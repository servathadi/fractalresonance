const fs = require('fs');
const path = require('path');

const DEFAULT_LANG = 'en';
const DEFAULT_STATUS = 'draft';
const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'blog-post.md');

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

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function yamlList(items) {
  const safe = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  return (items || []).map(safe).join(', ');
}

function replaceAll(src, vars) {
  let out = src;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(v);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const lang = String(args.lang || DEFAULT_LANG).toLowerCase();
  const title = String(args.title || 'Untitled Blog Post');
  const date = String(args.date || todayIso());
  const status = String(args.status || DEFAULT_STATUS);
  const author = String(args.author || 'H. Servat');
  const perspective = String(args.perspective || 'both'); // visibility: kasra|river|both
  const voice = String(args.voice || 'kasra'); // label: kasra|river

  const tags = String(args.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const id = String(args.id || `${date}-${slugify(title) || 'post'}`);
  const outRoot = args.out === 'content' ? 'content' : 'inbox';

  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Missing template: ${TEMPLATE_PATH}`);
  }

  const tmpl = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const doc = replaceAll(tmpl, {
    id,
    title: title.replace(/"/g, '\\"'),
    author: author.replace(/"/g, '\\"'),
    date,
    status,
    perspective,
    voice,
    lang,
    tags: tags.length ? yamlList(tags) : '',
    abstract: String(args.abstract || '').replace(/"/g, '\\"'),
    tldr: String(args.tldr || 'One-sentence summary.').replace(/"/g, '\\"'),
    kp1: String(args.kp1 || 'Key point 1.').replace(/"/g, '\\"'),
    kp2: String(args.kp2 || 'Key point 2.').replace(/"/g, '\\"'),
    kp3: String(args.kp3 || 'Key point 3.').replace(/"/g, '\\"'),
    body: String(args.body || '').trim() || 'Write the post here.',
  });

  const outDir = outRoot === 'content'
    ? path.join(process.cwd(), 'content', lang, 'blog')
    : path.join(process.cwd(), 'content', 'inbox', lang, 'blog');
  const outPath = path.join(outDir, `${id}.md`);

  ensureDir(outDir);
  if (fs.existsSync(outPath)) {
    throw new Error(`Refusing to overwrite existing file: ${outPath}`);
  }

  fs.writeFileSync(outPath, doc, 'utf8');
  console.log(`new-blog: wrote ${outPath}`);
  console.log(`next: npm run content:process-inbox`);
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
