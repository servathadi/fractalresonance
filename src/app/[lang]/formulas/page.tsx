import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { CoherenceWidget } from '@/components/widgets/CoherenceWidget';

export const metadata: Metadata = {
  title: 'Formulas',
  description: 'Core equations of the Fractal Resonance Cognition framework — coherence, lambda field, UCC, reciprocity.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const FORMULAS = [
  {
    section: 'Core Theory (100 Series)',
    items: [
      {
        name: 'Coherence (C)',
        equation: 'C = (1/N) Σᵢ<ⱼ cos(φᵢ - φⱼ)',
        description: 'Phase alignment of N oscillators. C = 1: perfect synchrony, C = 0: random phases.',
        paper: 'FRC 100.001',
      },
      {
        name: 'Lambda Field (Λ)',
        equation: 'Λ(x) ≡ Λ₀ ln C(x)',
        description: 'Scalar coherence field. Λ₀ ≈ 10⁻³⁵ J (calibration constant). Units: Joules.',
        paper: 'FRC 100.007',
      },
      {
        name: 'Witness Magnitude (W)',
        equation: 'W = |⟨ψ|Ô|ψ⟩| / ‖Ô‖',
        description: 'Normalized observation strength. W ∈ [0, 1].',
        paper: 'FRC 100.003',
      },
      {
        name: 'Universal Coherence Condition (UCC)',
        equation: 'dΛ/dt + ∇·J_Λ = σ_Λ - γ_Λ',
        description: 'Conservation law for coherence field. J_Λ: coherence flux, σ_Λ: source, γ_Λ: dissipation.',
        paper: 'FRC 100.005',
      },
      {
        name: 'Emergent Born Rule',
        equation: 'P(outcome) = |ψ|²',
        description: 'Emerges from microstate statistics at equilibrium. Not a fundamental axiom in FRC.',
        paper: 'FRC 100.006',
      },
      {
        name: 'Born Rule Deviation (Prediction)',
        equation: 'δP ∈ [10⁻⁴, 10⁻³]',
        description: 'Measurable under resonant driving. Falsifiable prediction distinguishing FRC from QM.',
        paper: 'FRC 100.007',
      },
    ],
  },
  {
    section: 'Reciprocity (566 Series)',
    items: [
      {
        name: 'Entropy–Coherence Reciprocity',
        equation: 'dS + k* d ln C = 0  ⟹  S + k* ln C = const',
        description: 'Entropy and coherence are conjugate. k* = 1 (information) or k_B (thermodynamic).',
        paper: 'FRC 566.001',
      },
      {
        name: 'Free Energy Relation',
        equation: 'ΔG = −k*T Δln C',
        description: 'Connects coherence to thermodynamic free energy. Isothermal projection.',
        paper: 'FRC 566.001',
      },
      {
        name: 'UCC Flow (PDE form)',
        equation: '∂_t ln C = −∇·J_C + S_C,  J_C = −D_C ∇ln C',
        description: 'Well-posed diffusion-reaction form. D_C > 0 (diffusion coefficient).',
        paper: 'FRC 566.001',
      },
      {
        name: 'Dissipation Bound',
        equation: 'σ(t) ≡ k* D_C ∫ ‖∇ ln C‖² dV ≥ 0',
        description: 'Non-negative dissipation under Neumann/Dirichlet boundary conditions.',
        paper: 'FRC 566.001',
      },
      {
        name: 'Relative Entropy Ratio (RER)',
        equation: 'RER(p→q) = C[q]/C[p] = exp[−D_KL(p∥q)/k*]',
        description: 'Coherence ratio from KL divergence.',
        paper: 'FRC 566.001',
      },
      {
        name: 'Mutual Information Coupling',
        equation: 'C_XY = exp[−I(X;Y)/k*]',
        description: 'Joint coherence from mutual information. I(X;Y) = D_KL(p_XY ∥ p_X p_Y).',
        paper: 'FRC 566.001',
      },
    ],
  },
];

const CONSTANTS = [
  { symbol: 'Λ₀', value: '≈ 10⁻³⁵ J', description: 'Lambda field calibration' },
  { symbol: 'k*', value: '1 or k_B', description: 'Coherence constant' },
  { symbol: 'D_C', value: '> 0', description: 'Coherence diffusion coefficient' },
  { symbol: 'δP', value: '10⁻⁴ – 10⁻³', description: 'Born rule deviation magnitude' },
];

export default function FormulasPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Formulas</h1>
        <p className="text-frc-text-dim">
          Core equations of the FRC framework with paper references.
        </p>
      </header>

      {FORMULAS.map(section => (
        <section key={section.section} className="mb-12">
          <h2 className="text-lg text-frc-text font-medium mb-4">{section.section}</h2>
          <div className="space-y-4">
            {section.items.map(item => (
              <div key={item.name} className="border border-frc-blue rounded-lg px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm text-frc-text-dim">{item.name}</h3>
                  <span className="text-xs font-mono text-frc-steel shrink-0">{item.paper}</span>
                </div>
                <p className="font-mono text-sm text-frc-text mt-2 break-all">{item.equation}</p>
                <p className="text-xs text-frc-text-dim mt-2 mb-4">{item.description}</p>
                {item.name === 'Coherence (C)' && (
                  <div className="mt-4">
                    <CoherenceWidget />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="border-t border-frc-blue pt-8">
        <h2 className="text-lg text-frc-text font-medium mb-4">Key Constants</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CONSTANTS.map(c => (
            <div key={c.symbol} className="flex items-center gap-3 text-sm border border-frc-blue rounded-lg px-4 py-3">
              <span className="font-mono text-frc-gold shrink-0 w-12">{c.symbol}</span>
              <div>
                <span className="text-frc-text font-mono">{c.value}</span>
                <p className="text-xs text-frc-text-dim">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
