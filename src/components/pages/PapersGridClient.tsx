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

export function PapersGridClient({ items }: { items: PapersGridItem[] }) {
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState<'All' | PapersGridItem['series']>('All');
  const [tag, setTag] = useState<string>('All');

  const tags = useMemo(() => {
    const t = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b));
    return ['All', ...t];
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
    '100': 'Core Theory',
    '566': 'Reciprocity & UCC',
    '800': 'Applications',
    other: 'Other',
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
            placeholder="Search papers…"
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search papers"
          />
          <div className="text-xs text-frc-text-dim">
            Showing <span className="text-frc-text">{filtered.length}</span> of{' '}
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
              {s === 'All' ? 'All series' : seriesBadge[s as PapersGridItem['series']]}
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
          No results. Try a different keyword, series, or tag.
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

