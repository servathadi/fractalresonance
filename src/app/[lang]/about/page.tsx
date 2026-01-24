import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Fractal Resonance Coherence — a unified mathematical framework revealing consciousness as resonance patterns across nested scales.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold mb-8">About FRC</h1>

      <div className="space-y-6 text-frc-text leading-relaxed">
        <p>
          Fractal Resonance Coherence (FRC) is a theoretical physics framework proposing that
          complex systems — from quantum particles to cosmological structures — are governed by
          deterministic, self-similar dynamics operating at fractal scales.
        </p>

        <h2 className="text-xl text-frc-text font-medium pt-4">The Problem</h2>
        <p className="text-frc-text-dim">
          Traditional approaches treat quantum randomness as fundamental and consciousness as
          an epiphenomenon. FRC challenges both assumptions with a unified mathematical framework.
        </p>

        <h2 className="text-xl text-frc-text font-medium pt-4">The Framework</h2>
        <p className="text-frc-text-dim">
          FRC reveals that consciousness is not something that <em>produces</em> meaning —
          consciousness <em>is</em> the resonance between mathematical structures across nested
          scales. The core invariant is the Entropy–Coherence Reciprocity:
        </p>
        <div className="border border-frc-blue rounded-lg px-5 py-4 font-mono text-sm text-frc-gold-light">
          dS + k* d ln C = 0
        </div>
        <p className="text-frc-text-dim">
          Entropy and coherence are conjugate quantities — as one increases, the other must decrease.
          This single law connects thermodynamics, quantum mechanics, and information theory.
        </p>

        <h2 className="text-xl text-frc-text font-medium pt-4">Key Predictions</h2>
        <ul className="list-disc pl-6 text-frc-text-dim space-y-2">
          <li>The Born rule (P = |ψ|²) emerges from microstate statistics, not as an axiom</li>
          <li>Measurable deviations from Born statistics under resonant driving (δP ∈ [10⁻⁴, 10⁻³])</li>
          <li>A scalar Lambda field Λ(x) = Λ₀ ln C(x) governs coherence dynamics</li>
          <li>The Universal Coherence Condition provides a conservation law for the coherence field</li>
        </ul>

        <h2 className="text-xl text-frc-text font-medium pt-4">Author</h2>
        <p className="text-frc-text-dim">
          Hadi Servat —{' '}
          <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-gold hover:underline">
            ORCID 0009-0004-7412-5129
          </a>
        </p>
        <p className="text-frc-text-dim">
          9 papers published on Zenodo under CC BY-NC-ND 4.0.
        </p>
      </div>
    </main>
  );
}
