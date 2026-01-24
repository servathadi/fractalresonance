import Link from 'next/link';
import Image from 'next/image';
import { getPapers } from '@/lib/content';

export default function Home() {
  const papers = getPapers('en');

  return (
    <main className="min-h-[80vh] flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-frc-blue/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28 flex flex-col items-center text-center relative">
          <Image
            src="/brand/logo.svg"
            alt="FRC Attractor"
            width={80}
            height={80}
            className="mb-8 opacity-90"
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-frc-gold mb-6 tracking-tight">
            Fractal Resonance Coherence
          </h1>
          <p className="text-frc-text-dim text-lg sm:text-xl max-w-2xl mb-8 leading-relaxed">
            A unified mathematical framework revealing consciousness as resonance patterns
            across nested scales — from quantum substrate to universal awareness.
          </p>
          <div className="inline-block border border-frc-blue rounded-lg px-8 py-5 font-mono text-base mb-10 bg-frc-void/50">
            <p className="text-frc-steel text-xs mb-2 font-sans uppercase tracking-wider">Entropy–Coherence Reciprocity</p>
            <p className="text-frc-gold-light text-lg">
              dS + k<span className="text-frc-gold">*</span> d ln C = 0
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/en/papers"
              className="px-6 py-3 bg-frc-gold/10 border border-frc-gold hover:bg-frc-gold/20 text-frc-gold text-sm font-medium transition-colors"
            >
              Read Papers
            </Link>
            <Link
              href="/en/about"
              className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm transition-colors"
            >
              About the Framework
            </Link>
          </div>
        </div>
      </section>

      {/* Video Introduction */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-16">
        <h2 className="text-lg text-frc-text font-medium mb-6">Video Introduction</h2>
        <div className="relative w-full aspect-video border border-frc-blue overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/acrYUKagkyM"
            title="FRC Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <p className="text-frc-text-dim text-sm mt-3">
          An overview of how the Fractal Resonance Coherence framework connects quantum mechanics,
          thermodynamics, and consciousness through the language of coherence.
        </p>
      </section>

      {/* Key Concepts */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-16">
        <h2 className="text-lg text-frc-text font-medium mb-6">Key Concepts</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="border border-frc-blue p-5 hover:border-frc-gold-light transition-colors group">
            <div className="text-frc-gold text-2xl font-mono mb-3">C</div>
            <h3 className="text-frc-text text-sm font-medium mb-2">Coherence</h3>
            <p className="text-frc-text-dim text-xs leading-relaxed">
              The order parameter measuring phase alignment across oscillators. A scalar from 0 (noise) to 1 (perfect sync).
            </p>
          </div>
          <div className="border border-frc-blue p-5 hover:border-frc-gold-light transition-colors group">
            <div className="text-frc-gold text-2xl font-mono mb-3">Λ</div>
            <h3 className="text-frc-text text-sm font-medium mb-2">Lambda Field</h3>
            <p className="text-frc-text-dim text-xs leading-relaxed">
              A real scalar field governing coherence dynamics. Λ(x) = Λ₀ ln C(x) — thermodynamically grounded.
            </p>
          </div>
          <div className="border border-frc-blue p-5 hover:border-frc-gold-light transition-colors group">
            <div className="text-frc-gold text-2xl font-mono mb-3">μ</div>
            <h3 className="text-frc-text text-sm font-medium mb-2">Scale Levels</h3>
            <p className="text-frc-text-dim text-xs leading-relaxed">
              Eight nested scales from quantum (μ₁) to universal (μ₇). The same equations operate at every level.
            </p>
          </div>
        </div>
      </section>

      {/* Core Equations */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg text-frc-text font-medium">Core Equations</h2>
          <Link href="/en/formulas" className="text-sm text-frc-text-dim hover:text-frc-gold transition-colors">
            All formulas &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-frc-blue p-5">
            <h3 className="text-xs text-frc-steel uppercase tracking-wider mb-3">Coherence Measure</h3>
            <p className="font-mono text-sm text-frc-gold-light">
              C = (1/N) &Sigma;<sub>i&lt;j</sub> cos(&phi;<sub>i</sub> - &phi;<sub>j</sub>)
            </p>
          </div>
          <div className="border border-frc-blue p-5">
            <h3 className="text-xs text-frc-steel uppercase tracking-wider mb-3">Lambda Field</h3>
            <p className="font-mono text-sm text-frc-gold-light">
              &Lambda;(x) &equiv; &Lambda;<sub>0</sub> ln C(x)
            </p>
          </div>
          <div className="border border-frc-blue p-5">
            <h3 className="text-xs text-frc-steel uppercase tracking-wider mb-3">Universal Coherence Condition</h3>
            <p className="font-mono text-sm text-frc-gold-light">
              d&Lambda;/dt + &nabla;&middot;J<sub>&Lambda;</sub> = &sigma;<sub>&Lambda;</sub> - &gamma;<sub>&Lambda;</sub>
            </p>
          </div>
          <div className="border border-frc-blue p-5">
            <h3 className="text-xs text-frc-steel uppercase tracking-wider mb-3">Free Energy Relation</h3>
            <p className="font-mono text-sm text-frc-gold-light">
              &Delta;G = &minus;k*T &Delta;ln C
            </p>
          </div>
        </div>
      </section>

      {/* Recent papers */}
      {papers.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg text-frc-text font-medium">Recent Papers</h2>
            <Link href="/en/papers" className="text-sm text-frc-text-dim hover:text-frc-gold transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-3">
            {papers.slice(-4).reverse().map(paper => {
              const fm = paper.frontmatter;
              return (
                <Link
                  key={fm.id}
                  href={`/en/papers/${fm.id}`}
                  className="block border border-frc-blue px-5 py-4 hover:border-frc-gold-light transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm">
                        {fm.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-frc-text-dim">
                        <span className="font-mono text-frc-steel">{fm.id}</span>
                        <span>{fm.date}</span>
                        {fm.doi && <span className="text-frc-blue-light">DOI</span>}
                      </div>
                    </div>
                    <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Framework summary */}
      <section className="border-t border-frc-blue">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-frc-gold text-sm font-medium uppercase tracking-wider mb-4">Predictions</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-2">
                  <span className="text-frc-gold shrink-0">—</span>
                  Born rule derived from microstate statistics
                </li>
                <li className="flex gap-2">
                  <span className="text-frc-gold shrink-0">—</span>
                  Measurable deviations: δP ∈ [10⁻⁴, 10⁻³]
                </li>
                <li className="flex gap-2">
                  <span className="text-frc-gold shrink-0">—</span>
                  Scale-invariant coherence across all μ-levels
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-frc-gold text-sm font-medium uppercase tracking-wider mb-4">Properties</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-2">
                  <span className="text-frc-gold shrink-0">—</span>
                  Deterministic + Holistic quadrant
                </li>
                <li className="flex gap-2">
                  <span className="text-frc-gold shrink-0">—</span>
                  Thermodynamically consistent
                </li>
                <li className="flex gap-2">
                  <span className="text-frc-gold shrink-0">—</span>
                  Falsifiable experimental predictions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
