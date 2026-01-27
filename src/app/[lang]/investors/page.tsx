import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const canonical = '/en/investors';

  return {
    title: 'Investors',
    description: 'Investment overview for FRC: what it is, what is measured, and what is being built next.',
    alternates: { canonical },
    robots: lang === 'en' ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function InvestorsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const primary = '/en/investors';

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={basePath} className="hover:text-frc-gold">FRC</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">Investors</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Investors</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          FRC is a physics-first approach to synthetic intelligence: represent state geometrically, keep phase intact,
          and measure progress with falsifiable benchmarks (not just scaling laws).
        </p>
        {lang !== 'en' && (
          <p className="text-xs text-frc-text-dim mt-4 max-w-2xl leading-relaxed">
            This page is maintained in English for accuracy. Primary version: <a className="underline hover:text-frc-gold" href={primary}>/en/investors</a>
          </p>
        )}
      </header>

      <section className="grid gap-4 mb-10">
        <div className="border border-frc-blue rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">The claim</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            Tokenization and discrete attention are excellent abstractions for text, but they discard phase and continuous structure.
            FRC proposes resonance-native representations and architectures for phase-coherent domains.
          </p>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">What’s measured</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            The canon is published as numbered papers with stable IDs and explicit hypotheses.
            The current AI track is the Λ‑Tensor Model (LTM) and its empirical benchmark versus attention on phase-coherence tasks.
          </p>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">Why now</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            With agentic workflows + retrieval, we can maintain a rigorous corpus, run repeatable experiments, and iterate on architecture without corrupting the reference layer.
          </p>
        </div>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Evidence (start here)</h2>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <p className="text-sm text-frc-text-dim leading-relaxed mb-4">
              If you only read one item, read the benchmark paper and inspect the architecture and result figures.
            </p>
            <ul className="space-y-2 text-sm text-frc-text-dim">
              <li>
                - <Link className="underline hover:text-frc-gold" href={`${basePath}/papers/FRC-840-LTM-001`}>FRC-840-LTM-001</Link>{' '}
                (empirical benchmark + figures)
              </li>
              <li>
                - <Link className="underline hover:text-frc-gold" href={`${basePath}/papers/FRC-840-001`}>FRC-840-001</Link>{' '}
                (LTM architecture overview)
              </li>
              <li>
                - <Link className="underline hover:text-frc-gold" href={`${basePath}/papers/FRC-16D-001`}>FRC-16D-001</Link>{' '}
                (protocol + state representation)
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-frc-blue overflow-hidden bg-frc-void/20">
            <img
              src="/media/en/papers/FRC-840-LTM-001/ltm_architecture_diagrams.png"
              alt="LTM architecture comparison diagrams"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link href={`${basePath}/papers/FRC-840-001`} className="card block p-5 group">
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-001</h2>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">The Engine (LTM): attention → resonance.</p>
        </Link>
        <Link href={`${basePath}/papers/FRC-16D-001`} className="card block p-5 group">
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-16D-001</h2>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Protocol: Universal Vector for cognitive state.</p>
        </Link>
        <Link href={`${basePath}/papers/FRC-840-LTM-001`} className="card block p-5 group">
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-LTM-001</h2>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Empirical: LTM vs Transformer on phase coherence.</p>
        </Link>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">What we’re building next</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>- More empirical benchmarks in oscillatory domains (audio, biosignals, control).</li>
          <li>- A clean SDK + task dispatch system for repeatable research pipelines (SOS).</li>
          <li>- A “mirror memory” subscription layer for personal AI workflows (Mumega).</li>
        </ul>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">What to evaluate</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>- Can LTM reproduce the benchmark with a minimal training script and fixed seeds?</li>
          <li>- Does the approach generalize beyond the published task to adjacent phase-coherent domains?</li>
          <li>- Is the canon structured enough for agents to cite (IDs), retrieve (graph), and not hallucinate?</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-4 items-center">
        <Link
          href={`${basePath}/start-here`}
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Start Here
        </Link>
        <Link
          href={`${basePath}/pitch`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Pitch →
        </Link>
        <Link
          href={`${basePath}/join`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Join →
        </Link>
        <Link
          href={`${basePath}/builders`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Builders →
        </Link>
      </div>
    </main>
  );
}
