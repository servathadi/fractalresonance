import Link from 'next/link';
import { getConcepts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

export function ConceptsIndex({
  lang,
  basePath,
  view,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  embedded?: boolean;
}) {
  const concepts = getConcepts(lang).filter((c) => matchesPerspectiveView(c.frontmatter.perspective, view));

  const content = (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Concepts</h1>
        <p className="text-frc-text-dim">
          Short definitions and connective tissue between papers, books, and articles.
        </p>
      </header>

      {concepts.length === 0 ? (
        <div className="text-frc-text-dim text-sm border border-frc-blue rounded-lg p-6">
          No concepts published yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {concepts.map((c) => {
            const fm = c.frontmatter;
            const excerpt = c.body
              .split('\n\n')
              .find(p => p && !p.startsWith('#') && !p.startsWith('---'))
              ?.replace(/\[\[|\]\]/g, '')
              .slice(0, 180) || '';

            return (
              <Link
                key={fm.id}
                href={`${basePath}/concepts/${fm.id}`}
                className="card block p-6 group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <h2 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium">
                      {fm.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-xs text-frc-steel">
                      <span className="font-mono">{fm.id}</span>
                    </div>
                  </div>
                  <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">&rarr;</span>
                </div>
                {excerpt && (
                  <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                    {excerpt}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
