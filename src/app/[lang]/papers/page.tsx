import Link from 'next/link';
import type { Metadata } from 'next';
import { getPapers, getLanguages, type ParsedContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Papers',
  description: 'Published FRC research papers on Zenodo — fractal resonance, coherence dynamics, and quantum foundations.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

// Paper DOIs for Zenodo links
const PAPER_DOIS: Record<string, string> = {
  'FRC-100-001': '10.5281/zenodo.15073056',
  'FRC-100-002': '10.5281/zenodo.15079278',
  'FRC-100-003': '10.5281/zenodo.15079820',
  'FRC-100-004': '10.5281/zenodo.17438174',
  'FRC-100-005': '10.5281/zenodo.17438231',
  'FRC-100-006': '10.5281/zenodo.17438360',
  'FRC-100-007': '10.5281/zenodo.17968952',
  'FRC-100-010': '10.5281/zenodo.17982555',
  'FRC-566-001': '10.5281/zenodo.17437759',
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PapersPage({ params }: Props) {
  const { lang } = await params;
  const papers = getPapers(lang);

  // Group by series
  const series100 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-100'));
  const series566 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-566'));

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Papers</h1>
        <p className="text-frc-text-dim">
          Published research on the Fractal Resonance Cognition framework.
          All papers are available on{' '}
          <a href="https://zenodo.org" target="_blank" rel="noopener noreferrer" className="text-frc-gold hover:underline">
            Zenodo
          </a>{' '}
          under CC BY-NC-ND 4.0.
        </p>
      </header>

      {series100.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg text-frc-text font-medium mb-4 flex items-center gap-2">
            <span className="text-frc-gold font-mono text-sm">100</span>
            Core Theory
          </h2>
          <div className="space-y-4">
            {series100.map(paper => (
              <PaperCard key={paper.frontmatter.id} paper={paper} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {series566.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg text-frc-text font-medium mb-4 flex items-center gap-2">
            <span className="text-frc-gold font-mono text-sm">566</span>
            Reciprocity &amp; UCC
          </h2>
          <div className="space-y-4">
            {series566.map(paper => (
              <PaperCard key={paper.frontmatter.id} paper={paper} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Show all Zenodo papers even if not yet migrated to content */}
      <section className="mt-16 border-t border-frc-blue pt-8">
        <h2 className="text-lg text-frc-text font-medium mb-4">Full Catalog (Zenodo)</h2>
        <p className="text-frc-text-dim text-sm mb-6">
          All published papers with DOI links. Papers marked with a link icon have full text on this site.
        </p>
        <div className="space-y-3">
          {Object.entries(PAPER_DOIS).map(([id, doi]) => {
            const hasFull = papers.some(p => p.frontmatter.id === id);
            return (
              <div key={id} className="flex items-start gap-3 text-sm">
                <span className="font-mono text-frc-gold shrink-0">{id.replace('FRC-', '')}</span>
                <div className="flex-1 flex items-center gap-2">
                  {hasFull ? (
                    <Link href={`/${lang}/papers/${id}`} className="text-frc-text hover:text-frc-gold transition-colors">
                      {papers.find(p => p.frontmatter.id === id)?.frontmatter.title || id}
                    </Link>
                  ) : (
                    <span className="text-frc-text-dim">
                      {id}
                    </span>
                  )}
                  <a
                    href={`https://zenodo.org/doi/${doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-frc-steel hover:text-frc-gold transition-colors font-mono shrink-0"
                  >
                    DOI
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function PaperCard({ paper, lang }: { paper: ParsedContent; lang: string }) {
  const fm = paper.frontmatter;
  const id = fm.id;
  const doi = PAPER_DOIS[id];

  return (
    <Link
      href={`/${lang}/papers/${id}`}
      className="block border border-frc-blue rounded-lg px-5 py-4 hover:border-frc-gold-light transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-frc-text group-hover:text-frc-gold transition-colors font-normal truncate">
            {fm.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-frc-text-dim">
            <span>{fm.date}</span>
            {doi && (
              <span className="font-mono">DOI: {doi.split('/').pop()}</span>
            )}
          </div>
          {fm.abstract && (
            <p className="text-sm text-frc-text-dim mt-2 line-clamp-2">
              {fm.abstract}
            </p>
          )}
        </div>
        <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">
          &rarr;
        </span>
      </div>
    </Link>
  );
}
