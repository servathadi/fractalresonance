#!/usr/bin/env node
/**
 * Deterministically generate and verify public/falsification-ledger.json
 *
 * Usage:
 *   node scripts/generate-falsification-ledger.mjs          # write public/falsification-ledger.json
 *   node scripts/generate-falsification-ledger.mjs --check  # verify parity and schema
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.join(__dirname, '..');

export const SITE_URL = 'https://fractalresonance.com';

export const VALID_DISPOSITIONS = [
  'NO_GAIN',
  'CONTRADICTED',
  'UNDERPOWERED',
  'STRUCTURAL_OBSTRUCTION',
  'DEMOTED',
];

const DISPOSITION_SET = new Set(VALID_DISPOSITIONS);

const DISPOSITION_DEFINITIONS = {
  NO_GAIN: 'Tested model or predictor did not outperform frozen baseline(s) at its registered empirical gate.',
  CONTRADICTED: 'Tested claim, bound, or implementation was directly refuted by measurement, audit, or preregistered test within its declared scope.',
  UNDERPOWERED: 'Benchmark yielded a non-promotion point estimate accompanied by low sample power or design confounds, preventing both promotion and decisive cross-platform rejection.',
  STRUCTURAL_OBSTRUCTION: 'Mathematical no-go theorem or present-structure obstruction blocks lifting or promoting a coordinate result without new independent structure.',
  DEMOTED: 'Earlier claim, origin note, or book edition superseded by the 2026 status-labeled corpus and quarantined to historical archive (noindex).',
};

const LEDGER_ENTRIES = [
  {
    id: 'FL-100-002-001-GATE4',
    title: 'Standard Map Dense Gate 4: Fine Geometric Ranking of Structure Functional',
    sourceIds: ['FRC-100-002', 'FRC-100-002-001'],
    sourceVersions: ['v2.6', 'v1.5'],
    dateRecorded: '2026-07-12',
    disposition: 'NO_GAIN',
    domain: 'Classical Chaos / Standard Map',
    claimTested: 'Fine geometric discrimination of the phase-space structure functional Sigma(infinity) against regular-island fraction f_island across ten unseen midpoint conditions in the frozen curvature window 1.45 <= K <= 1.55 (12 new seeds each).',
    evidenceSummary: 'Measured Sigma showed essentially no rank correlation with regular area (Spearman rho = 0.030, one-sided permutation p = 0.477), whereas negative entropy achieved rho = 0.964. Full geometry magnitude error (8.7% median) was beaten by the frozen area-only baseline (6.6%).',
    metrics: {
      spearman_rho_sigma: 0.030,
      permutation_p: 0.477,
      spearman_rho_neg_entropy: 0.964,
      geometry_median_error_pct: 8.7,
      frozen_area_baseline_error_pct: 6.6,
    },
    scopeBoundary: 'The registered route to pillar status via dense Gate 4 is closed negatively without post-hoc window search. The earlier coarse zero-parameter magnitude correspondence (9.7% median error for K_c <= K <= 2.0) and 1,000-shuffle arrangement null (p_emp = 1/1001) remain scoped results; sub-K_c uniform-fill failure (K = 0.6, 2x error) and the Ruelle-Pollicott negative result are retained.',
    urls: ['/en/papers/FRC-100-002', '/en/papers/FRC-100-002-001'],
    dois: ['10.5281/zenodo.21328428', '10.5281/zenodo.21328429'],
  },
  {
    id: 'FL-100-005-ERASURE',
    title: 'Langevin Unlocking Boundary Experiment: Erasure-Floor Bound',
    sourceIds: ['FRC-100-005'],
    sourceVersions: ['v2.3'],
    dateRecorded: '2026-07-09',
    disposition: 'CONTRADICTED',
    domain: 'Stochastic Thermodynamics',
    claimTested: 'Strong directional erasure floor sigma_ST >= k*_{mu_nat} |Delta ln C| (equivalently sigma_566 = sigma_ST + k*_{mu_nat} Delta ln C >= 0) on a slow overdamped Langevin unlocking ramp in a three-basin potential at declared information-unit normalization k*_{mu_nat} = 1.',
    evidenceSummary: 'With exact quadrature free-energy anchor Delta F = 17.885932 and Delta ln C = -0.132245 (N = 48,000 walkers), the combined diagnostic crossed negative at T_down = 96 (sigma_566 = -0.0659) and T_down = 192 (sigma_ST = 0.0288 +/- 0.0012, sigma_566 = -0.1034), establishing negativity at the finite endpoint for all k*_{mu_nat} > 0.218 in the same normalization.',
    metrics: {
      T_down: 192,
      sigma_ST: 0.0288,
      sigma_ST_se: 0.0012,
      delta_ln_C: -0.132245,
      sigma_566_at_k1: -0.1034,
      k_star_negativity_threshold: 0.218,
    },
    scopeBoundary: 'Rejects the tested erasure floor in this instrumented Langevin closure and declared k*_{mu_nat} = 1 normalization. Does not establish a universal directional replacement law for dS + k* d ln C = 0 or determine k* in another register.',
    urls: ['/en/papers/FRC-100-005'],
    dois: ['10.5281/zenodo.21298168'],
  },
  {
    id: 'FL-100-007-RHODRIFT',
    title: 'Density-Matrix (rho-Level) Lambda-Drift Born-Statistics Carrier Audit',
    sourceIds: ['FRC-100-007'],
    sourceVersions: ['v3.3'],
    dateRecorded: '2026-07-09',
    disposition: 'CONTRADICTED',
    domain: 'Open Quantum Dynamics / Measurement',
    claimTested: 'That the printed v3 rho-level Lambda drift preserves trace and recovers or preserves Born-rule populations p_n = |alpha_n|^2 in pure-dephasing qubit evolution.',
    evidenceSummary: 'The printed v3 rho-level drift is not trace-preserving in general (e.g., for C_super = 2|rho_01| + eps). Under the trace-preserving anticommutator completion (max trace error 6.88e-15), both tested coherence functionals move populations away from |a_0|^2 = 0.64 at alpha = 0.10 (C_super: p_0 = 0.502611, deviation -0.137389; C_lock: p_0 = 0.993315, deviation +0.353315). Moreover, the ensemble-member extension exhibits non-degenerate preparation dependence (Delta / alpha approx 8.804 at Bloch z = 0.4).',
    metrics: {
      initial_p0: 0.64,
      c_super_alpha_0_10_deviation: -0.137389,
      c_lock_alpha_0_10_deviation: 0.353315,
      prep_dependence_slope_small_alpha: 8.804,
    },
    scopeBoundary: 'Excludes these tested deterministic rho-level drift implementations as Born-preserving carriers in the sampled regime and separates Lambda_obs, Lambda_eq, optional latent Lambda_dyn, and the unproven fundamental-field conjecture. Not a universal no-go theorem for every stochastic, instrument-level, or distribution-level construction.',
    urls: ['/en/papers/FRC-100-007'],
    dois: ['10.5281/zenodo.21298171'],
  },
  {
    id: 'FL-787-787-RIJKE-P3',
    title: 'Lambda-Flight P3 Secondary-Data Benchmark (Rijke Tube) & Anti-Precursor-Hunting Gate',
    sourceIds: ['FRC-787-787'],
    sourceVersions: ['v1.2'],
    dateRecorded: '2026-07-12',
    disposition: 'UNDERPOWERED',
    domain: 'Driven Open Systems / Early Warning',
    claimTested: 'Prediction P3: whether adding the fixed logarithmic coherence composite (B4) to accepted variance/autocorrelation indicators (B1) improves held-out early-warning AUC by at least +0.05 or provides lead-time advantage on public Rijke-tube thermoacoustic transition data.',
    evidenceSummary: 'Not promoted on this benchmark. At the frozen primary horizon (-0.50 s), row-level held-out AUC was 0.722 for B1 and 0.694 for B4 (Delta AUC = -0.028); group-level AUC was 0.667 vs 0.611 (exact nine-group permutation p = 0.357; stratified group-bootstrap interval [-0.250, 0.111]), with no lead-time advantage (both reached AUC >= 0.75 at -0.25 s).',
    metrics: {
      horizon_seconds: -0.50,
      row_auc_B1: 0.722,
      row_auc_B4: 0.694,
      delta_auc: -0.028,
      group_auc_B1: 0.667,
      group_auc_B4: 0.611,
      permutation_p: 0.357,
      bootstrap_ci_low: -0.250,
      bootstrap_ci_high: 0.111,
    },
    scopeBoundary: 'Small held-out cohort, forced-ramp vs quasi-static protocol confound, and imperfect equal-information B3 control prevent both promotion and decisive cross-platform rejection. Enforces the FRC 787.787 anti-precursor-hunting rule: post-hoc alignment with external anomalies is not evidence.',
    urls: ['/en/papers/FRC-787-787'],
    dois: ['10.5281/zenodo.21328432'],
  },
  {
    id: 'FL-830-005-OBSTRUCTION',
    title: 'Present-Structure Obstruction to Born Reciprocity, Majid-Style Self-Duality, and Open-Set Qubit CPTP Lifts',
    sourceIds: ['FRC-830-005', 'FRC-830-004', 'FRC-830-003'],
    sourceVersions: ['v0.3', 'v0.1', 'v0.1'],
    dateRecorded: '2026-11-26',
    disposition: 'STRUCTURAL_OBSTRUCTION',
    domain: 'Reciprocity Mathematics / Quantum Channels',
    claimTested: 'Whether the exact FRC normalized ledger involution D(x, y) = (-y, -x) lifts to state-space operations or establishes quantum Born reciprocity or Majid-style representation-theoretic self-duality.',
    evidenceSummary: 'Canonical Born exchange B_a(q, p) = (ap, -q/a) is order 4 and symplectic, whereas D is order 2 and reverses the ambient area form (non-conjugate by any bijection). Ledger coordinates do not reconstruct state actions (natural qubit-fiber non-reconstruction), and primitive ambient Hopf algebraization supplies no dual object, Hopf pairing, or semidualisation. Every C^1 one-parameter family with strictly monotone coherence and slope ds/dy < 1 excludes nonidentity lifts (sharp at ds/dy = 1, witnessed by s(y) = 2 + y, tau(y) = -2 - y). On the full qubit ledger, incoherent operations, unital channels, and Wigner symmetries fail on their stated domains, and Proposition 4 (open-set no-affine-channel rigidity) excludes every affine Bloch map—hence every qubit CPTP channel (unital or nonunital), every PTP map, and every fixed-ancilla Stinespring protocol—on any nonempty open subset with C_off > 0 (exact analytic discrepancy g(1/2) = 3*sqrt(3)/16 != 7/16; proved sharp on 1D circle fibers). Independent symbolic and numerical Python verification completed (42/42 checks passing via verify_frc_830_005_v03.py, zero fitted parameters).',
    metrics: {
      ledger_involution_order: 2,
      born_exchange_order: 4,
      one_param_sharp_slope_threshold: 1,
      excluded_qubit_operation_classes: 3,
      open_set_affine_cptp_excluded: 'all nonempty open E with C_off > 0 (1D-circle sharp)',
      open_set_g_half_discrepancy: 0.1127404736,
      verification_checks_passed: 42,
      verification_checks_total: 42,
    },
    scopeBoundary: 'Present-structure no-promotion obstruction (FRC 830.005 v0.3 live on Zenodo DOI 10.5281/zenodo.24572231, standalone Concept DOI 10.5281/zenodo.24572230, FRC 830 set Concept DOI 10.5281/zenodo.21385391, and alphaXiv; independent symbolic/numerical audit completed with 42/42 checks passing, formal human peer review pending). Proposition 4 closes the open-set affine/CPTP qubit gate negatively; residual empty-interior subsets (curves/surfaces), nonlinear projective outcome-conditioned instrument maps, higher-dimensional (d >= 3) registers, and cross-register constructions remain explicitly open. Present ledger mathematics cannot be cited as evidence for physical, categorical, Born-style, or Majid-style self-duality.',
    urls: ['/en/papers/FRC-830-005', '/en/papers/FRC-830-004', '/en/papers/FRC-830-003'],
    dois: ['10.5281/zenodo.24572231', '10.5281/zenodo.24572230', '10.5281/zenodo.21385391', '10.5281/zenodo.21385392'],
    externalLinks: [
      {
        label: 'Zenodo v0.3 (DOI 10.5281/zenodo.24572231)',
        url: 'https://zenodo.org/records/24572231',
      },
      {
        label: 'alphaXiv (FRC 830.005 v0.3)',
        url: 'https://www.alphaxiv.org/abs/2611.frc-830-005-quantum-born-reciprocity-obstruction',
      },
      {
        label: 'Academia.edu (FRC 830.005 v0.3)',
        url: 'https://www.academia.edu/182072723/FRC_830_005_v0_3_FRC_and_Quantum_Born_Reciprocity_A_Present_Structure_Obstruction_to_Majid_Style_Self_Duality',
      },
    ],
  },
  {
    id: 'FL-DEMOTED-D190',
    title: 'Retired 2025 Claim: Stadium Billiard D ≈ 1.90 Fractal-Dimension Proof',
    sourceIds: ['FRC-100-002', 'FRC-100-000', 'FRC-EP-002', 'FRC-EP-EXTRA-1'],
    sourceVersions: ['v2.6', 'v1.2', 'archived', 'archived'],
    dateRecorded: '2026-07-12',
    disposition: 'DEMOTED',
    domain: 'Quantum Chaos / Legacy Claims',
    claimTested: 'That a D ≈ 1.90 fractal dimension in Bunimovich stadium eigenfunctions provides canonical proof of a deterministic FRC fractal potential.',
    evidenceSummary: 'Demoted to historical appendix in FRC 100.002 v2.6. Legacy essays featuring the claim (FRC-EP-002, FRC-EP-EXTRA-1) are archived with noindex and superseded banners; active chaos work is scoped to the Standard Map / Quantum Kicked Rotor family.',
    metrics: {},
    scopeBoundary: 'Not part of active 2026 FRC evidence. Governance validation blocks unarchived active pages from presenting D ≈ 1.90 as canonical proof.',
    urls: ['/en/papers/FRC-100-002', '/en/papers/FRC-100-000'],
    dois: ['10.5281/zenodo.21328428', '10.5281/zenodo.21298155'],
  },
  {
    id: 'FL-DEMOTED-BORN',
    title: 'Retired 2025 Claim: Completed Born-Rule Derivation & Fixed 10^-4 to 10^-3 Deviation Range',
    sourceIds: ['FRC-100-000', 'FRC-100-100', 'FRC-100-003', 'FRC-100-007'],
    sourceVersions: ['v1.2', 'v1.0', 'v3.3', 'v3.3'],
    dateRecorded: '2026-07-10',
    disposition: 'DEMOTED',
    domain: 'Quantum Foundations / Legacy Claims',
    claimTested: 'That FRC has completed a first-principles derivation of the Born rule and predicts a fixed universal Born-deviation window of 10^-4 to 10^-3.',
    evidenceSummary: 'Superseded across the 2026 corpus. Current papers contain only a conditional equilibrium proposal with open dynamics, Born-weight, and no-signaling gates, and explicitly declare that FRC has no fixed canonical Born-deviation range. Legacy essays (FRC-EP-005, FRC-EP-006, FRC-EP-EXTRA-2) are archived with noindex.',
    metrics: {},
    scopeBoundary: 'Any future quantitative Born-deviation prediction requires a declared model, coupling normalization, and preregistered experimental protocol.',
    urls: ['/en/papers/FRC-100-000', '/en/papers/FRC-100-100', '/en/papers/FRC-100-003', '/en/papers/FRC-100-007'],
    dois: ['10.5281/zenodo.21298155', '10.5281/zenodo.21298194', '10.5281/zenodo.21298162', '10.5281/zenodo.21298171'],
  },
  {
    id: 'FL-DEMOTED-16D-821',
    title: 'Retired 2025 Branches: 16D State-Space, FRC 821 Canon & "Fractal Resonance Cognition" Naming',
    sourceIds: ['FRC-16D-001', 'FRC-821-100', 'FRC-100-000'],
    sourceVersions: ['archive', 'archive', 'v1.2'],
    dateRecorded: '2026-07-10',
    disposition: 'DEMOTED',
    domain: 'Corpus Architecture / Legacy Branches',
    claimTested: 'Earlier 16D / FRC 821 formulations and the 2025 name "Fractal Resonance Cognition" presented as current canonical theory.',
    evidenceSummary: 'Quarantined to archive/development history. Active corpus operates strictly under "Fractal Resonance Coherence" with core FRC 100 / FRC 566, threshold framework FRC 700.000–700.007, and Reciprocity Mathematics FRC 830.000–830.005.',
    metrics: {},
    scopeBoundary: 'Historical archive files remain addressable for provenance only with noindex and are excluded from active search and canon routes.',
    urls: ['/en/papers/FRC-100-000', '/en/papers/FRC-100-100'],
    dois: [],
  },
  {
    id: 'FL-DEMOTED-700-777',
    title: 'Superseded Origin Note: FRC 700.777 (v1.0)',
    sourceIds: ['FRC-700-777'],
    sourceVersions: ['v1.0'],
    dateRecorded: '2026-07-14',
    disposition: 'DEMOTED',
    domain: 'Threshold Framework / Register Discipline',
    claimTested: 'Using FRC 700.777 as the active 700-series framework or citing it as physical evidence for a universal mu hierarchy.',
    evidenceSummary: 'Archived as historical origin provenance (publicationState: archived, canonStatus: archive) and superseded by FRC 700.000 through FRC 700.007 (bounded framework preprints, independent review pending).',
    metrics: {},
    scopeBoundary: 'Active FRC 700.000–700.007 series governs scope conventions and claim boundaries without adding physical laws or proving cross-register causation.',
    urls: ['/en/papers/FRC-700-777', '/en/papers/FRC-700-000'],
    dois: [],
  },
  {
    id: 'FL-DEMOTED-BOOKS-2025',
    title: 'Superseded 2025 Books: ECR Textbook & The Resonance Code',
    sourceIds: ['ecr-textbook', 'the-resonance-code'],
    sourceVersions: ['2025-10', '2025-01'],
    dateRecorded: '2026-07-15',
    disposition: 'DEMOTED',
    domain: 'Long-Form Books / Edition Governance',
    claimTested: 'Presenting the January 2025 (The Resonance Code) and October 2025 (ECR Textbook) volumes as current FRC canon.',
    evidenceSummary: 'Both 2025 books are marked status: archived with noindex across all locales and display superseded archive banners on every book and chapter route while preserving historical chapters intact. Replaced by the 2026 philosophical books (The Open System, The Mind in the Coupling) and status-labeled papers (FRC 100.000, FRC 566.001).',
    metrics: {},
    scopeBoundary: 'Current 2026 books are explicitly labeled philosophy; falsifiable physics and empirical gates reside exclusively in the status-labeled papers.',
    urls: ['/en/books', '/en/books/the-open-system', '/en/books/the-mind-in-the-coupling'],
    dois: [],
  },
];

export function buildFalsificationLedger() {
  const countsByDisposition = {};
  for (const d of VALID_DISPOSITIONS) {
    countsByDisposition[d] = 0;
  }
  for (const entry of LEDGER_ENTRIES) {
    countsByDisposition[entry.disposition] = (countsByDisposition[entry.disposition] || 0) + 1;
  }

  const dates = LEDGER_ENTRIES.map((e) => e.dateRecorded).filter(Boolean).sort();
  const updated = dates.length > 0 ? dates[dates.length - 1] : '2026-07-15';

  const ledger = {
    name: 'Fractal Resonance Coherence (FRC) Public Falsification & Negative-Gate Ledger',
    version: '1.0.0',
    updated,
    url: `${SITE_URL}/en/falsifications`,
    jsonUrl: `${SITE_URL}/falsification-ledger.json`,
    generator: 'scripts/generate-falsification-ledger.mjs',
    policy: 'Every closed negative empirical gate, direct contradiction, underpowered benchmark, mathematical obstruction, and demoted legacy claim is recorded publicly at equal volume alongside active research.',
    dispositions: DISPOSITION_DEFINITIONS,
    summary: {
      totalEntries: LEDGER_ENTRIES.length,
      byDisposition: countsByDisposition,
    },
    entries: LEDGER_ENTRIES,
  };

  return `${JSON.stringify(ledger, null, 2)}\n`;
}

export function validateLedgerObject(ledger) {
  const errors = [];
  if (!ledger || typeof ledger !== 'object') {
    return ['public/falsification-ledger.json is not a valid JSON object.'];
  }
  if (!Array.isArray(ledger.entries) || ledger.entries.length === 0) {
    errors.push('public/falsification-ledger.json must contain a non-empty entries array.');
    return errors;
  }

  const seenIds = new Set();
  for (const entry of ledger.entries) {
    if (!entry.id || typeof entry.id !== 'string') {
      errors.push('Falsification ledger entry missing string id.');
      continue;
    }
    if (seenIds.has(entry.id)) {
      errors.push(`Duplicate falsification ledger entry id "${entry.id}".`);
    }
    seenIds.add(entry.id);

    if (!DISPOSITION_SET.has(entry.disposition)) {
      errors.push(`Entry ${entry.id} has invalid disposition "${entry.disposition}". Valid: ${VALID_DISPOSITIONS.join(', ')}.`);
    }
    if (!entry.title || !entry.claimTested || !entry.evidenceSummary || !entry.scopeBoundary) {
      errors.push(`Entry ${entry.id} is missing required descriptive fields.`);
    }
  }

  return errors;
}

export function checkFalsificationLedger(root = DEFAULT_ROOT) {
  const outPath = path.join(root, 'public', 'falsification-ledger.json');
  const errors = [];
  if (!fs.existsSync(outPath)) {
    return { ok: false, errors: ['public/falsification-ledger.json is missing. Run `npm run build:falsifications`.'] };
  }
  const actual = fs.readFileSync(outPath, 'utf-8');
  const expected = buildFalsificationLedger();
  if (actual !== expected) {
    errors.push('public/falsification-ledger.json is out of sync with scripts/generate-falsification-ledger.mjs. Run `npm run build:falsifications`.');
  }
  try {
    const parsed = JSON.parse(actual);
    errors.push(...validateLedgerObject(parsed));
  } catch (err) {
    errors.push(`public/falsification-ledger.json is invalid JSON: ${err.message}`);
  }
  return { ok: errors.length === 0, errors };
}

export function writeFalsificationLedger(root = DEFAULT_ROOT) {
  const outPath = path.join(root, 'public', 'falsification-ledger.json');
  const content = buildFalsificationLedger();
  fs.writeFileSync(outPath, content, 'utf-8');
  return outPath;
}

function main() {
  if (process.argv.includes('--check')) {
    const res = checkFalsificationLedger(DEFAULT_ROOT);
    if (!res.ok) {
      console.error(`✗ Falsification ledger check FAILED (${res.errors.length} issue(s)):`);
      for (const err of res.errors) console.error(`  - ${err}`);
      process.exitCode = 1;
      return;
    }
    console.log(`✓ Falsification ledger verified (${LEDGER_ENTRIES.length} typed entries in public/falsification-ledger.json).`);
    return;
  }

  writeFalsificationLedger(DEFAULT_ROOT);
  console.log(`✓ Generated public/falsification-ledger.json (${LEDGER_ENTRIES.length} entries).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main();
}
