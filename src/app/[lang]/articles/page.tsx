import Link from 'next/link';
import type { Metadata } from 'next';
import { getPapers, getArticles, getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Research articles and publications on Fractal Resonance Cognition — exploring consciousness, entropy, and quantum foundations.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const ARTICLE_EXTRAS: Record<string, { category: string; readTime: string }> = {
  'FRC-566-001': { category: 'Foundation', readTime: '15 min' },
  'FRC-100-001': { category: 'Core Theory', readTime: '12 min' },
  // ... (keep others)
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { lang } = await params;
  const papers = getPapers(lang);
  const articles = getArticles(lang);

  const allContent = [...articles, ...papers].sort((a, b) => {
    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });

  const featured = allContent[0];
  const rest = allContent.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-light text-frc-gold tracking-tight">Articles</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
        </div>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          Research publications exploring the Fractal Resonance Cognition framework.
          Each article presents a component of the unified theory connecting quantum mechanics,
          thermodynamics, and consciousness.
        </p>
      </header>

      {/* Featured: Video */}
      <section className="mb-20">
        <div className="section-marker mb-6" data-section="§01">
          <span className="font-mono text-[0.625rem] text-frc-gold uppercase tracking-widest">Featured</span>
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
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
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h2 className="text-xl text-frc-text font-medium mb-3 leading-snug">
              Introduction to Fractal Resonance Coherence
            </h2>
            <p className="text-frc-text-dim text-sm leading-relaxed mb-4">
              A comprehensive video introduction covering the core concepts of
              entropy-coherence reciprocity, the Lambda field, and multi-scale
              consciousness architecture.
            </p>
            <div className="flex items-center gap-3 text-xs text-frc-steel">
              <span className="font-mono">VIDEO</span>
              <span className="text-frc-blue">|</span>
              <span>Overview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Article — full width */}
      {featured && (
        <section className="mb-16">
          <div className="section-marker mb-6" data-section="§02">
            <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">Latest</span>
          </div>
          <Link href={`/${lang}/papers/${featured.frontmatter.id}`} className="card-featured block p-8 group">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="tag">{(ARTICLE_EXTRAS[featured.frontmatter.id] || { category: 'Research' }).category}</span>
                  <span className="text-xs text-frc-steel">{(ARTICLE_EXTRAS[featured.frontmatter.id] || { readTime: '10 min' }).readTime} read</span>
                </div>
                <h3 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-3 leading-snug">
                  {featured.frontmatter.title}
                </h3>
                {featured.frontmatter.abstract && (
                  <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                    {featured.frontmatter.abstract}
                  </p>
                )}
              </div>
              <div className="flex flex-col justify-end items-end">
                <span className="font-mono text-xs text-frc-steel">{featured.frontmatter.id}</span>
                <span className="text-xs text-frc-steel mt-1">{featured.frontmatter.date}</span>
                <span className="text-sm text-frc-gold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read &rarr;
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Articles Grid */}
      <section>
        <div className="section-marker mb-8" data-section="§03">
          <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">All Articles</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {rest.map((paper, i) => {
            const fm = paper.frontmatter;
            const extras = ARTICLE_EXTRAS[fm.id] || { category: 'Research', readTime: '10 min' };
            return (
              <Link
                key={fm.id}
                href={`/${lang}/papers/${fm.id}`}
                className="card block p-6 group"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-frc-steel shrink-0 mt-1 tabular-nums">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="tag">{extras.category}</span>
                      <span className="text-[0.625rem] text-frc-steel">{extras.readTime}</span>
                    </div>
                    <h3 className="text-sm text-frc-text group-hover:text-frc-gold transition-colors font-medium leading-snug mb-2">
                      {fm.title}
                    </h3>
                    {fm.abstract && (
                      <p className="text-xs text-frc-text-dim leading-relaxed line-clamp-2">
                        {fm.abstract}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-[0.625rem] text-frc-steel">
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

      {/* Zenodo CTA */}
      <div className="ruled-line" />
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-frc-text text-sm font-medium mb-1">Complete catalog on Zenodo</p>
          <p className="text-frc-text-dim text-xs">9 papers published with DOI under CC BY-NC-ND 4.0</p>
        </div>
        <a
          href="https://zenodo.org/communities/frc"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-frc-blue hover:border-frc-gold text-frc-text-dim hover:text-frc-gold text-xs uppercase tracking-wider transition-all"
        >
          View on Zenodo &rarr;
        </a>
      </section>
    </main>
  );
}
