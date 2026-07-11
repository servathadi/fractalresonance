'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { TierBadge, inferTier, type Tier } from '@/components/TierBadge';
import type { PaperCanonStatus } from '@/lib/content';
import { getMuLevel, type MuLevel } from '@/lib/mu-levels';
import { canonicalizeTaxon, getTaxonomyLabel } from '@/lib/taxonomy';

export interface PapersGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  tags: string[];
  series: '100' | '566' | '700' | '800' | 'other';
  doi?: string;
  conceptDoi?: string;
  canonStatus: PaperCanonStatus;
  revisionPending?: boolean;
  muLevel?: MuLevel;
  tier?: Tier;
}

const DICT: Record<string, {
  search: string;
  showing: string;
  of: string;
  allSeries: string;
  allTags: string;
  noResults: string;
  livingCore: string;
  livingCoreDesc: string;
  frontier: string;
  frontierDesc: string;
  framework: string;
  frameworkDesc: string;
  archive: string;
  archiveDesc: string;
  currentScope: string;
  allScope: string;
  archiveScope: string;
}> = {
  en: {
    search: 'Search papers…',
    showing: 'Showing',
    of: 'of',
    allSeries: 'All series',
    allTags: 'All tags',
    noResults: 'No results. Try a different keyword, series, or tag.',
    livingCore: 'Living core',
    livingCoreDesc: 'Current papers that carry the framework forward.',
    frontier: 'Frontier',
    frontierDesc: 'Active research directions and open development.',
    framework: 'Framework notes',
    frameworkDesc: 'Philosophical and formal scope notes, not primary physical evidence.',
    archive: 'Archive',
    archiveDesc: 'Earlier papers retained as development history.',
    currentScope: 'Current research',
    allScope: 'Full library',
    archiveScope: 'Archive only',
  },
  fa: {
    search: 'جستجوی مقالات...',
    showing: 'نمایش',
    of: 'از',
    allSeries: 'تمام سری‌ها',
    allTags: 'تمام برچسب‌ها',
    noResults: 'نتیجه‌ای یافت نشد. کلمه کلیدی، سری یا برچسب دیگری را امتحان کنید.',
    livingCore: 'هسته زنده',
    livingCoreDesc: 'مقاله‌های جاری که چارچوب را پیش می‌برند.',
    frontier: 'مرز پژوهش',
    frontierDesc: 'مسیرهای پژوهشی فعال و توسعه باز.',
    framework: 'یادداشت‌های چارچوب',
    frameworkDesc: 'یادداشت‌های فلسفی و صوری دامنه؛ شاهد فیزیکی اولیه نیستند.',
    archive: 'بایگانی',
    archiveDesc: 'مقاله‌های پیشین که به‌عنوان تاریخچه توسعه نگهداری می‌شوند.',
    currentScope: 'پژوهش کنونی',
    allScope: 'کتابخانه کامل',
    archiveScope: 'فقط بایگانی',
  },
  es: {
    search: 'Buscar artículos...',
    showing: 'Mostrando',
    of: 'de',
    allSeries: 'Todas las series',
    allTags: 'Todas las etiquetas',
    noResults: 'Sin resultados. Intenta con otra palabra clave, serie o etiqueta.',
    livingCore: 'Núcleo vivo',
    livingCoreDesc: 'Artículos actuales que hacen avanzar el marco.',
    frontier: 'Frontera',
    frontierDesc: 'Líneas de investigación activas y desarrollo abierto.',
    framework: 'Notas de marco',
    frameworkDesc: 'Notas filosóficas y formales de alcance; no son evidencia física primaria.',
    archive: 'Archivo',
    archiveDesc: 'Artículos anteriores conservados como historia del desarrollo.',
    currentScope: 'Investigación actual',
    allScope: 'Biblioteca completa',
    archiveScope: 'Solo archivo',
  },
  fr: {
    search: 'Rechercher des articles...',
    showing: 'Affichage de',
    of: 'sur',
    allSeries: 'Toutes les séries',
    allTags: 'Toutes les étiquettes',
    noResults: 'Aucun résultat. Essayez un autre mot-clé, série ou étiquette.',
    livingCore: 'Cœur vivant',
    livingCoreDesc: 'Les articles actuels qui font progresser le cadre.',
    frontier: 'Frontière',
    frontierDesc: 'Axes de recherche actifs et développement ouvert.',
    framework: 'Notes de cadre',
    frameworkDesc: 'Notes philosophiques et formelles de portée; elles ne sont pas des preuves physiques primaires.',
    archive: 'Archives',
    archiveDesc: 'Anciens articles conservés comme historique du développement.',
    currentScope: 'Recherche actuelle',
    allScope: 'Bibliothèque complète',
    archiveScope: 'Archives seulement',
  },
};

export function PapersGridClient({ items, lang = 'en' }: { items: PapersGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = DICT[lang] || DICT['en'];
  const rawSeries = searchParams?.get('series');
  const series: 'All' | PapersGridItem['series'] = rawSeries === '100' || rawSeries === '566' || rawSeries === '700' || rawSeries === '800' || rawSeries === 'other' ? rawSeries : 'All';
  const rawScope = searchParams?.get('scope');
  const scope: 'current' | 'all' | 'archive' = rawScope === 'all' || rawScope === 'archive' ? rawScope : 'current';
  const tag = searchParams?.get('tag') ? canonicalizeTaxon(searchParams.get('tag') || '') : 'All';

  const filterHref = (changes: { series?: typeof series; scope?: typeof scope; tag?: string }) => {
    const next = new URLSearchParams(searchParams?.toString() || '');
    const nextSeries = changes.series === undefined ? series : changes.series;
    const nextScope = changes.scope === undefined ? scope : changes.scope;
    const nextTag = changes.tag === undefined ? tag : changes.tag;
    if (nextSeries === 'All') next.delete('series'); else next.set('series', nextSeries);
    if (nextScope === 'current') next.delete('scope'); else next.set('scope', nextScope);
    if (nextTag === 'All') next.delete('tag'); else next.set('tag', nextTag);
    const queryString = next.toString();
    const currentPath = pathname || `/${lang}/papers`;
    return queryString ? `${currentPath}?${queryString}` : currentPath;
  };

  const tags = useMemo(() => {
    const tgs = Array.from(new Set(items.flatMap((i) => i.tags || []).map(canonicalizeTaxon))).sort((a, b) => a.localeCompare(b));
    return ['All', ...tgs];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (scope === 'current' && (i.canonStatus === 'archive' || i.revisionPending)) return false;
      if (scope === 'archive' && i.canonStatus !== 'archive') return false;
      if (series !== 'All' && i.series !== series) return false;
      if (tag !== 'All' && !(i.tags || []).map(canonicalizeTaxon).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${i.conceptDoi || ''} ${i.doi || ''} ${(i.abstract || '')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, scope, series, tag]);

  const groups = useMemo(() => {
    const out: Record<PaperCanonStatus, PapersGridItem[]> = {
      'living-core': [],
      frontier: [],
      framework: [],
      archive: [],
    };
    for (const i of filtered) out[i.canonStatus].push(i);
    return out;
  }, [filtered]);

  const seriesBadge: Record<PapersGridItem['series'], string> = {
    '100': '100',
    '566': '566',
    '700': '700',
    '800': '800',
    other: '—',
  };

  const canonLabel: Record<PaperCanonStatus, { title: string; description: string }> = {
    'living-core': { title: t.livingCore, description: t.livingCoreDesc },
    frontier: { title: t.frontier, description: t.frontierDesc },
    framework: { title: t.framework, description: t.frameworkDesc },
    archive: { title: t.archive, description: t.archiveDesc },
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3">
        <div className="inline-flex w-full sm:w-fit border border-frc-blue" role="group" aria-label="Paper library scope">
          {([
            ['current', t.currentScope],
            ['all', t.allScope],
            ['archive', t.archiveScope],
          ] as const).map(([value, label]) => (
            <Link
              key={value}
              href={filterHref({ scope: value })}
              aria-pressed={scope === value}
              className={`flex-1 sm:flex-none px-3 py-2 text-[0.72rem] uppercase tracking-wider transition-colors ${
                scope === value
                  ? 'bg-frc-gold text-frc-void'
                  : 'text-frc-text-dim hover:text-frc-gold'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
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
          {(['All', '100', '566', '700', '800', 'other'] as const).map((s) => (
            <Link
              key={s}
              href={filterHref({ series: s })}
              className={`text-[0.72rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                series === s
                  ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                  : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
              }`}
            >
              {s === 'All' ? t.allSeries : seriesBadge[s as PapersGridItem['series']]}
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
                {taxon === 'All' ? t.allTags : getTaxonomyLabel(taxon, lang)}
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
        (['living-core', 'frontier', 'framework', 'archive'] as const).map((status) => {
          const list = groups[status];
          if (!list || list.length === 0) return null;
          return (
            <section key={status} className="mb-12" aria-labelledby={`papers-${status}`}>
              <div className="mb-4 border-b border-frc-blue pb-3">
                <h2 id={`papers-${status}`} className="text-lg text-frc-text font-medium">
                  {canonLabel[status].title}
                  <span className="ms-2 text-xs font-normal text-frc-steel">{list.length}</span>
                </h2>
                <p className="mt-1 text-xs text-frc-text-dim">{canonLabel[status].description}</p>
              </div>
              <div className="space-y-4">
                {list.map((paper) => (
                  <Link
                    key={paper.id}
                    href={paper.href}
                    className="grid grid-cols-1 gap-4 border border-frc-blue rounded-lg px-4 py-4 sm:px-5 hover:border-frc-gold-light transition-colors group sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="min-w-0">
                      <h3 className="text-frc-text group-hover:text-frc-gold transition-colors font-normal">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-frc-text-dim">
                        {paper.date && <span>{paper.date}</span>}
                        {(paper.conceptDoi || paper.doi) && (
                          <span className="font-mono break-all">
                            {paper.conceptDoi ? 'Concept DOI' : 'DOI'}: {(paper.conceptDoi || paper.doi)?.split('/').pop()}
                          </span>
                        )}
                        <TierBadge tier={inferTier(paper.tier, paper.id)} lang={lang} />
                        {paper.muLevel && <span className="font-mono text-[0.68rem] tracking-wide text-frc-steel">{getMuLevel(paper.muLevel)?.symbol}</span>}
                        {paper.revisionPending && (
                          <span className="font-mono text-[0.68rem] uppercase tracking-wide text-frc-steel">revision pending</span>
                        )}
                      </div>
                      {paper.abstract && (
                        <p className="text-sm text-frc-text-dim mt-2 line-clamp-2">
                          {paper.abstract}
                        </p>
                      )}
                    </div>
                    <span className="hidden sm:block text-frc-steel group-hover:text-frc-gold transition-colors shrink-0" aria-hidden="true">
                      &rarr;
                    </span>
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
