#!/usr/bin/env node
/**
 * Quality Gates: Validate content integrity
 * - Frontmatter enum values (status, tier, lang, perspective)
 * - Internal links (wikilinks reference existing content)
 * - Image references exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');

// Valid enum values
const VALID_STATUS = ['draft', 'review', 'published'];
const VALID_TIER = ['foundational', 'applied', 'speculative'];
const VALID_LANG = ['en', 'es', 'fa', 'fr'];
const VALID_PERSPECTIVE = ['kasra', 'river', 'both'];

// Track all content IDs for wikilink validation
const allContentIds = new Set();
const errors = [];
const warnings = [];

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  // Tolerate `---# Title` mistakes on delimiter lines (treat as a comment).
  const fmRegex = /^---[^\S\r\n]*(?:#.*)?\r?\n([\s\S]*?)\r?\n---[^\S\r\n]*(?:#.*)?\r?\n?([\s\S]*)$/;
  const match = content.match(fmRegex);
  if (!match) return { frontmatter: {}, body: content };

  const fmRaw = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of fmRaw.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && !key.startsWith(' ') && !key.startsWith('-')) {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

// Extract wikilinks from body
function extractWikilinks(body) {
  const wikilinks = [];
  const regex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let match;
  while ((match = regex.exec(body)) !== null) {
    const id = match[1].split('#')[0].trim();
    if (id) wikilinks.push(id);
  }
  return wikilinks;
}

// Extract image references from body
function extractImageRefs(body) {
  const images = [];
  const mdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(body)) !== null) {
    const src = match[1].split(' ')[0];
    if (!src.startsWith('http')) images.push(src);
  }
  return images;
}

// Validate a single content file
function validateFile(filePath, lang, contentType) {
  const relativePath = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  if (frontmatter.id) {
    allContentIds.add(frontmatter.id);
    allContentIds.add(frontmatter.id.toLowerCase());
  }

  // Validate required fields
  if (!frontmatter.id) {
    errors.push(relativePath + ': Missing required field "id"');
  }
  if (!frontmatter.title) {
    errors.push(relativePath + ': Missing required field "title"');
  }

  // Validate enums
  if (frontmatter.status && !VALID_STATUS.includes(frontmatter.status)) {
    errors.push(relativePath + ': Invalid status "' + frontmatter.status + '". Valid: ' + VALID_STATUS.join(', '));
  }
  if (frontmatter.tier && !VALID_TIER.includes(frontmatter.tier)) {
    errors.push(relativePath + ': Invalid tier "' + frontmatter.tier + '". Valid: ' + VALID_TIER.join(', '));
  }
  if (frontmatter.lang && !VALID_LANG.includes(frontmatter.lang)) {
    errors.push(relativePath + ': Invalid lang "' + frontmatter.lang + '". Valid: ' + VALID_LANG.join(', '));
  }
  if (frontmatter.perspective && !VALID_PERSPECTIVE.includes(frontmatter.perspective)) {
    errors.push(relativePath + ': Invalid perspective "' + frontmatter.perspective + '". Valid: ' + VALID_PERSPECTIVE.join(', '));
  }

  const wikilinks = extractWikilinks(body);

  // Validate image references
  for (const imgPath of extractImageRefs(body)) {
    const publicPath = path.join(PUBLIC_DIR, imgPath.startsWith('/') ? imgPath : '/' + imgPath);
    if (!fs.existsSync(publicPath)) {
      warnings.push(relativePath + ': Image not found "' + imgPath + '"');
    }
  }

  return { wikilinks, filePath: relativePath };
}

// Scan all content directories
function scanContent() {
  const wikilinksByFile = [];

  for (const lang of VALID_LANG) {
    const langDir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(langDir)) continue;

    const contentTypes = ['papers', 'articles', 'concepts', 'blog', 'books', 'topics', 'people'];

    for (const contentType of contentTypes) {
      const typeDir = path.join(langDir, contentType);
      if (!fs.existsSync(typeDir)) continue;

      // Handle books differently - they have subdirectories
      if (contentType === 'books') {
        const bookDirs = fs.readdirSync(typeDir).filter(f => {
          const stat = fs.statSync(path.join(typeDir, f));
          return stat.isDirectory();
        });
        for (const bookDir of bookDirs) {
          const indexPath = path.join(typeDir, bookDir, 'index.md');
          if (fs.existsSync(indexPath)) {
            const result = validateFile(indexPath, lang, contentType);
            if (result.wikilinks.length > 0) {
              wikilinksByFile.push(result);
            }
          }
        }
      } else {
        const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
        for (const file of files) {
          const filePath = path.join(typeDir, file);
          const result = validateFile(filePath, lang, contentType);
          if (result.wikilinks.length > 0) {
            wikilinksByFile.push(result);
          }
        }
      }
    }
  }

  return wikilinksByFile;
}

// Validate wikilinks
function validateWikilinks(wikilinksByFile) {
  const staticPages = ['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms', 'topics', 'blog', 'concepts', 'start-here', 'join', 'contact', 'investors', 'builders', 'pitch'];
  for (const page of staticPages) {
    allContentIds.add(page);
  }

  for (const { wikilinks, filePath } of wikilinksByFile) {
    for (const link of wikilinks) {
      if (!allContentIds.has(link) && !allContentIds.has(link.toLowerCase())) {
        warnings.push(filePath + ': Broken wikilink "[[' + link + ']]"');
      }
    }
  }
}

// Main
function main() {
  console.log('Quality Gates: Validating content...\n');

  const wikilinksByFile = scanContent();
  validateWikilinks(wikilinksByFile);

  if (errors.length > 0) {
    console.log('\x1b[31m' + errors.length + ' ERROR(S):\x1b[0m');
    for (const err of errors) {
      console.log('  \x1b[31m✗\x1b[0m ' + err);
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('\x1b[33m' + warnings.length + ' WARNING(S):\x1b[0m');
    for (const warn of warnings) {
      console.log('  \x1b[33m!\x1b[0m ' + warn);
    }
    console.log('');
  }

  const total = Math.floor(allContentIds.size / 2);
  console.log('Validated ' + total + ' content items across ' + VALID_LANG.length + ' languages.');

  if (errors.length > 0) {
    console.log('\n\x1b[31mValidation FAILED\x1b[0m');
    process.exitCode = 1;
  } else if (warnings.length > 0) {
    console.log('\n\x1b[33mValidation PASSED with warnings\x1b[0m');
  } else {
    console.log('\n\x1b[32mValidation PASSED\x1b[0m');
  }
}

main();
