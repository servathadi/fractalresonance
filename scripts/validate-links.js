const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Regex for wikilinks: [[id]] or [[id|label]] or [[id#section]]
const WIKILINK_REGEX = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

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
      if (langIndex.has(id)) {
        console.warn(
          `⚠️  Duplicate ID in ${lang}: ${id} (in ${relativePath} and ${langIndex.get(id)})`
        );
      }
      langIndex.set(id, relativePath);
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
        if (!langIndex || !langIndex.has(targetId)) {
          const enIndex = index.get('en');
          const existsInEn = enIndex && enIndex.has(targetId);

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

