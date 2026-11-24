import fs from 'node:fs';
import path from 'node:path';
import { getPapers, type ParsedContent } from './content';

export type ResearchStatusCategory =
  | 'exact-mathematics'
  | 'framework-methodology'
  | 'model-specific-results'
  | 'conjectures-empirical-gates';

export interface ResearchMapPaper {
  id: string;
  title: string;
  version: string | null;
  href: string;
  pdfHref: string | null;
  doi: string | null;
  conceptDoi: string | null;
  publicationState: string | null;
  statusLabel: string | null;
  statusCategory: ResearchStatusCategory;
  statusBadge: string;
  summary: string;
  isNegativeGate?: boolean;
}

export interface ResearchMapData {
  canonicalReciprocity: ResearchMapPaper | null;
  reciprocityMathematics: {
    papers: ResearchMapPaper[];
    sharedConceptDoi: string | null;
    sharedVersionDoi: string | null;
  };
  thresholdPapers: ResearchMapPaper[];
  empiricalPrograms: ResearchMapPaper[];
  supersededOrigin: {
    id: string;
    title: string;
    version: string | null;
    href: string;
    note: string;
  } | null;
  totalPublishedEnglishPapers: number;
}

const EMPIRICAL_SUMMARIES: Record<string, { statusCategory: ResearchStatusCategory; statusBadge: string; summary: string; isNegativeGate?: boolean }> = {
  'FRC-100-002': {
    statusCategory: 'model-specific-results',
    statusBadge: 'Model-specific results · Open empirical gates',
    summary: 'Standard Map / Quantum Kicked Rotor chaos program; KAM-structure functional, localization/decoherence pilots, retained Ruelle-Pollicott negative result, and demoted stadium appendix.',
  },
  'FRC-100-002-001': {
    statusCategory: 'conjectures-empirical-gates',
    statusBadge: 'Model-specific · Negative Gate 4 retained',
    summary: 'Coarse magnitude correspondence and arrangement null are retained; registered dense Gate 4 closed negatively (frozen area-only baseline performed better). Route to pillar status closed negatively.',
    isNegativeGate: true,
  },
  'FRC-787-787': {
    statusCategory: 'conjectures-empirical-gates',
    statusBadge: 'Operational protocol · Open empirical gate',
    summary: 'Operational and latent Lambda-Flight coherence-transport protocol awaiting held-out physical platform validation against equal-feature baselines.',
  },
};

const RECIPROCITY_MATH_BADGES: Record<string, { statusCategory: ResearchStatusCategory; statusBadge: string; summary: string }> = {
  'FRC-830-000': {
    statusCategory: 'framework-methodology',
    statusBadge: 'Framework / methodology · Terminology charter',
    summary: 'Separates coordinate transform, bookkeeping, balance law, duality, and self-duality; not evidence of physical duality.',
  },
  'FRC-830-001': {
    statusCategory: 'exact-mathematics',
    statusBadge: 'Exact mathematics · Review pending',
    summary: 'Affine classification and domain rigidity of the reciprocity one-form on the normalized ledger plane.',
  },
  'FRC-830-002': {
    statusCategory: 'exact-mathematics',
    statusBadge: 'Exact mathematics · Operational morphisms',
    summary: 'Typed category of operational registers and reciprocity-preserving morphisms; physical equivalence not claimed.',
  },
  'FRC-830-003': {
    statusCategory: 'exact-mathematics',
    statusBadge: 'Exact mathematics · Scoped obstruction',
    summary: 'Exact lift obstruction on the von Mises phase manifold; physical duality rejected for this family.',
  },
  'FRC-830-004': {
    statusCategory: 'exact-mathematics',
    statusBadge: 'Exact mathematics · Dimension threshold',
    summary: 'One-parameter nonidentity obstruction and qubit incoherent/unital/Wigner obstructions; general nonunital CPTP lift remains an open gate.',
  },
  'FRC-830-005': {
    statusCategory: 'exact-mathematics',
    statusBadge: 'Exact mathematics · No-promotion obstruction',
    summary: 'Present-structure obstruction to Born reciprocity and Majid-style self-duality; no physical or categorical self-duality established.',
  },
};

function hasPaperPdf(id: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', 'paper-pdfs', `${id}.pdf`));
}

function hasMatchingLocalizedRevision(enPaper: ParsedContent, localizedPaper: ParsedContent | undefined): boolean {
  if (!localizedPaper) return false;
  const enFm = enPaper.frontmatter;
  const trFm = localizedPaper.frontmatter;
  if (trFm.translationStatus === 'lags-canonical-english') return false;
  if (enFm.version && trFm.version !== enFm.version) return false;
  if (enFm.doi && trFm.doi !== enFm.doi) return false;
  return true;
}

function resolvePaperHref(
  paper: ParsedContent,
  lang: string,
  langPaperMap: Map<string, ParsedContent>,
  basePath: string,
): string {
  const id = paper.frontmatter.id;
  if (lang === 'en') {
    return `${basePath}/papers/${id}`;
  }
  if (hasMatchingLocalizedRevision(paper, langPaperMap.get(id))) {
    return `${basePath}/papers/${id}`;
  }
  return `/en/papers/${id}`;
}

function toMapPaper(
  paper: ParsedContent,
  lang: string,
  langPaperMap: Map<string, ParsedContent>,
  basePath: string,
  meta: {
    statusCategory: ResearchStatusCategory;
    statusBadge: string;
    summary: string;
    isNegativeGate?: boolean;
  },
): ResearchMapPaper {
  const fm = paper.frontmatter as typeof paper.frontmatter & { statusLabel?: string };
  return {
    id: fm.id,
    title: fm.title,
    version: fm.version || null,
    href: resolvePaperHref(paper, lang, langPaperMap, basePath),
    pdfHref: hasPaperPdf(fm.id) ? `/paper-pdfs/${fm.id}.pdf` : null,
    doi: fm.doi || null,
    conceptDoi: fm.conceptDoi || null,
    publicationState: fm.publicationState || null,
    statusLabel: fm.statusLabel || null,
    statusCategory: meta.statusCategory,
    statusBadge: meta.statusBadge,
    summary: meta.summary,
    isNegativeGate: meta.isNegativeGate,
  };
}

function comparePaperIds(a: string, b: string): number {
  return a.localeCompare(b, 'en', { numeric: true });
}

/**
 * Build the current public research map from canonical English paper frontmatter,
 * linking to a localized page only when it matches the advertised English revision,
 * and falling back to /en/papers/<id> otherwise.
 */
export function buildResearchMap(lang: string, basePath: string): ResearchMapData {
  const enPapers = getPapers('en').filter((p) => p.frontmatter.id && p.frontmatter.id !== 'FRC-000-START-HERE');
  const langPapers = lang === 'en' ? enPapers : getPapers(lang);
  const enById = new Map(enPapers.map((p) => [p.frontmatter.id, p]));
  const langPaperMap = new Map(langPapers.map((p) => [p.frontmatter.id, p]));

  const p566 = enById.get('FRC-566-001');
  const canonicalReciprocity = p566
    ? toMapPaper(p566, lang, langPaperMap, basePath, {
      statusCategory: 'conjectures-empirical-gates',
      statusBadge: 'Canonical relation · Operational bookkeeping / Physical conjecture',
      summary: 'Scale-invariant relation dS + k* d ln C = 0. Operational bookkeeping and control-law use at declared boundaries is distinct from the open conjecture of universal physical reciprocity.',
    })
    : null;

  const recPapers = enPapers
    .filter((p) => /^FRC-830-\d{3}$/.test(p.frontmatter.id))
    .sort((a, b) => comparePaperIds(a.frontmatter.id, b.frontmatter.id))
    .map((p) => {
      const id = p.frontmatter.id;
      const meta = RECIPROCITY_MATH_BADGES[id] || {
        statusCategory: 'exact-mathematics' as const,
        statusBadge: 'Exact mathematics · Preprint',
        summary: p.frontmatter.tldr || p.frontmatter.abstract || 'Reciprocity Mathematics preprint.',
      };
      return toMapPaper(p, lang, langPaperMap, basePath, meta);
    });

  const recConceptDois = [...new Set(recPapers.map((p) => p.conceptDoi).filter(Boolean))];
  const recVersionDois = [...new Set(recPapers.map((p) => p.doi).filter(Boolean))];

  const thresholdPapers = enPapers
    .filter((p) => /^FRC-700-00\d$/.test(p.frontmatter.id) && p.frontmatter.canonStatus === 'framework')
    .sort((a, b) => comparePaperIds(a.frontmatter.id, b.frontmatter.id))
    .map((p) => {
      const fm = p.frontmatter as typeof p.frontmatter & { statusLabel?: string };
      return toMapPaper(p, lang, langPaperMap, basePath, {
        statusCategory: 'framework-methodology',
        statusBadge: 'Framework / methodology · Independent review pending',
        summary: fm.statusLabel || fm.abstract || 'Threshold-framework preprint.',
      });
    });

  const empiricalIds = ['FRC-100-002', 'FRC-100-002-001', 'FRC-787-787'];
  const empiricalPrograms = empiricalIds
    .map((id) => {
      const p = enById.get(id);
      if (!p) return null;
      return toMapPaper(p, lang, langPaperMap, basePath, EMPIRICAL_SUMMARIES[id]);
    })
    .filter((item): item is ResearchMapPaper => item !== null);

  const p777 = enById.get('FRC-700-777');
  const supersededOrigin = p777
    ? {
      id: p777.frontmatter.id,
      title: p777.frontmatter.title,
      version: p777.frontmatter.version || null,
      href: '/en/papers/FRC-700-777',
      note: p777.frontmatter.statusNote || 'Superseded historical origin note; use FRC 700.000 through FRC 700.007 for the active threshold-framework route.',
    }
    : null;

  return {
    canonicalReciprocity,
    reciprocityMathematics: {
      papers: recPapers,
      sharedConceptDoi: recConceptDois.length === 1 ? recConceptDois[0] : null,
      sharedVersionDoi: recVersionDois.length === 1 ? recVersionDois[0] : null,
    },
    thresholdPapers,
    empiricalPrograms,
    supersededOrigin,
    totalPublishedEnglishPapers: enPapers.length,
  };
}
