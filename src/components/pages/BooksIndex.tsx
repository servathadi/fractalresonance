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
  legacyNote: string;
  legacyEdition: string;
  philosophy: string;
  partialAi: string;
  readBook: string;
  downloadPdf: string;
  englishEdition: string;
  papersNote: string;
}

const BOOK_PDFS: Record<string, string> = {
  'the-open-system': '/books/the-open-system-v41.pdf',
  'the-mind-in-the-coupling': '/books/the-mind-in-the-coupling-v3.13.pdf',
};

const DICT: Record<string, BookLabels> = {
  en: {
    title: 'Books',
    desc: 'Longer-form philosophical monographs for the FRC program. Falsifiable physics, measurements, and retained negative results live in the status-labeled papers.',
    noBooks: 'No books published yet.',
    current: 'Current 2026 books',
    currentEdition: 'Current 2026 edition',
    currentEnglishFallbackTitle: 'Current 2026 books (Canonical English editions)',
    currentEnglishFallbackNote:
      'The current 2026 FRC books are published in English below. The 2025 books in the archive section are superseded historical editions (noindex) and do not state the current canon.',
    legacy: 'Archived 2025 books',
    legacyNote: 'Superseded historical editions retained for provenance only (noindex).',
    legacyEdition: 'Archived · Superseded (2025)',
    philosophy: 'Philosophy',
    partialAi: 'Partial AI translation',
    readBook: 'Read online',
    downloadPdf: 'PDF',
    englishEdition: 'Read canonical English edition',
    papersNote: 'For technical definitions and empirical boundaries, start with',
  },
  fa: {
    title: 'کتاب‌ها',
    desc: 'تک‌نگاری‌های فلسفی بلندتر برای پروژه FRC. فیزیک ابطال‌پذیر، اندازه‌گیری‌ها و نتایج منفی ثبت‌شده در مقاله‌های برچسب‌گذاری‌شده قرار دارند.',
    noBooks: 'هنوز کتابی منتشر نشده است.',
    current: 'کتاب‌های جاری ۲۰۲۶',
    currentEdition: 'ویرایش جاری ۲۰۲۶',
    currentEnglishFallbackTitle: 'کتاب‌های جاری ۲۰۲۶ (نسخه‌های اصلی انگلیسی)',
    currentEnglishFallbackNote:
      'کتاب‌های جاری ۲۰۲۶ پروژه FRC (The Open System و The Mind in the Coupling) در حال حاضر به زبان انگلیسی منتشر شده‌اند. کتاب‌های سال ۲۰۲۵ در بخش بایگانی زیر نسخه‌های تاریخی منسوخ (noindex) هستند و بیانگر کانون جاری نیستند.',
    legacy: 'کتاب‌های بایگانی‌شده ۲۰۲۵',
    legacyNote: 'نسخه‌های تاریخی منسوخ صرفاً برای ثبت پیشینه (noindex).',
    legacyEdition: 'بایگانی‌شده · منسوخ (۲۰۲۵)',
    philosophy: 'فلسفه',
    partialAi: 'ترجمه جزئی با هوش مصنوعی',
    readBook: 'مطالعه آنلاین',
    downloadPdf: 'PDF',
    englishEdition: 'مطالعه نسخه اصلی انگلیسی',
    papersNote: 'برای تعاریف فنی و مرزهای تجربی، شروع کنید با',
  },
  es: {
    title: 'Libros',
    desc: 'Monografías filosóficas extensas para el proyecto FRC. La física falsable, las mediciones y los resultados negativos retenidos viven en los artículos etiquetados por estado.',
    noBooks: 'Aún no hay libros publicados.',
    current: 'Libros actuales de 2026',
    currentEdition: 'Edición actual 2026',
    currentEnglishFallbackTitle: 'Libros actuales de 2026 (Ediciones canónicas en inglés)',
    currentEnglishFallbackNote:
      'Los libros vigentes de 2026 (The Open System y The Mind in the Coupling) están publicados en inglés a continuación. Los libros de 2025 en la sección archivada son ediciones históricas sustituidas (noindex) y no representan el canon actual.',
    legacy: 'Libros archivados de 2025',
    legacyNote: 'Ediciones históricas sustituidas conservadas solo como referencia (noindex).',
    legacyEdition: 'Archivado · Sustituido (2025)',
    philosophy: 'Filosofía',
    partialAi: 'Traducción parcial por IA',
    readBook: 'Leer en línea',
    downloadPdf: 'PDF',
    englishEdition: 'Leer edición canónica en inglés',
    papersNote: 'Para definiciones técnicas y límites empíricos, comience con',
  },
  fr: {
    title: 'Livres',
    desc: 'Monographies philosophiques de forme longue pour le projet FRC. La physique réfutable, les mesures et les résultats négatifs conservés figurent dans les articles étiquetés par statut.',
    noBooks: 'Pas encore de livres publiés.',
    current: 'Livres actuels 2026',
    currentEdition: 'Édition actuelle 2026',
    currentEnglishFallbackTitle: 'Livres actuels 2026 (Éditions canoniques en anglais)',
    currentEnglishFallbackNote:
      'Les livres actuels de 2026 (The Open System et The Mind in the Coupling) sont publiés en anglais ci-dessous. Les ouvrages de 2025 dans la section d’archives sont des éditions historiques remplacées (noindex) et ne reflètent pas le canon actuel.',
    legacy: 'Livres archivés de 2025',
    legacyNote: 'Éditions historiques remplacées conservées uniquement pour la traçabilité (noindex).',
    legacyEdition: 'Archivé · Remplacé (2025)',
    philosophy: 'Philosophie',
    partialAi: 'Traduction partielle par IA',
    readBook: 'Lire en ligne',
    downloadPdf: 'PDF',
    englishEdition: 'Lire l’édition canonique anglaise',
    papersNote: 'Pour les définitions techniques et limites empiriques, commencez par',
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

  const englishCurrentBooks =
    currentBooks.length === 0 && lang !== 'en'
      ? getBooks('en').filter((b) => CURRENT_BOOK_IDS.has(b.frontmatter.id))
      : [];

  const renderCurrentShowcase = (book: (typeof books)[number], opts: { forceEnglishHref?: boolean } = {}) => {
    const { forceEnglishHref = false } = opts;
    const fm = book.frontmatter as typeof book.frontmatter & BookPresentationStatus;
    const isPartialTranslation = fm.translationStatus === 'partial-ai';
    const englishVersion = ENGLISH_EDITIONS[fm.id];
    const href = forceEnglishHref ? `/en/books/${fm.id}` : `${basePath}/books/${fm.id}`;
    const pdfHref = BOOK_PDFS[fm.id];

    return (
      <article
        key={`${forceEnglishHref ? 'en-' : ''}${fm.id}`}
        className="py-8 grid grid-cols-1 sm:grid-cols-[164px_1fr] gap-6 sm:gap-8 items-start"
      >
        <Link
          href={href}
          hrefLang={forceEnglishHref ? 'en' : undefined}
          className="block w-[144px] sm:w-full border border-frc-blue hover:border-frc-gold transition-colors bg-frc-void-light"
        >
          {fm.cover ? (
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={fm.cover}
                alt={`Cover of ${fm.title}`}
                fill
                sizes="(min-width: 640px) 164px, 144px"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="aspect-[2/3] w-full flex items-center justify-center text-frc-gold font-mono text-xl" aria-hidden="true">
              FRC
            </div>
          )}
        </Link>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-frc-steel mb-2">
            <span className="border-s-2 border-frc-gold ps-2 text-frc-gold font-medium">
              {t.currentEdition}
            </span>
            {fm.epistemicStatus === 'philosophical' && <span>{t.philosophy}</span>}
            {fm.version && <span className="font-mono text-[0.8125rem] tabular-nums">{fm.version}</span>}
            {forceEnglishHref && <span className="font-mono text-[0.8125rem]">EN</span>}
            {isPartialTranslation && <span className="text-frc-gold">{t.partialAi}</span>}
          </div>

          <h3 className="text-xl font-medium text-frc-text tracking-[-0.015em] leading-snug mb-2">
            <Link
              href={href}
              hrefLang={forceEnglishHref ? 'en' : undefined}
              className="hover:text-frc-gold transition-colors"
            >
              {fm.title}
            </Link>
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-frc-steel mb-4 tabular-nums">
            <span>{fm.author || 'Hadi Servat'}</span>
            {fm.date && <span>{fm.date}</span>}
          </div>

          {fm.abstract && (
            <p className="text-[0.9375rem] text-frc-text-dim leading-relaxed max-w-[65ch] mb-4">
              {fm.abstract}
            </p>
          )}

          {fm.statusNote && (
            <p className="text-sm text-frc-steel leading-relaxed max-w-[65ch] mb-5">
              {fm.statusNote}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link
              href={href}
              hrefLang={forceEnglishHref ? 'en' : undefined}
              className="text-frc-gold font-medium hover:underline"
            >
              {t.readBook} →
            </Link>
            {pdfHref && (
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-frc-text-dim hover:text-frc-gold transition-colors"
              >
                {t.downloadPdf}
              </a>
            )}
            {(isPartialTranslation || forceEnglishHref) && englishVersion && !forceEnglishHref && (
              <Link
                href={`/en/books/${fm.id}`}
                className="text-frc-text-dim hover:text-frc-gold transition-colors"
                hrefLang="en"
              >
                {t.englishEdition} ({englishVersion})
              </Link>
            )}
          </div>
        </div>
      </article>
    );
  };

  const renderArchivedBook = (book: (typeof books)[number]) => {
    const fm = book.frontmatter as typeof book.frontmatter & BookPresentationStatus;
    const href = `${basePath}/books/${fm.id}`;

    return (
      <article
        key={fm.id}
        className="py-5 grid grid-cols-[72px_1fr] gap-5 items-start opacity-80 hover:opacity-100 transition-opacity"
      >
        <Link href={href} className="block border border-frc-blue/70 bg-frc-void-light">
          {fm.cover ? (
            <div className="relative aspect-[2/3] w-full">
              <Image src={fm.cover} alt={`Cover of ${fm.title}`} fill sizes="72px" className="object-cover object-top" />
            </div>
          ) : (
            <div className="aspect-[2/3] w-full flex items-center justify-center text-frc-steel font-mono text-sm" aria-hidden="true">
              FRC
            </div>
          )}
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-frc-steel mb-1">
            <span className="border-s-2 border-frc-steel ps-2 font-mono">{t.legacyEdition}</span>
            <span className="font-mono">{fm.id}</span>
            {fm.date && <span className="tabular-nums">{fm.date}</span>}
          </div>
          <h3 className="text-base font-medium text-frc-text-dim hover:text-frc-text transition-colors leading-snug mb-1.5">
            <Link href={href}>{fm.title}</Link>
          </h3>
          {fm.statusNote ? (
            <p className="text-sm text-frc-steel leading-relaxed max-w-[65ch]">{fm.statusNote}</p>
          ) : fm.abstract ? (
            <p className="text-sm text-frc-steel leading-relaxed line-clamp-2 max-w-[65ch]">{fm.abstract}</p>
          ) : null}
        </div>
      </article>
    );
  };

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
      <header className="mb-12 border-b border-frc-blue pb-8">
        <h1 className="text-3xl sm:text-4xl font-light text-frc-gold tracking-[-0.025em] leading-[1.12] mb-4">
          {t.title}
        </h1>
        <p className="text-base text-frc-text-dim max-w-[65ch] leading-relaxed">{t.desc}</p>
        <p className="text-sm text-frc-steel mt-4">
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
        <div className="text-frc-text-dim text-sm border-t border-frc-blue pt-6">
          {t.noBooks}
        </div>
      ) : (
        <div className="space-y-14">
          {currentBooks.length > 0 && (
            <section aria-labelledby="current-books-heading">
              <h2 id="current-books-heading" className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-2">
                {t.current}
              </h2>
              <div className="divide-y divide-frc-blue/70">
                {currentBooks.map((book) => renderCurrentShowcase(book))}
              </div>
            </section>
          )}

          {englishCurrentBooks.length > 0 && (
            <section aria-labelledby="current-english-books-heading">
              <div className="border-s-2 border-frc-gold ps-4 mb-6">
                <h2 id="current-english-books-heading" className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-1.5">
                  {t.currentEnglishFallbackTitle}
                </h2>
                <p className="text-sm text-frc-text-dim leading-relaxed max-w-[65ch]">
                  {t.currentEnglishFallbackNote}
                </p>
              </div>
              <div className="divide-y divide-frc-blue/70">
                {englishCurrentBooks.map((book) => renderCurrentShowcase(book, { forceEnglishHref: true }))}
              </div>
            </section>
          )}

          {legacyBooks.length > 0 && (
            <section aria-labelledby="archived-books-heading" className="border-t border-frc-blue pt-10">
              <details>
                <summary className="cursor-pointer select-none list-none flex flex-wrap items-baseline justify-between gap-2 group">
                  <div>
                    <h2 id="archived-books-heading" className="inline text-base font-medium text-frc-text-dim group-hover:text-frc-text transition-colors">
                      {t.legacy}
                    </h2>
                    <span className="font-mono text-sm text-frc-steel ms-2.5 tabular-nums">
                      ({legacyBooks.length})
                    </span>
                    <p className="text-sm text-frc-steel mt-1">{t.legacyNote}</p>
                  </div>
                  <span className="text-sm text-frc-gold group-hover:underline">Show archive</span>
                </summary>
                <div className="divide-y divide-frc-blue/50 mt-6 border-t border-frc-blue/50">
                  {legacyBooks.map((book) => renderArchivedBook(book))}
                </div>
              </details>
            </section>
          )}
        </div>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
