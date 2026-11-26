'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { EdgeScopeBadge } from '@/components/EdgeScopeBadge';
import type { EdgeScopeTag } from '@/lib/content';
import { canonicalizeTaxon, getTaxonomyLabel } from '@/lib/taxonomy';

export interface ArticlesGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  category: string;
  scopeTag?: EdgeScopeTag;
  primarySourcesCount?: number;
  tags: string[];
  readTime: string;
  ordinal: number;
}

const DICT: Record<string, { allArticles: string; allScopes: string; allTags: string; search: string; showing: string; of: string; noResults: string; all: string }> = {
  en: { allArticles: 'All dispatches & articles', allScopes: 'All scopes', allTags: 'All tags', search: 'Filter by title, id, or abstract…', showing: 'Showing', of: 'of', noResults: 'No matching entries. Try another keyword or scope.', all: 'All' },
  fa: { allArticles: 'تمام مقالات و یادداشت‌ها', allScopes: 'همه دامنه‌ها', allTags: 'تمام برچسب‌ها', search: 'جستجو بر اساس عنوان، شناسه یا چکیده...', showing: 'نمایش', of: 'از', noResults: 'نتیجه‌ای یافت نشد.', all: 'همه' },
  es: { allArticles: 'Todos los artículos', allScopes: 'Todos los alcances', allTags: 'Todas las etiquetas', search: 'Filtrar por título, id o resumen...', showing: 'Mostrando', of: 'de', noResults: 'Sin resultados.', all: 'Todo' },
  fr: { allArticles: 'Tous les articles', allScopes: 'Toutes les portées', allTags: 'Toutes les étiquettes', search: 'Filtrer par titre, id ou résumé...', showing: 'Affichage de', of: 'sur', noResults: 'Aucun résultat.', all: 'Tout' },
};

export function ArticlesGridClient({ items, lang = 'en' }: { items: ArticlesGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const t = DICT[lang] || DICT.en;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scope = searchParams?.get('scope') || t.all;
  const tag = searchParams?.get('tag') ? canonicalizeTaxon(searchParams.get('tag') || '') : t.all;

  const filterHref = (changes: { scope?: string; tag?: string }) => {
    const next = new URLSearchParams(searchParams?.toString() || '');
    const nextScope = changes.scope === undefined ? scope : changes.scope;
    const nextTag = changes.tag === undefined ? tag : changes.tag;
    if (nextScope === t.all) next.delete('scope'); else next.set('scope', nextScope);
    if (nextTag === t.all) next.delete('tag'); else next.set('tag', nextTag);
    const queryString = next.toString();
    const currentPath = pathname || `/${lang}/articles`;
    return queryString ? `${currentPath}?${queryString}` : currentPath;
  };

  const scopes = useMemo(() => {
    const uniq = Array.from(new Set(items.map((i) => i.scopeTag).filter((s): s is EdgeScopeTag => Boolean(s))));
    return uniq.length > 0 ? [t.all, ...uniq] : [];
  }, [items, t.all]);

  const tags = useMemo(() => {
    const tagSet = Array.from(new Set(items.flatMap((item) => item.tags || []).map(canonicalizeTaxon))).sort((a, b) => a.localeCompare(b));
    return [t.all, ...tagSet];
  }, [items, t.all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (scope !== t.all && i.scopeTag !== scope) return false;
      if (tag !== t.all && !(i.tags || []).map(canonicalizeTaxon).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${i.abstract || ''} ${i.scopeTag || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, scope, tag, t.all]);

  return (
    <section className="border-t border-frc-blue pt-8">
      <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-6">{t.allArticles}</h2>

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue px-3.5 py-2 text-sm text-frc-text placeholder:text-frc-steel focus:outline-none focus:border-frc-gold"
            aria-label="Search articles"
          />
          <div className="text-sm text-frc-steel tabular-nums">
            {t.showing} <span className="text-frc-text">{filtered.length}</span> {t.of}{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
        </div>

        {scopes.length > 1 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-frc-blue/60 pb-3 text-sm" role="navigation" aria-label="Filter by epistemic scope">
            {scopes.map((s) => (
              <Link
                key={s}
                href={filterHref({ scope: s })}
                className={`pb-1 transition-colors ${
                  scope === s
                    ? 'text-frc-gold border-b-2 border-frc-gold font-medium'
                    : 'text-frc-text-dim hover:text-frc-text'
                }`}
              >
                {s === t.all ? t.allScopes : s}
              </Link>
            ))}
          </div>
        )}

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
            {tags.slice(0, 16).map((taxon) => (
              <Link
                key={taxon}
                href={filterHref({ tag: taxon })}
                className={`transition-colors ${
                  tag === taxon
                    ? 'text-frc-gold font-medium underline underline-offset-4'
                    : 'text-frc-steel hover:text-frc-text'
                }`}
              >
                {taxon === t.all ? t.allTags : getTaxonomyLabel(taxon, lang)}
              </Link>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border-t border-frc-blue pt-6 text-sm text-frc-text-dim">
          {t.noResults}
        </div>
      ) : (
        <div className="divide-y divide-frc-blue/70 border-y border-frc-blue">
          {filtered.map((item) => (
            <article key={item.id} className="py-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-2">
                {item.scopeTag ? (
                  <EdgeScopeBadge scopeTag={item.scopeTag} lang={lang} />
                ) : (
                  <EpistemicBadge status="commentary" lang={lang} />
                )}
                <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{item.id}</span>
                {item.date && <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{item.date}</span>}
                <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{item.readTime}</span>
              </div>
              <h3 className="text-base font-medium text-frc-text leading-snug mb-2">
                <Link href={item.href} className="hover:text-frc-gold transition-colors">
                  {item.title}
                </Link>
              </h3>
              {item.abstract && (
                <p className="text-sm text-frc-text-dim leading-relaxed max-w-[65ch]">
                  {item.abstract}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
