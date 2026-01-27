import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const canonical = '/en/builders';

  return {
    title: 'Builders',
    description: 'Builder notes for FRC: architecture, corpus contract, and reproducible paths into the canon.',
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

export default async function BuildersPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const mumega = 'https://mumega.com';
  const primary = '/en/builders';
  const repo = 'https://github.com/servathadi/fractalresonance';

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={basePath} className="hover:text-frc-gold">FRC</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">Builders</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Builders</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          FRC is designed as a corpus with stable IDs, tight definitions, and a clear separation between canon and interpretation.
          This page explains the contract so tools and agents can operate without corrupting the canon.
        </p>
        {lang !== 'en' && (
          <p className="text-xs text-frc-text-dim mt-4 max-w-2xl leading-relaxed">
            This page is maintained in English for accuracy. Primary version: <a className="underline hover:text-frc-gold" href={primary}>/en/builders</a>
          </p>
        )}
      </header>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">The contract</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>- Canon lives in Papers/Topics with stable IDs (e.g., <span className="font-mono">FRC-840-001</span>).</li>
          <li>- Interpretation is an opt-in lens (Oracle) that must cite canon IDs and never overwrite definitions.</li>
          <li>- Modes are UI-level (formal/interpretation/both); URLs remain canonical for citation.</li>
          <li>- Every claim should map to a falsifiable statement or a clearly labeled hypothesis.</li>
        </ul>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link href={`${basePath}/start-here`} className="card block p-5 group">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">Start Here</h3>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Canon → protocol → empirical benchmark.</p>
        </Link>
        <Link href={`${basePath}/graph`} className="card block p-5 group">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">Graph</h3>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">IDs + links as a navigable knowledge graph.</p>
        </Link>
        <Link href={`${basePath}/topics`} className="card block p-5 group">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">Topics</h3>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Question/answer format with prerequisites and citations.</p>
        </Link>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Implementation notes</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>- Public site: static export, designed for discoverability and citation.</li>
          <li>- Runtime (SDK / agents / memory) belongs on Mumega/SOS; this site is the public reference layer.</li>
          <li>- If you’re building tooling, treat IDs as primary keys and keep a strict write boundary for canon.</li>
        </ul>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Local workflow</h2>
        <div className="text-sm text-frc-text-dim leading-relaxed space-y-3">
          <p>
            Source lives on GitHub. For issues/PRs, treat content IDs as immutable and keep changes minimal and reproducible.
          </p>
          <p className="font-mono text-xs bg-frc-void/40 border border-frc-blue rounded-md p-3 overflow-x-auto">
            git clone {repo}
            <br />
            cd frc
            <br />
            npm i
            <br />
            npm run dev
            <br />
            npm run build
          </p>
          <p className="text-xs text-frc-text-dim">
            Tip: run <span className="font-mono">npm run content:audit</span> before committing content edits.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-4 items-center">
        <a
          href={`${mumega}/join?product=frc&lens=architect&lang=${encodeURIComponent(lang)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Join (Architect)
        </a>
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          GitHub →
        </a>
        <Link
          href={`${basePath}/investors`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Investors →
        </Link>
      </div>
    </main>
  );
}
