export interface FormulaInfo {
  id: string;
  paper: string;
  name: string;
  description: string;
  equation: string;
}

const FORMULAS: FormulaInfo[] = [
  {
    id: 'coherence',
    name: 'Coherence (C)',
    equation: 'C = (1/N) Σᵢ<ⱼ cos(φᵢ - φⱼ)',
    description: 'Phase alignment of N oscillators. C = 1: perfect synchrony, C = 0: random phases.',
    paper: 'FRC 100.001',
  },
  {
    id: 'lambda-field',
    name: 'Lambda Field (Λ)',
    equation: 'Λ(x) ≡ Λ₀ ln C(x)',
    description: 'Scalar coherence field. Λ₀ ≈ 10⁻³⁵ J (calibration constant). Units: Joules.',
    paper: 'FRC 100.007',
  },
  {
    id: 'witness-magnitude',
    name: 'Witness Magnitude (W)',
    equation: 'W = |⟨ψ|Ô|ψ⟩| / ‖Ô‖',
    description: 'Normalized observation strength. W ∈ [0, 1].',
    paper: 'FRC 100.003',
  },
  {
    id: 'ucc',
    name: 'Universal Coherence Condition (UCC)',
    equation: 'dΛ/dt + ∇·J_Λ = σ_Λ - γ_Λ',
    description: 'Conservation law for coherence field. J_Λ: coherence flux, σ_Λ: source, γ_Λ: dissipation.',
    paper: 'FRC 100.005',
  },
  {
    id: 'born-rule',
    name: 'Emergent Born Rule',
    equation: 'P(outcome) = |ψ|²',
    description: 'Emerges from microstate statistics at equilibrium. Not a fundamental axiom in FRC.',
    paper: 'FRC 100.006',
  },
  {
    id: 'born-rule-deviation',
    name: 'Born Rule Deviation (Prediction)',
    equation: 'δP ∈ [10⁻⁴, 10⁻³]',
    description: 'Measurable under resonant driving. Falsifiable prediction distinguishing FRC from QM.',
    paper: 'FRC 100.007',
  },
  {
    id: 'entropy-coherence',
    name: 'Entropy–Coherence Reciprocity',
    equation: 'dS + k* d ln C = 0  ⟹  S + k* ln C = const',
    description: 'Entropy and coherence are conjugate. k* = 1 (information) or k_B (thermodynamic).',
    paper: 'FRC 566.001',
  },
  {
    id: 'free-energy',
    name: 'Free Energy Relation',
    equation: 'ΔG = −k*T Δln C',
    description: 'Connects coherence to thermodynamic free energy. Isothermal projection.',
    paper: 'FRC 566.001',
  },
  {
    id: 'ucc-flow',
    name: 'UCC Flow (PDE form)',
    equation: '∂_t ln C = −∇·J_C + S_C,  J_C = −D_C ∇ln C',
    description: 'Well-posed diffusion-reaction form. D_C > 0 (diffusion coefficient).',
    paper: 'FRC 566.001',
  },
  {
    id: 'dissipation-bound',
    name: 'Dissipation Bound',
    equation: 'σ(t) ≡ k* D_C ∫ ‖∇ ln C‖² dV ≥ 0',
    description: 'Non-negative dissipation under Neumann/Dirichlet boundary conditions.',
    paper: 'FRC 566.001',
  },
  {
    id: 'rer',
    name: 'Relative Entropy Ratio (RER)',
    equation: 'RER(p→q) = C[q]/C[p] = exp[−D_KL(p∥q)/k*]',
    description: 'Coherence ratio from KL divergence.',
    paper: 'FRC 566.001',
  },
  {
    id: 'mutual-info',
    name: 'Mutual Information Coupling',
    equation: 'C_XY = exp[−I(X;Y)/k*]',
    description: 'Joint coherence from mutual information. I(X;Y) = D_KL(p_XY ∥ p_X p_Y).',
    paper: 'FRC 566.001',
  },
];

export function matchFormula(text: string): FormulaInfo | null {
  const t = text.trim();
  // Try exact match first
  const exact = FORMULAS.find(f => f.equation === t);
  if (exact) return exact;

  // Try matching without spaces (LaTeX formatting can be inconsistent)
  const norm = (s: string) => s.replace(/\s+/g, '');
  const tNorm = norm(t);

  return FORMULAS.find(f => norm(f.equation) === tNorm) || null;
}
