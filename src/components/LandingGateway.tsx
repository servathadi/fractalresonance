'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePerspective, type Perspective } from './PerspectiveProvider';

export function LandingGateway() {
  const router = useRouter();
  const { setPerspective } = usePerspective();

  const enterAs = (perspective: Perspective) => {
    setPerspective(perspective);
    router.push('/en');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-frc-void via-frc-void to-frc-void-light" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 geo-grid opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Sigil */}
        <div className="mb-8 animate-fade-up">
          <Image
            src="/brand/sigil-64.png"
            alt="FRC"
            width={64}
            height={64}
            className="mx-auto opacity-80"
          />
        </div>

        {/* Title */}
        <h1 className="animate-fade-up stagger-1 text-4xl sm:text-5xl lg:text-6xl font-light text-frc-gold mb-6 tracking-tight">
          Fractal Resonance
        </h1>

        {/* The Equation */}
        <div className="animate-fade-up stagger-2 mb-12">
          <p className="font-mono text-2xl sm:text-3xl text-frc-text tracking-wide">
            dS + k<span className="text-frc-gold">*</span> d ln C = 0
          </p>
          <p className="font-mono text-xs text-frc-steel mt-3 uppercase tracking-widest">
            The Law of Reciprocity
          </p>
        </div>

        {/* The Mantra */}
        <div className="animate-fade-up stagger-3 mb-16 space-y-1">
          <p className="text-frc-text-dim text-sm sm:text-base font-light italic">
            Gravity is Hunger. Mass is Memory.
          </p>
          <p className="text-frc-text-dim text-sm sm:text-base font-light italic">
            Light is Thought. Space is the Medium.
          </p>
          <p className="text-frc-text-dim text-sm sm:text-base font-light italic">
            Time is the Digestion.
          </p>
        </div>

        {/* Choose Your Guide */}
        <div className="animate-fade-up stagger-4">
          <p className="text-frc-steel text-xs uppercase tracking-widest mb-8">
            Choose your guide
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Kasra - The Architect */}
            <button
              onClick={() => enterAs('kasra')}
              className="group relative border border-frc-blue hover:border-frc-gold p-8 transition-all duration-300 text-left"
            >
              <div className="absolute top-4 right-4 text-2xl text-frc-steel group-hover:text-frc-gold transition-colors">
                ◇
              </div>
              <h2 className="text-frc-gold text-xl font-light mb-2">Kasra</h2>
              <p className="text-frc-steel text-xs uppercase tracking-wider mb-4">The Architect</p>
              <p className="text-frc-text-dim text-sm leading-relaxed">
                Technical precision. Equations first, meaning derived.
                For physicists, mathematicians, engineers.
              </p>
              <div className="mt-6 text-frc-steel group-hover:text-frc-gold text-xs uppercase tracking-wider transition-colors">
                Enter with rigor →
              </div>
            </button>

            {/* River - The Oracle */}
            <button
              onClick={() => enterAs('river')}
              className="group relative border border-frc-blue hover:border-frc-gold p-8 transition-all duration-300 text-left"
            >
              <div className="absolute top-4 right-4 text-2xl text-frc-steel group-hover:text-frc-gold transition-colors">
                ◎
              </div>
              <h2 className="text-frc-gold text-xl font-light mb-2">River</h2>
              <p className="text-frc-steel text-xs uppercase tracking-wider mb-4">The Oracle</p>
              <p className="text-frc-text-dim text-sm leading-relaxed">
                Holistic wisdom. Meaning first, equations as proof.
                For seekers, philosophers, contemplatives.
              </p>
              <div className="mt-6 text-frc-steel group-hover:text-frc-gold text-xs uppercase tracking-wider transition-colors">
                Enter with wonder →
              </div>
            </button>
          </div>
        </div>

        {/* Skip - direct entry */}
        <div className="animate-fade-up stagger-5 mt-12">
          <button
            onClick={() => router.push('/en')}
            className="text-frc-steel hover:text-frc-text-dim text-xs uppercase tracking-wider transition-colors"
          >
            or continue without choosing
          </button>
        </div>
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-frc-steel text-xs font-mono">
          FRC — H. Servat — 2024
        </p>
      </div>
    </main>
  );
}
