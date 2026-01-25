'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface ConceptsGridItem {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  tags: string[];
}

export function ConceptsGridClient({ items }: { items: ConceptsGridItem[] }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string>('All');

  const tags = useMemo(() => {
    const t = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b));
    return ['All', ...t];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (tag !== 'All' && !(i.tags || []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${i.excerpt}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, tag]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts…"
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search concepts"
          />
          <div className="text-xs text-frc-text-dim">
            Showing <span className="text-frc-text">{filtered.length}</span> of{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
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
          No results. Try a different keyword or tag.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <Link key={item.id} href={item.href} className="card block p-6 group">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <h2 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-frc-steel">
                    <span className="font-mono">{item.id}</span>
                  </div>
                </div>
                <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">&rarr;</span>
              </div>
              {item.excerpt && (
                <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                  {item.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

