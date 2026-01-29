#!/usr/bin/env node
/**
 * Generate search index for Cloudflare Workers AI
 * Run: node scripts/generate-search-index.js
 * Output: public/search-index.json
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'search-index.json');

const CONTENT_TYPES = ['papers', 'articles', 'concepts', 'topics', 'blog', 'books'];
const LANGUAGES = ['en', 'es', 'fa', 'fr'];

function extractText(markdown) {
  // Remove frontmatter delimiter if any leaked through
  let text = markdown.replace(/^---[\s\S]*?---/, '');
  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '');
  // Remove images
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  // Convert wikilinks to plain text
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');
  // Remove markdown links, keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove headers markers
  text = text.replace(/^#{1,6}\s+/gm, '');
  // Remove bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function truncate(text, maxLength = 500) {
  if (text.length <= maxLength) return text;
  // Try to break at a word boundary
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.8 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

function parseMarkdownFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);
    return { frontmatter, content };
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e.message);
    return null;
  }
}

function getFilesRecursive(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function buildIndex() {
  const index = {
    generated: new Date().toISOString(),
    documents: [],
    stats: { total: 0, byLang: {}, byType: {} }
  };

  for (const lang of LANGUAGES) {
    index.stats.byLang[lang] = 0;

    for (const type of CONTENT_TYPES) {
      const typeDir = path.join(CONTENT_DIR, lang, type);
      if (!fs.existsSync(typeDir)) continue;

      const files = getFilesRecursive(typeDir);

      for (const filePath of files) {
        const parsed = parseMarkdownFile(filePath);
        if (!parsed) continue;

        const { frontmatter, content } = parsed;
        const plainText = extractText(content);

        // Skip empty or very short content
        if (plainText.length < 50) continue;

        const doc = {
          id: frontmatter.id || path.basename(filePath, '.md'),
          type,
          lang,
          title: frontmatter.title || 'Untitled',
          abstract: frontmatter.abstract || frontmatter.description || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          content: truncate(plainText, 500), // Limit content size for smaller index
          url: `/${lang}/${type}/${frontmatter.id || path.basename(filePath, '.md')}`,
          date: frontmatter.date ? String(frontmatter.date) : null,
        };

        // Special handling for books - include book ID in URL
        if (type === 'books') {
          const relativePath = path.relative(typeDir, filePath);
          const parts = relativePath.split(path.sep);
          if (parts.length > 1) {
            const bookId = parts[0];
            const chapterId = path.basename(filePath, '.md');
            doc.url = `/${lang}/books/${bookId}/chapter/${chapterId}`;
            doc.bookId = bookId;
          }
        }

        index.documents.push(doc);
        index.stats.total++;
        index.stats.byLang[lang]++;
        index.stats.byType[type] = (index.stats.byType[type] || 0) + 1;
      }
    }
  }

  return index;
}

// Main
console.log('Generating search index...');
const index = buildIndex();

// Write combined output (smaller, no content for quick metadata)
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));

// Write per-language indexes for lazy loading
const OUTPUT_DIR = path.dirname(OUTPUT_PATH);
for (const lang of LANGUAGES) {
  const langDocs = index.documents.filter(d => d.lang === lang);
  const langIndex = {
    generated: index.generated,
    lang,
    count: langDocs.length,
    documents: langDocs,
  };
  const langPath = path.join(OUTPUT_DIR, `search-index-${lang}.json`);
  fs.writeFileSync(langPath, JSON.stringify(langIndex));
}

console.log(`✓ Generated search index: ${OUTPUT_PATH}`);
console.log(`  Total documents: ${index.stats.total}`);
console.log(`  By language:`, index.stats.byLang);
console.log(`  By type:`, index.stats.byType);
console.log(`  Per-language indexes: search-index-{en,es,fa,fr}.json`);
