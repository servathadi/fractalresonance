#!/usr/bin/env node
/**
 * Public Corpus Governance Check
 * Run: npm run governance:check
 *
 * Verifies:
 *   1. FRC 700.777 is archived as superseded historical/origin material and routed to FRC 700.000–700.007.
 *   2. FRC 700.000–700.007 are published framework preprints with status labels.
 *   3. FRC 830.000–830.005 are published preprints with status labels and no-promotion language.
 *   4. Revision-pending living identifiers declare publicationState: revision pending.
 *   5. Retired mind-content records and archived/revision-pending papers are excluded from active search/discovery across all languages.
 *   6. public/catalog.json, public/llms.txt, public/agent.md, and public/agent.json match canonical English frontmatter with zero drift.
 *   7. Cross-language translation metadata/DOI parity and no-stale-claims rules pass across es/fa/fr.
 *   8. Homepage configs and start-here content align with active FRC 700.000–700.007 and FRC 830.000–830.005,
 *      do not feature FRC 700.777 as current, and contain no inflated Born-rule/self-duality claims.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  REVISION_PENDING_PAPERS,
  checkAiEntrypoints,
  loadCanonicalPapers,
} from './generate-ai-entrypoints.mjs';
import { checkFalsificationLedger } from './generate-falsification-ledger.mjs';
import { ALL_LANGS, validateTranslations } from './validate-translations.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.join(__dirname, '..');

export const NEGATION_CONTEXT_RX =
  /\b(?:not\s+a\s+pillar|not\s+universal|not\s+the\s+current|not\s+current|not\s+(?:already\s+)?derived|(?:has|have|was|were)\s+not\s+(?:been\s+|already\s+)?derived|never\s+(?:derived|proves?|claims?|establishes?|substitutes?)|not\s+an?\s+(?:established|empirical\s+proof)|not\s+claim\s+to\s+prove|no\s+claim\s+to\s+prove|zero\s+(?:empirical\s+|physical\s+)?proof|does\s+not\s+(?:derive|claim|establish|assert|predict|prove)|do\s+not\s+(?:claim|assert|present|derive|prove)|has\s+no\s+fixed|no\s+fixed|no\s+longer|demoted|withdrawn|retired|retracted|contradicted|refuted|excluded|superseded|archived|quarantined|development\s+history|no\s+fitted|obsolete|relegat|rejected|cannot\s+be\s+used|conditional|not\s+a\s+completed|prohibited\s+category\s+error)\b|(?:no\s+ha\s+derivado|no\s+afirma|descartad|retirad|archiv|sustituid|degradad|retrograd|n['’]a\s+pas\s+dérivé|ne\s+revendique\s+pas|remplac|بایگانی|منسوخ|تنزل|کنار\s+گذاشته|مدعی[\s\S]{0,20}نیست)/i;

export const TWO_REGISTER_FRAMING_RX =
  /(?:\b(?:philosophy\s+register|philosophical\s+register|in\s+philosophy)\b[^.;!?]{0,40}\bfractal\s+resonance\s+cognition\b|\bfractal\s+resonance\s+cognition\b[^.;!?]{0,40}(?:\b(?:belongs?\s+to\s+philosophy|in\s+(?:its\s+)?philosophy\s+register|philosophy\s+register)\b|\(\s*philosophy(?:\s+register)?\s*\)))/i;

export const COGNITION_NAME_RX = /\bfractal\s+resonance\s+cognition\b/i;

/**
 * Verb-independent physics-mechanism / quantum / dynamics vocabulary that must NEVER
 * co-occur with "Fractal Resonance Cognition" in a clause on physics or charter pages.
 */
export const COGNITION_PHYSICS_VOCAB_RX =
  /\b(?:quantum|decoherence|collapse|wavefunction|born|hamiltonian|physically|physical\s+(?:force|mechanism|collapse|law|dynamics|process|substrate|driver|cause|interaction|field|equation|model|theory|effect)|phase[- ]locking\s+mechanism|thermodynamic\s+law)\b/i;

export const PHILOSOPHY_BOOK_IDS = new Set([
  'the-open-system',
  'the-mind-in-the-coupling',
]);

export const CHARTER_OVERVIEW_IDS = new Set([
  'FRC-100-000',
  'FRC-100-100',
  'FRC-100-011',
  'start-here',
  'about',
]);

const ACTIVE_STALE_CLAIM_RULES = [
  {
    id: 'retired-cognition-name',
    pattern: COGNITION_NAME_RX,
    message: 'uses "Fractal Resonance Cognition" in physics register without explicit philosophy/two-register or historical/negation framing',
  },
  {
    id: 'unhedged-equation-proves-consciousness',
    pattern: /(?:(?:equation|reciprocity|dS\s*\+\s*k\*?\s*d\s*\\?ln\s*C|FRC)\s+(?:proves?|demonstrates?|establishes?)\s+(?:that\s+)?(?:consciousness|subjective\s+experience|sentience)|proves?\s+consciousness\s+(?:physically|mathematically|from\s+the\s+equation))/i,
    message: 'contains unhedged claim that the physics equation proves consciousness',
  },
  {
    id: 'unhedged-d190',
    pattern: /(?:\bD\s*(?:\\approx|\\simeq|\\sim|[≈~=])\s*1[.,]90|\b1[.,]90\s*(?:fractal|signature|dimension)|stadium[^.;!?]{0,40}1[.,]90)/i,
    message: 'contains unhedged D ≈ 1.90 stadium proof claim',
  },
  {
    id: 'unhedged-16d',
    pattern: /\b16D\b/,
    message: 'contains unhedged 16D canonical claim',
  },
  {
    id: 'unhedged-821',
    pattern: /(?:\bFRC[\s.-]?821\b|\b821[\s.-]\d{3}\b|\b821\s+(?:series|branch|canon|framework|paper|model|theory)\b)/i,
    message: 'contains unhedged FRC 821 canonical claim',
  },
  {
    id: 'unhedged-born-rule',
    pattern: /(?:(?:(?:has|have)\s+(?:already\s+)?)?deriv(?:es?|ed)\s+the\s+born\s+rule|born\s+rule\s+(?:(?:is|was|has\s+been|had\s+been)\s+(?:already\s+)?)?(?:derived|derivation|emerges\s+as)|(?:deriva|dérive)\s+la\s+(?:regla|règle)\s+de\s+born|قاعده\s+بورن[\s\S]{0,60}استخراج\s+می‌کند|born[\s-]rule\s+deviation[^.;!?]{0,40}10\^?\{?-4|10\^\{?-4\}?\s*(?:to|–|-|,)\s*10\^\{?-3\}?|10⁻⁴)/i,
    message: 'contains unhedged Born-rule derivation or fixed deviation-range claim',
  },
];

const NEGATED_LIST_LEAD_RX =
  /\b(?:do\s+not\s+revive|do\s+not\s+claim|retired\s+claims|withdrawn\s+claims|demoted\s+claims|explicit\s+non-claims)\b[^.\n]*:\s*$/i;

const NEGATED_TABLE_ROW_CELL_RX =
  /^(?:CONTRADICTED|DEMOTED|ARCHIVED|RETIRED|HISTORICAL\s+DEVELOPMENT\s+ARCHIVE(?:\s*\([^)]*\))?)$/i;

/**
 * Determine whether a content item belongs to the physics or philosophy register,
 * and whether it is a charter/overview document permitted to explain the Two-Register Architecture.
 */
export function resolveContentRegister({ type = '', id = '', rel = '', frontmatter = {} } = {}) {
  const fm = frontmatter || {};
  const normalizedId = String(id || fm.id || '').trim();
  const normalizedRel = String(rel || '').replace(/\\/g, '/');
  const explicitRegister = String(fm.register || '').trim().toLowerCase();
  const epistemicStatus = String(fm.epistemicStatus || '').trim().toLowerCase();

  const isPhilosophyBook =
    type === 'books'
      ? PHILOSOPHY_BOOK_IDS.has(normalizedId) ||
        /(?:^|\/)(?:the-open-system|the-mind-in-the-coupling)(?:\/|$)/i.test(normalizedRel)
      : /(?:^|\/)books\/(?:the-open-system|the-mind-in-the-coupling)(?:\/|$)/i.test(normalizedRel);

  const register =
    explicitRegister === 'philosophy' || epistemicStatus === 'philosophical' || isPhilosophyBook
      ? 'philosophy'
      : 'physics';

  const baseId = path.basename(normalizedRel, '.md');
  const isCharterOverview =
    CHARTER_OVERVIEW_IDS.has(normalizedId) ||
    CHARTER_OVERVIEW_IDS.has(normalizedId.toUpperCase()) ||
    CHARTER_OVERVIEW_IDS.has(baseId) ||
    CHARTER_OVERVIEW_IDS.has(baseId.toUpperCase());

  return { register, isCharterOverview };
}

/**
 * Split a line into clauses/sentences so negation/demotion framing in one clause
 * cannot exempt an affirmative retired claim in another clause on the same line.
 * Preserves decimals/identifiers (digit.digit with no following whitespace) and
 * inline em-dash appositives/definitions, while splitting on `;`, `!`, `?`, `|`,
 * sentence-ending `.` followed by whitespace/EOL (including years like `2025. `),
 * and contrastive conjunction clauses (`, but `, `, however `, `, yet `, `, whereas `, `, while `).
 */
export function splitIntoClauses(line) {
  const withoutListPrefix = String(line || '').replace(/^\s*(?:[-*+]|\d+\.)\s+/, '');
  return withoutListPrefix
    .split(/(?:[;!?|]+|\.[)"'”’]*(?=\s|$)|,\s+(?:but|however|yet|whereas|while)\b)/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Scan active (non-archived) text clause-by-clause for unhedged retired claims.
 *
 * Register-aware governance (Two-Register Architecture):
 *   - register: 'physics' (default): strict enforcement on all rules, including
 *     unhedged "Fractal Resonance Cognition" unless explicitly framed as Two-Register
 *     on charter/overview pages or explicitly negated/historical.
 *   - register: 'philosophy': allows canonical "Fractal Resonance Cognition" cleanly
 *     while STILL blocking unhedged physics-overreach claims (D ≈ 1.90 proof, 16D canon,
 *     FRC 821 canon, Born-rule derivation/deviation, equation proves consciousness).
 */
export function checkActiveTextForStaleClaims(text, rel, options = {}) {
  const { register = 'physics', isCharterOverview = false } = options;
  const issues = [];
  let inNegatedList = false;
  let awaitingListAfterLead = false;

  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (!awaitingListAfterLead) {
        inNegatedList = false;
      }
      continue;
    }

    const plainTrimmed = trimmed.replace(/[*_`]+/g, '');
    const isListItem = /^(?:[-*+]|\d+\.)\s+/.test(trimmed);
    if (NEGATED_LIST_LEAD_RX.test(plainTrimmed)) {
      inNegatedList = true;
      awaitingListAfterLead = true;
      continue;
    }
    if (!isListItem) {
      inNegatedList = false;
      awaitingListAfterLead = false;
    } else if (inNegatedList) {
      awaitingListAfterLead = false;
      continue;
    }

    const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');
    const tableCells = isTableRow
      ? trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.replace(/[*_`]+/g, '').trim())
      : [];
    const hasNegatedTableDisposition =
      isTableRow && tableCells.some((cell) => NEGATED_TABLE_ROW_CELL_RX.test(cell));
    const hasPhilosophyRegisterTableCell =
      isTableRow && tableCells.some((cell) => /^philosophy\s+register$/i.test(cell));

    for (const clause of splitIntoClauses(rawLine)) {
      const plainClause = clause.replace(/[*_`]+/g, '');
      const hasCognitionPhysicsVocab =
        COGNITION_NAME_RX.test(plainClause) && COGNITION_PHYSICS_VOCAB_RX.test(plainClause);

      // Strict verb-independent rule: on ANY physics or charter page, a clause combining
      // "Fractal Resonance Cognition" with physics-mechanism / quantum / dynamics vocabulary
      // is unconditionally rejected (cannot be bypassed by "philosophy register", "(philosophy)",
      // "the open system", "Two-Register Architecture", or piggybacked negation phrases).
      if (hasCognitionPhysicsVocab && register !== 'philosophy') {
        issues.push(
          `${rel}: active page combines "Fractal Resonance Cognition" with physical-mechanism/quantum vocabulary ("${clause.slice(0, 120)}").`,
        );
        continue;
      }

      for (const rule of ACTIVE_STALE_CLAIM_RULES) {
        if (rule.id === 'retired-cognition-name' && register === 'philosophy') {
          continue;
        }
        if (!rule.pattern.test(plainClause)) continue;
        if (NEGATION_CONTEXT_RX.test(plainClause)) continue;
        if (hasNegatedTableDisposition && rule.id !== 'unhedged-equation-proves-consciousness') {
          continue;
        }
        if (
          rule.id === 'retired-cognition-name' &&
          isCharterOverview &&
          (TWO_REGISTER_FRAMING_RX.test(plainClause) || hasPhilosophyRegisterTableCell)
        ) {
          continue;
        }
        issues.push(`${rel}: active page ${rule.message} ("${clause.slice(0, 120)}").`);
      }
    }
  }
  return issues;
}

const RETIRED_MIND_CONTENT_IDS = {
  articles: new Set(['ai-awakening']),
  blog: new Set(['ai-and-the-symbolic-realm', 'FRC-BLOG-2026-01-27-001']),
  topics: new Set([
    'ai-transformer-attention',
    'FRC-TOP-042',
    'consciousness-emergence-protocol',
    'frc-vs-iit',
    'frc-vs-orch-or',
    'reflexive-closure-001',
    'reflexive-closure-emergence',
    'reflexive-coherence',
    'reflexive-coherence-synthetic-emergence',
  ]),
};

const PROHIBITED_HOMEPAGE_CLAIM_PATTERNS = [
  /derives?\s+the\s+born\s+rule/i,
  /born\s+rule\s+is\s+derived/i,
  /10\^\{?-4\}?\s*(?:to|–|-|,)\s*10\^\{?-3\}?/i,
  /10⁻⁴/,
  /proved\s+universal\s+μ\s+hierarchy/i,
  /established\s+physical\s+self-duality/i,
];

function readJson(root, relPath, errors) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`${relPath} is missing.`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  } catch (err) {
    errors.push(`${relPath} is invalid JSON: ${err.message}`);
    return null;
  }
}

export function validateGovernance(root = DEFAULT_ROOT) {
  const errors = [];

  const papers = loadCanonicalPapers(root);
  const byId = new Map(papers.map((p) => [p.id, p]));

  // 1. FRC 700.777 superseded historical/origin governance
  const origin777 = byId.get('FRC-700-777');
  if (!origin777) {
    errors.push('FRC-700-777 must remain addressable as archived historical provenance.');
  } else {
    if (origin777.publicationState !== 'archived') {
      errors.push(`FRC-700-777 must have publicationState="archived" (got ${JSON.stringify(origin777.publicationState)}).`);
    }
    if (origin777.canonStatus !== 'archive') {
      errors.push(`FRC-700-777 must have canonStatus="archive" (got ${JSON.stringify(origin777.canonStatus)}).`);
    }
    if (origin777.epistemicStatus !== 'archive') {
      errors.push(`FRC-700-777 must have epistemicStatus="archive" (got ${JSON.stringify(origin777.epistemicStatus)}).`);
    }
    if (!String(origin777.supersededBy || '').includes('FRC-700-000') || !String(origin777.supersededBy || '').includes('FRC-700-007')) {
      errors.push('FRC-700-777 must declare supersededBy pointing to FRC-700-000 through FRC-700-007.');
    }
  }

  // 2. Active FRC 700.000–700.007 threshold-framework route
  for (let i = 0; i <= 7; i += 1) {
    const id = `FRC-700-${String(i).padStart(3, '0')}`;
    const p = byId.get(id);
    if (!p) {
      errors.push(`Missing active threshold-framework paper ${id}.`);
      continue;
    }
    if (p.canonStatus !== 'framework') {
      errors.push(`${id} must have canonStatus="framework" (got ${JSON.stringify(p.canonStatus)}).`);
    }
    if (p.publicationState !== 'preprint') {
      errors.push(`${id} must have publicationState="preprint" (got ${JSON.stringify(p.publicationState)}).`);
    }
    if (!p.statusLabel) {
      errors.push(`${id} is missing frontmatter statusLabel.`);
    }
  }

  // 3. Active FRC 830.000–830.005 Reciprocity Mathematics series
  for (let i = 0; i <= 5; i += 1) {
    const id = `FRC-830-${String(i).padStart(3, '0')}`;
    const p = byId.get(id);
    if (!p) {
      errors.push(`Missing active Reciprocity Mathematics paper ${id}.`);
      continue;
    }
    if (p.publicationState !== 'preprint') {
      errors.push(`${id} must have publicationState="preprint" (got ${JSON.stringify(p.publicationState)}).`);
    }
    if (!p.statusLabel) {
      errors.push(`${id} is missing frontmatter statusLabel.`);
    }
  }

  // 4. Revision-pending living identifiers (validate raw frontmatter before normalization)
  for (const id of REVISION_PENDING_PAPERS) {
    const p = byId.get(id);
    if (!p) {
      errors.push(`Missing revision-pending paper ${id}.`);
      continue;
    }
    if (String(p.rawPublicationState || '').toLowerCase() !== 'revision pending') {
      errors.push(
        `${id} frontmatter must declare publicationState="revision pending" (got ${JSON.stringify(p.rawPublicationState)}).`,
      );
    }
  }

  // 5. Catalog and search-index governance hygiene (all languages)
  const catalog = readJson(root, 'public/catalog.json', errors);
  if (catalog?.content) {
    for (const [lang, byType] of Object.entries(catalog.content)) {
      if (byType.papers?.some((p) => p.id === 'FRC-000-START-HERE')) {
        errors.push(`public/catalog.json (${lang}) must not include superseded alias FRC-000-START-HERE.`);
      }
      for (const [type, retiredSet] of Object.entries(RETIRED_MIND_CONTENT_IDS)) {
        const leaked = (byType[type] || []).filter((item) => retiredSet.has(item.id));
        for (const item of leaked) {
          errors.push(`public/catalog.json (${lang}/${type}) leaks retired content ${item.id}.`);
        }
      }
      for (const person of byType.people || []) {
        if (['kasra', 'river'].includes(String(person.id || '').toLowerCase()) || person.status === 'archived' || person.noindex === true) {
          errors.push(`public/catalog.json (${lang}/people) leaks archived/persona record ${person.id}.`);
        }
      }
      for (const [type, items] of Object.entries(byType)) {
        if (!Array.isArray(items)) continue;
        for (const item of items) {
          if (/^(?:kasra|river|کسرا|ریور)$/i.test(String(item.author || '').trim())) {
            errors.push(`public/catalog.json (${lang}/${type}/${item.id}) leaks raw persona author "${item.author}".`);
          }
          if (/\b(?:kasra|river(?:-side)?)\b|کسرا|ریور/i.test(`${item.abstract || ''} ${item.description || ''}`)) {
            errors.push(`public/catalog.json (${lang}/${type}/${item.id}) leaks raw persona tagline/abstract.`);
          }
        }
      }
    }
  }

  for (const relPath of ['public/search-index.json', ...ALL_LANGS.map((l) => `public/search-index-${l}.json`)]) {
    const searchIndex = readJson(root, relPath, errors);
    if (Array.isArray(searchIndex?.documents)) {
      for (const doc of searchIndex.documents) {
        if (doc.type === 'papers' && doc.id === 'FRC-700-777') {
          errors.push(`${relPath} must exclude archived origin note FRC-700-777.`);
        }
        if (doc.type === 'papers' && doc.id === 'FRC-000-START-HERE') {
          errors.push(`${relPath} must exclude superseded alias FRC-000-START-HERE.`);
        }
        if (doc.type === 'papers' && REVISION_PENDING_PAPERS.has(String(doc.id).toUpperCase())) {
          errors.push(`${relPath} must exclude revision-pending paper ${doc.id}.`);
        }
        if (RETIRED_MIND_CONTENT_IDS[doc.type]?.has(doc.id)) {
          errors.push(`${relPath} leaks retired content ${doc.type}:${doc.id}.`);
        }
      }
    }
  }

  // 6. AI entrypoints + catalog parity and semantic governance
  const drift = checkAiEntrypoints(root);
  if (!drift.ok) {
    errors.push(...drift.errors);
  }

  const agentJson = readJson(root, 'public/agent.json', errors);
  if (agentJson) {
    const primaryIds = new Set((agentJson.primary_route || []).map((p) => p.id));
    const thresholdIds = new Set((agentJson.threshold_route || []).map((p) => p.id));
    const frontierIds = new Set((agentJson.frontier_route || []).map((p) => p.id));
    const recIds = new Set((agentJson.reciprocity_mathematics_route || []).map((p) => p.id));
    const supersededIds = new Set((agentJson.superseded_origin_material || []).map((p) => p.id));

    if (primaryIds.has('FRC-700-777') || thresholdIds.has('FRC-700-777') || frontierIds.has('FRC-700-777')) {
      errors.push('public/agent.json must not present FRC-700-777 in active primary, threshold, or frontier routes.');
    }
    if (!supersededIds.has('FRC-700-777')) {
      errors.push('public/agent.json must record FRC-700-777 under superseded_origin_material.');
    }
    for (let i = 0; i <= 7; i += 1) {
      const id = `FRC-700-${String(i).padStart(3, '0')}`;
      if (!thresholdIds.has(id)) {
        errors.push(`public/agent.json threshold_route is missing ${id}.`);
      }
    }
    for (let i = 0; i <= 5; i += 1) {
      const id = `FRC-830-${String(i).padStart(3, '0')}`;
      if (!recIds.has(id)) {
        errors.push(`public/agent.json reciprocity_mathematics_route is missing ${id}.`);
      }
    }
    if (agentJson.canon?.reciprocity_mathematics?.no_promotion !== true) {
      errors.push('public/agent.json must explicitly record no_promotion: true for FRC 830.');
    }
  }

  // 7. Cross-language translation parity & DOI hygiene
  const trResult = validateTranslations(root);
  if (!trResult.ok) {
    errors.push(...trResult.errors);
  }

  // 8. Homepage & start-here governance alignment across locales
  for (const lang of ALL_LANGS) {
    const homePath = path.join(root, 'content', lang, 'site', 'home.md');
    if (!fs.existsSync(homePath)) {
      errors.push(`Missing content/${lang}/site/home.md.`);
      continue;
    }
    const raw = fs.readFileSync(homePath, 'utf-8');
    const fm = matter(raw).data;
    const routes = [...(fm.startHere?.kasra || []), ...(fm.startHere?.river || [])];
    for (const item of routes) {
      if (item.target === 'FRC-700-777' || String(item.url || '').includes('FRC-700-777')) {
        errors.push(`content/${lang}/site/home.md must not route startHere cards to superseded FRC-700-777.`);
      }
    }
    if (!raw.includes('FRC 830.000') || !raw.includes('FRC 700.000')) {
      errors.push(`content/${lang}/site/home.md must reference active FRC 700.000–700.007 and FRC 830.000–830.005 routes.`);
    }
    for (const rx of PROHIBITED_HOMEPAGE_CLAIM_PATTERNS) {
      if (rx.test(raw)) {
        errors.push(`content/${lang}/site/home.md matches prohibited inflated claim pattern ${rx}.`);
      }
    }
  }

  const startHerePath = path.join(root, 'content', 'en', 'site', 'start-here.md');
  if (!fs.existsSync(startHerePath)) {
    errors.push('Missing content/en/site/start-here.md.');
  } else {
    const startHereRaw = fs.readFileSync(startHerePath, 'utf-8');
    if (!startHereRaw.includes('FRC 830.000') || !startHereRaw.includes('FRC 700.000')) {
      errors.push('content/en/site/start-here.md must route readers into active FRC 700.000–700.007 and FRC 830.000–830.005.');
    }
    for (const rx of PROHIBITED_HOMEPAGE_CLAIM_PATTERNS) {
      if (rx.test(startHereRaw)) {
        errors.push(`content/en/site/start-here.md matches prohibited inflated claim pattern ${rx}.`);
      }
    }
    const startHereFm = matter(startHereRaw).data;
    const startHereRel = path.relative(root, startHerePath);
    errors.push(
      ...checkActiveTextForStaleClaims(
        startHereRaw,
        startHereRel,
        resolveContentRegister({ type: 'site', id: 'start-here', rel: startHereRel, frontmatter: startHereFm }),
      ),
    );
  }

  // 9. Active (non-archived) pages across papers, books, articles, concepts, blog, and topics
  // must not carry retired 2025 claims or PLACEHOLDER DOIs.
  const ARCHIVED_BOOK_IDS = ['ecr-textbook', 'the-resonance-code'];
  const FRONTIER_PAPER_IDS = new Set(['FRC-787-787', 'FRC-826-829', 'FRC-840-101', 'FRC-841-004']);

  for (const lang of ALL_LANGS) {
    // Verify superseded 2025 books are archived + noindex across every locale
    for (const bookId of ARCHIVED_BOOK_IDS) {
      const bookIndex = path.join(root, 'content', lang, 'books', bookId, 'index.md');
      if (!fs.existsSync(bookIndex)) continue;
      const raw = fs.readFileSync(bookIndex, 'utf-8');
      const fm = matter(raw).data;
      if (fm.status !== 'archived' || fm.epistemicStatus !== 'archive' || fm.noindex !== true) {
        errors.push(
          `content/${lang}/books/${bookId}/index.md must declare status="archived", epistemicStatus="archive", and noindex=true.`,
        );
      }
    }

    for (const type of ['papers', 'books', 'articles', 'concepts', 'blog', 'topics']) {
      const typeDir = path.join(root, 'content', lang, type);
      if (!fs.existsSync(typeDir)) continue;
      const files =
        type === 'books'
          ? fs
              .readdirSync(typeDir, { withFileTypes: true })
              .filter((e) => e.isDirectory())
              .map((e) => path.join(typeDir, e.name, 'index.md'))
              .filter((p) => fs.existsSync(p))
          : fs
              .readdirSync(typeDir, { withFileTypes: true })
              .filter((e) => e.isFile() && e.name.endsWith('.md'))
              .map((e) => path.join(typeDir, e.name));

      for (const filePath of files) {
        const rel = path.relative(root, filePath);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const normalized = raw.replace(/^(---)[^\S\r\n]*#.*$/gm, '$1');
        const parsed = matter(normalized);
        const fm = parsed.data;
        const id = String(fm.id || path.basename(filePath, '.md'));

        if (/\bPLACEHOLDER\b/i.test(raw)) {
          errors.push(`${rel}: contains forbidden PLACEHOLDER token.`);
        }

        const isPaperArchive =
          type === 'papers' &&
          (fm.canonStatus === 'archive' ||
            (!fm.canonStatus && !/^FRC-(?:100|566)-/i.test(id) && !FRONTIER_PAPER_IDS.has(id.toUpperCase())) ||
            id === 'FRC-000-START-HERE' ||
            REVISION_PENDING_PAPERS.has(id.toUpperCase()));

        const isArchived =
          fm.status === 'archived' ||
          fm.epistemicStatus === 'archive' ||
          fm.editionStatus === 'legacy' ||
          String(fm.publicationState || '').toLowerCase() === 'archived' ||
          String(fm.publicationState || '').toLowerCase() === 'revision pending' ||
          RETIRED_MIND_CONTENT_IDS[type]?.has(id) ||
          isPaperArchive;

        if (isArchived) continue;

        // Strip trailing References section only for papers so historical bibliographic titles don't false-positive.
        // For translated papers explicitly flagged lags-canonical-english, check frontmatter metadata/abstract.
        const isLaggingPaperTranslation =
          type === 'papers' && lang !== 'en' && String(fm.translationStatus || '') === 'lags-canonical-english';
        const textToCheck = isLaggingPaperTranslation
          ? raw.slice(0, raw.indexOf('\n---', 3) + 4)
          : type === 'papers'
            ? raw.split(/\r?\n##+\s+(?:\d+\.\s*)?References\b/i)[0]
            : raw;

        const registerInfo = resolveContentRegister({ type, id, rel, frontmatter: fm });
        errors.push(...checkActiveTextForStaleClaims(textToCheck, rel, registerInfo));
      }
    }
  }

  // Ensure archived 2025 books are excluded from search-index*.json
  for (const relPath of ['public/search-index.json', ...ALL_LANGS.map((l) => `public/search-index-${l}.json`)]) {
    const searchIndex = readJson(root, relPath, errors);
    if (Array.isArray(searchIndex?.documents)) {
      for (const doc of searchIndex.documents) {
        if (doc.type === 'books' && ARCHIVED_BOOK_IDS.includes(doc.bookId || doc.id)) {
          errors.push(`${relPath} leaks archived 2025 book ${doc.bookId || doc.id}.`);
        }
      }
    }
  }

  // 10. Public falsification ledger verification
  const ledgerCheck = checkFalsificationLedger(root);
  if (!ledgerCheck.ok) {
    errors.push(...ledgerCheck.errors);
  }

  // 11. Issue #92 structured data hygiene (no dead /search SearchAction or /api/* endpoints)
  const schemaPath = path.join(root, 'src', 'lib', 'schema.ts');
  if (fs.existsSync(schemaPath)) {
    const schemaSrc = fs.readFileSync(schemaPath, 'utf-8');
    if (/\bSearchAction\b/.test(schemaSrc) || /\/search['"`?]/.test(schemaSrc)) {
      errors.push('src/lib/schema.ts must not advertise dead /search or SearchAction endpoints (Issue #92).');
    }
    if (/\/api\//.test(schemaSrc)) {
      errors.push('src/lib/schema.ts must not advertise nonexistent /api/* endpoints (Issue #92).');
    }
  }

  // 12. Ensure no stray "* 2.*" macOS Finder duplicate files exist under src/
  function findFinderDuplicates(dir) {
    const hits = [];
    if (!fs.existsSync(dir)) return hits;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) hits.push(...findFinderDuplicates(full));
      else if (/\s2\.[A-Za-z0-9]+$/.test(entry.name)) hits.push(path.relative(root, full));
    }
    return hits;
  }
  for (const dup of findFinderDuplicates(path.join(root, 'src'))) {
    errors.push(`Stray duplicate file found: ${dup}`);
  }

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      publishedEnglishPapers: papers.length,
      translatedPapersChecked: trResult.stats.translatedPapersChecked,
    },
  };
}

function main() {
  const rootArg = process.argv.find((a) => a.startsWith('--root='));
  const targetRoot = rootArg ? path.resolve(rootArg.slice('--root='.length)) : DEFAULT_ROOT;

  console.log('Governance Check: Verifying FRC public corpus & homepage governance...\n');
  const { ok, errors, stats } = validateGovernance(targetRoot);

  if (!ok) {
    console.error(`✗ Governance check FAILED (${errors.length} issue(s)):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `✓ Governance check PASSED (${stats.publishedEnglishPapers} published English papers, FRC 700/830 boundaries, catalog, search indexes, AI entrypoints, ${stats.translatedPapersChecked} translated papers, and homepage/start-here research map verified).`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main();
}
