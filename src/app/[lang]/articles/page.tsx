import Link from 'next/link';
import type { Metadata } from 'next';
import { getPapers, getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Research articles and publications on Fractal Resonance Coherence — exploring consciousness, entropy, and quantum foundations.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

// Article metadata beyond the raw papers
const ARTICLE_EXTRAS: Record<string, { category: string; readTime: string }> = {
  'FRC-566-001': { category: 'Foundation', readTime: '15 min' },
  'FRC-100-001': { category: 'Core Theory', readTime: '12 min' },
  'FRC-100-002': { category: 'Core Theory', readTime: '10 min' },
  'FRC-100-003': { category: 'Core Theory', readTime: '10 min' },
  'FRC-100-004': { category: 'Core Theory', readTime: '8 min' },
  'FRC-100-005': { category: 'Core Theory', readTime: '8 min' },
  'FRC-100-006': { category: 'Core Theory', readTime: '10 min' },
  'FRC-100-007': { category: 'Applications', readTime: '12 min' },
  'FRC-100-010': { category: 'Applications', readTime: '10 min' },
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { lang } = await params;
  const papers = getPapers(lang);

  // Sort papers by date descending (most recent first)
  const sortedPapers = [...papers].sort((a, b) => {
    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Articles</h1>
        <p className="text-frc-text-dim max-w-2xl">
          Research publications exploring the Fractal Resonance Coherence framework.
          Each article presents a component of the unified theory connecting quantum mechanics,
          thermodynamics, and consciousness.
        </p>
      </header>

      {/* Featured: Video Introduction */}
      <section className="mb-12 border border-frc-blue p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-frc-gold uppercase tracking-wider font-medium">Featured</span>
          <span className="text-xs text-frc-steel">Video</span>
        </div>
        <h2 className="text-lg text-frc-text font-medium mb-3">Introduction to FRC</h2>
        <div className="relative w-full aspect-video border border-frc-blue overflow-hidden mb-4">
          <iframe
            src="https://www.youtube.com/embed/acrYUKagkyM"
            title="FRC Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <p className="text-frc-text-dim text-sm">
          A comprehensive video introduction to the Fractal Resonance Coherence framework,
          covering the core concepts of entropy-coherence reciprocity, the Lambda field,
          and multi-scale consciousness.
        </p>
      </section>

      {/* Articles List */}
      <section>
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-6">Published Research</h2>
        <div className="space-y-6">
          {sortedPapers.map(paper => {
            const fm = paper.frontmatter;
            const extras = ARTICLE_EXTRAS[fm.id] || { category: 'Research', readTime: '10 min' };
            return (
              <article key={fm.id} className="border border-frc-blue p-5 hover:border-frc-gold-light transition-colors group">
                <Link href={`/${lang}/papers/${fm.id}`} className="block">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-frc-gold uppercase tracking-wider">{extras.category}</span>
                    <span className="text-xs text-frc-steel">{extras.readTime} read</span>
                    <span className="text-xs text-frc-steel ml-auto">{fm.date}</span>
                  </div>
                  <h3 className="text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-2">
                    {fm.title}
                  </h3>
                  {fm.abstract && (
                    <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">
                      {fm.abstract}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-frc-steel">
                    <span className="font-mono">{fm.id}</span>
                    <span className="text-frc-text-dim group-hover:text-frc-gold transition-colors">
                      Read article &rarr;
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="mt-12 border-t border-frc-blue pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-frc-text text-sm font-medium">All papers on Zenodo</p>
            <p className="text-frc-text-dim text-xs mt-1">9 papers published with DOI under CC BY-NC-ND 4.0</p>
          </div>
          <a
            href="https://zenodo.org/communities/frc"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-frc-blue hover:border-frc-gold text-frc-text-dim hover:text-frc-gold text-sm transition-colors"
          >
            View on Zenodo &rarr;
          </a>
        </div>
      </section>
    </main>
  );
}
