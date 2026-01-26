'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { VoiceTag } from '@/components/VoiceTag';

export interface BlogGridItem {
  id: string;
  title: string;
  abstract?: string;
  date?: string;
  href: string;
  tags: string[];
  voice?: string;
  readTime: string;
  ordinal: number;
}

const DICT: Record<string, { search: string; showing: string; of: string; allVoices: string; noResults: string; all: string }> = {
  en: { search: 'Search blog posts…', showing: 'Showing', of: 'of', allVoices: 'All voices', noResults: 'No results. Try a different keyword or tag.', all: 'All' },
  fa: { search: 'جستجوی پست‌های وبلاگ...', showing: 'نمایش', of: 'از', allVoices: 'تمام صداها', noResults: 'نتیجه‌ای یافت نشد. کلمه کلیدی یا برچسب دیگری را امتحان کنید.', all: 'همه' },
  es: { search: 'Buscar publicaciones de blog...', showing: 'Mostrando', of: 'de', allVoices: 'Todas las voces', noResults: 'Sin resultados. Intenta con otra palabra clave o etiqueta.', all: 'Todo' },
  fr: { search: 'Rechercher des articles de blog...', showing: 'Affichage de', of: 'sur', allVoices: 'Toutes les voix', noResults: 'Aucun résultat. Essayez un autre mot-clé ou une autre étiquette.', all: 'Tout' },
};

export function BlogGridClient({ items, lang = 'en' }: { items: BlogGridItem[]; lang?: string }) {
  const [query, setQuery] = useState('');
  const t = DICT[lang] || DICT['en'];
  const [tag, setTag] = useState<string>(t.all);
  const [voice, setVoice] = useState<string>(t.all);

  const tags = useMemo(() => {
    const tgs = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b));
    return [t.all, ...tgs];
  }, [items, t.all]);

  const voices = useMemo(() => {
    const uniq = Array.from(new Set(items.map((i) => i.voice).filter(Boolean) as string[]));
    // Put known personas first, then the rest alphabetically.
    const known = ['kasra', 'river'];
    const rest = uniq
      .filter((v) => !known.includes(v))
      .sort((a, b) => a.localeCompare(b));
    const ordered = [...known.filter((k) => uniq.includes(k)), ...rest];
    return [t.all, ...ordered];
  }, [items, t.all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (tag !== t.all && !(i.tags || []).includes(tag)) return false;
      if (voice !== t.all && i.voice !== voice) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.id} ${(i.abstract || '')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, tag, voice, t.all]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full sm:max-w-md bg-frc-void-light border border-frc-blue rounded-md px-3 py-2 text-sm text-frc-text placeholder:text-frc-text-dim focus:outline-none focus:border-frc-gold"
            aria-label="Search blog posts"
          />
          <div className="text-xs text-frc-text-dim">
            {t.showing} <span className="text-frc-text">{filtered.length}</span> {t.of}{' '}
            <span className="text-frc-text">{items.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {voices.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVoice(v)}
              className={`text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-md border transition-colors ${
                voice === v
                  ? 'border-frc-gold text-frc-gold bg-frc-blue/20'
                  : 'border-frc-blue text-frc-text-dim hover:text-frc-text hover:border-frc-gold-light'
              }`}
            >
              {v === t.all ? t.allVoices : v}
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
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <Link key={item.id} href={item.href} className="card block p-6 group">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-frc-steel shrink-0 mt-1 tabular-nums">
                  {String(item.ordinal).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <VoiceTag voice={item.voice} />
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
