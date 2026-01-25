const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const INBOX_DIR = path.join(process.cwd(), 'content', 'inbox');
const CONTENT_DIR = path.join(process.cwd(), 'content');

const TYPE_TO_DIR = {
  paper: 'papers',
  papers: 'papers',
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

function stripBadControls(str) {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function normalizeFrontmatterDelimiters(str) {
  return str
    .replace(/^(?:\uFEFF)?---\s*\r?$/gm, '---')
    .replace(/^---\s*\r?$/gm, '---');
}

function parseFrontmatterHeader(text) {
  const m = text.match(/^(?:\uFEFF)?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
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

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeFilename(id) {
  return `${id}.md`;
}

async function main() {
  if (!fs.existsSync(INBOX_DIR)) {
    console.log(`process-inbox: nothing to do (no ${INBOX_DIR})`);
    return;
  }

  const files = await glob('**/*.md', { cwd: INBOX_DIR, absolute: true });
  if (files.length === 0) {
    console.log(`process-inbox: nothing to do (inbox empty)`);
    return;
  }

  let moved = 0;
  let skipped = 0;

  for (const file of files) {
    const rel = path.relative(INBOX_DIR, file);
    // Skip already processed files
    if (rel.split(path.sep)[0] === '_processed') continue;

    const raw = fs.readFileSync(file, 'utf8');
    const cleaned = normalizeFrontmatterDelimiters(stripBadControls(raw));
    const { frontmatter } = parseFrontmatterHeader(cleaned);

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
    fs.writeFileSync(outPath, cleaned, 'utf8');

    const processedDir = path.join(INBOX_DIR, '_processed', path.dirname(rel));
    ensureDir(processedDir);
    fs.renameSync(file, path.join(processedDir, path.basename(rel)));

    moved++;
  }

  console.log(`process-inbox: moved ${moved}, skipped ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
