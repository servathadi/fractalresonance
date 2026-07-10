import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'builders');
  const canonical = '/en/builders';

  return {
    title: page?.frontmatter.title || 'Builders',
    description: page?.frontmatter.description || 'Builder notes for FRC.',
    alternates: { canonical },
    robots: { index: true, follow: true },
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
  const page = getSitePage(lang, 'builders');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const mumega = 'https://mumega.com';
  const repo = 'https://github.com/servathadi/fractalresonance';
  const primary = '/en/builders';
  
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);
  
  const fm = page.frontmatter as any;

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
        <span className="mx-2">/</span>
        <span className="text-frc-text">{fm.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{fm.title}</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          {fm.description}
        </p>
        {lang !== 'en' && (
          <p className="text-xs text-frc-text-dim mt-4 max-w-2xl leading-relaxed">
            This page is translated for accessibility. Primary version: <Link className="underline hover:text-frc-gold" href={primary}>/en/builders</Link>
          </p>
        )}
      </header>

      {fm.contract && (
        <section className="border border-frc-blue rounded-lg p-6 mb-10">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">The contract</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {fm.contract.map((line: string, i: number) => (
              <li key={i}>- {line}</li>
            ))}
          </ul>
        </section>
      )}

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

      {fm.implementation_notes && (
        <section className="border border-frc-blue rounded-lg p-6 mb-10">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Implementation notes</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {fm.implementation_notes.map((note: string, i: number) => (
              <li key={i}>- {note}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="prose prose-invert max-w-none mb-10">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
      </div>

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
