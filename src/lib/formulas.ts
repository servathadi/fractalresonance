export interface FormulaInfo {
  id: string;
  name: string;
  paper: string;
  description: string;
}

const FORMULAS: FormulaInfo[] = [
  {
    id: 'FRC-100.001',
    name: 'Coherence Measure',
    paper: 'FRC 100.001',
    description: 'C = (1/N) Σᵢ<ⱼ cos(φᵢ - φⱼ) — Phase alignment of N oscillators.'
  },
  {
    id: 'FRC-100.007',
    name: 'Lambda Field',
    paper: 'FRC 100.007',
    description: 'Λ(x) ≡ Λ₀ ln C(x) — Scalar coherence field.'
  },
  {
    id: 'FRC-100.005',
    name: 'Universal Coherence Condition',
    paper: 'FRC 100.005',
    description: 'dΛ/dt + ∇·JΛ = σΛ - γΛ — Conservation law for coherence field.'
  },
  {
    id: 'FRC-566.001',
    name: 'Entropy–Coherence Reciprocity',
    paper: 'FRC 566.001',
    description: 'dS + k* d ln C = 0 — Entropy and coherence are conjugate.'
  },
  {
    id: 'FRC-566.001-G',
    name: 'Free Energy Relation',
    paper: 'FRC 566.001',
    description: 'ΔG = −k*T Δln C — Connects coherence to thermodynamic free energy.'
  }
];

export function matchFormula(text: string): FormulaInfo | null {
  // Normalize text for matching (remove spaces, case insensitive)
  const normalized = text.toLowerCase().replace(/\s+/g, '');

  // Basic matching based on key characters appearing in the rendered output
  if (normalized.includes('c=') && normalized.includes('cos') && normalized.includes('n')) return FORMULAS[0];
  if (normalized.includes('Λ') && normalized.includes('lnc')) return FORMULAS[1]; // Λ is usually rendered as is
  if (normalized.includes('dΛ/dt') || (normalized.includes('∇') && normalized.includes('jΛ'))) return FORMULAS[2];
  if (normalized.includes('ds') && normalized.includes('dlnc')) return FORMULAS[3];
  if (normalized.includes('δg') || normalized.includes('δlnc')) return FORMULAS[4];

  return null;
}
