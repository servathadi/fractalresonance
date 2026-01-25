const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const WIKILINK_REGEX = /\[\[([^\]]+)\]\]/g;

function isControlChar(code) {
  // Allow TAB(9), LF(10), CR(13)
  if (code === 9 || code === 10 || code === 13) return false;
  return code >= 0 && code < 32;
}

function findControlChars(text) {
  const codes = new Map();
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (isControlChar(code)) {
      codes.set(code, (codes.get(code) || 0) + 1);
    }
  }
  return codes;
}

function extractFrontmatterBlock(text) {
  const m = text.match(/^(?:\uFEFF)?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  return m ? m[1] : null;
}

function extractId(frontmatter) {
  const m = frontmatter.match(/^id:\s*([a-zA-Z0-9-_]+)/m);
  return m ? m[1].trim() : null;
}

function extractTags(frontmatter) {
  // Support inline: tags: [a, b, c]
  const inline = frontmatter.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (inline) {
    return inline[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^["']|["']$/g, ''));
  }

  // Support block:
  // tags:
  //   - a
  //   - b
  const blockStart = frontmatter.match(/^tags:\s*$/m);
  if (!blockStart) return [];

  const lines = frontmatter.split('\n');
  const idx = lines.findIndex((l) => l.trim() === 'tags:');
  if (idx === -1) return [];

  const out = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith(' ')) break;
    const m = line.match(/^\s*-\s*(.+)\s*$/);
    if (m) out.push(m[1].trim().replace(/^["']|["']$/g, ''));
  }
  return out;
}

function cleanWikilinkInner(inner) {
  const noPipe = inner.split('|')[0];
  const noSection = noPipe.split('#')[0];
  return noSection.replace(/[\x00-\x1F]/g, '').trim();
}

async function main() {
  const files = await glob('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });

  const byLang = new Map(); // lang -> Map(id -> file)
  const inbound = new Map(); // id -> Set(sourceId)
  const outbound = new Map(); // id -> Set(targetId)
  const tagsCount = new Map(); // tag -> count
  const controlIssues = [];
  const duplicates = [];

  for (const file of files) {
    const rel = path.relative(CONTENT_DIR, file);
    const parts = rel.split(path.sep);
    const lang = parts[0];

    // Ignore CMS config directories in reports.
    if (parts[1] === 'site') continue;

    const text = fs.readFileSync(file, 'utf-8');

    const ctrl = findControlChars(text);
    if (ctrl.size > 0) {
      controlIssues.push({
        file: rel,
        codes: Array.from(ctrl.entries()).sort((a, b) => a[0] - b[0]),
      });
    }

    const fmBlock = extractFrontmatterBlock(text);
    if (!fmBlock) continue;

    const id = extractId(fmBlock);
    if (!id) continue;

    if (!byLang.has(lang)) byLang.set(lang, new Map());
    const langMap = byLang.get(lang);
    if (langMap.has(id)) {
      duplicates.push({ lang, id, a: langMap.get(id), b: rel });
    }
    langMap.set(id, rel);

    const tags = extractTags(fmBlock);
    for (const t of tags) tagsCount.set(t, (tagsCount.get(t) || 0) + 1);

    const targets = new Set();
    let m;
    while ((m = WIKILINK_REGEX.exec(text)) !== null) {
      const target = cleanWikilinkInner(m[1]);
      if (!target || target === id) continue;
      targets.add(target);
    }
    outbound.set(id, targets);
    for (const target of targets) {
      if (!inbound.has(target)) inbound.set(target, new Set());
      inbound.get(target).add(id);
    }
  }

  const langs = Array.from(byLang.keys()).sort();
  const allIds = new Set();
  for (const lm of byLang.values()) for (const id of lm.keys()) allIds.add(id);

  const missingTranslations = [];
  for (const id of allIds) {
    const present = new Set();
    for (const lang of langs) {
      if (byLang.get(lang)?.has(id)) present.add(lang);
    }
    const missing = langs.filter((l) => !present.has(l));
    if (present.size >= 2 && missing.length > 0) {
      missingTranslations.push({ id, missing });
    }
  }

  const orphans = [];
  for (const id of allIds) {
    const inSet = inbound.get(id);
    const inCount = inSet ? inSet.size : 0;
    if (inCount === 0) orphans.push(id);
  }

  console.log(`Content report`);
  console.log(`- Files scanned: ${files.length}`);
  console.log(`- Languages: ${langs.join(', ') || '(none)'}`);
  console.log(`- Unique IDs: ${allIds.size}`);

  if (duplicates.length) {
    console.log(`\nDuplicate IDs: ${duplicates.length}`);
    for (const d of duplicates.slice(0, 20)) {
      console.log(`- ${d.lang}:${d.id} -> ${d.a} AND ${d.b}`);
    }
    if (duplicates.length > 20) console.log(`- ... (${duplicates.length - 20} more)`);
  } else {
    console.log(`\nDuplicate IDs: none`);
  }

  console.log(`\nOrphan pages (no inbound wikilinks): ${orphans.length}`);
  for (const id of orphans.slice(0, 30)) console.log(`- ${id}`);
  if (orphans.length > 30) console.log(`- ... (${orphans.length - 30} more)`);

  console.log(`\nMissing translations (only when ID appears in 2+ languages): ${missingTranslations.length}`);
  for (const row of missingTranslations.slice(0, 30)) {
    console.log(`- ${row.id} missing: ${row.missing.join(', ')}`);
  }
  if (missingTranslations.length > 30) console.log(`- ... (${missingTranslations.length - 30} more)`);

  const topTags = Array.from(tagsCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 25);
  console.log(`\nTop tags:`);
  for (const [tag, count] of topTags) console.log(`- ${tag}: ${count}`);

  console.log(`\nControl character issues: ${controlIssues.length}`);
  for (const c of controlIssues.slice(0, 20)) {
    const codes = c.codes.map(([code, count]) => `0x${code.toString(16).padStart(2, '0')}(${count})`).join(', ');
    console.log(`- ${c.file}: ${codes}`);
  }
  if (controlIssues.length > 20) console.log(`- ... (${controlIssues.length - 20} more)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
