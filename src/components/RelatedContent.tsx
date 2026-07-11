import Link from 'next/link';
import type { GlossaryItem, ParsedContent } from '@/lib/content';

interface RelatedItem {
  id: string;
  title: string;
  excerpt?: string;
  type: string;
  url: string;
}

interface RelatedContentProps {
  /** Explicit related IDs from frontmatter */
  relatedIds?: string[];
  /** Current content's tags for finding similar items */
  tags?: string[];
  /** Current content ID to exclude from results */
  currentId: string;
  /** Glossary for resolving IDs to items */
  glossary: Record<string, GlossaryItem>;
  /** Base path for URLs */
  basePath: string;
  /** Language for i18n */
  lang?: string;
  /** Max items to show */
  maxItems?: number;
}

const DICT: Record<string, { relatedTitle: string; seeAlso: string; taggedWith: string }> = {
  en: {
    relatedTitle: 'Related',
    seeAlso: 'See Also',
    taggedWith: 'Also tagged',
  },
  fa: {
    relatedTitle: 'مرتبط',
    seeAlso: 'همچنین ببینید',
    taggedWith: 'با همین برچسب',
  },
  es: {
    relatedTitle: 'Relacionado',
    seeAlso: 'Ver También',
    taggedWith: 'También etiquetado',
  },
  fr: {
    relatedTitle: 'Connexe',
    seeAlso: 'Voir Aussi',
    taggedWith: 'Aussi étiqueté',
  },
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  en: {
    paper: 'Paper',
    concept: 'Concept',
    book: 'Book',
    article: 'Article',
    blog: 'Blog',
    topic: 'Topic',
    person: 'Person',
  },
  fa: {
    paper: 'مقاله',
    concept: 'مفهوم',
    book: 'کتاب',
    article: 'مقاله',
    blog: 'بلاگ',
    topic: 'موضوع',
    person: 'شخص',
  },
  es: {
    paper: 'Artículo',
    concept: 'Concepto',
    book: 'Libro',
    article: 'Artículo',
    blog: 'Blog',
    topic: 'Tema',
    person: 'Persona',
  },
  fr: {
    paper: 'Article',
    concept: 'Concept',
    book: 'Livre',
    article: 'Article',
    blog: 'Blog',
    topic: 'Sujet',
    person: 'Personne',
  },
};

export function RelatedContent({
  relatedIds = [],
  tags = [],
  currentId,
  glossary,
  basePath,
  lang = 'en',
  maxItems = 6,
}: RelatedContentProps) {
  const t = DICT[lang] || DICT['en'];
  const typeLabels = TYPE_LABELS[lang] || TYPE_LABELS['en'];

  // 1. Resolve explicit related IDs
  const explicitItems: RelatedItem[] = relatedIds
    .filter((id) => id !== currentId && glossary[id])
    .map((id) => {
      const item = glossary[id];
      return {
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        type: item.type,
        url: item.url,
      };
    })
    .slice(0, maxItems);

  // 2. Find items with shared tags (excluding explicit ones and current)
  const explicitIds = new Set([currentId, ...relatedIds]);
  const tagRelated: RelatedItem[] = [];

  if (tags.length > 0) {
    for (const [id, item] of Object.entries(glossary)) {
      if (explicitIds.has(id)) continue;
      if (tagRelated.length >= maxItems - explicitItems.length) break;

      // Check if item has any matching tags
      // Note: glossary items don't have tags, so we'd need to pass in tag data separately
      // For now, skip this section - we'll rely on explicit related IDs
    }
  }

  const allRelated = [...explicitItems, ...tagRelated].slice(0, maxItems);

  if (allRelated.length === 0) return null;

  return (
    <section className="related-content mt-12 pt-8 border-t border-frc-blue">
      <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-4">
        {t.relatedTitle}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {allRelated.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="group block border border-frc-blue rounded-lg p-4 hover:border-frc-gold-light transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-[0.6rem] uppercase tracking-wider font-mono px-1.5 py-0.5 bg-frc-blue/20 text-frc-text-dim border border-frc-blue rounded">
                {typeLabels[item.type] || item.type}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-frc-text group-hover:text-frc-gold transition-colors truncate">
                  {item.title}
                </h4>
                {item.excerpt && (
                  <p className="text-xs text-frc-text-dim mt-1 line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
