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

const STATUS_PRIORITY = {
  primary: 100,
  frontier: 80,
  commentary: 60,
  conceptual: 50,
  philosophical: 40,
  archive: 20,
};

const FRONTIER_PAPERS = new Set([
  'FRC-787-787',
  'FRC-826-829',
  'FRC-840-101',
  'FRC-841-004',
]);

const PHILOSOPHICAL_BOOKS = new Set([
  'the-open-system',
  'the-mind-in-the-coupling',
]);
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
  if (/^FRC-100(?:-|$)/i.test(id)) return 'frc-100';
  if (/^FRC-566(?:-|$)/i.test(id)) return 'frc-566';
  if (/^FRC-700(?:-|$)/i.test(id)) return 'frc-700';
  if (/^FRC-8(?:[0-4][0-9]|[0-9]{2})(?:-|$)/i.test(id)) return 'frc-800';
  return null;
}

function getTaxons(type, id, tags) {
  const rawTags = Array.isArray(tags) ? tags : tags ? [tags] : [];
  const taxons = rawTags.map(canonicalTaxon);
  const series = type === 'papers' ? deriveSeriesTaxon(id) : null;
  return [...new Set(series ? [...taxons, series] : taxons)];
}

function getEpistemicMetadata(type, id, bookId = null, frontmatter = {}) {
  let epistemicStatus;

  if (frontmatter.epistemicStatus === 'archive' || ARCHIVED_CONTENT_IDS[type]?.has(id)) {
    epistemicStatus = 'archive';
  } else if (frontmatter.epistemicStatus === 'philosophical') {
    epistemicStatus = 'philosophical';
  } else if (type === 'papers') {
    if (frontmatter.canonStatus === 'frontier') {
      epistemicStatus = 'frontier';
    } else if (frontmatter.canonStatus === 'archive') {
      epistemicStatus = 'archive';
    } else if (/^FRC-(100|566)(?:-|$)/i.test(id)) {
      epistemicStatus = 'primary';
    } else if (FRONTIER_PAPERS.has(id.toUpperCase())) {
      epistemicStatus = 'frontier';
    } else {
      // 16D, 821, and all other historical paper branches are archival.
      epistemicStatus = 'archive';
    }
  } else if (type === 'articles' || type === 'blog') {
    epistemicStatus = frontmatter.epistemicStatus === 'archive' ? 'archive' : 'commentary';
  } else if (type === 'concepts' || type === 'topics') {
    epistemicStatus = 'conceptual';
  } else if (type === 'books' && bookId && PHILOSOPHICAL_BOOKS.has(bookId)) {
    epistemicStatus = 'philosophical';
  } else {
    // The current remaining books (ECR Textbook and The Resonance Code) are archival.
    epistemicStatus = 'archive';
  }

  return {
    epistemicStatus,
    retrievalPriority: STATUS_PRIORITY[epistemicStatus],
  };
}

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
        if (frontmatter.status && frontmatter.status !== 'published') continue;
        if (type === 'papers' && frontmatter.id === 'FRC-000-START-HERE') continue;
        const plainText = extractText(content);

        // Skip empty or very short content
        if (plainText.length < 50) continue;

        const id = String(frontmatter.id || path.basename(filePath, '.md'));
        if (RETIRED_MIND_CONTENT_IDS[type]?.has(id)) continue;
        const relativePath = path.relative(typeDir, filePath);
        const pathParts = relativePath.split(path.sep);
        const bookId = type === 'books' && pathParts.length > 1 ? pathParts[0] : null;
        const epistemicMetadata = getEpistemicMetadata(type, id, bookId, frontmatter);
        // The public search corpus is a current reading aid. Archived records
        // remain in the catalog and on their direct URLs, but are deliberately
        // excluded so they cannot outrank current, versioned work.
        if (epistemicMetadata.epistemicStatus === 'archive' || REVISION_PENDING_PAPERS.has(id.toUpperCase()) || String(frontmatter.publicationState || '').toLowerCase() === 'revision pending') continue;
        const rawTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : frontmatter.tags ? [frontmatter.tags] : [];

        const doc = {
          id,
          type,
          lang,
          title: frontmatter.title || 'Untitled',
          abstract: frontmatter.abstract || frontmatter.description || '',
          tags: rawTags,
          taxons: getTaxons(type, id, rawTags),
          content: truncate(plainText, 500), // Limit content size for smaller index
          url: `/${lang}/${type}/${frontmatter.id || path.basename(filePath, '.md')}`,
          date: frontmatter.date ? String(frontmatter.date) : null,
          version: frontmatter.version || null,
          muLevel: frontmatter.muLevel || null,
          doi: frontmatter.doi || null,
          conceptDoi: frontmatter.conceptDoi || null,
          ...epistemicMetadata,
        };

        // Special handling for books - include book ID in URL
        if (type === 'books' && bookId) {
          if (pathParts.length > 1) {
            const chapterId = path.basename(filePath, '.md');
            doc.url = chapterId === 'index'
              ? `/${lang}/books/${bookId}`
              : `/${lang}/books/${bookId}/chapter/${chapterId}`;
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
