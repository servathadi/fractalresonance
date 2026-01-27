import { getConcepts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { ConceptsGridClient, type ConceptsGridItem } from '@/components/pages/ConceptsGridClient';

const DICT: Record<string, { title: string; desc: string; noConcepts: string }> = {
  en: { title: 'Concepts', desc: 'Short definitions and connective tissue between papers, books, and articles.', noConcepts: 'No concepts published yet.' },
  fa: { title: 'مفاهیم', desc: 'تعاریف کوتاه و بافت پیوندی بین مقالات، کتاب‌ها و نوشته‌ها.', noConcepts: 'هنوز مفهومی منتشر نشده است.' },
  es: { title: 'Conceptos', desc: 'Definiciones breves y tejido conectivo entre artículos, libros y escritos.', noConcepts: 'Aún no hay conceptos publicados.' },
  fr: { title: 'Concepts', desc: 'Courtes définitions et tissu conjonctif entre articles, livres et écrits.', noConcepts: 'Pas encore de concepts publiés.' },
};

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
      tags: Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === 'string') : [],
    };
  });

  const t = DICT[lang] || DICT['en'];

  const content = (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{t.title}</h1>
        <p className="text-frc-text-dim">
          {t.desc}
        </p>
      </header>

      {concepts.length === 0 ? (
        <div className="text-frc-text-dim text-sm border border-frc-blue rounded-lg p-6">
          {t.noConcepts}
        </div>
      ) : (
        <ConceptsGridClient items={items} lang={lang} />
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
