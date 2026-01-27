import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Builders',
  description: 'Builder notes for FRC: architecture, corpus contract, and reproducible paths into the canon.',
};

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

      <div className="flex flex-wrap gap-4 items-center">
        <a
          href={`${mumega}/join?product=frc&lens=architect&lang=${encodeURIComponent(lang)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Join (Architect)
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

