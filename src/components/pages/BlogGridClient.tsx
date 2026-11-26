'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { EdgeScopeBadge } from '@/components/EdgeScopeBadge';
import type { EdgeScopeTag } from '@/lib/content';
import { canonicalizeTaxon, getTaxonomyLabel } from '@/lib/taxonomy';

export interface BlogGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  tags: string[];
  scopeTag?: EdgeScopeTag;
  primarySourcesCount?: number;
  readTime: string;
  ordinal: number;
}

const DICT: Record<string, { search: string; showing: string; of: string; allScopes: string; noResults: string; all: string }> = {
  en: { search: 'Filter field notes & dispatches…', showing: 'Showing', of: 'of', allScopes: 'All scopes', noResults: 'No matching entries. Try another keyword or scope.', all: 'All' },
  fa: { search: 'جستجو در یادداشت‌های میدانی...', showing: 'نمایش', of: 'از', allScopes: 'همه دامنه‌ها', noResults: 'نتیجه‌ای یافت نشد.', all: 'همه' },
  es: { search: 'Filtrar notas de campo...', showing: 'Mostrando', of: 'de', allScopes: 'Todos los alcances', noResults: 'Sin resultados.', all: 'Todo' },
  fr: { search: 'Filtrer les notes de terrain...', showing: 'Affichage de', of: 'sur', allScopes: 'Toutes les portées', noResults: 'Aucun résultat.', all: 'Tout' },
};

export function BlogGridClient({ items, lang = 'en' }: { items: BlogGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const t = DICT[lang] || DICT.en;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tag = searchParams?.get('tag') ? canonicalizeTaxon(searchParams.get('tag') || '') : t.all;
  const scope = searchParams?.get('scope') || t.all;

  const filterHref = (changes: { tag?: string; scope?: string }) => {
    const next = new URLSearchParams(searchParams?.toString() || '');
    const nextTag = changes.tag === undefined ? tag : changes.tag;
    const nextScope = changes.scope === undefined ? scope : changes.scope;
    if (nextTag === t.all) next.delete('tag'); else next.set('tag', nextTag);
    if (nextScope === t.all) next.delete('scope'); else next.set('scope', nextScope);
    const queryString = next.toString();
    const currentPath = pathname || `/${lang}/blog`;
    return queryString ? `${currentPath}?${queryString}` : currentPath;
  };

  const tags = useMemo(() => {
    const tgs = Array.from(new Set(items.flatMap((i) => i.tags || []).map(canonicalizeTaxon))).sort((a, b) => a.localeCompare(b));
    return [t.all, ...tgs];
  }, [items, t.all]);

  const scopes = useMemo(() => {
    const uniq = Array.from(new Set(items.map((i) => i.scopeTag).filter((s): s is EdgeScopeTag => Boolean(s))));
    return uniq.length > 0 ? [t.all, ...uniq] : [];
  }, [items, t.all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (tag !== t.all && !(i.tags || []).map(canonicalizeTaxon).includes(tag)) return false;
      if (scope !== t.all && i.scopeTag !== scope) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${i.abstract || ''} ${i.scopeTag || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, tag, scope, t.all]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue px-3.5 py-2 text-sm text-frc-text placeholder:text-frc-steel focus:outline-none focus:border-frc-gold"
            aria-label="Search field notes"
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
                {taxon === t.all ? t.all : getTaxonomyLabel(taxon, lang)}
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
                {item.date && <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{item.date}</span>}
                <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{item.readTime}</span>
                {item.primarySourcesCount && item.primarySourcesCount > 0 ? (
                  <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">
                    {item.primarySourcesCount} {item.primarySourcesCount === 1 ? 'source' : 'sources'}
                  </span>
                ) : null}
              </div>
              <h2 className="text-lg font-medium text-frc-text leading-snug mb-2">
                <Link href={item.href} className="hover:text-frc-gold transition-colors">
                  {item.title}
                </Link>
              </h2>
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
