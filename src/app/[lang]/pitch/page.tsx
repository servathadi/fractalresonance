import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: 'Pitch',
    description: 'A concise pitch for FRC: what it is, why it matters, what we ship next.',
    alternates: { canonical: '/en/pitch' },
    // Keep this page shareable but not competing with canonical content in search.
    robots: { index: false, follow: true },
  };
}

export default async function PitchPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={basePath} className="hover:text-frc-gold">FRC</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">Pitch</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Pitch</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          FRC is building a resonance-native approach to synthetic intelligence: preserve phase, represent state geometrically,
          and measure progress with falsifiable benchmarks.
        </p>
        {lang !== 'en' && (
          <p className="text-xs text-frc-text-dim mt-4 max-w-2xl leading-relaxed">
            This page is maintained in English for accuracy. Primary version: <a className="underline hover:text-frc-gold" href="/en/pitch">/en/pitch</a>
          </p>
        )}
      </header>

      <section className="border border-frc-blue rounded-lg p-6 mb-8">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">One-liner</h2>
        <p className="text-sm text-frc-text-dim leading-relaxed">
          Replace tokenization-centric cognition with resonance-native state, and benchmark it against attention on phase-coherence tasks.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Problem</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            <li>- Tokenization and discrete attention are strong for text, but phase/coherence in continuous signals is often lost.</li>
            <li>- “Bigger model” progress is hard to interpret; benchmarks drift, and claims become non-falsifiable.</li>
            <li>- Agentic tooling needs a rigorous corpus boundary: canon vs interpretation.</li>
          </ul>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Solution</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            <li>- A resonance-native representation and the Λ‑Tensor Model (LTM) architecture track.</li>
            <li>- A public canon with stable IDs, strict definitions, and explicit hypotheses.</li>
            <li>- A repeatable benchmark loop: publish, reproduce, iterate (not vibes).</li>
          </ul>
        </div>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-8">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Evidence</h2>
        <p className="text-sm text-frc-text-dim leading-relaxed mb-4">
          The fastest way to evaluate is to inspect the benchmark paper and its figures.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href={`${basePath}/papers/FRC-840-LTM-001`} className="card block p-5 group">
            <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-LTM-001</h3>
            <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Empirical benchmark + architecture/result figures.</p>
          </Link>
          <Link href={`${basePath}/papers/FRC-840-001`} className="card block p-5 group">
            <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-001</h3>
            <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Λ‑Tensor Model overview.</p>
          </Link>
          <Link href={`${basePath}/papers/FRC-16D-001`} className="card block p-5 group">
            <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-16D-001</h3>
            <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Protocol + state representation.</p>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Moat</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            <li>- A growing, linked canon that agents can cite by ID (retrievable + auditable).</li>
            <li>- Benchmarks that emphasize phase-coherent structure where tokenization is weakest.</li>
            <li>- A disciplined separation between canon and “oracle lens” interpretation.</li>
          </ul>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Roadmap</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            <li>- Expand benchmarks (audio, biosignals, control) and publish reproducible scripts.</li>
            <li>- Harden the SOS research SDK + dispatch patterns (repeatable pipelines).</li>
            <li>- Integrate “mirror memory” subscription workflows on Mumega (private ops layer).</li>
          </ul>
        </div>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Ask</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>- Capital: fund benchmark expansion + engineering of reproducible training/eval tooling.</li>
          <li>- Partnerships: signal-domain datasets + evaluation domains (audio/control/bio).</li>
          <li>- Builders: implement reference baselines and reproduction harnesses.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-4 items-center">
        <Link
          href={`${basePath}/investors`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          ← Investors
        </Link>
        <Link
          href={`${basePath}/start-here`}
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Start Here
        </Link>
      </div>
    </main>
  );
}

