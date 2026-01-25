/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { glob } = require('glob');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MEDIA_ROOT = path.join(PUBLIC_DIR, 'media');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    if (eq !== -1) out[a.slice(2, eq)] = a.slice(eq + 1);
    else {
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
    const val = (mm[2] || '').trim();
    fm[key] = val.replace(/^"|"$/g, '');
  }
  return { frontmatter: fm, body };
}

function isRemoteUrl(u) {
  return typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://'));
}

function isLocalUrl(u) {
  return typeof u === 'string' && (u.startsWith('/') || u.startsWith('./') || u.startsWith('../'));
}

function extFromContentType(ct) {
  const t = String(ct || '').toLowerCase().split(';')[0].trim();
  const map = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };
  return map[t] || null;
}

function extFromUrl(u) {
  try {
    const url = new URL(u);
    const p = url.pathname || '';
    const m = p.match(/\.([a-zA-Z0-9]{2,5})$/);
    if (!m) return null;
    const ext = m[1].toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) return ext === 'jpeg' ? 'jpg' : ext;
    return null;
  } catch {
    return null;
  }
}

function sha1(s) {
  return crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 12);
}

function classifyContentFromPath(absPath) {
  const rel = path.relative(CONTENT_DIR, absPath);
  const parts = rel.split(path.sep);
  const lang = parts[0] || 'en';
  const typeDir = parts[1] || 'articles';
  const rest = parts.slice(2);

  // Books can be single-file books/<id>.md or folder books/<id>/chapter.md
  if (typeDir === 'books' && rest.length >= 2) {
    return { lang, typeDir, contentId: rest[0] }; // folder id
  }

  // Default: use filename without extension as a fallback content id.
  const filename = rest[0] || path.basename(absPath);
  const contentId = filename.replace(/\.md$/, '');
  return { lang, typeDir, contentId };
}

async function fetchToFile(url, outPath, maxBytes) {
  let res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    // YouTube thumbnails often 404 on maxresdefault; hqdefault is usually available.
    if (res.status === 404 && url.includes('img.youtube.com/') && url.includes('/maxresdefault.')) {
      const fallback = url.replace('/maxresdefault.', '/hqdefault.');
      res = await fetch(fallback, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status} (fallback from maxresdefault failed)`);
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  }

  const ct = res.headers.get('content-type') || '';
  if (!String(ct).toLowerCase().startsWith('image/')) {
    throw new Error(`Not an image (content-type: ${ct || 'unknown'})`);
  }

  const ab = await res.arrayBuffer();
  const buf = Buffer.from(ab);
  if (maxBytes && buf.length > maxBytes) {
    throw new Error(`Too large (${buf.length} bytes > ${maxBytes})`);
  }

  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, buf);
  return { contentType: ct, bytes: buf.length };
}

function extractRemoteImageUrls(markdown) {
  const urls = new Set();

  // Frontmatter: optional. This catches things like video.thumbnailUrl.
  const fm = markdown.match(/^(?:\uFEFF)?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (fm) {
    const fmBody = fm[1] || '';
    const fmUrls = /https?:\/\/[^\s"')]+/g;
    for (const m of fmBody.matchAll(fmUrls)) {
      const u = (m[0] || '').trim();
      if (!isRemoteUrl(u)) continue;
      const ext = extFromUrl(u);
      if (ext) urls.add(u);
      else if (u.includes('img.youtube.com/')) urls.add(u);
    }
  }

  // Markdown images: ![alt](url "title")
  // Keep it simple: capture inside (...) until whitespace or closing paren.
  // (If you have exotic URLs with nested parens, use <img> instead.)
  const mdImg = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const m of markdown.matchAll(mdImg)) {
    const u = (m[1] || '').trim();
    if (isRemoteUrl(u)) urls.add(u);
  }

  // HTML images: <img ... src="...">
  const htmlImg = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const m of markdown.matchAll(htmlImg)) {
    const u = (m[1] || '').trim();
    if (isRemoteUrl(u)) urls.add(u);
  }

  return Array.from(urls);
}

function rewriteImageUrls(markdown, replacements) {
  let out = markdown;
  for (const [from, to] of Object.entries(replacements)) {
    // Replace only exact URL occurrences inside markdown.
    out = out.split(from).join(to);
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = !!args['dry-run'];
  const includeInbox = !!args['include-inbox'];
  const includeFrontmatter = args['frontmatter'] === undefined ? true : !!args['frontmatter'];
  const maxBytes = args['max-bytes'] ? Number(args['max-bytes']) : 8_000_000;
  const langFilter = args['lang'] ? String(args['lang']).toLowerCase() : null;

  const roots = [CONTENT_DIR];
  const ignore = includeInbox ? [] : ['**/inbox/**'];

  const patterns = roots.map((r) => path.join(r, '**', '*.md'));
  const files = [];
  for (const p of patterns) {
    const found = await glob(p, { absolute: true, ignore });
    files.push(...found);
  }

  const targets = files.filter((f) => {
    const rel = path.relative(CONTENT_DIR, f);
    if (rel.startsWith(`inbox${path.sep}`)) return includeInbox;
    if (langFilter) {
      const p = rel.split(path.sep);
      return (p[0] || '').toLowerCase() === langFilter;
    }
    return true;
  });

  let downloaded = 0;
  let rewritten = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of targets) {
    const raw = fs.readFileSync(file, 'utf8');
    const { frontmatter } = parseFrontmatterHeader(raw);
    const { lang, typeDir, contentId: fallbackId } = classifyContentFromPath(file);
    const contentId = frontmatter.id || fallbackId;

    const urls = includeFrontmatter ? extractRemoteImageUrls(raw) : extractRemoteImageUrls(raw.replace(/^(?:\uFEFF)?---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, ''));
    if (urls.length === 0) {
      skipped++;
      continue;
    }

    const replacements = {};

    for (const url of urls) {
      try {
        // Avoid re-downloading if the URL was already made local.
        if (!isRemoteUrl(url) || isLocalUrl(url)) continue;

        const baseExt = extFromUrl(url);
        const key = sha1(url);
        // If URL doesn't reveal an extension, we'll decide after fetch.
        const dir = path.join(MEDIA_ROOT, lang, typeDir, contentId);
        const tmpExt = baseExt || 'img';
        let outPath = path.join(dir, `${key}.${tmpExt}`);

        // If we already have it (any extension), reuse it.
        if (fs.existsSync(dir)) {
          const existing = fs.readdirSync(dir).find((f) => f.startsWith(`${key}.`));
          if (existing) {
            replacements[url] = `/media/${lang}/${typeDir}/${contentId}/${existing}`;
            continue;
          }
        }

        if (dryRun) {
          const pretend = `${key}.${tmpExt}`;
          replacements[url] = `/media/${lang}/${typeDir}/${contentId}/${pretend}`;
          continue;
        }

        const result = await fetchToFile(url, outPath, maxBytes);
        downloaded++;

        // If we used a placeholder extension, rename based on content-type.
        if (!baseExt) {
          const ext = extFromContentType(result.contentType) || 'img';
          const renamed = path.join(dir, `${key}.${ext}`);
          if (renamed !== outPath) {
            fs.renameSync(outPath, renamed);
            outPath = renamed;
          }
        } else if (baseExt === 'jpg') {
          // Normalize .jpeg -> .jpg already; nothing to do.
        }

        const publicRel = path.relative(PUBLIC_DIR, outPath).split(path.sep).join('/');
        replacements[url] = `/${publicRel}`;
      } catch (err) {
        failed++;
        console.warn(`sync-media: failed ${url} in ${path.relative(process.cwd(), file)} (${err.message || err})`);
      }
    }

    if (Object.keys(replacements).length === 0) continue;

    const next = rewriteImageUrls(raw, replacements);
    if (next !== raw) {
      rewritten++;
      if (!dryRun) fs.writeFileSync(file, next, 'utf8');
    }
  }

  console.log(`sync-media: files=${targets.length} rewritten=${rewritten} downloaded=${downloaded} skipped=${skipped} failed=${failed} dryRun=${dryRun}`);
  if (dryRun) console.log('sync-media: dry-run only (no files written)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
