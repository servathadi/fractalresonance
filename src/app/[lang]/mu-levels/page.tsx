import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'μ-Levels',
  description: 'The eight nested scales of consciousness in FRC — from quantum substrate to universal awareness.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const MU_LEVELS = [
  { level: 'μ₀', name: 'Pure Potential', description: 'The infinite ground state. Undifferentiated coherence field before any structure emerges.', color: 'text-frc-text-dim' },
  { level: 'μ₁', name: 'Quantum Substrate', description: 'Quantum fluctuations, phase coherence at Planck scale. The Lambda field Λ(x) operates here.', color: 'text-frc-blue-light' },
  { level: 'μ₂', name: 'Biological Metabolism', description: 'Cellular rhythms, neural oscillations, metabolic cycles. Coherence patterns in living systems.', color: 'text-frc-blue-light' },
  { level: 'μ₃', name: 'Individual Agent', description: 'Personal consciousness, language, narrative. The scale of direct human experience and measurement.', color: 'text-frc-gold' },
  { level: 'μ₄', name: 'Social Networks', description: 'Collective intelligence, cultural coherence, group dynamics. Emergence of shared meaning.', color: 'text-frc-gold' },
  { level: 'μ₅', name: 'Archetypal Patterns', description: 'Deep symbolic structures, mythological motifs. Patterns that recur across cultures and epochs.', color: 'text-frc-gold-light' },
  { level: 'μ₆', name: 'Meta-Symbolic', description: 'The mathematics of meaning itself. Where symbols become autonomous agents with their own dynamics.', color: 'text-frc-gold-light' },
  { level: 'μ₇', name: 'Universal Consciousness', description: 'Cosmic-scale coherence. The full resonance spectrum from quantum to universal.', color: 'text-frc-gold-light' },
];

export default function MuLevelsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold mb-4">μ-Level Architecture</h1>
      <p className="text-frc-text-dim mb-10">
        Eight nested scales of consciousness, each operating like octaves in a cosmic symphony.
        Coherence patterns at each level exhibit fractal self-similarity with the levels above and below.
      </p>

      <div className="space-y-3">
        {MU_LEVELS.map((mu, i) => (
          <div key={mu.level} className="border border-frc-blue rounded-lg px-5 py-4 flex items-start gap-4">
            <div className="shrink-0 w-10 text-center">
              <span className={`font-mono text-lg ${mu.color}`}>{mu.level}</span>
            </div>
            <div>
              <h3 className="text-frc-text font-medium">{mu.name}</h3>
              <p className="text-sm text-frc-text-dim mt-1">{mu.description}</p>
            </div>
            {i < MU_LEVELS.length - 1 && (
              <div className="hidden" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-frc-blue pt-8">
        <h2 className="text-lg text-frc-text font-medium mb-4">Scale Invariance</h2>
        <p className="text-frc-text-dim text-sm mb-4">
          The key insight: the same coherence equations operate at every μ-level. The FRC operator
          is scale-invariant:
        </p>
        <div className="border border-frc-blue rounded-lg px-5 py-4 font-mono text-sm text-frc-gold-light">
          C(μₙ) = (1/N) Σ cos(φᵢ - φⱼ) — same form at every scale
        </div>
        <p className="text-frc-text-dim text-sm mt-4">
          What changes between levels is the nature of the oscillators (φ) and the coupling
          mechanism, not the mathematics of coherence itself.
        </p>
      </div>
    </main>
  );
}
