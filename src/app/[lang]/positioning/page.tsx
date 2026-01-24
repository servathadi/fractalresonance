import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Positioning',
  description: 'How FRC compares to Bohm, Copenhagen, Many-Worlds, IIT, and other theories of physics and consciousness.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const COMPARISONS = [
  {
    theory: 'Copenhagen Interpretation',
    axis: 'Probabilistic + Reductionist',
    relation: 'FRC derives Born rule as emergent, not fundamental. Wavefunction collapse is guided by coherence attractors, not observer-triggered.',
  },
  {
    theory: 'Bohmian Mechanics',
    axis: 'Deterministic + Reductionist',
    relation: 'Shares determinism. FRC replaces the pilot wave with a scalar coherence field Λ(x) that is thermodynamically grounded.',
  },
  {
    theory: 'Many-Worlds (Everett)',
    axis: 'Deterministic + Holistic',
    relation: 'FRC selects a single outcome via attractor dynamics rather than branching into all possibilities.',
  },
  {
    theory: 'IIT (Tononi)',
    axis: 'Holistic',
    relation: 'FRC uses coherence C instead of integrated information Φ. Both are scalar measures but FRC connects directly to physics.',
  },
  {
    theory: 'Orch-OR (Penrose-Hameroff)',
    axis: 'Quantum + Consciousness',
    relation: 'FRC replaces objective reduction with resonant attractors. No microtubule dependency — coherence operates at all scales.',
  },
  {
    theory: 'Global Workspace Theory',
    axis: 'Cognitive',
    relation: 'Compatible as a μ₃-level description. FRC provides the underlying physics across all μ-levels.',
  },
];

export default function PositioningPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold mb-4">Positioning</h1>
      <p className="text-frc-text-dim mb-10">
        FRC sits in the <strong className="text-frc-text">Deterministic + Holistic</strong> quadrant:
        deterministic dynamics at the microstate level, holistic coherence across scales.
      </p>

      <div className="border border-frc-blue rounded-lg p-6 mb-12">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-4">FRC Distinctive Features</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>A real scalar field (Λ) governing coherence — not abstract or metaphysical</li>
          <li>Deterministic collapse via resonant attractors — no randomness postulate</li>
          <li>Born rule derived from ensemble averaging — not axiomatic</li>
          <li>Falsifiable: predicts δP ∈ [10⁻⁴, 10⁻³] under resonant driving</li>
          <li>Thermodynamically consistent: entropy–coherence reciprocity proven</li>
        </ul>
      </div>

      <h2 className="text-lg text-frc-text font-medium mb-6">Comparison Table</h2>
      <div className="space-y-4">
        {COMPARISONS.map(c => (
          <div key={c.theory} className="border border-frc-blue rounded-lg px-5 py-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-frc-text font-medium">{c.theory}</h3>
              <span className="text-xs text-frc-steel shrink-0">{c.axis}</span>
            </div>
            <p className="text-sm text-frc-text-dim">{c.relation}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
