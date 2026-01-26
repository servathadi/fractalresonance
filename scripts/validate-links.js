const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Regex for wikilinks: [[id]] or [[id|label]] or [[id#section]]
const WIKILINK_REGEX = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

function canonicalizeFrcLikeId(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const m = s.match(/^(FRC)\s*[- ]?\s*(\d{2,4})\.(\d+(?:\.\d+)*|[A-Za-z]+)(?:\b|[^A-Za-z0-9].*)$/i);
  if (!m) return null;
  const series = m[2];
  const suffix = m[3];
  const normSuffix = suffix.replace(/\./g, '-').toUpperCase();
  return `FRC-${series}-${normSuffix}`;
}

function fallbackWikilinkBucket(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const lower = s.toLowerCase();
  const lowerAscii = lower.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');

  const hasScales =
    lower.includes('scales') ||
    lower.includes('escalas') ||
    lowerAscii.includes('echelles') ||
    s.includes('\u0645\u0642\u06cc\u0627\u0633');
  if (hasScales) return 'mu-levels';

  const hasMath =
    lower.includes('mathematics') ||
    lowerAscii.includes('mathematique') ||
    lowerAscii.includes('matematic') ||
    s.includes('\u0631\u06cc\u0627\u0636');
  if (hasMath) return 'papers';

  const hasAi =
    lower.includes('ai ') ||
    lower.includes(' ai') ||
    lower.includes('ia ') ||
    lower.includes(' ia') ||
    s.includes('\u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06cc');
  if (hasAi) return 'topics';

  const hasConsciousness =
    lower.includes('consciousness') ||
    lower.includes('conciencia') ||
    lowerAscii.includes('conscience') ||
    s.includes('\u0622\u06af\u0627\u0647\u06cc');
  if (hasConsciousness) return 'consciousness';

  return null;
}

async function getAllContentFiles() {
  return glob('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
}

// Build an index of valid IDs -> File Paths, grouped by Language
// Structure: Map<Lang, Map<ID, Path>>
function buildContentIndex(files) {
  const index = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(CONTENT_DIR, file);

    // Extract language from path (e.g., "en/papers/..." -> "en")
    const pathParts = relativePath.split(path.sep);
    const lang = pathParts[0];

    if (!index.has(lang)) {
      index.set(lang, new Map());
    }
    const langIndex = index.get(lang);

    // Extract ID from frontmatter (simple scan; frontmatter parser is in app code)
    const idMatch = content.match(/^id:\s*([a-zA-Z0-9-_]+)/m);
    if (idMatch) {
      const id = idMatch[1].trim();
      const key = id.toLowerCase();
      if (langIndex.has(key)) {
        console.warn(
          `⚠️  Duplicate ID in ${lang}: ${id} (in ${relativePath} and ${langIndex.get(key)})`
        );
      }
      langIndex.set(key, relativePath);
    }
  }

  return { index };
}

async function validateLinks() {
  const files = await getAllContentFiles();
  const { index } = buildContentIndex(files);

  let errorCount = 0;

  console.log(`🔍 Scanning ${files.length} files for broken wikilinks...`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(CONTENT_DIR, file);
    const pathParts = relativePath.split(path.sep);
    const lang = pathParts[0];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      let match;
      while ((match = WIKILINK_REGEX.exec(line)) !== null) {
        const targetId = match[1].trim();
        if (!targetId) continue;

        // Check if ID exists in the SAME language
        const langIndex = index.get(lang);
        const key = targetId.toLowerCase();
        const existsInLang = langIndex && langIndex.has(key);

        // Allow FRC-style references that resolve to /papers/<id> (missing papers redirect to /papers).
        const frcId = canonicalizeFrcLikeId(targetId);
        if (!existsInLang && frcId) {
          continue;
        }

        // Allow common "Related reading" placeholders (routed to hubs in runtime resolver).
        if (!existsInLang && fallbackWikilinkBucket(targetId)) {
          console.warn(`⚠️  ${relativePath}:${i + 1} - Wikilink [[${targetId}]] routed to hub page.`);
          continue;
        }

        if (!existsInLang) {
          const enIndex = index.get('en');
          const existsInEn = enIndex && enIndex.has(key);

          if (existsInEn) {
            console.warn(
              `⚠️  ${relativePath}:${i + 1} - Link [[${targetId}]] missing in ${lang}, but found in 'en'.`
            );
          } else {
            console.error(
              `❌ ${relativePath}:${i + 1} - Broken Wikilink: [[${targetId}]] (ID not found in ${lang})`
            );
            errorCount++;
          }
        }
      }
    }
  }

  if (errorCount > 0) {
    console.error(`\n💥 Found ${errorCount} broken wikilinks.`);
    process.exit(1);
  } else {
    console.log(`\n✅ No broken wikilinks found.`);
  }
}

validateLinks().catch((err) => {
  console.error(err);
  process.exit(1);
});
