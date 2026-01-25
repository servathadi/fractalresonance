import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Regex for wikilinks: [[id]] or [[id|label]] or [[id#section]]
const WIKILINK_REGEX = /\Щ\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|\[^\]]+)?\]\]/g;

// Regex for standard markdown links: [label](/path/to/resource)
const MD_LINK_REGEX = /\Щ\[([^\]]+)\]\((\/[^\]]+)\)/g;

async function getAllContentFiles() {
  return glob('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
}

// Build an index of valid IDs -> File Paths, grouped by Language
// Structure: Map<Lang, Map<ID, Path>>
function buildContentIndex(files: string[]) {
  const index = new Map<string, Map<string, string>>();
  const filePaths = new Set<string>();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(CONTENT_DIR, file);
    
    // Extract language from path (e.g., "en/papers/..." -> "en")
    const pathParts = relativePath.split(path.sep);
    const lang = pathParts[0];

    // Normalize to forward slash for checking existence
    filePaths.add('/' + relativePath.replace(/\\/g, '/')); 

    if (!index.has(lang)) {
      index.set(lang, new Map());
    }
    const langIndex = index.get(lang)!;

    // Extract ID from frontmatter
    const idMatch = content.match(/^id:\s*([a-zA-Z0-9-_]+)/m);
    if (idMatch) {
      const id = idMatch[1].trim();
      if (langIndex.has(id)) {
        console.warn(`⚠️  Duplicate ID in ${lang}: ${id} (in ${relativePath} and ${langIndex.get(id)})`);
      }
      langIndex.set(id, relativePath);
    }
  }
  return { index, filePaths };
}

async function validateLinks() {
  const files = await getAllContentFiles();
  const { index, filePaths } = buildContentIndex(files);
  
  let errorCount = 0;

  console.log(`🔍 Scanning ${files.length} files for broken links...`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(CONTENT_DIR, file);
    const pathParts = relativePath.split(path.sep);
    const lang = pathParts[0];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. Check Wikilinks [[id]]
      let match;
      while ((match = WIKILINK_REGEX.exec(line)) !== null) {
        const targetId = match[1].trim();
        
        if (!targetId) continue;

        // Check if ID exists in the SAME language
        const langIndex = index.get(lang);
        if (!langIndex || !langIndex.has(targetId)) {
          // Fallback check: does it exist in English? (Optional policy)
          // For now, let's be strict: Internal links should point to content in the same language.
          // If we want to allow cross-language links, we'd check index.get('en').
          
          const enIndex = index.get('en');
          const existsInEn = enIndex && enIndex.has(targetId);

          if (existsInEn) {
             console.warn(`⚠️  ${relativePath}:${i + 1} - Link [[${targetId}]] missing in ${lang}, but found in 'en'.`);
             // We won't fail the build for this, but it indicates missing translation or wrong link.
          } else {
             console.error(`❌ ${relativePath}:${i + 1} - Broken Wikilink: [[${targetId}]] (ID not found in ${lang})`);
             errorCount++;
          }
        }
      }

      // 2. Check Standard Links [label](/path)
      let linkMatch;
      while ((linkMatch = MD_LINK_REGEX.exec(line)) !== null) {
        const targetPath = linkMatch[2].trim();

        if (targetPath.startsWith('//') || targetPath.startsWith('http')) continue; 

        // TODO: Add static asset checking if needed
      }
    }
  }

  if (errorCount > 0) {
    console.error(`
💥 Found ${errorCount} broken links.`);
    process.exit(1);
  } else {
    console.log(`
✅ No broken wikilinks found.`);
  }
}

validateLinks().catch(err => {
  console.error(err);
  process.exit(1);
});