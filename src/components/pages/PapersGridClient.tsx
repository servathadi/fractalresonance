'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface PapersGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  tags: string[];
  series: '100' | '566' | '800' | 'other';
  doiSuffix?: string;
}

const DICT: Record<string, {
  search: string;
  showing: string;
  of: string;
  allSeries: string;
  allTags: string;
  noResults: string;
  coreTheory: string;
  reciprocity: string;
  applications: string;
  other: string;
}> = {
  en: {
    search: 'Search papers…',
    showing: 'Showing',
    of: 'of',
    allSeries: 'All series',
    allTags: 'All tags',
    noResults: 'No results. Try a different keyword, series, or tag.',
    coreTheory: 'Core Theory',
    reciprocity: 'Reciprocity & UCC',
    applications: 'Applications',
    other: 'Other',
  },
  fa: {
    search: 'جستجوی مقالات...',
    showing: 'نمایش',
    of: 'از',
    allSeries: 'تمام سری‌ها',
    allTags: 'تمام برچسب‌ها',
    noResults: 'نتیجه‌ای یافت نشد. کلمه کلیدی، سری یا برچسب دیگری را امتحان کنید.',
    coreTheory: 'نظریه اصلی',
    reciprocity: 'تقابل و UCC',
    applications: 'کاربردها',
    other: 'سایر',
  },
  es: {
    search: 'Buscar artículos...',
    showing: 'Mostrando',
    of: 'de',
    allSeries: 'Todas las series',
    allTags: 'Todas las etiquetas',
    noResults: 'Sin resultados. Intenta con otra palabra clave, serie o etiqueta.',
    coreTheory: 'Teoría Central',
    reciprocity: 'Reciprocidad y UCC',
    applications: 'Aplicaciones',
    other: 'Otros',
  },
  fr: {
    search: 'Rechercher des articles...',
    showing: 'Affichage de',
    of: 'sur',
    allSeries: 'Toutes les séries',
    allTags: 'Toutes les étiquettes',
    noResults: 'Aucun résultat. Essayez un autre mot-clé, série ou étiquette.',
    coreTheory: 'Théorie Centrale',
    reciprocity: 'Réciprocité et UCC',
    applications: 'Applications',
    other: 'Autre',
  },
};

export function PapersGridClient({ items, lang = 'en' }: { items: PapersGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState<'All' | PapersGridItem['series']>('All');
  const [tag, setTag] = useState<string>('All');
  const t = DICT[lang] || DICT['en'];

  const tags = useMemo(() => {
    const tgs = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b));
    return ['All', ...tgs];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (series !== 'All' && i.series !== series) return false;
      if (tag !== 'All' && !(i.tags || []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${(i.abstract || '')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, series, tag]);

  const groups = useMemo(() => {
    const out: Record<PapersGridItem['series'], PapersGridItem[]> = { '100': [], '566': [], '800': [], other: [] };
    for (const i of filtered) out[i.series].push(i);
    return out;
  }, [filtered]);

  const seriesLabel: Record<PapersGridItem['series'], string> = {
    '100': t.coreTheory,
    '566': t.reciprocity,
    '800': t.applications,
    other: t.other,
  };

  const seriesBadge: Record<PapersGridItem['series'], string> = {
    '100': '100',
    '566': '566',
    '800': '800',
    other: '—',
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search papers"
          />
          <div className="text-xs text-frc-text-dim">
            {t.showing} <span className="text-frc-text">{filtered.length}</span> {t.of}{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['All', '100', '566', '800', 'other'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeries(s)}
              className={`text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                series === s
                  ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                  : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
              }`}
            >
              {s === 'All' ? t.allSeries : seriesBadge[s as PapersGridItem['series']]}
            </button>
          ))}
        </div>

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 18).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                  tag === t
                    ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                    : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
                }`}
              >
                {t}
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
        (['100', '566', '800', 'other'] as const).map((k) => {
          const list = groups[k];
          if (!list || list.length === 0) return null;
          return (
            <section key={k} className="mb-12">
              <h2 className="text-lg text-frc-text font-medium mb-4 flex items-center gap-2">
                <span className="text-frc-gold font-mono text-sm">{seriesBadge[k]}</span>
                {seriesLabel[k]}
              </h2>
              <div className="space-y-4">
                {list.map((paper) => (
                  <Link
                    key={paper.id}
                    href={paper.href}
                    className="block border border-frc-blue rounded-lg px-5 py-4 hover:border-frc-gold-light transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-frc-text group-hover:text-frc-gold transition-colors font-normal truncate">
                          {paper.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-frc-text-dim">
                          {paper.date && <span>{paper.date}</span>}
                          {paper.doiSuffix && (
                            <span className="font-mono">DOI: {paper.doiSuffix}</span>
                          )}
                        </div>
                        {paper.abstract && (
                          <p className="text-sm text-frc-text-dim mt-2 line-clamp-2">
                            {paper.abstract}
                          </p>
                        )}
                      </div>
                      <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}

