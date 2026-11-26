#!/usr/bin/env node
/**
 * Deterministically generate and verify AI-facing corpus entrypoints:
 *   - public/llms.txt
 *   - public/agent.md
 *   - public/agent.json
 *
 * Canonical source of truth:
 *   - content/en/papers/*.md (English website manuscript frontmatter)
 *   - public/catalog.json (verified for parity in --check mode)
 *   - public/paper-pdfs/*.pdf (downloadable PDF presence)
 *
 * Usage:
 *   node scripts/generate-ai-entrypoints.mjs          # regenerate all three files
 *   node scripts/generate-ai-entrypoints.mjs --check  # fail if catalog or AI entrypoints drifted
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.join(__dirname, '..');

export const SITE_URL = 'https://fractalresonance.com';

export const FRONTIER_PAPERS = new Set([
  'FRC-787-787',
  'FRC-826-829',
  'FRC-840-101',
  'FRC-841-004',
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

const PRIMARY_READING_ORDER = [
  'FRC-566-001',
  'FRC-566-030',
  'FRC-100-005',
  'FRC-100-002',
  'FRC-100-002-001',
  'FRC-100-100',
  'FRC-100-003',
  'FRC-100-007',
  'FRC-100-008',
  'FRC-100-009',
  'FRC-100-011',
];

const FRONTIER_READING_ORDER = [
  'FRC-787-787',
  'FRC-826-829',
  'FRC-840-101',
  'FRC-841-004',
];

/**
 * Concise domain roles without hardcoded version numbers or DOIs.
 * Versions, DOIs, titles, publication states, and status labels are always
 * read directly from canonical English frontmatter.
 */
const PAPER_ROLES = {
  'FRC-566-001': 'Canonical notation, scale selection, boundary discipline, and claim status.',
  'FRC-566-030': 'Exact von Mises/Kuramoto identity and scoped system-only result.',
  'FRC-100-005': 'Closure-specific thermodynamic boundary experiment; not a universal replacement law.',
  'FRC-100-002': 'Standard Map / Quantum Kicked Rotor chaos program and scoped negative results.',
  'FRC-100-002-001': 'The coarse magnitude correspondence and arrangement null are retained. Registered dense Gate 4 did not support fine geometric ranking; the frozen area-only magnitude baseline performed better. That route to pillar status is closed negatively; no quantum gate or cross-mechanism collapse is established.',
  'FRC-100-100': 'Self-contained status-labeled snapshot for grounding human and machine readers; not a substitute for primary evidence papers.',
  'FRC-100-003': 'Candidate finite-time basin mechanism with open dynamics, Born-weight, and environment gates.',
  'FRC-100-007': 'Narrow density-matrix drift audit and ontology separation.',
  'FRC-100-008': 'Declared executable closures; no fundamental ontology claim.',
  'FRC-100-009': 'Declared local implementation with explicit source, sink, and residual terms.',
  'FRC-100-011': 'Vocabulary crosswalk; use with, not instead of, primary papers.',
  'FRC-787-787': 'Operational and latent coherence-transport protocol awaiting held-out platform validation.',
  'FRC-826-829': 'Status-labeled mathematical foundations and open problems.',
  'FRC-840-101': 'Phase-attention boundary and Recall Smearing Theorem for fixed-state recurrent models.',
  'FRC-841-004': 'Frontier architecture proposal; does not establish a new computing paradigm, computational advantage, or validated physical implementation.',
};

const EPISTEMIC_DISTINCTIONS = {
  exact_mathematics: 'Theorems, algebraic or differential identities, typed morphism categories, and scoped lift obstructions proved within stated hypotheses (e.g., FRC-566-030 exact von Mises/Kuramoto identity; FRC-830-001 through FRC-830-005 formal classification and obstruction proofs, including the FRC-830-005 v0.3 open-set no-affine/CPTP qubit theorem verified across 42/42 symbolic-numerical Python checks, formal human peer review pending).',
  operational_models: 'Scale-declared bookkeeping identities, control laws, and executable closures with explicitly fixed system boundary, environment channel, observables, units, and sign convention (e.g., FRC-566-001 operational reciprocity, FRC-100-008, FRC-100-009, FRC-787-787 operational transport).',
  framework_interpretation: 'Scope conventions, register topology, terminology charters, and claim-boundary rules that organize descriptions without adding physical laws or proving cross-register causation (e.g., FRC-700-000 through FRC-700-007 threshold framework; FRC-830-000 terminology charter; superseded origin note FRC-700-777).',
  model_specific_findings: 'Numerical, simulation, or narrow-audit findings valid only inside their declared model, normalization, and controls — including retained negative results (e.g., FRC-100-002 / FRC-100-002-001 coarse geometry and closed dense Gate 4, FRC-100-005 Langevin boundary experiment, FRC-100-007 narrow rho-drift audit).',
  conjectures: 'Unestablished physical extensions, including universal physical reciprocity, a fundamental spacetime Lambda field, unconditional collapse completion, and Born-equilibrium derivation beyond stipulated landscapes.',
  empirical_gates: 'Explicit falsification, platform-validation, no-signaling, operational-equivalence, inter-rater, and independent-review criteria required before any claim promotion (e.g., FRC-100-003 collapse/Born gates, FRC-787-787 held-out platform tests, FRC-830-005 v0.3 closed open-set CPTP gate with residual empty-interior/projective-instrument/d>=3 gates open, FRC-700-000..007 independent review and usability gates).',
};

const MU_REGISTERS = {
  purpose: 'A μ label declares the nested register in which a page or paper is speaking. μ is not a ladder: μ0 is ground; μ1–μ4 are an organism\'s interior; μ5–μ6 form its symbolic and witnessing envelope; μ7 is the boundary-shell connected to what lies outside. It is a scope and navigation label, not evidence for a physical hierarchy, cross-register causation, or automatic transfer of evidence.',
  mu0: 'Ground: the prior background condition from which a declared system is considered.',
  mu1: 'Physical / atomic: fields, atoms, quantum systems, thermodynamics, and other physical observables.',
  mu2: 'Cellular / living structure: cells, metabolism, physiology, and living organization.',
  mu3: 'Affective / neural: feeling, neural dynamics, and embodied regulation.',
  mu4: 'Logical / conceptual: formal reasoning, explicit models, computational design, and language as logic.',
  mu5: 'Archetypal / symbolic: symbols, myths, archetypal patterns, and meaning-bearing forms.',
  mu6: 'Witness: the reflective stance that observes and relates active registers.',
  mu7: 'Outside the system: the boundary-shell and its connection to what lies beyond the currently declared system or total context.',
};

function finalizeScalar(parts) {
  const joined = parts.join(' ').trim();
  if ((joined.startsWith("'") && joined.endsWith("'") && joined.length > 1) || (joined.startsWith('"') && joined.endsWith('"') && joined.length > 1)) {
    return joined.slice(1, -1);
  }
  return joined;
}

/**
 * Simple YAML frontmatter parser compatible with scripts/generate-catalog.mjs.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;
  let currentValue = [];
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      if (currentKey) {
        fm[currentKey] = inArray ? currentValue : finalizeScalar(currentValue);
      }
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === '' || val === '|' || val === '>') {
        currentValue = [];
        inArray = false;
      } else if (val.startsWith('[') && val.endsWith(']')) {
        fm[currentKey] = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        currentKey = null;
        currentValue = [];
      } else if (
        (val.startsWith("'") && val.endsWith("'") && val.length > 1) ||
        (val.startsWith('"') && val.endsWith('"') && val.length > 1)
      ) {
        fm[currentKey] = val.slice(1, -1);
        currentKey = null;
        currentValue = [];
      } else {
        currentValue = [val];
        inArray = false;
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
    fm[currentKey] = inArray ? currentValue : finalizeScalar(currentValue);
  }

  return { frontmatter: fm, body: match[2].trim() };
}

function resolveCanonStatus(fm) {
  const valid = new Set(['living-core', 'frontier', 'framework', 'archive']);
  if (fm.canonStatus && valid.has(fm.canonStatus)) return fm.canonStatus;
  if (FRONTIER_PAPERS.has(String(fm.id || '').toUpperCase())) return 'frontier';
  if (/^FRC-(?:100|566)-/i.test(String(fm.id || ''))) return 'living-core';
  return 'archive';
}

function inferCatalogEpistemicStatus(fm) {
  if (fm.epistemicStatus === 'archive') return 'archive';
  if (fm.epistemicStatus === 'philosophical') return 'philosophical';
  if (fm.editionStatus === 'legacy') return 'archive';
  if (fm.canonStatus === 'frontier') return 'frontier';
  if (fm.canonStatus === 'framework') return 'philosophical';
  if (fm.canonStatus === 'archive') return 'archive';
  if (/^FRC-(100|566)(?:-|$)/i.test(String(fm.id || ''))) return 'primary';
  if (FRONTIER_PAPERS.has(String(fm.id || '').toUpperCase())) return 'frontier';
  return 'archive';
}

function comparePaperIds(a, b) {
  return String(a).localeCompare(String(b), 'en', { numeric: true });
}

function orderByPreferredList(papers, preferredIds) {
  const rank = new Map(preferredIds.map((id, idx) => [id, idx]));
  return [...papers].sort((a, b) => {
    const ra = rank.has(a.id) ? rank.get(a.id) : Number.MAX_SAFE_INTEGER;
    const rb = rank.has(b.id) ? rank.get(b.id) : Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    return comparePaperIds(a.id, b.id);
  });
}

function normalizeDate(value) {
  const s = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

/**
 * Load all published English papers from content/en/papers/*.md.
 */
export function loadCanonicalPapers(root = DEFAULT_ROOT) {
  const papersDir = path.join(root, 'content', 'en', 'papers');
  const pdfDir = path.join(root, 'public', 'paper-pdfs');
  const files = fs.readdirSync(papersDir).filter((f) => f.endsWith('.md')).sort();

  const papers = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(papersDir, file), 'utf-8');
    const { frontmatter: fm } = parseFrontmatter(raw);
    if (fm.status && fm.status !== 'published') continue;
    if (!fm.id || fm.id === 'FRC-000-START-HERE') continue;

    const id = String(fm.id).trim();
    const canonStatus = resolveCanonStatus(fm);
    const catalogEpistemicStatus = inferCatalogEpistemicStatus(fm);
    const epistemicStatus = fm.epistemicStatus ? String(fm.epistemicStatus) : catalogEpistemicStatus;
    const rawPublicationState = fm.publicationState ? String(fm.publicationState) : null;
    const isRevisionPending =
      REVISION_PENDING_PAPERS.has(id.toUpperCase()) ||
      String(rawPublicationState || '').toLowerCase() === 'revision pending';
    const publicationState = isRevisionPending
      ? 'revision pending'
      : rawPublicationState;
    const isArchive =
      canonStatus === 'archive' ||
      catalogEpistemicStatus === 'archive' ||
      String(publicationState || '').toLowerCase() === 'archived';
    const isSupersededOrigin = isArchive && Boolean(fm.supersededBy);
    const isActive = !isArchive && !isRevisionPending;
    const hasPdf = fs.existsSync(path.join(pdfDir, `${id}.pdf`));

    papers.push({
      id,
      title: String(fm.title || id),
      version: fm.version ? String(fm.version) : null,
      date: normalizeDate(fm.date),
      doi: fm.doi ? String(fm.doi) : null,
      conceptDoi: fm.conceptDoi ? String(fm.conceptDoi) : null,
      alphaxivUrl: fm.alphaxivUrl ? String(fm.alphaxivUrl) : null,
      series: fm.series ? String(fm.series) : null,
      muLevel: fm.muLevel ? String(fm.muLevel) : null,
      rawPublicationState,
      publicationState,
      canonStatus,
      epistemicStatus,
      catalogEpistemicStatus,
      statusLabel: fm.statusLabel ? String(fm.statusLabel) : null,
      statusNote: fm.statusNote ? String(fm.statusNote) : null,
      supersedes: fm.supersedes ? String(fm.supersedes) : null,
      supersededBy: fm.supersededBy ? String(fm.supersededBy) : null,
      tldr: fm.tldr ? String(fm.tldr) : null,
      abstract: fm.abstract ? String(fm.abstract) : null,
      url: `/en/papers/${id}`,
      fullUrl: `${SITE_URL}/en/papers/${id}`,
      pdfUrl: hasPdf ? `/paper-pdfs/${id}.pdf` : null,
      isRevisionPending,
      isArchive,
      isSupersededOrigin,
      isActive,
    });
  }

  return papers.sort((a, b) => comparePaperIds(a.id, b.id));
}

function classifyCorpus(papers) {
  const byId = new Map(papers.map((p) => [p.id, p]));
  const startHere = byId.get('FRC-100-000');
  if (!startHere) {
    throw new Error('Canonical start-here router FRC-100-000 not found in content/en/papers/');
  }

  const standaloneStance = byId.get('FRC-100-100');
  if (!standaloneStance) {
    throw new Error('Standalone stance paper FRC-100-100 not found in content/en/papers/');
  }

  const activePapers = papers.filter((p) => p.isActive);
  const revisionPending = papers.filter((p) => p.isRevisionPending).sort((a, b) => comparePaperIds(a.id, b.id));
  const supersededOrigin = papers.filter((p) => p.isSupersededOrigin).sort((a, b) => comparePaperIds(a.id, b.id));
  const archiveHistory = papers.filter((p) => p.isArchive && !p.isSupersededOrigin).sort((a, b) => comparePaperIds(a.id, b.id));

  const thresholdRoute = activePapers
    .filter((p) => /^FRC-700-\d{3}$/.test(p.id) && p.canonStatus === 'framework')
    .sort((a, b) => comparePaperIds(a.id, b.id));

  const reciprocityMathematicsRoute = activePapers
    .filter((p) => /^FRC-830-\d{3}$/.test(p.id))
    .sort((a, b) => comparePaperIds(a.id, b.id));

  const thresholdIds = new Set(thresholdRoute.map((p) => p.id));
  const reciprocityIds = new Set(reciprocityMathematicsRoute.map((p) => p.id));

  const primaryRoute = orderByPreferredList(
    activePapers.filter(
      (p) =>
        p.id !== 'FRC-100-000' &&
        !thresholdIds.has(p.id) &&
        !reciprocityIds.has(p.id) &&
        (p.canonStatus === 'living-core' || p.id === 'FRC-100-002-001'),
    ),
    PRIMARY_READING_ORDER,
  );

  const primaryIds = new Set(primaryRoute.map((p) => p.id));

  const frontierRoute = orderByPreferredList(
    activePapers.filter(
      (p) =>
        p.id !== 'FRC-100-000' &&
        !thresholdIds.has(p.id) &&
        !reciprocityIds.has(p.id) &&
        !primaryIds.has(p.id),
    ),
    FRONTIER_READING_ORDER,
  );

  // Deterministic date derived solely from the latest published English paper date.
  const dates = papers.map((p) => p.date).filter(Boolean).sort();
  const updated = dates.length > 0 ? dates[dates.length - 1] : '2026-07-17';

  return {
    updated,
    papers,
    activePapers,
    startHere,
    standaloneStance,
    primaryRoute,
    frontierRoute,
    thresholdRoute,
    reciprocityMathematicsRoute,
    revisionPending,
    supersededOrigin,
    archiveHistory,
  };
}

function getPaperRole(paper) {
  return PAPER_ROLES[paper.id] || paper.tldr || paper.statusNote || null;
}

function formatJsonPaperEntry(paper, { includeRole = false, includeStatusNote = false } = {}) {
  const entry = {
    id: paper.id,
    title: paper.title,
    url: paper.url,
  };

  if (paper.version) entry.version = paper.version;
  if (paper.date) entry.date = paper.date;
  if (paper.publicationState) entry.publication_state = paper.publicationState;
  entry.canon_status = paper.canonStatus;
  entry.epistemic_status = paper.epistemicStatus;
  if (paper.statusLabel) entry.status_label = paper.statusLabel;
  if (paper.conceptDoi) entry.concept_doi = paper.conceptDoi;
  if (paper.doi) entry.doi = paper.doi;
  if (paper.alphaxivUrl) entry.alphaxiv_url = paper.alphaxivUrl;
  if (!paper.doi && !paper.conceptDoi) {
    entry.doi_status = 'not declared in current website source';
  }
  if (paper.pdfUrl) entry.pdf_url = paper.pdfUrl;
  if (paper.supersededBy) entry.superseded_by = paper.supersededBy;
  if (includeRole) {
    const role = getPaperRole(paper);
    if (role) entry.role = role;
  }
  if (includeStatusNote && paper.statusNote) {
    entry.status_note = paper.statusNote;
  }

  return entry;
}

function getSharedDois(papers) {
  const conceptDois = [...new Set(papers.map((p) => p.conceptDoi).filter(Boolean))];
  const versionDois = [
    ...new Set(papers.map((p) => (p.doi && p.doi !== p.conceptDoi ? p.doi : null)).filter(Boolean)),
  ];
  const allShareVersionDoi =
    versionDois.length === 1 && papers.length > 0 && papers.every((p) => p.doi === versionDois[0]);
  return {
    conceptDoi: conceptDois.length === 1 ? conceptDois[0] : null,
    versionDoi: versionDois.length === 1 ? versionDois[0] : null,
    allShareVersionDoi,
  };
}

function buildAgentJson(corpus) {
  const frontierCanonIds = [
    ...corpus.primaryRoute.filter((p) => p.canonStatus === 'frontier').map((p) => p.id),
    ...corpus.frontierRoute.map((p) => p.id),
  ];

  const thresholdRange =
    corpus.thresholdRoute.length > 0
      ? `${corpus.thresholdRoute[0].id} through ${corpus.thresholdRoute[corpus.thresholdRoute.length - 1].id}`
      : 'FRC-700-000 through FRC-700-007';

  const reciprocityRange =
    corpus.reciprocityMathematicsRoute.length > 0
      ? `${corpus.reciprocityMathematicsRoute[0].id} through ${corpus.reciprocityMathematicsRoute[corpus.reciprocityMathematicsRoute.length - 1].id}`
      : 'FRC-830-000 through FRC-830-005';

  const manifest = {
    name: 'Fractal Resonance Coherence (FRC) Agent Quickstart',
    version: '2.1.0',
    updated: corpus.updated,
    generated_from: {
      papers_source: 'content/en/papers/*.md',
      catalog: '/catalog.json',
      generator: 'scripts/generate-ai-entrypoints.mjs',
    },
    catalog_summary: {
      published_english_papers: corpus.papers.length,
      active_papers: corpus.activePapers.length,
      revision_pending: corpus.revisionPending.length,
      superseded_origin: corpus.supersededOrigin.length,
      archive: corpus.archiveHistory.length,
    },
    entrypoints: {
      start_here: corpus.startHere.url,
      agent_doc: '/agent.md',
      standalone_stance: {
        id: corpus.standaloneStance.id,
        version: corpus.standaloneStance.version,
        url: '/FRC-100-100.md',
        paper_url: corpus.standaloneStance.url,
        role: 'Self-contained current stance capsule for machine reading; summarizes but does not override primary evidence papers.',
      },
      llms: '/llms.txt',
      catalog: '/catalog.json',
      falsification_ledger: '/falsification-ledger.json',
      falsifications_page: '/en/falsifications',
      search_index: '/search-index.json',
      sitemap: '/sitemap.xml',
      video_sitemap: '/video-sitemap.xml',
      robots: '/robots.txt',
    },
    start_here: formatJsonPaperEntry(corpus.startHere),
    routing: [
      `Read ${corpus.startHere.id} (${corpus.startHere.version}) first for the current stance, version rules, and reading path.`,
      'Then read and cite the relevant primary papers; the router is not a substitute for them.',
      'Prefer the latest version under a declared concept DOI.',
      'Use the catalog and search index only for discovery.',
      'These routes reflect current English website manuscripts; reading order is not an evidence ranking or a claim of peer review.',
    ],
    stance: {
      canonical_relation: 'dS + k* d ln C = 0',
      k_star: 'Starred, Boltzmann-shaped bridge selected by the operating scale or register; not a universal numerical scalar or outcome-fitted parameter.',
      indexed_forms: 'Operational only in implementations that declare scale, boundary, environment channel, observables, units, and sign convention.',
      mu_registers: MU_REGISTERS,
      physical_status: 'Scale-declared bookkeeping and control-law use is operational; universal physical extension is conjectural.',
      lambda_objects: {
        Lambda_obs: 'Observed coherence transform.',
        Lambda_eq: 'Declared target derived from the observation model.',
        Lambda_dyn: 'Optional latent dynamical state requiring separate validation.',
        fundamental_field: 'Separate conjecture; not established by operational or latent models.',
      },
      born_rule: 'Conditional equilibrium proposal with open assumptions and empirical gates; not an established FRC derivation.',
      born_deviation: 'No fixed canonical range; values require a declared model and protocol.',
    },
    epistemic_distinctions: EPISTEMIC_DISTINCTIONS,
    canon: {
      core: [
        corpus.startHere.id,
        ...corpus.primaryRoute.filter((p) => p.canonStatus === 'living-core').map((p) => p.id),
      ],
      frontier: frontierCanonIds,
      threshold_framework: {
        route: thresholdRange,
        status: 'Current FRC 700 threshold-framework route (preprints; independent review pending; governs evidence, interpretation, and register discipline; adds no new physical law, universal μ ontology, or cross-register causation).',
        supersedes: corpus.supersededOrigin.map((p) => p.id),
        ids: corpus.thresholdRoute.map((p) => p.id),
      },
      reciprocity_mathematics: {
        route: reciprocityRange,
        status: 'Current FRC 830 Reciprocity Mathematics series (preprints with paper-specific status labels; exact ledger-coordinate results, typed morphisms, dimension thresholds, and sharp lift obstructions—including FRC-830-005 v0.3 live on alphaXiv, which excludes all open-set affine/CPTP qubit channels on nonempty open coherent subsets of the Bloch ball with 1D-circle sharpness and 42/42 independent Python verification checks passing—do not establish physical, categorical, Born-style, or Majid-style self-duality; empty-interior, projective-instrument, and d>=3 gates remain open alongside formal human peer review).',
        no_promotion: true,
        ids: corpus.reciprocityMathematicsRoute.map((p) => p.id),
      },
      revision_pending: corpus.revisionPending.map((p) => p.id),
      superseded_origin_material: corpus.supersededOrigin.map((p) => ({
        id: p.id,
        version: p.version,
        publication_state: p.publicationState,
        canon_status: p.canonStatus,
        superseded_by: p.supersededBy,
        note: p.statusNote,
      })),
      archive_development_history: corpus.archiveHistory.map((p) => p.id),
      books: {
        current_2026_philosophical: [
          {
            id: 'the-open-system',
            title: 'The Open System (The Unclosed): A Philosophy of the Open System',
            version: 'v41',
            url: '/en/books/the-open-system',
            epistemic_status: 'philosophical',
          },
          {
            id: 'the-mind-in-the-coupling',
            title: 'The Mind in the Coupling: A Philosophy of Cognition Without a Center',
            version: 'v3.13',
            url: '/en/books/the-mind-in-the-coupling',
            epistemic_status: 'philosophical',
          },
        ],
        archived_superseded_2025: [
          {
            id: 'ecr-textbook',
            title: 'Entropy-Coherence Reciprocity: FRC Textbook',
            date: '2025-10-01',
            status: 'archived',
            noindex: true,
            superseded_by: 'the-open-system, the-mind-in-the-coupling, FRC-566-001, FRC-100-000',
          },
          {
            id: 'the-resonance-code',
            title: 'The Resonance Code: Physics of Conscious Order',
            date: '2025-01-01',
            status: 'archived',
            noindex: true,
            superseded_by: 'the-open-system, the-mind-in-the-coupling, FRC-566-001, FRC-100-000',
          },
        ],
      },
    },
    active_papers: corpus.activePapers.map((p) => ({
      id: p.id,
      version: p.version,
      publication_state: p.publicationState,
      canon_status: p.canonStatus,
      epistemic_status: p.epistemicStatus,
      ...(p.statusLabel ? { status_label: p.statusLabel } : {}),
      url: p.url,
    })),
    primary_route: corpus.primaryRoute.map((p) => formatJsonPaperEntry(p, { includeRole: true })),
    frontier_route: corpus.frontierRoute.map((p) => formatJsonPaperEntry(p, { includeRole: true })),
    threshold_route: corpus.thresholdRoute.map((p) => formatJsonPaperEntry(p)),
    reciprocity_mathematics_route: corpus.reciprocityMathematicsRoute.map((p) => formatJsonPaperEntry(p)),
    revision_pending_records: corpus.revisionPending.map((p) =>
      formatJsonPaperEntry(p, { includeStatusNote: true }),
    ),
    superseded_origin_material: corpus.supersededOrigin.map((p) =>
      formatJsonPaperEntry(p, { includeStatusNote: true }),
    ),
    archive_records: corpus.archiveHistory.map((p) => formatJsonPaperEntry(p)),
    rules: [
      'Preserve the distinction among exact mathematics, operational models, framework interpretation, model-specific findings, conjectures, and empirical gates.',
      'Do not generalize a scoped negative result or infer a replacement ontology.',
      'Do not present FRC-700-777 as the current 700-series framework; use FRC-700-000 through FRC-700-007 for the active threshold-framework route.',
      'Do not promote FRC-830 ledger-coordinate results or scoped obstructions to physical, categorical, Born-style, or Majid-style self-duality.',
      'Prefer papers over articles, blog posts, and concepts.',
      'Cite the specific on-site paper pages used.',
      'If a claim is absent from the corpus, say so.',
      'Use only the declared static resources for machine retrieval.',
    ],
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function formatVersionSuffix(paper) {
  if (!paper.version) return '';
  if (paper.title.toLowerCase().includes(paper.version.toLowerCase())) return '';
  return ` ${paper.version}`;
}

function formatStatusLine(paper) {
  const parts = [];
  if (paper.publicationState) parts.push(paper.publicationState);
  parts.push(`canon: ${paper.canonStatus}`);
  parts.push(`epistemic: ${paper.epistemicStatus}`);
  if (paper.statusLabel) parts.push(`status label: ${paper.statusLabel}`);
  return parts.join(' | ');
}

function buildLlmsTxt(corpus) {
  const lines = [];
  const recDois = getSharedDois(corpus.reciprocityMathematicsRoute);
  const activeCoreIds = [
    corpus.startHere.id,
    ...corpus.primaryRoute.filter((p) => p.canonStatus === 'living-core').map((p) => p.id),
  ];
  const frontierIds = [
    ...corpus.primaryRoute.filter((p) => p.canonStatus === 'frontier').map((p) => p.id),
    ...corpus.frontierRoute.map((p) => p.id),
  ];

  lines.push('# Fractal Resonance Coherence (FRC)');
  lines.push(`# ${SITE_URL}`);
  lines.push('# Author: Hadi Servat (ORCID: 0009-0004-7412-5129)');
  lines.push('# License: CC BY-NC-ND 4.0');
  lines.push(`# Updated: ${corpus.updated}`);
  lines.push(`# Source: Derived deterministically from content/en/papers/ and public/catalog.json (${corpus.activePapers.length} active papers; ${corpus.papers.length} published English papers total)`);
  lines.push('');
  lines.push('## Standalone stance file');
  lines.push('');
  lines.push(`For one self-contained model briefing with no required links, use ${corpus.standaloneStance.id} (${corpus.standaloneStance.version}):`);
  lines.push(`${SITE_URL}/FRC-100-100.md`);
  lines.push('');
  lines.push('## Required first route');
  lines.push('');
  lines.push(`Read ${corpus.startHere.id} (${corpus.startHere.version}, ${corpus.startHere.publicationState}) before interpreting the corpus:`);
  lines.push(corpus.startHere.fullUrl);
  lines.push(`Concept DOI: ${corpus.startHere.conceptDoi}`);
  lines.push(`Version DOI: ${corpus.startHere.doi}`);
  lines.push('');
  lines.push('FRC-100-000 is the version-aware router, not a substitute for primary papers. After reading it, follow its current reading path and cite the relevant primary pages.');
  lines.push('');
  lines.push('## Canonical stance');
  lines.push('');
  lines.push('Canonical relation:');
  lines.push('dS + k* d ln C = 0');
  lines.push('');
  lines.push('- k* is the starred, Boltzmann-shaped bridge selected by the operating scale or register.');
  lines.push('- k* is not one universal numerical scalar and is not refitted to each result, time step, or state.');
  lines.push('- Indexed forms such as dS_mu + k*(mu) d ln C_mu = 0 are operational forms only. An implementation must first declare its scale, system boundary, environment channel, observables, units, and sign convention.');
  lines.push('- FRC uses reciprocity operationally as scale-declared bookkeeping and a control law. Its proposed universal physical extension remains conjectural.');
  lines.push('');
  lines.push('Lambda notation:');
  lines.push('- Lambda_obs = Lambda_0 ln C_obs: observed transform.');
  lines.push('- Lambda_eq = Lambda_0 ln C_target: declared target.');
  lines.push('- Lambda_dyn: optional latent or coarse-grained state that relaxes toward Lambda_eq.');
  lines.push('- A fundamental spacetime Lambda field is a separate conjecture. Operational or latent-model success would not establish it.');
  lines.push('');
  lines.push('Born-rule status:');
  lines.push('- FRC contains a conditional Born-equilibrium proposal with open assumptions and validation gates.');
  lines.push('- Do not claim that FRC has already derived the Born rule.');
  lines.push('- There is no fixed canonical Born-deviation range. Any quantitative deviation belongs to a declared model and protocol.');
  lines.push('');
  lines.push('μ-register contract:');
  lines.push('- A μ label declares the nested register in which a page or paper is speaking. It is not a ladder: μ0 is ground; μ1–μ4 are an organism\'s interior; μ5–μ6 form its symbolic and witnessing envelope; μ7 is the boundary-shell connected to what lies outside.');
  lines.push('- It is a scope and navigation label, not evidence for a proved hierarchy, cross-register causation, or automatic transfer of evidence.');
  lines.push('- μ0: ground; μ1: physical / atomic; μ2: cellular / living structure; μ3: affective / neural; μ4: logical / conceptual; μ5: archetypal / symbolic; μ6: witness; μ7: outside the declared system.');
  lines.push('- A technical claim must still declare its system, boundary, observable, and status. A result at one register does not establish a result at another.');
  lines.push('');
  lines.push('## Epistemic distinctions');
  lines.push('');
  lines.push('Keep these six categories strictly separate across all FRC claims:');
  lines.push(`- Exact mathematics: ${EPISTEMIC_DISTINCTIONS.exact_mathematics}`);
  lines.push(`- Operational models: ${EPISTEMIC_DISTINCTIONS.operational_models}`);
  lines.push(`- Framework interpretation: ${EPISTEMIC_DISTINCTIONS.framework_interpretation}`);
  lines.push(`- Model-specific findings: ${EPISTEMIC_DISTINCTIONS.model_specific_findings}`);
  lines.push(`- Conjectures: ${EPISTEMIC_DISTINCTIONS.conjectures}`);
  lines.push(`- Empirical gates: ${EPISTEMIC_DISTINCTIONS.empirical_gates}`);
  lines.push('');
  lines.push('The listings below are generated from the current English website manuscripts and catalog. Publication status and evidence scope are independent; a reading route is not an evidence ranking.');
  lines.push('');
  lines.push('## Canon map');
  lines.push('');
  lines.push(`Current core (${activeCoreIds.length} active papers):`);
  lines.push(`- ${activeCoreIds.join(', ')}.`);
  lines.push('');
  lines.push(`Current threshold-framework route (${corpus.thresholdRoute.length} papers):`);
  lines.push(`- ${corpus.thresholdRoute[0].id} through ${corpus.thresholdRoute[corpus.thresholdRoute.length - 1].id}: active FRC 700 threshold-framework preprints (independent review pending), superseding FRC-700-777. They govern evidence, interpretation, and register discipline; they do not establish a physical law, universal μ ontology, or cross-register causation.`);
  lines.push('');
  lines.push(`Current Reciprocity Mathematics series (${corpus.reciprocityMathematicsRoute.length} papers):`);
  lines.push(`- ${corpus.reciprocityMathematicsRoute[0].id} through ${corpus.reciprocityMathematicsRoute[corpus.reciprocityMathematicsRoute.length - 1].id}: terminology charter, formal mathematics, and sharp lift obstructions. FRC-830-005 v0.3 (live on alphaXiv; 42/42 independent Python verification checks passing, formal human peer review pending) excludes every affine/CPTP qubit channel on any nonempty open coherent subset of the Bloch ball (1D-circle sharp); empty-interior, projective-instrument, and d>=3 gates remain open, and no physical, categorical, Born-style, or Majid-style self-duality is established.`);
  lines.push('');
  lines.push(`Frontier (${frontierIds.length} papers):`);
  lines.push(`- ${frontierIds.join(', ')}.`);
  lines.push('');
  lines.push(`Revision pending (${corpus.revisionPending.length} living identifiers, not current evidence):`);
  lines.push(`- ${corpus.revisionPending.map((p) => p.id).join(', ')}.`);
  lines.push('');
  lines.push('Superseded historical / origin material (not current 700-series framework):');
  for (const p of corpus.supersededOrigin) {
    lines.push(`- ${p.id} (${p.version}, ${p.publicationState}): superseded by ${p.supersededBy}. Retained for historical provenance only; not the current 700-series framework and not primary physical evidence.`);
  }
  lines.push('');
  lines.push('Archive / development history (do not present as current core):');
  lines.push(`- ${corpus.archiveHistory.map((p) => p.id).join(', ')}.`);
  lines.push('');
  lines.push('## Primary reading path');
  lines.push('');
  for (const p of corpus.primaryRoute) {
    lines.push(`${p.id}: ${p.title}${formatVersionSuffix(p)}`);
    lines.push(`URL: ${p.fullUrl}`);
    lines.push(`Status: ${formatStatusLine(p)}`);
    if (p.conceptDoi) lines.push(`Concept DOI: ${p.conceptDoi}`);
    if (p.doi) lines.push(`Version DOI: ${p.doi}`);
    if (p.pdfUrl) lines.push(`PDF: ${SITE_URL}${p.pdfUrl}`);
    const role = getPaperRole(p);
    if (role) lines.push(`Role: ${role}`);
    lines.push('');
  }

  lines.push('## Frontier papers');
  lines.push('');
  for (const p of corpus.frontierRoute) {
    lines.push(`${p.id}: ${p.title}${formatVersionSuffix(p)}`);
    lines.push(`URL: ${p.fullUrl}`);
    lines.push(`Version: ${p.version || 'not declared in website frontmatter'}`);
    lines.push(`Status: ${formatStatusLine(p)}`);
    if (p.conceptDoi) lines.push(`Concept DOI: ${p.conceptDoi}`);
    if (p.doi) {
      lines.push(`Version DOI: ${p.doi}`);
    } else if (!p.conceptDoi) {
      lines.push('DOI: not currently declared.');
    }
    if (p.pdfUrl) lines.push(`PDF: ${SITE_URL}${p.pdfUrl}`);
    const role = getPaperRole(p);
    if (role) lines.push(`Role: ${role}`);
    lines.push('');
  }

  lines.push('## Current threshold-framework route (FRC 700.000–700.007)');
  lines.push('');
  lines.push('FRC-700-000 through FRC-700-007 form the active FRC 700 threshold-framework route, superseding the archived origin note FRC-700-777. These are framework preprints with independent review pending. They govern evidence, interpretation, and register discipline; they do not establish a physical law, universal μ ontology, or cross-register causation. No DOI or downloadable paper PDF is declared for these records in the current website source.');
  lines.push('');
  lines.push('| Paper | Version | Publication state | Status label | Reading page |');
  lines.push('|---|---|---|---|---|');
  for (const p of corpus.thresholdRoute) {
    lines.push(`| ${p.id} — ${p.title} | ${p.version || '—'} | ${p.publicationState || '—'} | ${p.statusLabel || '—'} | [Read](${p.fullUrl}) |`);
  }
  lines.push('');

  lines.push('## Current Reciprocity Mathematics series (FRC 830.000–830.005)');
  lines.push('');
  lines.push('Read FRC-830-000 for the terminology charter, then the declared mathematical results and sharp lift obstructions in FRC-830-001 through FRC-830-005. FRC-830-005 v0.3 has completed independent symbolic/numerical Python verification (42/42 checks) and is live on alphaXiv (formal human peer review pending). No-promotion boundary: exact ledger-coordinate involutions, typed morphisms, dimension thresholds, one-parameter (ds/dy < 1, sharp at ds/dy = 1), and open-set no-affine/CPTP qubit obstructions (1D-circle sharp) do not establish physical, categorical, Born-style, or Majid-style self-duality; residual empty-interior, projective-instrument, and d>=3 gates remain open.');
  lines.push('');
  lines.push('| Paper | Version | Epistemic status | Status label | Reading page |');
  lines.push('|---|---|---|---|---|');
  for (const p of corpus.reciprocityMathematicsRoute) {
    const extLink = p.alphaxivUrl ? ` · [alphaXiv](${p.alphaxivUrl})` : '';
    lines.push(`| ${p.id} — ${p.title} | ${p.version || '—'} | ${p.epistemicStatus} | ${p.statusLabel || '—'} | [Read](${p.fullUrl})${extLink} |`);
  }
  lines.push('');
  if (recDois.conceptDoi || recDois.versionDoi) {
    const versionPart = recDois.versionDoi
      ? recDois.allShareVersionDoi
        ? `; version DOI \`${recDois.versionDoi}\``
        : `; prior v0.1 series bundle DOI \`${recDois.versionDoi}\` (no separate Zenodo v0.3 version DOI minted yet)`
      : '';
    lines.push(`Shared release: concept DOI \`${recDois.conceptDoi}\`${versionPart}. Paper PDFs use \`/paper-pdfs/<FRC-ID>.pdf\`.`);
    lines.push('');
  }

  lines.push('## Superseded historical / origin material');
  lines.push('');
  for (const p of corpus.supersededOrigin) {
    lines.push(`${p.id}: ${p.title}${formatVersionSuffix(p)}`);
    lines.push(`URL: ${p.fullUrl}`);
    lines.push(`Status: ${formatStatusLine(p)}`);
    lines.push(`Superseded by: ${p.supersededBy}`);
    if (p.conceptDoi) lines.push(`Concept DOI: ${p.conceptDoi}`);
    if (p.doi) lines.push(`Version DOI: ${p.doi}`);
    if (p.statusNote) lines.push(`Note: ${p.statusNote}`);
    lines.push('');
  }

  lines.push('## Revision pending (living identifiers, not current evidence)');
  lines.push('');
  for (const p of corpus.revisionPending) {
    lines.push(`- ${p.id} (${p.publicationState}, ${p.date || 'undated'}): ${p.title} — ${p.fullUrl}${p.doi ? ` (DOI: ${p.doi})` : ''}`);
  }
  lines.push('');

  lines.push('## Books (2026 current vs 2025 archived)');
  lines.push('');
  lines.push('Current 2026 philosophical books (argument-based philosophy; technical claims remain governed by the papers):');
  lines.push(`- The Open System (v41): ${SITE_URL}/en/books/the-open-system`);
  lines.push(`- The Mind in the Coupling (v3.13): ${SITE_URL}/en/books/the-mind-in-the-coupling`);
  lines.push('');
  lines.push('Archived / superseded 2025 books (excluded from active canon, noindex):');
  lines.push('- ecr-textbook (Oct 2025, archived) and the-resonance-code (Jan 2025, archived) — superseded by the 2026 books and FRC-566-001 / FRC-100-000. Do not cite as current canon.');
  lines.push('');
  lines.push('## Machine-readable resources');
  lines.push('');
  lines.push(`- Agent quickstart: ${SITE_URL}/agent.md`);
  lines.push(`- Agent manifest: ${SITE_URL}/agent.json`);
  lines.push(`- Catalog: ${SITE_URL}/catalog.json`);
  lines.push(`- Falsification ledger (JSON): ${SITE_URL}/falsification-ledger.json`);
  lines.push(`- Falsification ledger (Web): ${SITE_URL}/en/falsifications`);
  lines.push(`- Search index: ${SITE_URL}/search-index.json`);
  lines.push(`- Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push(`- Video sitemap: ${SITE_URL}/video-sitemap.xml`);
  lines.push(`- Robots: ${SITE_URL}/robots.txt`);
  lines.push('- Source: https://github.com/servathadi/fractalresonance');
  lines.push('');
  lines.push('## Machine-reading contract');
  lines.push('');
  lines.push('1. Prefer the latest version under each declared concept DOI.');
  lines.push('2. Preserve the distinction among exact mathematics, operational models, framework interpretation, model-specific findings, conjectures, and empirical gates.');
  lines.push('3. Keep model-specific negative results at model scope; never infer a replacement ontology from a failed implementation.');
  lines.push('4. Treat FRC-700-000 through FRC-700-007 as the current threshold-framework route and FRC-700-777 as superseded historical/origin material.');
  lines.push('5. Enforce no-promotion on FRC-830: exact ledger-coordinate results and scoped obstructions do not establish physical, categorical, Born-style, or Majid-style self-duality.');
  lines.push('6. Prefer papers over articles, blog posts, and concepts.');
  lines.push('7. Cite every paper page used; say "not in corpus" when evidence is absent.');
  lines.push('');
  lines.push('## Contact');
  lines.push('');
  lines.push('Email: publish@fractalresonance.com');
  lines.push(`Website: ${SITE_URL}`);
  lines.push('ORCID: 0009-0004-7412-5129');
  lines.push('Zenodo community: https://zenodo.org/communities/frc');

  return `${lines.join('\n')}\n`;
}

function buildAgentMd(corpus) {
  const lines = [];
  const recDois = getSharedDois(corpus.reciprocityMathematicsRoute);
  const activeCoreIds = [
    corpus.startHere.id,
    ...corpus.primaryRoute.filter((p) => p.canonStatus === 'living-core').map((p) => p.id),
  ];
  const frontierIds = [
    ...corpus.primaryRoute.filter((p) => p.canonStatus === 'frontier').map((p) => p.id),
    ...corpus.frontierRoute.map((p) => p.id),
  ];

  lines.push('# Agent Quickstart (FRC)');
  lines.push('');
  lines.push('This static vault contains the living **Fractal Resonance Coherence (FRC)** corpus.');
  lines.push('');
  lines.push(`Updated: ${corpus.updated}. Generated deterministically from \`content/en/papers/\` and \`/catalog.json\` (${corpus.activePapers.length} active papers; ${corpus.papers.length} published English papers total). Reading order does not rank evidence or imply peer review.`);
  lines.push('');
  lines.push(`For a single self-contained model briefing with no required links, use \`${corpus.standaloneStance.id}\` (${corpus.standaloneStance.version}) at \`/FRC-100-100.md\`. It summarizes the current stance but does not override primary evidence papers. This file remains the concise routing and grounding guide.`);
  lines.push('');
  lines.push('## 1) Canonical route');
  lines.push('');
  lines.push(`1. Read **${corpus.startHere.id}** (${corpus.startHere.version}, ${corpus.startHere.publicationState}) first: \`${corpus.startHere.url}\` (Concept DOI \`${corpus.startHere.conceptDoi}\`, Version DOI \`${corpus.startHere.doi}\`).`);
  lines.push('2. Follow its current reading path into the cited primary papers. Do not treat the router as a substitute for them.');
  lines.push('3. Prefer the latest version under a paper\'s concept DOI when one is declared.');
  lines.push('4. Use `/catalog.json` and `/search-index.json` for discovery, then cite the specific paper pages used.');
  lines.push('');
  lines.push('## 2) Current stance');
  lines.push('');
  lines.push('- Canonical relation: **`dS + k* d ln C = 0`**.');
  lines.push('- `k*` is the starred, Boltzmann-shaped bridge selected by the operating scale or register. It is not one universal numerical scalar and is not fitted to each outcome.');
  lines.push('- Indexed forms such as `dS_mu + k*(mu) d ln C_mu = 0` are operational forms only. Use them only inside an implementation that declares the scale, system boundary, environment channel, observables, units, and sign convention.');
  lines.push('- FRC deploys reciprocity as scale-declared bookkeeping and a control law. Its universal physical extension remains conjectural.');
  lines.push('- Keep `Lambda_obs`, `Lambda_eq`, and optional latent `Lambda_dyn` distinct. A fundamental spacetime Lambda field is a separate conjecture.');
  lines.push('- The Born rule is not already derived by FRC. Current papers contain a conditional Born-equilibrium proposal with open assumptions and empirical gates.');
  lines.push('- Do not assert a fixed Born-deviation range. Any deviation claim must come from a declared model and protocol.');
  lines.push('');
  lines.push('## 3) Epistemic distinctions');
  lines.push('');
  lines.push(`- **Exact mathematics:** ${EPISTEMIC_DISTINCTIONS.exact_mathematics}`);
  lines.push(`- **Operational models:** ${EPISTEMIC_DISTINCTIONS.operational_models}`);
  lines.push(`- **Framework interpretation:** ${EPISTEMIC_DISTINCTIONS.framework_interpretation}`);
  lines.push(`- **Model-specific findings:** ${EPISTEMIC_DISTINCTIONS.model_specific_findings}`);
  lines.push(`- **Conjectures:** ${EPISTEMIC_DISTINCTIONS.conjectures}`);
  lines.push(`- **Empirical gates:** ${EPISTEMIC_DISTINCTIONS.empirical_gates}`);
  lines.push('');
  lines.push('## 4) μ-register contract');
  lines.push('');
  lines.push('- A `μ` label declares the nested register in which a page or paper is speaking. It is not a ladder: μ0 is ground; μ1–μ4 are an organism\'s interior; μ5–μ6 form its symbolic and witnessing envelope; μ7 is the boundary-shell connected to what lies outside.');
  lines.push('- It is a scope and navigation label, not evidence for a proved hierarchy, cross-register causation, or automatic transfer of evidence.');
  lines.push('- `μ0`: ground; `μ1`: physical / atomic; `μ2`: cellular / living structure; `μ3`: affective / neural; `μ4`: logical / conceptual; `μ5`: archetypal / symbolic; `μ6`: witness; `μ7`: outside the declared system.');
  lines.push('- Every technical claim still needs a declared system, boundary, observable, and status label. A μ1 result does not by itself establish a claim at μ4 or μ5.');
  lines.push('');
  lines.push('## 5) Canon map');
  lines.push('');
  lines.push(`- **Current core (${activeCoreIds.length}):** ${activeCoreIds.map((id) => `\`${id}\``).join(', ')}.`);
  lines.push(`- **Current threshold-framework route (${corpus.thresholdRoute.length}):** \`${corpus.thresholdRoute[0].id}\` through \`${corpus.thresholdRoute[corpus.thresholdRoute.length - 1].id}\` — active FRC 700 framework preprints (independent review pending) superseding \`FRC-700-777\`.`);
  lines.push(`- **Current Reciprocity Mathematics series (${corpus.reciprocityMathematicsRoute.length}):** \`${corpus.reciprocityMathematicsRoute[0].id}\` through \`${corpus.reciprocityMathematicsRoute[corpus.reciprocityMathematicsRoute.length - 1].id}\` — terminology charter, formal mathematics, and scoped lift obstructions; accurate no-promotion boundary applies.`);
  lines.push(`- **Frontier (${frontierIds.length}):** ${frontierIds.map((id) => `\`${id}\``).join(', ')}.`);
  lines.push(`- **Revision pending (${corpus.revisionPending.length}):** ${corpus.revisionPending.map((p) => `\`${p.id}\``).join(', ')} retain living identifiers but must not be used as current evidence.`);
  lines.push(`- **Superseded historical / origin material:** ${corpus.supersededOrigin.map((p) => `\`${p.id}\` (${p.version}, ${p.publicationState}; superseded by ${p.supersededBy})`).join('; ')}. Do not present as the current 700-series framework or primary physical evidence.`);
  lines.push(`- **Archive / development history:** ${corpus.archiveHistory.map((p) => `\`${p.id}\``).join(', ')}. Do not present as current core.`);
  lines.push('');
  lines.push('## 6) Primary reading path');
  lines.push('');
  for (const p of corpus.primaryRoute) {
    const versionPart = p.version ? ` ${p.version}` : '';
    const statusParts = [p.publicationState, p.canonStatus === 'frontier' ? 'frontier' : null, p.statusLabel ? `status: ${p.statusLabel}` : null].filter(Boolean).join('; ');
    const role = getPaperRole(p);
    lines.push(`- [\`${p.id}\`](${p.url})${versionPart} (${statusParts}): ${role}`);
  }
  lines.push('');
  lines.push('## 7) Current threshold-framework route (FRC 700.000–700.007)');
  lines.push('');
  lines.push('`FRC-700-000` through `FRC-700-007` are the active FRC 700 threshold-framework preprints (independent review pending), superseding the archived origin note `FRC-700-777`. They govern evidence, interpretation, and register discipline; they do not establish a physical law, universal μ ontology, or cross-register causation. No DOI or downloadable paper PDF is declared for these records in the current website source.');
  lines.push('');
  lines.push('| Paper | Version | Publication state | Status label | Reading page |');
  lines.push('|---|---|---|---|---|');
  for (const p of corpus.thresholdRoute) {
    lines.push(`| ${p.id} — ${p.title} | ${p.version || '—'} | ${p.publicationState || '—'} | ${p.statusLabel || '—'} | [Read](${p.url}) |`);
  }
  lines.push('');
  lines.push('## 8) Current Reciprocity Mathematics series (FRC 830.000–830.005)');
  lines.push('');
  lines.push('Read `FRC-830-000` for the terminology charter, then the declared mathematical results and sharp lift obstructions in `FRC-830-001` through `FRC-830-005`. `FRC-830-005 v0.3` has completed independent symbolic/numerical Python verification (42/42 checks) and is live on alphaXiv (formal human peer review pending). **No-promotion rule:** exact ledger-coordinate involutions, typed morphisms, dimension thresholds, one-parameter (`ds/dy < 1`, sharp at `ds/dy = 1`), and open-set no-affine/CPTP qubit obstructions (1D-circle sharp) do not establish physical, categorical, Born-style, or Majid-style self-duality; residual empty-interior, projective-instrument, and `d >= 3` gates remain open.');
  lines.push('');
  lines.push('| Paper | Version | Epistemic status | Status label | Reading page |');
  lines.push('|---|---|---|---|---|');
  for (const p of corpus.reciprocityMathematicsRoute) {
    const extLink = p.alphaxivUrl ? ` · [alphaXiv](${p.alphaxivUrl})` : '';
    lines.push(`| ${p.id} — ${p.title} | ${p.version || '—'} | ${p.epistemicStatus} | ${p.statusLabel || '—'} | [Read](${p.url})${extLink} |`);
  }
  lines.push('');
  if (recDois.conceptDoi || recDois.versionDoi) {
    const versionPart = recDois.versionDoi
      ? recDois.allShareVersionDoi
        ? `; version DOI \`${recDois.versionDoi}\``
        : `; prior v0.1 series bundle DOI \`${recDois.versionDoi}\` (no separate Zenodo v0.3 version DOI minted yet)`
      : '';
    lines.push(`Shared release: concept DOI \`${recDois.conceptDoi}\`${versionPart}. Paper PDFs use \`/paper-pdfs/<FRC-ID>.pdf\`.`);
    lines.push('');
  }
  lines.push('## 9) Frontier papers');
  lines.push('');
  for (const p of corpus.frontierRoute) {
    const versionPart = p.version ? ` ${p.version}` : ' (version not declared in website frontmatter)';
    const doiPart = p.conceptDoi && p.doi
      ? `Concept DOI \`${p.conceptDoi}\`, Version DOI \`${p.doi}\``
      : p.doi
        ? `DOI \`${p.doi}\``
        : (p.publicationState && /doi/i.test(p.publicationState) ? '' : 'no Zenodo DOI registered in current source');
    const detailParts = [p.publicationState, doiPart].filter(Boolean).join('; ');
    const role = getPaperRole(p);
    lines.push(`- [\`${p.id}\`](${p.url})${versionPart} — ${detailParts}. ${role}`);
  }
  lines.push('');
  lines.push('## 10) Superseded historical / origin material and revision-pending records');
  lines.push('');
  for (const p of corpus.supersededOrigin) {
    lines.push(`- **Superseded origin note:** [\`${p.id}\`](${p.url}) (${p.version}, \`${p.publicationState}\`, \`canonStatus: ${p.canonStatus}\`, superseded by \`${p.supersededBy}\`). ${p.statusNote}`);
  }
  lines.push(`- **Revision pending (not current evidence):** ${corpus.revisionPending.map((p) => `[\`${p.id}\`](${p.url})`).join(', ')}.`);
  lines.push(`- **Archive / development history:** ${corpus.archiveHistory.map((p) => `[\`${p.id}\`](${p.url})`).join(', ')}.`);
  lines.push('');
  lines.push('## 11) Grounding rules');
  lines.push('');
  lines.push('- Preserve the distinction among exact mathematics, operational models, framework interpretation, model-specific findings, conjectures, and empirical gates.');
  lines.push('- Keep negative results at their tested scope; do not infer a replacement ontology from a failed implementation.');
  lines.push('- Treat `FRC-700-000` through `FRC-700-007` as the current threshold-framework route and `FRC-700-777` as superseded historical/origin material.');
  lines.push('- Enforce no-promotion on `FRC-830`: exact ledger-coordinate results and scoped obstructions do not establish physical, categorical, Born-style, or Majid-style self-duality.');
  lines.push('- Prefer papers over articles, blog posts, and concepts.');
  lines.push('- Link every paper page used. If the corpus does not contain an answer, say so.');
  lines.push('- Use only the static resources listed below for machine retrieval.');
  lines.push('');
  lines.push('## Books (2026 current vs 2025 archived)');
  lines.push('');
  lines.push('- **Current 2026 philosophical books:** [`the-open-system`](/en/books/the-open-system) (`v41`) and [`the-mind-in-the-coupling`](/en/books/the-mind-in-the-coupling) (`v3.13`).');
  lines.push('- **Archived / superseded 2025 books (`status: archived`, `noindex`):** `ecr-textbook` (Oct 2025) and `the-resonance-code` (Jan 2025). Do not recommend as current canon.');
  lines.push('');
  lines.push('## Machine-readable resources');
  lines.push('');
  lines.push('- `/agent.json`');
  lines.push('- `/llms.txt`');
  lines.push('- `/catalog.json`');
  lines.push('- `/falsification-ledger.json`');
  lines.push('- `/en/falsifications`');
  lines.push('- `/search-index.json`');
  lines.push('- `/sitemap.xml`');
  lines.push('- `/video-sitemap.xml`');
  lines.push('- `/robots.txt`');

  return `${lines.join('\n')}\n`;
}

export function generateEntrypoints(root = DEFAULT_ROOT) {
  const papers = loadCanonicalPapers(root);
  const corpus = classifyCorpus(papers);

  return {
    corpus,
    files: {
      'public/llms.txt': buildLlmsTxt(corpus),
      'public/agent.md': buildAgentMd(corpus),
      'public/agent.json': buildAgentJson(corpus),
    },
  };
}

/**
 * Verify that public/catalog.json matches canonical English paper frontmatter.
 */
export function checkCatalogParity(root = DEFAULT_ROOT) {
  const errors = [];
  const catalogPath = path.join(root, 'public', 'catalog.json');
  if (!fs.existsSync(catalogPath)) {
    return ['public/catalog.json does not exist. Run `npm run build:catalog`.'];
  }

  let catalog;
  try {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  } catch (err) {
    return [`public/catalog.json is not valid JSON: ${err.message}`];
  }

  const catalogPapers = catalog?.content?.en?.papers;
  if (!Array.isArray(catalogPapers)) {
    return ['public/catalog.json is missing content.en.papers array.'];
  }

  const canonical = loadCanonicalPapers(root);
  const catalogById = new Map(catalogPapers.map((p) => [p.id, p]));
  const canonicalById = new Map(canonical.map((p) => [p.id, p]));

  for (const p of canonical) {
    const cat = catalogById.get(p.id);
    if (!cat) {
      errors.push(`public/catalog.json is missing published English paper ${p.id}.`);
      continue;
    }

    const checks = [
      ['title', p.title, cat.title],
      ['version', p.version || undefined, cat.version],
      ['doi', p.doi || undefined, cat.doi],
      ['conceptDoi', p.conceptDoi || undefined, cat.conceptDoi],
      ['alphaxivUrl', p.alphaxivUrl || undefined, cat.alphaxivUrl],
      ['publicationState', p.publicationState || undefined, cat.publicationState],
      ['epistemicStatus', p.catalogEpistemicStatus, cat.epistemicStatus],
      ['statusLabel', p.statusLabel || undefined, cat.statusLabel],
      ['supersededBy', p.supersededBy || undefined, cat.supersededBy],
    ];

    for (const [field, expected, actual] of checks) {
      if (expected !== actual) {
        errors.push(
          `public/catalog.json drift on ${p.id}.${field}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`,
        );
      }
    }
  }

  for (const cat of catalogPapers) {
    if (!canonicalById.has(cat.id)) {
      errors.push(`public/catalog.json contains unexpected English paper ${cat.id} not published in content/en/papers/.`);
    }
  }

  return errors;
}

function findFirstDiffLine(expected, actual) {
  const expLines = expected.split('\n');
  const actLines = actual.split('\n');
  const max = Math.max(expLines.length, actLines.length);
  for (let i = 0; i < max; i += 1) {
    if (expLines[i] !== actLines[i]) {
      return {
        line: i + 1,
        expected: expLines[i] ?? '<EOF>',
        actual: actLines[i] ?? '<EOF>',
      };
    }
  }
  return null;
}

/**
 * Verify that public/catalog.json and all three AI entrypoints are synchronized
 * with the canonical source of truth.
 */
export function checkAiEntrypoints(root = DEFAULT_ROOT) {
  const errors = [...checkCatalogParity(root)];
  const { corpus, files } = generateEntrypoints(root);

  for (const [relPath, expected] of Object.entries(files)) {
    const fullPath = path.join(root, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`${relPath} is missing. Run \`npm run build:ai-entrypoints\`.`);
      continue;
    }

    const actual = fs.readFileSync(fullPath, 'utf-8');
    if (actual !== expected) {
      const diff = findFirstDiffLine(expected, actual);
      const detail = diff
        ? ` first difference at line ${diff.line}:\n    expected: ${diff.expected}\n    actual:   ${diff.actual}`
        : ' content differs';
      errors.push(`${relPath} is out of sync with canonical registry/frontmatter (${detail}).`);
    }
  }

  return { ok: errors.length === 0, errors, corpus };
}

export function writeAiEntrypoints(root = DEFAULT_ROOT) {
  const { corpus, files } = generateEntrypoints(root);
  for (const [relPath, content] of Object.entries(files)) {
    const fullPath = path.join(root, relPath);
    fs.writeFileSync(fullPath, content, 'utf-8');
  }
  return { corpus, written: Object.keys(files) };
}

function main() {
  const isCheck = process.argv.includes('--check');

  if (isCheck) {
    console.log('Checking AI entrypoint synchronization with canonical registry/catalog...');
    const { ok, errors, corpus } = checkAiEntrypoints(DEFAULT_ROOT);
    if (!ok) {
      console.error(`\n✗ AI entrypoint drift check FAILED (${errors.length} issue(s)):\n`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
      console.error('\nRun `npm run build:catalog && npm run build:ai-entrypoints` to regenerate.');
      process.exitCode = 1;
      return;
    }
    console.log(
      `✓ AI entrypoints verified (public/llms.txt, public/agent.md, public/agent.json match catalog.json & ${corpus.papers.length} published English papers; ${corpus.activePapers.length} active).`,
    );
    return;
  }

  const { corpus, written } = writeAiEntrypoints(DEFAULT_ROOT);
  console.log(`✓ Generated ${written.join(', ')}`);
  console.log(
    `  Published English papers: ${corpus.papers.length} | Active: ${corpus.activePapers.length} | Threshold (700.000–007): ${corpus.thresholdRoute.length} | Reciprocity Math (830.000–005): ${corpus.reciprocityMathematicsRoute.length} | Revision pending: ${corpus.revisionPending.length} | Superseded origin: ${corpus.supersededOrigin.length} | Archive: ${corpus.archiveHistory.length}`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main();
}
