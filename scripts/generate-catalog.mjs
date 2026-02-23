/**
 * Generate catalog.json - machine-readable index of all FRC content
 * Run: node scripts/generate-catalog.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITE_URL = 'https://fractalresonance.com';

// Simple YAML frontmatter parser
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentValue = [];
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      if (currentKey) {
        fm[currentKey] = inArray ? currentValue : currentValue.join('\n').trim();
      }
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === '' || val === '|' || val === '>') {
        currentValue = [];
        inArray = false;
      } else if (val.startsWith('[') && val.endsWith(']')) {
        fm[currentKey] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        currentKey = null;
        currentValue = [];
      } else if (val.startsWith("'") || val.startsWith('"')) {
        fm[currentKey] = val.replace(/^['"]|['"]$/g, '');
        currentKey = null;
        currentValue = [];
      } else {
        fm[currentKey] = val;
        currentKey = null;
        currentValue = [];
      }
      inArray = false;
    } else if (line.startsWith('- ')) {
      inArray = true;
      currentValue.push(line.slice(2).trim().replace(/^['"]|['"]$/g, ''));
    } else if (currentKey && line.startsWith('  ')) {
      currentValue.push(trimmed);
    }
  }

  if (currentKey) {
    fm[currentKey] = inArray ? currentValue : currentValue.join('\n').trim();
  }

  return { frontmatter: fm, body: match[2].trim() };
}

function readContentDir(lang, type) {
  const dir = path.join(CONTENT_DIR, lang, type);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.map(f => {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    return { ...frontmatter, _file: f, _wordCount: body.split(/\s+/).filter(Boolean).length };
  });
}

function getLanguages() {
  if (!fs.existsSync(CONTENT_DIR)) return ['en'];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => {
      const full = path.join(CONTENT_DIR, f);
      return fs.statSync(full).isDirectory() && f !== 'inbox';
    });
}

function buildCatalog() {
  const languages = getLanguages();
  const catalog = {
    $schema: 'https://fractalresonance.com/catalog.schema.json',
    version: '1.0.0',
    generated: new Date().toISOString(),
    site: {
      url: SITE_URL,
      name: 'Fractal Resonance Cognition',
      author: 'Hadi Servat',
      license: 'CC BY-NC-ND 4.0',
    },
    statistics: {
      languages: languages.length,
      totalItems: 0,
      byType: {},
      byLanguage: {},
    },
    content: {},
  };

  const contentTypes = ['papers', 'articles', 'concepts', 'topics', 'blog', 'books', 'people'];

  for (const lang of languages) {
    catalog.content[lang] = {};
    catalog.statistics.byLanguage[lang] = 0;

    for (const type of contentTypes) {
      const items = readContentDir(lang, type);

      catalog.content[lang][type] = items.map(item => {
        const entry = {
          id: item.id,
          title: item.title,
          url: `${SITE_URL}/${lang}/${type}/${item.id}`,
          path: `/${lang}/${type}/${item.id}`,
        };

        if (item.abstract) entry.abstract = item.abstract;
        if (item.description) entry.description = item.description;
        if (item.date) entry.date = item.date;
        if (item.author) entry.author = item.author;
        if (item.doi) entry.doi = item.doi;
        if (item.tier) entry.tier = item.tier;
        if (item.series) entry.series = item.series;
        if (item.tags && Array.isArray(item.tags)) entry.tags = item.tags;
        if (item.status) entry.status = item.status;
        if (item._wordCount) entry.wordCount = item._wordCount;

        return entry;
      }).filter(item => item.id);

      catalog.statistics.byLanguage[lang] += catalog.content[lang][type].length;
      catalog.statistics.byType[type] = (catalog.statistics.byType[type] || 0) + catalog.content[lang][type].length;
      catalog.statistics.totalItems += catalog.content[lang][type].length;
    }
  }

  return catalog;
}

// Main
console.log('Generating catalog.json...');
const catalog = buildCatalog();

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'catalog.json'),
  JSON.stringify(catalog, null, 2)
);

console.log(`✓ Generated catalog.json`);
console.log(`  Total items: ${catalog.statistics.totalItems}`);
console.log(`  Languages: ${Object.keys(catalog.statistics.byLanguage).join(', ')}`);
console.log(`  By type: ${JSON.stringify(catalog.statistics.byType)}`);
