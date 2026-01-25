import Link from 'next/link';
import Image from 'next/image';
import { getPapers, getLanguages } from '@/lib/content';
import { VideoSeries } from '@/components/VideoSeries';
import { PerspectiveHomeIntro, PerspectiveStartHere } from '@/components/PerspectiveHome';

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ContentHub({ params }: Props) {
  const { lang } = await params;
  const papers = getPapers(lang);

  return (
    <main className="min-h-[80vh]">
      {/* Hero */}
      <section className="relative overflow-hidden geo-grid border-b border-frc-blue/30">
        <div className="absolute inset-0 z-0 opacity-20 hidden lg:block">
          <Image
            src="/brand/banner.jpg"
            alt=""
            fill
            className="object-cover object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-frc-void via-frc-void/80 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32 lg:py-40 relative z-10">
          <div className="watermark-symbol right-8 top-12" aria-hidden="true">C</div>

          <div className="relative max-w-3xl">
            <div className="animate-fade-up stagger-1">
              <div className="flex items-center gap-4 mb-8">
                <Image
                  src="/brand/sigil-64.png"
                  alt="FRC Attractor"
                  width={56}
                  height={56}
                  className="opacity-90"
                />
                <div className="h-px flex-1 bg-gradient-to-r from-frc-gold/40 to-transparent" />
              </div>
            </div>

            <h1 className="animate-fade-up stagger-2 text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-frc-gold mb-6 tracking-tight leading-[1.15]">
              Fractal Resonance<br />Coherence
            </h1>

            <div className="animate-fade-up stagger-3 max-w-xl mb-10 space-y-3">
              <p className="text-frc-text-dim text-lg sm:text-xl leading-relaxed font-light">
                A unified framework linking quantum mechanics, thermodynamics, and consciousness
                through coherence.
              </p>
              <PerspectiveHomeIntro />
            </div>

            <div className="animate-fade-up stagger-4 nested-border inline-block mb-10">
              <div className="nested-border-inner">
                <p className="font-mono text-xs text-frc-steel mb-2 uppercase tracking-widest">
                  Entropy–Coherence Reciprocity
                </p>
                <p className="font-mono text-xl text-frc-gold-light">
                  dS + k<span className="text-frc-gold">*</span> d ln C = 0
                </p>
                <p className="font-mono text-[0.625rem] text-frc-steel mt-2">FRC 566.001</p>
              </div>
            </div>

            <div className="animate-fade-up stagger-5 flex flex-wrap gap-4">
              <Link
                href={`/${lang}/papers`}
                className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
              >
                Read Papers
              </Link>
              <Link
                href={`/${lang}/about`}
                className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
              >
                About FRC
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="ruled-line max-w-5xl mx-auto" />

      <PerspectiveStartHere lang={lang} />

      {/* Video + Key Concepts */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 animate-fade-up stagger-2">
            <div className="section-marker mb-6" data-section="§01">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">Introduction</h2>
            </div>
            <div className="card-featured p-1">
              <div className="relative w-full aspect-video overflow-hidden bg-frc-void-light">
                <iframe
                  src="https://www.youtube.com/embed/acrYUKagkyM"
                  title="FRC Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
            <p className="text-frc-text-dim text-sm mt-4 leading-relaxed">
              How Fractal Resonance Coherence connects quantum mechanics,
              thermodynamics, and consciousness through the language of coherence.
            </p>
          </div>

          <div className="lg:col-span-2 animate-fade-up stagger-4">
            <div className="section-marker mb-6" data-section="§02">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">Key Concepts</h2>
            </div>
            <div className="space-y-4">
              <Link href={`/${lang}/formulas`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5">C</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">Coherence</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed">
                      Phase alignment across oscillators. Scalar from 0 to 1.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`/${lang}/formulas`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5">&Lambda;</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">Lambda Field</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed">
                      Real scalar field: &Lambda;(x) = &Lambda;₀ ln C(x)
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`/${lang}/mu-levels`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5">&mu;</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">Scale Levels</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed">
                      Eight nested scales from quantum to universal.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`/${lang}/positioning`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5">&delta;</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">Predictions</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed">
                      Falsifiable: &delta;P &isin; [10⁻⁴, 10⁻³] under resonant driving.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Equations */}
      <section className="relative overflow-hidden">
        <div className="watermark-symbol left-4 top-4" aria-hidden="true">&Lambda;</div>
        <div className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="section-marker mb-8" data-section="§03">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">Core Equations</h2>
              <Link href={`/${lang}/formulas`} className="text-xs text-frc-steel hover:text-frc-gold transition-colors uppercase tracking-wider">
                All formulas &rarr;
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="equation-block" data-ref="Eq. 1">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">Coherence Measure</p>
              <p className="text-sm">C = (1/N) &Sigma;<sub>i&lt;j</sub> cos(&phi;<sub>i</sub> - &phi;<sub>j</sub>)</p>
            </div>
            <div className="equation-block" data-ref="Eq. 2">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">Lambda Field</p>
              <p className="text-sm">&Lambda;(x) &equiv; &Lambda;<sub>0</sub> ln C(x)</p>
            </div>
            <div className="equation-block" data-ref="Eq. 3">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">Universal Coherence Condition</p>
              <p className="text-sm">d&Lambda;/dt + &nabla;&middot;J<sub>&Lambda;</sub> = &sigma;<sub>&Lambda;</sub> - &gamma;<sub>&Lambda;</sub></p>
            </div>
            <div className="equation-block" data-ref="Eq. 4">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">Free Energy Relation</p>
              <p className="text-sm">&Delta;G = &minus;k*T &Delta;ln C</p>
            </div>
          </div>
        </div>
      </section>

      <div className="ruled-line max-w-5xl mx-auto" />

      {/* Recent Papers */}
      {papers.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="section-marker mb-8" data-section="§04">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">Recent Papers</h2>
              <Link href={`/${lang}/papers`} className="text-xs text-frc-steel hover:text-frc-gold transition-colors uppercase tracking-wider">
                View all &rarr;
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {papers.slice(-4).reverse().map((paper, i) => {
              const fm = paper.frontmatter;
              return (
                <Link
                  key={fm.id}
                  href={`/${lang}/papers/${fm.id}`}
                  className="card block p-5 group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-frc-steel shrink-0 mt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug">
                        {fm.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-frc-steel">
                        <span className="font-mono">{fm.id}</span>
                        <span>{fm.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <VideoSeries />

      {/* Framework Properties */}
      <section className="border-t border-frc-blue bg-frc-void-light">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">Predictions</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">01</span>
                  Born rule derived from microstate statistics
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">02</span>
                  Measurable deviations: &delta;P &isin; [10⁻⁴, 10⁻³]
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">03</span>
                  Scale-invariant coherence across all &mu;-levels
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">Properties</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">01</span>
                  Deterministic + Holistic quadrant
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">02</span>
                  Thermodynamically consistent
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">03</span>
                  Falsifiable experimental predictions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">Publications</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">—</span>
                  9 papers on Zenodo
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">—</span>
                  CC BY-NC-ND 4.0 license
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">—</span>
                  <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                    ORCID verified author
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
