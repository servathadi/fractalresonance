import Link from 'next/link';
import Image from 'next/image';
import { getBooks, getContentEpistemicStatus, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface BookPresentationStatus {
  epistemicStatus?: string;
  editionStatus?: string;
  translationStatus?: string;
  statusNote?: string;
  status?: string;
}

interface BookLabels {
  title: string;
  desc: string;
  noBooks: string;
  current: string;
  currentEdition: string;
  currentEnglishFallbackTitle: string;
  currentEnglishFallbackNote: string;
  legacy: string;
  legacyEdition: string;
  philosophy: string;
  partialAi: string;
  englishEdition: string;
  papersNote: string;
}

const DICT: Record<string, BookLabels> = {
  en: {
    title: 'Books',
    desc: 'Longer-form philosophical writing for the FRC project. Falsifiable physics, measurements, and kept negative results live in the status-labeled papers.',
    noBooks: 'No books published yet.',
    current: 'Current 2026 books',
    currentEdition: 'Current 2026 edition',
    currentEnglishFallbackTitle: 'Current 2026 books (Canonical English editions)',
    currentEnglishFallbackNote: 'The current 2026 FRC books are published in English below. The 2025 books in the archive section are superseded historical editions (noindex) and do not state the current canon.',
    legacy: 'Archived / superseded 2025 books (historical reference only)',
    legacyEdition: 'Archived · Superseded (2025)',
    philosophy: 'Philosophy',
    partialAi: 'Partial AI translation',
    englishEdition: 'Read canonical English edition',
    papersNote: 'For technical definitions and empirical boundaries, start with FRC 100.000 and FRC 566.001.',
  },
  fa: {
    title: 'کتاب‌ها',
    desc: 'نوشته‌های فلسفی بلندتر برای پروژه FRC. فیزیک ابطال‌پذیر، اندازه‌گیری‌ها و نتایج منفی ثبت‌شده در مقاله‌های برچسب‌گذاری‌شده قرار دارند.',
    noBooks: 'هنوز کتابی منتشر نشده است.',
    current: 'کتاب‌های جاری ۲۰۲۶',
    currentEdition: 'ویرایش جاری ۲۰۲۶',
    currentEnglishFallbackTitle: 'کتاب‌های جاری ۲۰۲۶ (نسخه‌های اصلی انگلیسی)',
    currentEnglishFallbackNote: 'کتاب‌های جاری ۲۰۲۶ پروژه FRC (The Open System و The Mind in the Coupling) در حال حاضر به زبان انگلیسی منتشر شده‌اند. کتاب‌های سال ۲۰۲۵ در بخش بایگانی زیر نسخه‌های تاریخی منسوخ (noindex) هستند و بیانگر کانون جاری نیستند.',
    legacy: 'کتاب‌های بایگانی‌شده / منسوخ ۲۰۲۵ (صرفاً مرجع تاریخی)',
    legacyEdition: 'بایگانی‌شده · منسوخ (۲۰۲۵)',
    philosophy: 'فلسفه',
    partialAi: 'ترجمه جزئی با هوش مصنوعی',
    englishEdition: 'مطالعه نسخه اصلی انگلیسی',
    papersNote: 'برای تعاریف فنی و مرزهای تجربی، از FRC 100.000 و FRC 566.001 شروع کنید.',
  },
  es: {
    title: 'Libros',
    desc: 'Escritos filosóficos extensos para el proyecto FRC. La física falsable, las mediciones y los resultados negativos retenidos viven en los artículos etiquetados por estado.',
    noBooks: 'Aún no hay libros publicados.',
    current: 'Libros actuales de 2026',
    currentEdition: 'Edición actual 2026',
    currentEnglishFallbackTitle: 'Libros actuales de 2026 (Ediciones canónicas en inglés)',
    currentEnglishFallbackNote: 'Los libros vigentes de 2026 (The Open System y The Mind in the Coupling) están publicados en inglés a continuación. Los libros de 2025 en la sección archivada son ediciones históricas sustituidas (noindex) y no representan el canon actual.',
    legacy: 'Libros archivados / sustituidos de 2025 (solo referencia histórica)',
    legacyEdition: 'Archivado · Sustituido (2025)',
    philosophy: 'Filosofía',
    partialAi: 'Traducción parcial por IA',
    englishEdition: 'Leer edición canónica en inglés',
    papersNote: 'Para definiciones técnicas y límites empíricos, comience con FRC 100.000 y FRC 566.001.',
  },
  fr: {
    title: 'Livres',
    desc: 'Écrits philosophiques de forme longue pour le projet FRC. La physique réfutable, les mesures et les résultats négatifs conservés figurent dans les articles étiquetés par statut.',
    noBooks: 'Pas encore de livres publiés.',
    current: 'Livres actuels 2026',
    currentEdition: 'Édition actuelle 2026',
    currentEnglishFallbackTitle: 'Livres actuels 2026 (Éditions canoniques en anglais)',
    currentEnglishFallbackNote: 'Les livres actuels de 2026 (The Open System et The Mind in the Coupling) sont publiés en anglais ci-dessous. Les ouvrages de 2025 dans la section d’archives sont des éditions historiques remplacées (noindex) et ne reflètent pas le canon actuel.',
    legacy: 'Livres archivés / remplacés de 2025 (référence historique uniquement)',
    legacyEdition: 'Archivé · Remplacé (2025)',
    philosophy: 'Philosophie',
    partialAi: 'Traduction partielle par IA',
    englishEdition: 'Lire l’édition canonique anglaise',
    papersNote: 'Pour les définitions techniques et limites empiriques, commencez par FRC 100.000 et FRC 566.001.',
  },
};

const CURRENT_BOOK_IDS = new Set(['the-open-system', 'the-mind-in-the-coupling']);
const ENGLISH_EDITIONS: Record<string, string> = {
  'the-open-system': 'v41',
  'the-mind-in-the-coupling': 'v3.13',
};

export function BooksIndex({
  lang,
  basePath,
  view,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  embedded?: boolean;
}) {
  const books = getBooks(lang).filter((b) => matchesPerspectiveView(b.frontmatter.perspective, view));
  const t = DICT[lang] || DICT.en;
  const isCurrent = (book: (typeof books)[number]) => {
    const fm = book.frontmatter as typeof book.frontmatter & BookPresentationStatus;
    if (getContentEpistemicStatus('book', fm) === 'archive' || fm.status === 'archived' || fm.editionStatus === 'legacy') {
      return false;
    }
    return fm.editionStatus === 'current' || CURRENT_BOOK_IDS.has(fm.id);
  };
  const currentBooks = books.filter(isCurrent);
  const legacyBooks = books.filter((book) => !isCurrent(book));

  // For non-English locales where the 2026 books are not yet translated, surface
  // the canonical 2026 English books prominently instead of presenting 2025 archived books as canon.
  const englishCurrentBooks =
    currentBooks.length === 0 && lang !== 'en'
      ? getBooks('en').filter((b) => CURRENT_BOOK_IDS.has(b.frontmatter.id))
      : [];

  const renderBook = (book: (typeof books)[number], opts: { legacy?: boolean; forceEnglishHref?: boolean } = {}) => {
    const { legacy = false, forceEnglishHref = false } = opts;
    const fm = book.frontmatter as typeof book.frontmatter & BookPresentationStatus;
    const isPartialTranslation = fm.translationStatus === 'partial-ai';
    const isPhilosophy = fm.epistemicStatus === 'philosophical';
    const englishVersion = ENGLISH_EDITIONS[fm.id];
    const href = forceEnglishHref ? `/en/books/${fm.id}` : `${basePath}/books/${fm.id}`;

    return (
      <article
        key={`${forceEnglishHref ? 'en-' : ''}${fm.id}`}
        className={`group relative grid grid-cols-[104px_1fr] sm:grid-cols-[128px_1fr] border transition-colors overflow-hidden min-h-48 ${
          legacy
            ? 'border-frc-blue/50 bg-frc-void hover:border-frc-blue opacity-85'
            : 'border-frc-gold/60 bg-frc-void-light hover:border-frc-gold'
        }`}
      >
        {fm.cover ? (
          <div className="relative aspect-[2/3] w-full bg-frc-void">
            <Image src={fm.cover} alt={`Cover of ${fm.title}`} fill sizes="128px" className="object-cover object-top" />
          </div>
        ) : (
          <div className="aspect-[2/3] w-full bg-frc-void flex items-center justify-center text-frc-gold font-mono text-xl" aria-hidden="true">FRC</div>
        )}
        <div className="p-5 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`border px-2 py-0.5 text-[0.7rem] uppercase ${legacy ? 'border-frc-blue/60 text-frc-steel' : 'border-frc-gold/60 text-frc-gold'}`}>
              {legacy ? t.legacyEdition : t.currentEdition}
            </span>
            {isPhilosophy && (
              <span className="border border-frc-blue/70 px-2 py-0.5 text-[0.7rem] uppercase text-frc-text-dim">
                {t.philosophy}
              </span>
            )}
            {forceEnglishHref && (
              <span className="border border-frc-blue/70 px-2 py-0.5 text-[0.7rem] font-mono uppercase text-frc-steel">
                EN
              </span>
            )}
            {isPartialTranslation && (
              <span className="border border-frc-gold/50 px-2 py-0.5 text-[0.7rem] uppercase text-frc-gold">
                {t.partialAi}
              </span>
            )}
          </div>
          <h2 className={`text-base transition-colors font-medium leading-snug ${legacy ? 'text-frc-text-dim group-hover:text-frc-text' : 'text-frc-text group-hover:text-frc-gold'}`}>
            <Link href={href} hrefLang={forceEnglishHref ? 'en' : undefined} className="after:absolute after:inset-0">
              {fm.title}
            </Link>
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[0.72rem] text-frc-steel">
            <span className="font-mono">{fm.id}</span>
            {fm.version && <span className="font-mono text-frc-gold">{fm.version}</span>}
            {fm.date && <span>{fm.date}</span>}
          </div>
          {fm.abstract && <p className="text-xs text-frc-text-dim leading-relaxed line-clamp-3 mt-4">{fm.abstract}</p>}
          {fm.statusNote && <p className="text-[0.72rem] text-frc-steel leading-relaxed mt-3">{fm.statusNote}</p>}
          {(isPartialTranslation || forceEnglishHref) && englishVersion && (
            <Link
              href={`/en/books/${fm.id}`}
              className="relative z-10 inline-block text-xs text-frc-gold hover:underline mt-3"
              hrefLang="en"
            >
              {t.englishEdition} ({englishVersion})
            </Link>
          )}
        </div>
      </article>
    );
  };

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{t.title}</h1>
        <p className="text-frc-text-dim">{t.desc}</p>
        <p className="text-xs text-frc-steel mt-3">
          {t.papersNote}{' '}
          <Link href="/en/papers/FRC-100-000" className="text-frc-gold hover:underline font-mono">
            FRC 100.000
          </Link>
          {' · '}
          <Link href="/en/papers/FRC-566-001" className="text-frc-gold hover:underline font-mono">
            FRC 566.001
          </Link>
        </p>
      </header>

      {books.length === 0 && englishCurrentBooks.length === 0 ? (
        <div className="text-frc-text-dim text-sm border border-frc-blue rounded-lg p-6">
          {t.noBooks}
        </div>
      ) : (
        <div className="space-y-10">
          {currentBooks.length > 0 && (
            <section aria-labelledby="current-books-heading">
              <h2 id="current-books-heading" className="text-xs uppercase tracking-wider text-frc-gold mb-4">
                {t.current}
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {currentBooks.map((book) => renderBook(book))}
              </div>
            </section>
          )}

          {englishCurrentBooks.length > 0 && (
            <section aria-labelledby="current-english-books-heading">
              <div className="border border-frc-gold/50 bg-frc-void-light p-4 mb-5 text-xs text-frc-text-dim leading-relaxed">
                <h2 id="current-english-books-heading" className="text-xs uppercase tracking-wider text-frc-gold mb-2">
                  {t.currentEnglishFallbackTitle}
                </h2>
                <p>{t.currentEnglishFallbackNote}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {englishCurrentBooks.map((book) => renderBook(book, { forceEnglishHref: true }))}
              </div>
            </section>
          )}

          {legacyBooks.length > 0 && (
            <details className="border-t border-frc-blue/50 pt-5">
              <summary className="cursor-pointer select-none text-xs uppercase tracking-wider text-frc-steel hover:text-frc-text transition-colors">
                {t.legacy} <span className="font-mono ms-2">{legacyBooks.length}</span>
              </summary>
              <div className="grid md:grid-cols-2 gap-5 mt-5">
                {legacyBooks.map((book) => renderBook(book, { legacy: true }))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
