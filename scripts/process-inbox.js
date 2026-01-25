const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');

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
    '- Do not invent citations or URLs.',
    '- If the input includes a table, keep it as GitHub-flavored markdown.',
    '',
    'Frontmatter requirements:',
    `- lang must be "${lang}".`,
    `- type must be "${CANONICAL_TYPE}".`,
    `- id must be "${targetId}".`,
    '- Keep existing frontmatter fields when present (title, tags, status, perspective, voice, source, etc).',
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
    tools_enabled: false,
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
  let digested = 0;

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
    if (useSos) {
      const digestedMd = await digestWithSos({
        sosUrl,
        sosAgentId,
        sosModel,
        lang,
        typeDir: dir,
        targetId,
        existingFrontmatter: frontmatter,
        rawContent: cleaned,
      });
      fs.writeFileSync(outPath, digestedMd, 'utf8');
      digested++;
    } else {
      fs.writeFileSync(outPath, cleaned, 'utf8');
    }

    const processedDir = path.join(INBOX_DIR, '_processed', path.dirname(rel));
    ensureDir(processedDir);
    fs.renameSync(file, path.join(processedDir, path.basename(rel)));

    moved++;
  }

  console.log(`process-inbox: moved ${moved}, skipped ${skipped}${useSos ? `, digested ${digested}` : ''}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
