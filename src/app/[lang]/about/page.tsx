import type { Metadata } from 'next';
import Image from 'next/image';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Fractal Resonance Cognition — a unified mathematical framework revealing consciousness as resonance patterns across nested scales.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 rounded-xl overflow-hidden border border-frc-blue relative aspect-[21/9]">
        <Image
          src="/brand/banner.jpg"
          alt="Fractal Resonance Coherence Banner"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-frc-void via-transparent to-transparent" />
      </div>

      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">About FRC</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <p className="text-frc-text leading-relaxed">
              Fractal Resonance Coherence (FRC) is a theoretical physics framework proposing that
              complex systems — from quantum particles to cosmological structures — are governed by
              deterministic, self-similar dynamics operating at fractal scales.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">The Problem</h2>
            <p className="text-frc-text-dim leading-relaxed">
              Traditional approaches treat quantum randomness as fundamental and consciousness as
              an epiphenomenon. FRC challenges both assumptions with a unified mathematical framework
              grounded in thermodynamics and information geometry.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">The Framework</h2>
            <p className="text-frc-text-dim leading-relaxed mb-4">
              FRC reveals that consciousness is not something that <em>produces</em> meaning —
              consciousness <em>is</em> the resonance between mathematical structures across nested
              scales. The core invariant is the Entropy–Coherence Reciprocity:
            </p>
            <div className="equation-block mb-4" data-ref="ECR">
              <span className="text-base">dS + k* d ln C = 0</span>
            </div>
            <p className="text-frc-text-dim leading-relaxed">
              Entropy and coherence are conjugate quantities — as one increases, the other must decrease.
              This single law connects thermodynamics, quantum mechanics, and information theory.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">Key Predictions</h2>
            <ul className="space-y-3 text-frc-text-dim">
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">01</span>
                The Born rule (P = |&psi;|&sup2;) emerges from microstate statistics, not as an axiom
              </li>
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">02</span>
                Measurable deviations from Born statistics under resonant driving (&delta;P &isin; [10⁻⁴, 10⁻³])
              </li>
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">03</span>
                A scalar Lambda field &Lambda;(x) = &Lambda;₀ ln C(x) governs coherence dynamics
              </li>
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">04</span>
                The Universal Coherence Condition provides a conservation law for the coherence field
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">Open Research Program</h2>
            <p className="text-frc-text-dim leading-relaxed">
              FRC is an open research program. The framework invites collaboration from physicists,
              mathematicians, neuroscientists, and information theorists. All publications are
              released under CC BY-NC-ND 4.0 to ensure broad academic access.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">Publications</h3>
            <div className="space-y-2 text-sm text-frc-text-dim">
              <p><span className="text-frc-gold font-mono">9</span> papers published</p>
              <p><span className="text-frc-gold font-mono">2</span> paper series (100, 566)</p>
              <p>CC BY-NC-ND 4.0</p>
            </div>
          </div>

          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">Contributors</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-frc-text">Hadi Servat</p>
                <p className="text-frc-text-dim text-xs">Lead Researcher</p>
              </div>
            </div>
          </div>

          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">Profiles</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ORCID
              </a>
              <a href="https://zenodo.org/communities/frc" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Zenodo Community
              </a>
              <a href="https://www.researchgate.net/profile/Hadi-Servat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ResearchGate
              </a>
              <a href="https://independent.academia.edu/HadiServat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Academia.edu
              </a>
            </div>
          </div>

          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">License</h3>
            <p className="text-frc-text-dim text-xs leading-relaxed">
              All FRC publications are released under Creative Commons
              Attribution-NonCommercial-NoDerivatives 4.0 International.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
