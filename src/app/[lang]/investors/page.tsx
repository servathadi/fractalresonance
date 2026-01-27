import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Investors',
  description: 'Investment overview for FRC: what it is, what is measured, and what is being built next.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function InvestorsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

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
          FRC is a physics-first approach to synthetic intelligence: replace tokenization with resonance,
          represent state geometrically, and measure progress with falsifiable benchmarks.
        </p>
      </header>

      <section className="grid gap-4 mb-10">
        <div className="border border-frc-blue rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">The claim</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            Transformers are strong statistical sequence models, but tokenization discards phase and continuous structure.
            FRC proposes architectures and protocols built for phase-coherent, oscillatory domains.
          </p>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">What’s measured</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            The project publishes numbered papers with stable IDs and empirical comparisons where possible.
            The current AI track is the Λ‑Tensor Model (LTM) and its empirical benchmark vs attention.
          </p>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">Why now</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            Agentic workflows + retrieval make it feasible to maintain a rigorous, growing corpus and ship measurable architecture iterations quickly.
          </p>
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
          <li>- A clean SDK + task dispatch system for agentic research pipelines (SOS).</li>
          <li>- A “mirror memory” subscription layer for personal AI workflows (Mumega).</li>
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
          href={`${basePath}/builders`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Builders →
        </Link>
      </div>
    </main>
  );
}

