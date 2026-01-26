import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getGlossary } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Start Here',
  description: 'A rigorous onboarding path into Fractal Resonance Cognition (FRC): canon → protocol → empirical results.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function StartHerePage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });

  const path = [
    {
      k: '01',
      id: 'FRC-840-001',
      title: 'The Engine (LTM)',
      desc: 'Replacing attention with resonance: the Λ‑Tensor Model.',
      href: `${basePath}/papers/FRC-840-001`,
    },
    {
      k: '02',
      id: 'FRC-16D-001',
      title: 'The Protocol (16D)',
      desc: 'Universal Vector: a file format for cognitive state.',
      href: `${basePath}/papers/FRC-16D-001`,
    },
    {
      k: '03',
      id: 'FRC-840-LTM-001',
      title: 'Empirical (LTM vs Attention)',
      desc: 'First benchmark on phase‑coherent sequence prediction.',
      href: `${basePath}/papers/FRC-840-LTM-001`,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={basePath} className="hover:text-frc-gold">FRC</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">Start Here</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Start Here</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          Canon first. Three documents to understand what FRC claims, how it represents state, and what has been measured so far.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-10">
        {path.map((it) => (
          <Link key={it.id} href={it.href} className="card block p-5 group">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-frc-gold shrink-0 mt-0.5 tabular-nums">{it.k}</span>
              <div className="min-w-0">
                <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug">
                  {it.title}
                </h2>
                <div className="text-[10px] text-frc-steel font-mono mt-2">{it.id}</div>
                <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">What we’re building now</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>Agentic research + ops tooling (SDK/CLI) to maintain a rigorous, growing corpus.</li>
          <li>Architecture benchmarks in oscillatory / phase‑coherent domains where attention is the wrong inductive bias.</li>
          <li>Canonical library with stable IDs (e.g., FRC series) designed for retrieval and citation.</li>
        </ul>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <Link href={`${basePath}/positioning`} className="card block p-5 group">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">Positioning</h3>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">How FRC differs from Copenhagen, Bohm, Many‑Worlds, IIT, etc.</p>
        </Link>
        <Link href={`${basePath}/graph`} className="card block p-5 group">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">Knowledge Graph</h3>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Explore the corpus as a link graph (IDs, prerequisites, backlinks).</p>
        </Link>
        <Link href={`${basePath}/papers`} className="card block p-5 group">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">Papers</h3>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Browse the published canon and DOI links.</p>
        </Link>
      </section>

      <div className="mt-10 border border-frc-blue rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">Updates</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            Choose a lens (Architect / Oracle) and get the latest canon, topics, and benchmarks.
          </p>
        </div>
        <Link
          href={`${basePath}/join`}
          className="px-6 py-3 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Join
        </Link>
      </div>

      {/* Keep the glossary referenced so the compiler doesn’t tree-shake it oddly in edge cases. */}
      <span className="sr-only" aria-hidden="true">{Object.keys(glossary).length}</span>
    </main>
  );
}
