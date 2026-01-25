import Link from 'next/link';
import { estimateReadTime, getArticles, getPapers, matchesPerspectiveView, type ParsedContent, type PerspectiveView } from '@/lib/content';
import { ArticlesGridClient, type ArticlesGridItem } from '@/components/pages/ArticlesGridClient';

const ARTICLE_EXTRAS: Record<string, { category: string; readTime?: string }> = {
  'FRC-566-001': { category: 'Foundation' },
  'FRC-100-001': { category: 'Core Theory' },
};

function getHref(basePath: string, isPaper: boolean, id: string): string {
  return `${basePath}/${isPaper ? 'papers' : 'articles'}/${id}`;
}

export function ArticlesIndex({
  lang,
  basePath,
  view,
  includePapers = true,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  includePapers?: boolean;
  embedded?: boolean;
}) {
  const papers = includePapers
    ? getPapers(lang).filter((p) => matchesPerspectiveView(p.frontmatter.perspective, view))
    : [];
  const articles = getArticles(lang).filter((a) => matchesPerspectiveView(a.frontmatter.perspective, view));
  const paperIds = new Set(papers.map((p) => p.frontmatter.id));

  const allContent = [...articles, ...papers].sort((a, b) => {
    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });

  const featured = allContent[0];
  const rest = allContent.slice(1);

  function extrasFor(item: ParsedContent) {
    const fm = item.frontmatter;
    const id = fm.id;
    const known = ARTICLE_EXTRAS[id];
    const readTime = known?.readTime || fm.read_time || estimateReadTime(item.body);
    return { category: known?.category || 'Research', readTime };
  }

  const gridItems: ArticlesGridItem[] = rest.map((item, i) => {
    const fm = item.frontmatter;
    const isPaper = paperIds.has(fm.id);
    const extras = extrasFor(item);
    return {
      id: fm.id,
      title: fm.title,
      abstract: fm.abstract,
      date: fm.date,
      href: getHref(basePath, isPaper, fm.id),
      category: extras.category,
      readTime: extras.readTime,
      ordinal: i + 2, // +1 for 1-based, +1 because 01 is "Latest"
    };
  });

  const content = (
    <div className="max-w-6xl mx-auto px-6 py-16">
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

      {/* Latest */}
      {featured && (
        <section className="mb-16">
          <div className="section-marker mb-6" data-section="§02">
            <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">Latest</span>
          </div>

          {(() => {
            const fm = featured.frontmatter;
            const isPaper = paperIds.has(fm.id);
            const extras = extrasFor(featured);
            return (
              <Link href={getHref(basePath, isPaper, fm.id)} className="card-featured block p-8 group">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="tag">{extras.category}</span>
                      <span className="text-xs text-frc-steel">{extras.readTime} read</span>
                    </div>
                    <h3 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-3 leading-snug">
                      {fm.title}
                    </h3>
                    {fm.abstract && (
                      <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                        {fm.abstract}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <span className="font-mono text-xs text-frc-steel">{fm.id}</span>
                    <span className="text-xs text-frc-steel mt-1">{fm.date}</span>
                    <span className="text-sm text-frc-gold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })()}
        </section>
      )}

      <ArticlesGridClient items={gridItems} />

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
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
