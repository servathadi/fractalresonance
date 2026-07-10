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

const STATUS_PRIORITY = {
  primary: 100,
  frontier: 80,
  commentary: 60,
  conceptual: 50,
  philosophical: 40,
  archive: 20,
};

const FRONTIER_PAPERS = new Set(['FRC-787-787', 'FRC-826-829', 'FRC-840-101', 'FRC-841-004']);
const CURRENT_BOOKS = new Set(['the-open-system', 'the-mind-in-the-coupling']);
const REVISION_PENDING_PAPERS = new Set(['FRC-100-001', 'FRC-100-004', 'FRC-100-006', 'FRC-100-006-002', 'FRC-100-010', 'FRC-566-010', 'FRC-566-020']);
const RETIRED_MIND_CONTENT_IDS = {
  articles: new Set(['ai-awakening']),
  blog: new Set(['ai-and-the-symbolic-realm', 'FRC-BLOG-2026-01-27-001']),
  topics: new Set(['ai-transformer-attention', 'FRC-TOP-042', 'consciousness-emergence-protocol', 'frc-vs-iit', 'frc-vs-orch-or', 'reflexive-closure-001', 'reflexive-closure-emergence', 'reflexive-coherence', 'reflexive-coherence-synthetic-emergence']),
};
const ARCHIVED_CONTENT_IDS = {
  articles: new Set(['ai-awakening', 'FRC-EP-001', 'FRC-EP-002', 'FRC-EP-003', 'FRC-EP-005', 'FRC-EP-006', 'FRC-EP-EXTRA-1', 'FRC-EP-EXTRA-2', 'ep1-ghost-in-the-machine', 'ep2-order-in-the-chaos', 'ep3-engine-of-coherence', 'ep5-illusion-of-chance', 'ep6-hunting-the-glitch', 'extra-190-signature', 'extra-unmasking-randomness']),
  blog: new Set(['ai-and-the-symbolic-realm', 'beyond-randomness', 'coherence-delta-benchmarking-reflexive-closure', 'quantitative-benchmarking-of-coherence-density', 'the-symphony-of-mu-levels']),
  concepts: new Set(['fractal-imperative', 'general-relativity', 'mu-levels', 'process-philosophy', 'quantum-computing', 'time', 'witness']),
  topics: new Set(['addiction-coherence-trap', 'ai-transformer-attention', 'artificial-reflexive-closure', 'cities-coherence-concrete', 'climate-earth-fever', 'consciousness-emergence-protocol', 'dreams-nightly-nigredo', 'education-cgl-gates', 'food-coherence-alchemy', 'FRC-TOP-042', 'frc-vs-active-inference', 'frc-vs-bohmian-mechanics', 'frc-vs-copenhagen', 'frc-vs-dark-matter', 'frc-vs-heat-death', 'frc-vs-iit', 'frc-vs-neo-darwinism', 'frc-vs-orch-or', 'frc-vs-quantum-computing', 'frc-vs-simulation-hypothesis', 'frc-vs-string-theory', 'frc-vs-wolfram', 'gaia-sahara-ocean-coherence', 'health-hrv-coherence', 'iran-liquid-fortress', 'language-coherence-audible', 'markets-coherence-flow', 'open-problem-covariant-flux', 'open-problem-vainshtein', 'reflexive-closure-001', 'reflexive-closure-emergence', 'reflexive-coherence', 'reflexive-coherence-synthetic-emergence', 'war-coherence-fields']),
};

const TAXON_ALIASES = {
  '100': 'frc-100', '100-series': 'frc-100', 'frc-100': 'frc-100', 'frc-100-series': 'frc-100',
  '566': 'frc-566', '566-series': 'frc-566', 'frc-566': 'frc-566', 'frc-566-series': 'frc-566',
  '700': 'frc-700', '700-series': 'frc-700', 'frc-700': 'frc-700', 'frc-700-series': 'frc-700',
  '800': 'frc-800', '800-series': 'frc-800', 'frc-800': 'frc-800',
  ai: 'ai', ia: 'ai', coherence: 'coherence', coherencia: 'coherence', 'cohérence': 'coherence', 'همدوسی': 'coherence',
  entropy: 'entropy', entropia: 'entropy', 'entropía': 'entropy', entropie: 'entropy', 'آنتروپی': 'entropy',
  'lambda-field': 'lambda-field', 'campo-lambda': 'lambda-field', 'champ-lambda': 'lambda-field', 'میدان-لاندا': 'lambda-field',
  ucc: 'ucc', frc: 'frc', kuramoto: 'kuramoto', 'open-systems': 'open-systems', reciprocity: 'reciprocity',
};

function canonicalTaxon(value) {
  const normalized = String(value).trim().toLowerCase().replace(/[_\s]+/g, '-').replace(/-+/g, '-');
  const withSpaces = normalized.replace(/-/g, ' ');
  return TAXON_ALIASES[normalized] || TAXON_ALIASES[withSpaces] || normalized;
}

function deriveSeriesTaxon(id) {
  if (/^FRC-100(?:-|$)/i.test(id || '')) return 'frc-100';
  if (/^FRC-566(?:-|$)/i.test(id || '')) return 'frc-566';
  if (/^FRC-700(?:-|$)/i.test(id || '')) return 'frc-700';
  if (/^FRC-8(?:[0-4][0-9]|[0-9]{2})(?:-|$)/i.test(id || '')) return 'frc-800';
  return null;
}

function getTaxons(type, item) {
  const rawTags = Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [];
  const taxons = rawTags.map(canonicalTaxon);
  const series = type === 'papers' ? deriveSeriesTaxon(item.id) : null;
  return [...new Set(series ? [...taxons, series] : taxons)];
}

function inferEpistemicStatus(type, item) {
  if (ARCHIVED_CONTENT_IDS[type]?.has(item.id)) return 'archive';
  if (item.epistemicStatus === 'archive') return 'archive';
  if (item.epistemicStatus === 'philosophical') return 'philosophical';
  if (item.editionStatus === 'legacy') return 'archive';

  if (type === 'papers') {
    if (item.canonStatus === 'frontier') return 'frontier';
    if (item.canonStatus === 'archive') return 'archive';
    if (/^FRC-(100|566)(?:-|$)/i.test(item.id || '')) return 'primary';
    if (FRONTIER_PAPERS.has(String(item.id || '').toUpperCase())) return 'frontier';
    return 'archive';
  }
  if (type === 'articles' || type === 'blog') return 'commentary';
  if (type === 'concepts' || type === 'topics') return 'conceptual';
  if (type === 'books') return CURRENT_BOOKS.has(item.id) ? 'philosophical' : 'archive';
  return null;
}

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

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap(entry => {
    if (entry.isFile() && entry.name.endsWith('.md')) return [entry.name];
    if (entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'index.md'))) {
      return [path.join(entry.name, 'index.md')];
    }
    return [];
  });

  return files.map(f => {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    return { ...frontmatter, _file: f, _wordCount: body.split(/\s+/).filter(Boolean).length };
  }).filter(item => (!item.status || item.status === 'published') && (type !== 'papers' || item.id !== 'FRC-000-START-HERE'));
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
      name: 'Fractal Resonance Coherence',
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

      catalog.content[lang][type] = items.filter((item) => !RETIRED_MIND_CONTENT_IDS[type]?.has(item.id)).map(item => {
        const epistemicStatus = inferEpistemicStatus(type, item);
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
        if (item.conceptDoi) entry.conceptDoi = item.conceptDoi;
        if (item.version) entry.version = item.version;
        if (item.muLevel) entry.muLevel = item.muLevel;
        if (item.supersedes) entry.supersedes = item.supersedes;
        if (item.statusNote) entry.statusNote = item.statusNote;
        if (item.publicationState) entry.publicationState = item.publicationState;
        if (type === 'papers' && REVISION_PENDING_PAPERS.has(String(item.id || '').toUpperCase())) entry.publicationState = 'revision pending';
        if (item.editionStatus) entry.editionStatus = item.editionStatus;
        if (item.translationStatus) entry.translationStatus = item.translationStatus;
        if (epistemicStatus) {
          entry.epistemicStatus = epistemicStatus;
          entry.retrievalPriority = STATUS_PRIORITY[epistemicStatus];
        }
        if (item.canonStatus) entry.canonStatus = item.canonStatus;
        if (item.cover) entry.cover = item.cover;
        if (item.tier) entry.tier = item.tier;
        if (item.series) entry.series = item.series;
        if (item.tags && Array.isArray(item.tags)) entry.tags = item.tags;
        entry.taxons = getTaxons(type, item);
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
