'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { canonicalizeTaxon, getTaxonomyLabel } from '@/lib/taxonomy';

export interface ArticlesGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  category: string;
  tags: string[];
  readTime: string;
  ordinal: number;
}

const DICT: Record<string, { allArticles: string; allTags: string; search: string; showing: string; of: string; noResults: string; all: string }> = {
  en: { allArticles: 'All Articles', allTags: 'All tags', search: 'Search by title, id, or abstract…', showing: 'Showing', of: 'of', noResults: 'No results. Try a different keyword or category.', all: 'All' },
  fa: { allArticles: 'تمام مقالات', allTags: 'تمام برچسب‌ها', search: 'جستجو بر اساس عنوان، شناسه یا چکیده...', showing: 'نمایش', of: 'از', noResults: 'نتیجه‌ای یافت نشد. کلمه کلیدی یا دسته‌بندی دیگری را امتحان کنید.', all: 'همه' },
  es: { allArticles: 'Todos los Artículos', allTags: 'Todas las etiquetas', search: 'Buscar por título, id o resumen...', showing: 'Mostrando', of: 'de', noResults: 'Sin resultados. Intenta con otra palabra clave o categoría.', all: 'Todo' },
  fr: { allArticles: 'Tous les Articles', allTags: 'Toutes les étiquettes', search: 'Rechercher par titre, id ou résumé...', showing: 'Affichage de', of: 'sur', noResults: 'Aucun résultat. Essayez un autre mot-clé ou une autre catégorie.', all: 'Tout' },
};

export function ArticlesGridClient({ items, lang = 'en' }: { items: ArticlesGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const t = DICT[lang] || DICT['en'];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || t.all;
  const tag = searchParams?.get('tag') ? canonicalizeTaxon(searchParams.get('tag') || '') : t.all;
  const filterHref = (changes: { category?: string; tag?: string }) => {
    const next = new URLSearchParams(searchParams?.toString() || '');
    const nextCategory = changes.category === undefined ? category : changes.category;
    const nextTag = changes.tag === undefined ? tag : changes.tag;
    if (nextCategory === t.all) next.delete('category'); else next.set('category', nextCategory);
    if (nextTag === t.all) next.delete('tag'); else next.set('tag', nextTag);
    const queryString = next.toString();
    const currentPath = pathname || `/${lang}/articles`;
    return queryString ? `${currentPath}?${queryString}` : currentPath;
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category))).sort((a, b) => a.localeCompare(b));
    return [t.all, ...cats];
  }, [items, t.all]);

  const tags = useMemo(() => {
    const tagSet = Array.from(new Set(items.flatMap((item) => item.tags || []).map(canonicalizeTaxon))).sort((a, b) => a.localeCompare(b));
    return [t.all, ...tagSet];
  }, [items, t.all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (category !== t.all && i.category !== category) return false;
      if (tag !== t.all && !(i.tags || []).map(canonicalizeTaxon).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${i.abstract || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, category, t.all]);

  return (
    <section>
      <div className="section-marker mb-8" data-section="§03">
        <span className="font-mono text-[0.72rem] text-frc-steel uppercase tracking-widest">{t.allArticles}</span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search articles"
          />
          <div className="text-xs text-frc-text-dim">
            {t.showing} <span className="text-frc-text">{filtered.length}</span> {t.of}{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={filterHref({ category: c })}
              className={`text-[0.72rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                category === c
                  ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                  : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 18).map((taxon) => (
              <Link
                key={taxon}
                href={filterHref({ tag: taxon })}
                className={`text-[0.72rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                  tag === taxon
                    ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                    : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
                }`}
              >
                {taxon === t.all ? t.allTags : getTaxonomyLabel(taxon, lang)}
              </Link>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          {t.noResults}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="card block p-6 group"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-frc-steel shrink-0 mt-1 tabular-nums">
                  {String(item.ordinal).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <EpistemicBadge status="commentary" lang={lang} />
                    <span className="tag">{item.category}</span>
                    <span className="text-[0.7rem] text-frc-steel">{item.readTime}</span>
                  </div>
                  <h3 className="text-sm text-frc-text group-hover:text-frc-gold transition-colors font-medium leading-snug mb-2">
                    {item.title}
                  </h3>
                  {item.abstract && (
                    <p className="text-xs text-frc-text-dim leading-relaxed line-clamp-2">
                      {item.abstract}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-[0.7rem] text-frc-steel">
                    <span className="font-mono">{item.id}</span>
                    {item.date && <span>{item.date}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
