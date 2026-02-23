/**
 * Formula registry for FRC inline tooltips
 * Maps formula patterns to their explanations
 */

export interface FormulaInfo {
  id: string;
  name: string;
  description: string;
  paper: string;
  paperId: string;
}

/**
 * Key FRC formulas with their explanations
 * The pattern is a substring that appears in the rendered KaTeX output
 */
export const FORMULA_REGISTRY: Record<string, FormulaInfo> = {
  // Coherence - various forms
  'C=(1/N)': {
    id: 'coherence',
    name: 'Coherence (C)',
    description: 'Phase alignment of N oscillators. C = 1 means perfect synchrony, C = 0 means random phases.',
    paper: 'FRC 100.001',
    paperId: 'FRC-100-001',
  },

  // Lambda field
  'Λ(x)≡Λ': {
    id: 'lambda-field',
    name: 'Lambda Field (Λ)',
    description: 'Scalar coherence field. Λ₀ ≈ 10⁻³⁵ J is the calibration constant.',
    paper: 'FRC 100.007',
    paperId: 'FRC-100-007',
  },
  'Λ₀lnC': {
    id: 'lambda-field',
    name: 'Lambda Field (Λ)',
    description: 'Scalar coherence field defined as Λ(x) = Λ₀ ln C(x).',
    paper: 'FRC 100.007',
    paperId: 'FRC-100-007',
  },

  // Witness magnitude
  'W=|⟨ψ|': {
    id: 'witness',
    name: 'Witness Magnitude (W)',
    description: 'Normalized observation strength. W ∈ [0, 1].',
    paper: 'FRC 100.003',
    paperId: 'FRC-100-003',
  },

  // Born rule
  'P(outcome)=|ψ|²': {
    id: 'born-rule',
    name: 'Emergent Born Rule',
    description: 'Emerges from microstate statistics at equilibrium. Not a fundamental axiom in FRC.',
    paper: 'FRC 100.006',
    paperId: 'FRC-100-006',
  },
  '|ψ|²': {
    id: 'born-rule',
    name: 'Born Rule Probability',
    description: 'Probability amplitude squared. In FRC, this emerges from coherence statistics.',
    paper: 'FRC 100.006',
    paperId: 'FRC-100-006',
  },

  // Born rule deviation
  'δP∈[10': {
    id: 'born-deviation',
    name: 'Born Rule Deviation',
    description: 'Measurable deviation δP ∈ [10⁻⁴, 10⁻³] under resonant driving. Key falsifiable prediction.',
    paper: 'FRC 100.007',
    paperId: 'FRC-100-007',
  },

  // UCC
  'dΛ/dt': {
    id: 'ucc',
    name: 'Universal Coherence Condition',
    description: 'Conservation law for the coherence field. J_Λ is coherence flux.',
    paper: 'FRC 100.005',
    paperId: 'FRC-100-005',
  },
  '∂_tlnC': {
    id: 'ucc-pde',
    name: 'UCC Flow (PDE form)',
    description: 'Well-posed diffusion-reaction form of the Universal Coherence Condition.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },

  // Reciprocity
  'dS+k': {
    id: 'reciprocity',
    name: 'Entropy–Coherence Reciprocity',
    description: 'Entropy and coherence are conjugate: dS + k* d ln C = 0.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },
  'S+k': {
    id: 'reciprocity-integral',
    name: 'Reciprocity Conservation',
    description: 'Integrated form: S + k* ln C = constant.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },

  // Free energy
  'ΔG=−k': {
    id: 'free-energy',
    name: 'Free Energy Relation',
    description: 'Connects coherence to thermodynamic free energy. Isothermal projection.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },

  // Fractal dimension
  'D≈1.90': {
    id: 'fractal-dim',
    name: 'Fractal Dimension (D)',
    description: 'Predicted nodal pattern fractal dimension D ≈ 1.90 ± 0.02 in quantum chaotic systems.',
    paper: 'FRC 100.002',
    paperId: 'FRC-100-002',
  },
  'D=1.90': {
    id: 'fractal-dim',
    name: 'Fractal Dimension (D)',
    description: 'Key prediction: D = 1.90 vs standard QM prediction of D = 2.0.',
    paper: 'FRC 100.002',
    paperId: 'FRC-100-002',
  },

  // Lambda field mass/energy
  'Λ₀≈10': {
    id: 'lambda-constant',
    name: 'Lambda Calibration Constant',
    description: 'Λ₀ ≈ 10⁻³⁵ J - the fundamental calibration constant of the Lambda field.',
    paper: 'FRC 100.007',
    paperId: 'FRC-100-007',
  },

  // Dissipation bound
  'σ(t)≡k': {
    id: 'dissipation',
    name: 'Dissipation Bound',
    description: 'Non-negative dissipation σ(t) ≥ 0 under Neumann/Dirichlet boundary conditions.',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },

  // RER
  'RER(p→q)': {
    id: 'rer',
    name: 'Relative Entropy Ratio',
    description: 'Coherence ratio from KL divergence: RER = exp[−D_KL/k*].',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },

  // Mutual information coupling
  'C_XY=exp': {
    id: 'mutual-info',
    name: 'Mutual Information Coupling',
    description: 'Joint coherence from mutual information: C_XY = exp[−I(X;Y)/k*].',
    paper: 'FRC 566.001',
    paperId: 'FRC-566-001',
  },
};

/**
 * Check if a KaTeX-rendered text contains a known formula
 * Returns the first matching formula info, or null
 */
export function matchFormula(text: string): FormulaInfo | null {
  // Normalize: remove spaces and common variations
  const normalized = text.replace(/\s+/g, '').replace(/\\,/g, '');

  for (const [pattern, info] of Object.entries(FORMULA_REGISTRY)) {
    if (normalized.includes(pattern)) {
      return info;
    }
  }

  return null;
}
