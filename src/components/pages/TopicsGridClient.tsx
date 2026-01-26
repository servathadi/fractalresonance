'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface TopicsGridItem {
  id: string;
  title: string;
  question?: string;
  shortAnswer?: string;
  abstract?: string;
  date?: string;
  href: string;
  tags: string[];
  answersCount?: number;
}

const DICT: Record<string, { search: string; showing: string; of: string; allTags: string; noResults: string; all: string; answersSuffix: string }> = {
  en: { search: 'Search topics…', showing: 'Showing', of: 'of', allTags: 'All tags', noResults: 'No results. Try a different keyword or tag.', all: 'All', answersSuffix: 'answers' },
  fa: { search: 'جستجوی موضوعات...', showing: 'نمایش', of: 'از', allTags: 'تمام برچسب‌ها', noResults: 'نتیجه‌ای یافت نشد. کلمه کلیدی یا برچسب دیگری را امتحان کنید.', all: 'همه', answersSuffix: 'پاسخ' },
  es: { search: 'Buscar temas...', showing: 'Mostrando', of: 'de', allTags: 'Todas las etiquetas', noResults: 'Sin resultados. Intenta con otra palabra clave o etiqueta.', all: 'Todo', answersSuffix: 'respuestas' },
  fr: { search: 'Rechercher des sujets...', showing: 'Affichage de', of: 'sur', allTags: 'Toutes les étiquettes', noResults: 'Aucun résultat. Essayez un autre mot-clé ou une autre étiquette.', all: 'Tout', answersSuffix: 'réponses' },
};

export function TopicsGridClient({ items, lang = 'en' }: { items: TopicsGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const t = DICT[lang] || DICT['en'];
  const [tag, setTag] = useState<string>(t.all);

  const tags = useMemo(() => {
    const tgs = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b));
    return [t.all, ...tgs];
  }, [items, t.all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (tag !== t.all && !(i.tags || []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${(i.question || '')} ${(i.shortAnswer || i.abstract || '')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, tag, t.all]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search topics"
          />
          <div className="text-xs text-frc-text-dim">
            {t.showing} <span className="text-frc-text">{filtered.length}</span> {t.of}{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
        </div>

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 18).map((tagName) => (
              <button
                key={tagName}
                type="button"
                onClick={() => setTag(tagName)}
                className={`text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                  tag === tagName
                    ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                    : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
                }`}
              >
                {tagName === t.all ? t.allTags : tagName}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          {t.noResults}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block border border-frc-blue rounded-lg px-5 py-4 hover:border-frc-gold-light transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-frc-text group-hover:text-frc-gold transition-colors font-normal truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-frc-text-dim">
                    {item.date && <span>{item.date}</span>}
                    {typeof item.answersCount === 'number' && (
                      <span className="font-mono">{item.answersCount} {t.answersSuffix}</span>
                    )}
                  </div>
                  {(item.shortAnswer || item.abstract) && (
                    <p className="text-sm text-frc-text-dim mt-2 line-clamp-2">
                      {item.shortAnswer || item.abstract}
                    </p>
                  )}
                </div>
                <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
