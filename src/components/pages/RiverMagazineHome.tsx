import Link from 'next/link';
import { estimateReadTime, getArticles, matchesPerspectiveView, type ParsedContent } from '@/lib/content';

function excerptOf(item: ParsedContent): string {
  const fm = item.frontmatter;
  if (fm.tldr) return fm.tldr;
  if (fm.abstract) return fm.abstract;
  return (
    item.body
      .split('\n\n')
      .find(p => p && !p.startsWith('#') && !p.startsWith('---'))
      ?.replace(/\[\[|\]\]/g, '')
      .slice(0, 180) || ''
  );
}

export function RiverMagazineHome({ lang }: { lang: string }) {
  const basePath = `/${lang}/river`;
  const kasraBase = `/${lang}`;
  const pinned = [
    {
      id: 'river-welcome',
      title: 'River Digest: How To Read FRC',
      href: `${basePath}/articles/river-welcome`,
    },
    {
      id: 'gemini-deep-research-frc-2026-01-25',
      title: 'Gemini Deep Research on FRC (Jan 25, 2026)',
      href: `${basePath}/articles/gemini-deep-research-frc-2026-01-25`,
    },
  ];

  const riverArticles = getArticles(lang)
    .filter((a) => matchesPerspectiveView(a.frontmatter.perspective, 'river'))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const latest = riverArticles.slice(0, 10);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-light text-frc-gold tracking-tight">River Digest</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
        </div>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          A magazine-style layer: short, digestible entries that point into the technical library when you want rigor.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`${basePath}/articles`}
            className="px-5 py-2 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-xs uppercase tracking-wider transition-colors"
          >
            Browse digests
          </Link>
          <Link
            href={`${kasraBase}/papers`}
            className="px-5 py-2 border border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold text-xs uppercase tracking-wider transition-colors"
          >
            Open Kasra library
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <div className="section-marker mb-6" data-section="§00">
          <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">Pinned</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {pinned.map((p) => (
            <Link key={p.id} href={p.href} className="card block p-6 group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg text-frc-text group-hover:text-frc-gold transition-colors font-medium leading-snug">
                    {p.title}
                  </h2>
                  <p className="text-xs text-frc-text-dim mt-2">
                    Curated entry point for River.
                  </p>
                </div>
                <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {latest.length === 0 ? (
        <section className="border border-frc-blue rounded-lg p-6">
          <p className="text-frc-text-dim text-sm">
            No River digests yet. Create one by ingesting a chat with `--perspective river`.
          </p>
          <pre className="mt-4 text-xs overflow-auto bg-frc-void-light border border-frc-blue/50 p-4">
{`npm run content:ingest -- --file /path/to/chat.txt --type article --lang ${lang} --title "..." --perspective river
npm run content:process-inbox`}
          </pre>
        </section>
      ) : (
        <section>
          <div className="section-marker mb-8" data-section="§01">
            <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">Latest</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {latest.map((a) => {
              const fm = a.frontmatter;
              const readTime = fm.read_time || estimateReadTime(a.body);
              const ex = excerptOf(a);
              return (
                <Link
                  key={fm.id}
                  href={`${basePath}/articles/${fm.id}`}
                  className="card block p-6 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 text-xs text-frc-steel">
                      {fm.date && <span>{fm.date}</span>}
                      <span className="text-frc-blue">|</span>
                      <span className="font-mono">{readTime}</span>
                    </div>
                    <span className="font-mono text-xs text-frc-steel">{fm.id}</span>
                  </div>
                  <h2 className="text-lg text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-3 leading-snug">
                    {fm.title}
                  </h2>
                  {ex && (
                    <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                      {ex}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
