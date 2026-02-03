export interface FormulaInfo {
  id: string;
  name: string;
  description: string;
  paper: string;
}

const FORMULAS: FormulaInfo[] = [
  {
    id: 'coherence',
    name: 'Coherence (C)',
    description: 'Phase alignment of N oscillators. C = 1 implies perfect synchrony.',
    paper: 'FRC 100.001'
  },
  {
    id: 'lambda-field',
    name: 'Lambda Field (Λ)',
    description: 'Scalar coherence field defined as Λ(x) ≡ Λ₀ ln C(x).',
    paper: 'FRC 100.007'
  },
  {
    id: 'witness',
    name: 'Witness Magnitude (W)',
    description: 'Normalized observation strength W ∈ [0, 1].',
    paper: 'FRC 100.003'
  },
  {
    id: 'ucc',
    name: 'Universal Coherence Condition',
    description: 'Conservation law for coherence field: dΛ/dt + ∇·JΛ = σΛ - γΛ.',
    paper: 'FRC 100.005'
  }
];

export function matchFormula(text: string): FormulaInfo | null {
  const clean = text.trim();
  // Simple heuristic matching
  if (clean.includes('C = (1/N)')) return FORMULAS[0];
  if (clean.includes('Λ(x)')) return FORMULAS[1];
  if (clean.includes('W = |')) return FORMULAS[2];
  if (clean.includes('dΛ/dt')) return FORMULAS[3];

  return null;
}
