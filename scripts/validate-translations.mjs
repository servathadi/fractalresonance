#!/usr/bin/env node
/**
 * Cross-Language Translation Parity & DOI Hygiene Validator
 * Run: node scripts/validate-translations.mjs
 *
 * Enforces:
 *   1. Zero PLACEHOLDER or fake/malformed DOI values across all content/ and public/ files.
 *   2. Non-English papers inherit exact canonical English metadata:
 *      status, publicationState, version, doi, conceptDoi, canonStatus,
 *      epistemicStatus, statusLabel, supersededBy, tier, muLevel, and statusNote presence.
 *   3. No conflicting stale version tokens in translated titles (e.g. `(v8)` vs `v3.3`).
 *   4. No superseded Born-rule derivation / fixed 10^-4..10^-3 deviation / stadium D≈1.90
 *      claims in translated abstracts when canonical English does not make them.
 *   5. Non-paper translated content does not contradict canonical English governance fields.
 *   6. public/catalog.json and public/search-index*.json contain zero PLACEHOLDERs,
 *      preserve cross-language paper metadata parity, and exclude revision-pending & archived
 *      papers from active search indexes in every language.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.join(__dirname, '..');

export const TRANSLATION_LANGS = ['es', 'fa', 'fr'];
export const ALL_LANGS = ['en', ...TRANSLATION_LANGS];
export const CONTENT_TYPES = ['papers', 'articles', 'blog', 'concepts', 'topics', 'books'];
export const VALID_TRANSLATION_STATUS = new Set([
  'synced',
  'ai-translated',
  'lags-canonical-english',
  'revision-pending',
  'partial-ai',
]);

export const REVISION_PENDING_PAPERS = new Set([
  'FRC-100-001',
  'FRC-100-004',
  'FRC-100-006',
  'FRC-100-006-002',
  'FRC-100-010',
  'FRC-566-010',
  'FRC-566-020',
]);

const FAKE_DOI_PATTERNS = [
  /placeholder/i,
  /\b(tbd|todo|xxx+|fake|dummy|example)\b/i,
  /^10\.5281\/zenodo\.0+$/i,
];

function normalizeValue(val) {
  if (val === undefined || val === null || val === '') return null;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val).trim();
}

export function isValidDoi(doi) {
  const s = normalizeValue(doi);
  if (!s) return true;
  for (const rx of FAKE_DOI_PATTERNS) {
    if (rx.test(s)) return false;
  }
  if (/^10\.5281\/zenodo\./i.test(s)) {
    return /^10\.5281\/zenodo\.\d+$/.test(s);
  }
  return /^10\.\d{4,9}\/\S+$/.test(s);
}

function listMarkdownFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function safeParseMarkdown(filePath, errors, root) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(root, filePath);

  if (/zenodo\.PLACEHOLDER/i.test(raw) || /\bPLACEHOLDER\b/.test(raw)) {
    errors.push(`${rel}: contains forbidden PLACEHOLDER token.`);
  }

  // Tolerate `---# Title` delimiter quirk used in older corpus files.
  const normalized = raw.replace(/^(---)[^\S\r\n]*#.*$/gm, '$1');
  let parsed;
  try {
    parsed = matter(normalized);
  } catch (err) {
    errors.push(`${rel}: failed to parse YAML frontmatter (${err.message}).`);
    return { raw, data: {}, content: '' };
  }

  for (const key of ['doi', 'conceptDoi']) {
    if (parsed.data[key] && !isValidDoi(parsed.data[key])) {
      errors.push(`${rel}: invalid or placeholder ${key} "${parsed.data[key]}".`);
    }
  }

  return { raw, data: parsed.data, content: parsed.content };
}

function extractTitleVersion(title) {
  const s = String(title || '');
  const m = s.match(/(?:\(|\b)v(\d+(?:\.\d+)?)\)?/i);
  return m ? `v${m[1]}` : null;
}

function hasSupersededBornOrStadiumAbstractClaim(text) {
  const s = String(text || '');
  return (
    /(?:deriva|dérive)\s+la\s+(?:regla|règle)\s+de\s+born/i.test(s) ||
    /قاعده\s+بورن[\s\S]{0,80}استخراج\s+می‌کند/i.test(s) ||
    /D\s*[≈~=]\s*1[.,]90/i.test(s) ||
    /10\^\{?-4\}?|10⁻⁴/i.test(s)
  );
}

export function validateTranslations(root = DEFAULT_ROOT) {
  const errors = [];
  const contentDir = path.join(root, 'content');
  const publicDir = path.join(root, 'public');

  // 1. Scan EVERY markdown file in content/ across all languages for PLACEHOLDER / fake DOIs
  const allMdFiles = listMarkdownFiles(contentDir);
  for (const filePath of allMdFiles) {
    safeParseMarkdown(filePath, errors, root);
  }

  // 2. Scan public JSON/text discovery files for PLACEHOLDER strings
  const publicFilesToScan = [
    'catalog.json',
    'search-index.json',
    'search-index-en.json',
    'search-index-es.json',
    'search-index-fa.json',
    'search-index-fr.json',
    'llms.txt',
    'agent.md',
    'agent.json',
  ];
  for (const fname of publicFilesToScan) {
    const full = path.join(publicDir, fname);
    if (!fs.existsSync(full)) continue;
    const raw = fs.readFileSync(full, 'utf-8');
    if (/PLACEHOLDER/i.test(raw)) {
      errors.push(`public/${fname}: contains forbidden PLACEHOLDER token.`);
    }
  }

  // 3. Load canonical English papers
  const enPapersDir = path.join(contentDir, 'en', 'papers');
  const enPapersByFile = new Map();
  const enPapersById = new Map();
  for (const filePath of listMarkdownFiles(enPapersDir)) {
    const fileName = path.basename(filePath);
    const parsed = safeParseMarkdown(filePath, [], root);
    enPapersByFile.set(fileName, parsed);
    if (parsed.data.id) {
      enPapersById.set(String(parsed.data.id), parsed);
    }
  }

  // 4. Cross-language paper metadata parity (es, fa, fr vs en)
  const STRICT_PAPER_FIELDS = [
    'id',
    'status',
    'publicationState',
    'version',
    'doi',
    'conceptDoi',
    'canonStatus',
    'epistemicStatus',
    'statusLabel',
    'supersededBy',
    'tier',
    'muLevel',
  ];

  let checkedTranslatedPapers = 0;

  for (const lang of TRANSLATION_LANGS) {
    const langPapersDir = path.join(contentDir, lang, 'papers');
    if (!fs.existsSync(langPapersDir)) continue;

    for (const filePath of listMarkdownFiles(langPapersDir)) {
      const fileName = path.basename(filePath);
      const rel = path.relative(root, filePath);
      const tr = safeParseMarkdown(filePath, [], root);
      const en = enPapersByFile.get(fileName) || (tr.data.id ? enPapersById.get(String(tr.data.id)) : null);

      if (!en) {
        errors.push(`${rel}: has no canonical English paper counterpart in content/en/papers/.`);
        continue;
      }

      checkedTranslatedPapers += 1;

      const enStatus = normalizeValue(en.data.status) || 'published';
      const trStatus = normalizeValue(tr.data.status) || 'published';

      // Enforce exact parity on canonical metadata fields
      for (const field of STRICT_PAPER_FIELDS) {
        const ev = normalizeValue(en.data[field]);
        const tv = normalizeValue(tr.data[field]);
        if (ev !== tv) {
          errors.push(
            `${rel}: metadata mismatch on "${field}" (English=${JSON.stringify(ev)}, ${lang}=${JSON.stringify(tv)}).`,
          );
        }
      }

      // If English is published, check statusNote, translationStatus, title version, and abstract safety
      if (enStatus === 'published' && trStatus === 'published') {
        const enStatusNote = normalizeValue(en.data.statusNote);
        const trStatusNote = normalizeValue(tr.data.statusNote);
        if (enStatusNote && !trStatusNote) {
          errors.push(`${rel}: missing "statusNote" declared in canonical English.`);
        }

        const trTranslationStatus = normalizeValue(tr.data.translationStatus);
        if (!trTranslationStatus || !VALID_TRANSLATION_STATUS.has(trTranslationStatus)) {
          errors.push(
            `${rel}: missing or invalid "translationStatus" (${JSON.stringify(trTranslationStatus)}). Expected one of: ${[...VALID_TRANSLATION_STATUS].join(', ')}.`,
          );
        }

        const enVersion = normalizeValue(en.data.version);
        const titleVersion = extractTitleVersion(tr.data.title);
        if (enVersion && titleVersion && titleVersion.toLowerCase() !== enVersion.toLowerCase()) {
          errors.push(
            `${rel}: stale version "${titleVersion}" in title conflicts with canonical English version "${enVersion}".`,
          );
        }

        const enAbstract = normalizeValue(en.data.abstract) || '';
        const trAbstract = normalizeValue(tr.data.abstract) || '';
        if (
          hasSupersededBornOrStadiumAbstractClaim(trAbstract) &&
          !hasSupersededBornOrStadiumAbstractClaim(enAbstract)
        ) {
          errors.push(
            `${rel}: translated abstract retains superseded Born-rule/deviation or stadium D≈1.90 claim not present in canonical English abstract.`,
          );
        }
      }
    }
  }

  // 5. Cross-language governance parity for non-paper content
  const NON_PAPER_GOVERNANCE_FIELDS = [
    'status',
    'doi',
    'conceptDoi',
    'publicationState',
    'canonStatus',
    'epistemicStatus',
    'editionStatus',
  ];
  for (const type of CONTENT_TYPES.filter((t) => t !== 'papers')) {
    const enDir = path.join(contentDir, 'en', type);
    if (!fs.existsSync(enDir)) continue;
    for (const lang of TRANSLATION_LANGS) {
      const trDir = path.join(contentDir, lang, type);
      if (!fs.existsSync(trDir)) continue;
      for (const filePath of listMarkdownFiles(trDir)) {
        const relUnderType = path.relative(trDir, filePath);
        const enPath = path.join(enDir, relUnderType);
        if (!fs.existsSync(enPath)) continue;
        const rel = path.relative(root, filePath);
        const en = safeParseMarkdown(enPath, [], root);
        const tr = safeParseMarkdown(filePath, [], root);
        for (const field of NON_PAPER_GOVERNANCE_FIELDS) {
          const ev = normalizeValue(en.data[field]);
          const tv = normalizeValue(tr.data[field]);
          if (ev !== tv) {
            errors.push(
              `${rel}: governance metadata mismatch on "${field}" (English=${JSON.stringify(ev)}, ${lang}=${JSON.stringify(tv)}).`,
            );
          }
        }
      }
    }
  }

  // 6. Verify public/catalog.json & public/search-index*.json parity and exclusions
  const catalogPath = path.join(publicDir, 'catalog.json');
  if (fs.existsSync(catalogPath)) {
    let catalog;
    try {
      catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    } catch (err) {
      errors.push(`public/catalog.json: invalid JSON (${err.message}).`);
    }
    if (catalog?.content?.en?.papers) {
      const enCatById = new Map(catalog.content.en.papers.map((p) => [p.id, p]));
      for (const lang of TRANSLATION_LANGS) {
        const langPapers = catalog.content?.[lang]?.papers || [];
        for (const p of langPapers) {
          const enP = enCatById.get(p.id);
          if (!enP) continue;
          for (const field of ['publicationState', 'version', 'doi', 'conceptDoi', 'canonStatus', 'epistemicStatus', 'statusLabel']) {
            const ev = normalizeValue(enP[field]);
            const tv = normalizeValue(p[field]);
            if (ev !== tv) {
              errors.push(
                `public/catalog.json (${lang}/papers/${p.id}): "${field}" disagrees with English catalog (en=${JSON.stringify(ev)}, ${lang}=${JSON.stringify(tv)}). Run \`npm run build:catalog\`.`,
              );
            }
          }
        }
      }
    }
  }

  const searchIndexPath = path.join(publicDir, 'search-index.json');
  if (fs.existsSync(searchIndexPath)) {
    try {
      const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8'));
      for (const doc of searchIndex.documents || []) {
        if (doc.type !== 'papers') continue;
        const enPaper = enPapersById.get(doc.id);
        const isRevPending =
          REVISION_PENDING_PAPERS.has(String(doc.id).toUpperCase()) ||
          normalizeValue(enPaper?.data?.publicationState)?.toLowerCase() === 'revision pending';
        const isArchived =
          normalizeValue(enPaper?.data?.canonStatus) === 'archive' ||
          normalizeValue(enPaper?.data?.epistemicStatus) === 'archive' ||
          normalizeValue(enPaper?.data?.publicationState)?.toLowerCase() === 'archived';
        if (isRevPending) {
          errors.push(`public/search-index.json (${doc.lang}): must exclude revision-pending paper ${doc.id}.`);
        }
        if (isArchived) {
          errors.push(`public/search-index.json (${doc.lang}): must exclude archived paper ${doc.id}.`);
        }
      }
    } catch (err) {
      errors.push(`public/search-index.json: invalid JSON (${err.message}).`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      markdownFilesScanned: allMdFiles.length,
      translatedPapersChecked: checkedTranslatedPapers,
    },
  };
}

function main() {
  console.log('Checking cross-language translation parity and DOI hygiene...');
  const { ok, errors, stats } = validateTranslations(DEFAULT_ROOT);
  if (!ok) {
    console.error(`\n✗ Translation parity / DOI validation FAILED (${errors.length} issue(s)):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(
    `✓ Translation parity & DOI hygiene PASSED (${stats.markdownFilesScanned} markdown files scanned; ${stats.translatedPapersChecked} translated papers verified against canonical English).`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main();
}
