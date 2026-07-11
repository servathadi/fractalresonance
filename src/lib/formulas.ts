/** Formula tooltip registry. Entries carry the status and scope used by the current papers. */
export interface FormulaInfo {
  id: string;
  name: string;
  description: string;
  paper: string;
  paperId: string;
}

export const FORMULA_REGISTRY: Record<string, FormulaInfo> = {
  'dS+k': {
    id: 'reciprocity',
    name: 'Entropy-Coherence Reciprocity',
    description: 'Canonical scale-invariant relation. Operational realizations must declare scale, units, observables, and boundary; physical universality remains conjectural.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },
  'dS_sys=d_iS+d_eS': {
    id: 'open-system-ledger',
    name: 'Open-System Entropy Ledger',
    description: 'Standard subsystem accounting with non-negative internal entropy production d_iS. A coherence residual does not replace this identity.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },
  'dS/dlnC=−κr': {
    id: 'von-mises-identity',
    name: 'Exact von Mises Identity',
    description: 'Exact for the declared von Mises/Kuramoto family; it is not by itself an environment or entropy-production measurement.',
    paper: 'FRC 566.030',
    paperId: 'FRC-566-030',
  },
  'Σ=S_vM(C)−S': {
    id: 'structure-functional',
    name: 'Chaos Structure Functional',
    description: 'Non-negative maximum-entropy gap. FRC 100.002.001 reports a scoped, null-controlled geometry prediction in the mixed Standard Map; Gate 4 remains open.',
    paper: 'FRC 100.002.001',
    paperId: 'FRC-100-002-001',
  },
  't*γ_C': {
    id: 'localization-crossover',
    name: 'Localization Crossover Target',
    description: 'Registered order-one coherence-lifetime criterion. The tolerance band and out-of-sample collapse remain open.',
    paper: 'FRC 100.002',
    paperId: 'FRC-100-002',
  },
  'Λ_obs=Λ₀lnC_obs': {
    id: 'lambda-observed',
    name: 'Observed Lambda Transform',
    description: 'Observed transform of a declared coherence channel. It must remain distinct from Lambda_eq, optional Lambda_dyn, and a conjectural fundamental field.',
    paper: 'FRC 826.829',
    paperId: 'FRC-826-829',
  },
};

export function matchFormula(text: string): FormulaInfo | null {
  const normalized = text.replace(/\s+/g, '').replace(/\\,/g, '');
  for (const [pattern, info] of Object.entries(FORMULA_REGISTRY)) {
    if (normalized.includes(pattern.replace(/\s+/g, ''))) return info;
  }
  return null;
}
