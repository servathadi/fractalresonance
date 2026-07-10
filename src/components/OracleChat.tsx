'use client';

import { useMemo, useState } from 'react';
import { EpistemicBadge, type EpistemicStatus } from './EpistemicBadge';

interface SearchDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  abstract?: string;
  content?: string;
  tags?: string[];
  epistemicStatus?: EpistemicStatus;
  retrievalPriority?: number;
}

interface SearchResult extends SearchDocument { score: number }

const DICT: Record<string, { placeholder: string; search: string; loading: string; error: string; empty: string; intro: string }> = {
  en: { placeholder: 'Paper code, formula, result, or topic', search: 'Search', loading: 'Loading corpus index…', error: 'The local search index is unavailable.', empty: 'No matching record found.', intro: 'Search the published corpus directly. Results link to sources and do not replace the papers.' },
  es: { placeholder: 'Código, fórmula, resultado o tema', search: 'Buscar', loading: 'Cargando el índice…', error: 'El índice local no está disponible.', empty: 'No se encontraron resultados.', intro: 'Busque directamente en el corpus. Los resultados enlazan las fuentes y no sustituyen los artículos.' },
  fr: { placeholder: 'Code, formule, résultat ou sujet', search: 'Rechercher', loading: 'Chargement de l’index…', error: 'L’index local est indisponible.', empty: 'Aucun résultat.', intro: 'Recherchez directement dans le corpus. Les résultats citent les sources et ne remplacent pas les articles.' },
  fa: { placeholder: 'کد مقاله، فرمول، نتیجه یا موضوع', search: 'جستجو', loading: 'در حال بارگذاری نمایه…', error: 'نمایه محلی در دسترس نیست.', empty: 'نتیجه‌ای یافت نشد.', intro: 'مستقیماً در پیکره منتشرشده جستجو کنید. نتایج به منبع پیوند می‌دهند و جای مقاله را نمی‌گیرند.' },
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { papers: 'Paper', articles: 'Article', blog: 'Blog', concepts: 'Concept', topics: 'Topic', books: 'Book' },
  es: { papers: 'Artículo académico', articles: 'Artículo', blog: 'Blog', concepts: 'Concepto', topics: 'Tema', books: 'Libro' },
  fr: { papers: 'Article scientifique', articles: 'Article', blog: 'Blog', concepts: 'Concept', topics: 'Sujet', books: 'Livre' },
  fa: { papers: 'مقاله علمی', articles: 'مقاله', blog: 'وبلاگ', concepts: 'مفهوم', topics: 'موضوع', books: 'کتاب' },
};

export function OracleChat({ lang }: { lang: string }) {
  const [documents, setDocuments] = useState<SearchDocument[] | null>(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [error, setError] = useState(false);
  const t = DICT[lang] || DICT.en;

  const results = useMemo<SearchResult[]>(() => {
    const terms = submitted.toLowerCase().split(/\s+/).filter((term) => term.length > 1);
    if (!documents || terms.length === 0) return [];
    return documents
      .map((document) => {
        const title = `${document.id} ${document.title}`.toLowerCase();
        const detail = `${document.abstract || ''} ${document.content || ''} ${(document.tags || []).join(' ')}`.toLowerCase();
        const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 5 : 0) + (detail.includes(term) ? 1 : 0), 0);
        return { ...document, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) =>
        (b.retrievalPriority || 0) - (a.retrievalPriority || 0)
        || b.score - a.score
        || a.title.localeCompare(b.title, lang)
      )
      .slice(0, 8);
  }, [documents, lang, submitted]);

  async function search() {
    if (!query.trim()) return;
    setError(false);
    if (!documents) {
      try {
        const response = await fetch(`/search-index-${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json() as { documents?: SearchDocument[] };
        setDocuments(payload.documents || []);
      } catch {
        setError(true);
        return;
      }
    }
    setSubmitted(query.trim());
  }

  const waiting = submitted && documents === null && !error;

  return (
    <div className="border border-frc-blue bg-frc-void/50">
      <div className="p-5 border-b border-frc-blue">
        <p className="text-sm text-frc-text-dim mb-4">{t.intro}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') search(); }} placeholder={t.placeholder} className="flex-1 bg-frc-void border border-frc-blue px-3 py-2.5 text-sm text-frc-text placeholder:text-frc-steel focus:outline-none focus:border-frc-gold" />
          <button type="button" onClick={search} className="px-5 py-2.5 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm uppercase transition-colors">{t.search}</button>
        </div>
      </div>
      <div className="min-h-48 p-5" aria-live="polite">
        {waiting && <p className="text-sm text-frc-text-dim">{t.loading}</p>}
        {error && <p className="text-sm text-red-400">{t.error}</p>}
        {submitted && documents && results.length === 0 && <p className="text-sm text-frc-text-dim">{t.empty}</p>}
        {results.length > 0 && (
          <ol className="divide-y divide-frc-blue">
            {results.map((result) => (
              <li key={`${result.type}:${result.id}`} className="py-4 first:pt-0 last:pb-0">
                <a href={result.url} className="group block">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <EpistemicBadge status={result.epistemicStatus || 'archive'} lang={lang} />
                    <span className="text-[0.7rem] text-frc-steel">
                      {(TYPE_LABELS[lang] || TYPE_LABELS.en)[result.type] || result.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-frc-gold">{result.id}</span>
                    <h3 className="text-sm text-frc-text group-hover:text-frc-gold transition-colors">{result.title}</h3>
                  </div>
                  {result.abstract && <p className="text-xs text-frc-text-dim mt-2 line-clamp-2 leading-relaxed">{result.abstract}</p>}
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
