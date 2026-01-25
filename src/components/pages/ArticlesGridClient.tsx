'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface ArticlesGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  category: string;
  readTime: string;
  ordinal: number;
}

export function ArticlesGridClient({ items }: { items: ArticlesGridItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category))).sort((a, b) => a.localeCompare(b));
    return ['All', ...cats];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (category !== 'All' && i.category !== category) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${i.abstract || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, category]);

  return (
    <section>
      <div className="section-marker mb-8" data-section="§03">
        <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">All Articles</span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, id, or abstract…"
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search articles"
          />
          <div className="text-xs text-frc-text-dim">
            Showing <span className="text-frc-text">{filtered.length}</span> of{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                category === c
                  ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                  : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          No results. Try a different keyword or category.
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
                    <span className="tag">{item.category}</span>
                    <span className="text-[0.625rem] text-frc-steel">{item.readTime}</span>
                  </div>
                  <h3 className="text-sm text-frc-text group-hover:text-frc-gold transition-colors font-medium leading-snug mb-2">
                    {item.title}
                  </h3>
                  {item.abstract && (
                    <p className="text-xs text-frc-text-dim leading-relaxed line-clamp-2">
                      {item.abstract}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-[0.625rem] text-frc-steel">
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

