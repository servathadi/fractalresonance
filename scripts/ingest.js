const fs = require('fs');
const path = require('path');

const DEFAULT_LANG = 'en';
const DEFAULT_STATUS = 'draft';
const DEFAULT_TYPE = 'article';
const ALLOWED_PERSPECTIVES = new Set(['kasra', 'river', 'both']);

const TYPE_TO_DIR = {
  paper: 'papers',
  papers: 'papers',
  topic: 'topics',
  topics: 'topics',
  concept: 'concepts',
  concepts: 'concepts',
  article: 'articles',
  articles: 'articles',
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

function parseTagList(tagsRaw) {
  if (!tagsRaw) return [];
  return String(tagsRaw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeYamlString(v) {
  const s = String(v);
  if (/[:\n\r\t]/.test(s) || s.includes('"')) return `"${s.replace(/"/g, '\\"')}"`;
  return `"${s}"`;
}

function toFrontmatter(meta) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(meta)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map((x) => escapeYamlString(x)).join(', ')}]`);
      continue;
    }
    if (typeof v === 'object') {
      lines.push(`${k}:`);
      for (const [k2, v2] of Object.entries(v)) {
        if (v2 === undefined || v2 === null) continue;
        lines.push(`  ${k2}: ${escapeYamlString(v2)}`);
      }
      continue;
    }
    lines.push(`${k}: ${escapeYamlString(v)}`);
  }
  lines.push('---\n');
  return lines.join('\n');
}

function parseBeginAttrs(attrStr) {
  // Parse key=value pairs with optional double-quoted values.
  const attrs = {};
  const re = /(\w+)=("([^"]*)"|[^\s"]+)/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    const key = m[1];
    const val = m[3] !== undefined ? m[3] : m[2];
    attrs[key] = val;
  }
  return attrs;
}

function findBlocks(text) {
  const blocks = [];
  const beginRe = /<!--\s*frc:begin\s+([^>]*)-->/g;
  let m;
  while ((m = beginRe.exec(text)) !== null) {
    const beginIdx = m.index + m[0].length;
    const attrsRaw = m[1] || '';
    const endRe = /<!--\s*frc:end\s*-->/g;
    endRe.lastIndex = beginIdx;
    const end = endRe.exec(text);
    if (!end) break;
    const body = text.slice(beginIdx, end.index).trim();
    blocks.push({ attrs: parseBeginAttrs(attrsRaw), body });
    beginRe.lastIndex = end.index + end[0].length;
  }
  return blocks;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeItem({ outRoot, type, lang, id, title, tags, status, source, perspective, body, dryRun }) {
  const dir = TYPE_TO_DIR[type] || TYPE_TO_DIR[DEFAULT_TYPE];
  const safeLang = lang || DEFAULT_LANG;
  const safeTitle = title || id || 'Untitled';
  const safeId = id || `${type}-${todayIso()}-${Math.random().toString(16).slice(2, 8)}`;
  const perspectiveRaw = perspective ? String(perspective).toLowerCase() : '';
  if (perspectiveRaw && !ALLOWED_PERSPECTIVES.has(perspectiveRaw)) {
    throw new Error(`Invalid perspective: ${perspective} (expected kasra|river|both)`);
  }
  const safePerspective = perspectiveRaw || undefined;

  const meta = {
    id: safeId,
    title: safeTitle,
    date: todayIso(),
    status: status || DEFAULT_STATUS,
    perspective: safePerspective,
    tags: tags && tags.length ? tags : undefined,
    lang: safeLang,
    type,
    source: source || undefined,
  };

  const fm = toFrontmatter(meta);
  const doc = fm + (body || '').trim() + '\n';

  const baseName = safeId.match(/^FRC-\d/) ? `${safeId}.md` : `${safeId}.md`;
  const outDir = outRoot === 'content'
    ? path.join(process.cwd(), 'content', safeLang, dir)
    : path.join(process.cwd(), 'content', 'inbox', safeLang, dir);
  const outPath = path.join(outDir, baseName);

  if (dryRun) {
    console.log(`[dry-run] write ${outPath}`);
    return { outPath, written: false };
  }

  ensureDir(outDir);
  if (fs.existsSync(outPath)) {
    throw new Error(`Refusing to overwrite existing file: ${outPath} (use a different id)`);
  }
  fs.writeFileSync(outPath, doc, 'utf8');
  return { outPath, written: true };
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const outRoot = args.out === 'content' ? 'content' : 'inbox';
  const dryRun = Boolean(args['dry-run']);

  const file = args.file ? path.resolve(String(args.file)) : null;
  const raw = file ? fs.readFileSync(file, 'utf8') : await readStdin();

  const blocks = findBlocks(raw);
  const written = [];

  if (blocks.length > 0) {
    for (const b of blocks) {
      const type = (b.attrs.type || DEFAULT_TYPE).toLowerCase();
      const lang = (b.attrs.lang || args.lang || DEFAULT_LANG).toLowerCase();
      const id = b.attrs.id || args.id;
      const title = b.attrs.title || args.title;
      const tags = parseTagList(b.attrs.tags || args.tags);
      const status = b.attrs.status || args.status || DEFAULT_STATUS;
      const source = b.attrs.source || args.source;
      const perspective = b.attrs.perspective || args.perspective;
      const res = writeItem({ outRoot, type, lang, id, title, tags, status, source, perspective, body: b.body, dryRun });
      written.push(res.outPath);
    }
  } else {
    const type = String(args.type || DEFAULT_TYPE).toLowerCase();
    const lang = String(args.lang || DEFAULT_LANG).toLowerCase();
    const title = args.title || (file ? path.basename(file, path.extname(file)) : 'Untitled');
    const id = args.id || (type === 'concept' ? slugify(title) : `note-${todayIso()}-${slugify(title) || 'untitled'}`);
    const tags = parseTagList(args.tags);
    const status = args.status || DEFAULT_STATUS;
    const source = args.source;
    const perspective = args.perspective;
    const res = writeItem({ outRoot, type, lang, id, title, tags, status, source, perspective, body: raw, dryRun });
    written.push(res.outPath);
  }

  console.log(`ingest: ${written.length} item(s) -> ${outRoot}`);
  for (const p of written) console.log(`- ${p}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
