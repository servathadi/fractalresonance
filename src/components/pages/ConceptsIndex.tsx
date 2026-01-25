import { getConcepts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { ConceptsGridClient, type ConceptsGridItem } from '@/components/pages/ConceptsGridClient';

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

  const items: ConceptsGridItem[] = concepts.map((c) => {
    const fm = c.frontmatter;
    const excerpt = c.body
      .split('\n\n')
      .find(p => p && !p.startsWith('#') && !p.startsWith('---'))
      ?.replace(/\[\[|\]\]/g, '')
      .slice(0, 180) || '';
    return {
      id: fm.id,
      title: fm.title,
      excerpt,
      href: `${basePath}/concepts/${fm.id}`,
      tags: fm.tags || [],
    };
  });

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
        <ConceptsGridClient items={items} />
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
