const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const INBOX_DIR = path.join(process.cwd(), 'content', 'inbox');
const CONTENT_DIR = path.join(process.cwd(), 'content');

const TYPE_TO_DIR = {
  paper: 'papers',
  papers: 'papers',
  topic: 'topics',
  topics: 'topics',
  concept: 'concepts',
  concepts: 'concepts',
  article: 'articles',
  articles: 'articles',
  blog: 'blog',
  blogs: 'blog',
  book: 'books',
  books: 'books',
  note: 'articles',
  notes: 'articles',
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function stripBadControls(str) {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function normalizeFrontmatterDelimiters(str) {
  return str
    // Normalize delimiter lines (also tolerate `---# Title` mistakes)
    .replace(/^(?:\uFEFF)?---[^\S\r\n]*(?:#.*)?\r?$/gm, '---')
    .replace(/^---[^\S\r\n]*(?:#.*)?\r?$/gm, '---');
}

function parseFrontmatterHeader(text) {
  const m = text.match(/^(?:\uFEFF)?---[^\S\r\n]*(?:#.*)?\r?\n([\s\S]*?)\r?\n---[^\S\r\n]*(?:#.*)?\r?\n?/);
  if (!m) return { frontmatter: {}, body: text };
  const fmRaw = m[1];
  const body = text.slice(m[0].length);

  const fm = {};
  for (const line of fmRaw.split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1];
    const val = mm[2].trim();
    fm[key] = val.replace(/^"|"$/g, '');
  }
  return { frontmatter: fm, body };
}

function extractTitleFromBody(body) {
  const b = String(body || '').trim();
  const m = b.match(/^#\s+(.+)\s*$/m);
  if (m) return m[1].trim();
  // Fallback: first non-empty line (trimmed)
  const line = b.split(/\r?\n/).map((s) => s.trim()).find(Boolean);
  return line ? line.slice(0, 120) : 'Untitled';
}

function toYamlFrontmatter(meta) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(meta)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`- ${String(item)}`);
      continue;
    }
    lines.push(`${k}: ${String(v)}`);
  }
  lines.push('---\n');
  return lines.join('\n');
}

function ensureFrontmatter(cleaned, { relPath }) {
  const { frontmatter, body } = parseFrontmatterHeader(cleaned);
  const hasFm = Object.keys(frontmatter).length > 0;
  if (hasFm && frontmatter.id && (frontmatter.title || frontmatter.name)) {
    return cleaned.endsWith('\n') ? cleaned : `${cleaned}\n`;
  }

  const relParts = String(relPath || '').split(path.sep).filter(Boolean);
  const relLang = relParts[0] && relParts[0] !== '_processed' ? relParts[0].toLowerCase() : '';
  const lang = (frontmatter.lang || relLang || 'en').toLowerCase();

  const title = frontmatter.title || frontmatter.name || extractTitleFromBody(body);
  const id = frontmatter.id || (relParts[2] ? path.basename(relParts[2], '.md') : null) || `note-${todayIso()}-${Math.random().toString(16).slice(2, 8)}`;
  const safeId = /^FRC-\d/.test(id) ? id : slugify(id) || `note-${todayIso()}-${Math.random().toString(16).slice(2, 8)}`;

  const type = (frontmatter.type || '').toLowerCase() || undefined;
  const meta = {
    id: safeId,
    title,
    lang,
    ...(frontmatter.status ? { status: frontmatter.status } : { status: 'draft' }),
    ...(frontmatter.date ? { date: frontmatter.date } : { date: todayIso() }),
    ...(type ? { type } : {}),
  };

  const fm = toYamlFrontmatter(meta);
  const out = fm + String(body || '').trim() + '\n';
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeFilename(id) {
  return `${id}.md`;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    if (eq !== -1) {
      out[a.slice(2, eq)] = a.slice(eq + 1);
    } else {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[k] = v;
    }
  }
  return out;
}

function stripCodeFences(text) {
  const t = String(text || '').trim();
  const m = t.match(/^```(?:markdown|md)?\s*\r?\n([\s\S]*?)\r?\n```\s*$/i);
  return m ? m[1] : t;
}

async function digestWithSos({
  sosUrl,
  sosAgentId,
  sosModel,
  sosToolsEnabled,
  lang,
  typeDir,
  targetId,
  existingFrontmatter,
  rawContent,
}) {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch() is not available. Use Node 18+ (or provide a fetch polyfill).');
  }

  const CANONICAL_TYPE = {
    papers: 'paper',
    topics: 'topic',
    concepts: 'concept',
    articles: 'article',
    books: 'book',
    blog: 'blog',
  }[typeDir] || 'article';

  const fmLines = Object.entries(existingFrontmatter || {})
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join('\n');

  const prompt = [
    'You are a CMS "inbox digestion" engine.',
    'Return ONLY a single Markdown document.',
    'The document MUST start with YAML frontmatter delimited by --- lines.',
    '',
    'Hard rules:',
    '- Do not add commentary outside the markdown.',
    '- Do not invent citations or URLs. If you add a link, it must be real.',
    '- If the input includes a table, keep it as GitHub-flavored markdown.',
    '',
    'Frontmatter requirements:',
    `- lang must be "${lang}".`,
    `- type must be "${CANONICAL_TYPE}".`,
    `- id must be "${targetId}".`,
    '- Keep existing frontmatter fields when present (title, tags, status, perspective, voice, source, etc).',
    '',
    'Topic conventions (when type=topic):',
    '- Use authorities: as a list of sources with url + optional quote/publisher.',
    '- Use answers: as a list of spectrum answers. Prefer including lens: (e.g. frc, gr, newtonian, whitehead, jung, sufi).',
    '',
    'Existing frontmatter (may be empty):',
    '---',
    fmLines || '(none)',
    '---',
    '',
    'Raw content:',
    rawContent,
    '',
  ].join('\n');

  const payload = {
    message: prompt,
    agent_id: sosAgentId,
    conversation_id: `frc-inbox:${crypto.createHash('sha256').update(rawContent).digest('hex').slice(0, 12)}`,
    model: sosModel || undefined,
    tools_enabled: Boolean(sosToolsEnabled),
    memory_enabled: false,
    witness_enabled: false,
    stream: false,
  };

  const res = await fetch(`${sosUrl.replace(/\/+$/, '')}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`SOS /chat failed (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json();
  const content = data && typeof data.content === 'string' ? data.content : '';
  const cleaned = normalizeFrontmatterDelimiters(stripBadControls(stripCodeFences(content)));

  if (!/^(?:\uFEFF)?---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/.test(cleaned)) {
    throw new Error('SOS output missing YAML frontmatter (--- ... ---).');
  }

  return cleaned.endsWith('\n') ? cleaned : `${cleaned}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const ai = String(args.ai || '').toLowerCase();
  const useSos = Boolean(args['use-sos'] || ai === 'sos');
  const sosUrl = String(args['sos-url'] || process.env.CMS_SOS_URL || 'http://localhost:6060');
  const sosAgentId = String(args['sos-agent'] || process.env.CMS_SOS_AGENT || 'agent:River');
  const sosModel = args['sos-model'] || process.env.CMS_SOS_MODEL || undefined;
  const sosToolsEnabled = Boolean(
    args.tools ||
      args['sos-tools'] ||
      process.env.CMS_SOS_TOOLS === '1' ||
      process.env.CMS_SOS_TOOLS === 'true'
  );

  const doValidate = !Boolean(args['no-validate']);
  const doIndex = !Boolean(args['no-index']);
  const doCatalog = !Boolean(args['no-catalog']);
  const force = Boolean(args.force);

  if (!fs.existsSync(INBOX_DIR)) {
    console.log(`process-inbox: nothing to do (no ${INBOX_DIR})`);
    if (!force) return;
  }

  const files = fs.existsSync(INBOX_DIR)
    ? await glob('**/*.md', { cwd: INBOX_DIR, absolute: true })
    : [];
  if (files.length === 0) {
    console.log(`process-inbox: nothing to do (inbox empty)`);
    if (!force) return;
  }

  let moved = 0;
  let skipped = 0;
  let digested = 0;

  for (const file of files) {
    const rel = path.relative(INBOX_DIR, file);
    // Skip already processed files
    if (rel.split(path.sep)[0] === '_processed') continue;

    const raw = fs.readFileSync(file, 'utf8');
    const cleaned = normalizeFrontmatterDelimiters(stripBadControls(raw));
    const normalized = ensureFrontmatter(cleaned, { relPath: rel });
    const { frontmatter } = parseFrontmatterHeader(normalized);

    const lang = (frontmatter.lang || rel.split(path.sep)[0] || 'en').toLowerCase();
    const typeRaw = (frontmatter.type || '').toLowerCase();
    const id = frontmatter.id || null;

    const dir = TYPE_TO_DIR[typeRaw] || (id && /^FRC-\d/.test(id) ? 'papers' : 'articles');
    const targetId = id || `note-${todayIso()}-${Math.random().toString(16).slice(2, 8)}`;

    const outDir = path.join(CONTENT_DIR, lang, dir);
    const outPath = path.join(outDir, safeFilename(targetId));
    if (fs.existsSync(outPath)) {
      console.warn(`process-inbox: skip (exists) ${outPath}`);
      skipped++;
      continue;
    }

    ensureDir(outDir);
    if (useSos) {
      const digestedMd = await digestWithSos({
        sosUrl,
        sosAgentId,
        sosModel,
        sosToolsEnabled,
        lang,
        typeDir: dir,
        targetId,
        existingFrontmatter: frontmatter,
        rawContent: normalized,
      });
      fs.writeFileSync(outPath, digestedMd, 'utf8');
      digested++;
    } else {
      fs.writeFileSync(outPath, normalized, 'utf8');
    }

    const processedDir = path.join(INBOX_DIR, '_processed', path.dirname(rel));
    ensureDir(processedDir);
    fs.renameSync(file, path.join(processedDir, path.basename(rel)));

    moved++;
  }

  if (moved > 0 || force) {
    if (doValidate) {
      const r = spawnSync('node', ['scripts/validate-content.mjs'], { stdio: 'inherit' });
      if (r.status !== 0) process.exit(r.status || 1);
    }
    if (doIndex) {
      const r = spawnSync('node', ['scripts/generate-search-index.js'], { stdio: 'inherit' });
      if (r.status !== 0) process.exit(r.status || 1);
    }
    if (doCatalog) {
      const r = spawnSync('node', ['scripts/generate-catalog.mjs'], { stdio: 'inherit' });
      if (r.status !== 0) process.exit(r.status || 1);
    }
  }

  console.log(`process-inbox: moved ${moved}, skipped ${skipped}${useSos ? `, digested ${digested}` : ''}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
