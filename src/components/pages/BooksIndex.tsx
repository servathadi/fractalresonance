import Link from 'next/link';
import Image from 'next/image';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface BookPresentationStatus {
  epistemicStatus?: string;
  editionStatus?: string;
  translationStatus?: string;
  statusNote?: string;
}

interface BookLabels {
  title: string;
  desc: string;
  noBooks: string;
  current: string;
  currentEdition: string;
  legacy: string;
  legacyEdition: string;
  philosophy: string;
  partialAi: string;
  englishEdition: string;
}

const DICT: Record<string, BookLabels> = {
  en: {
    title: 'Books',
    desc: 'Longer-form writing (textbooks, primers, and narrative frames) for the FRC project.',
    noBooks: 'No books published yet.',
    current: 'Current books',
    currentEdition: 'Current edition',
    legacy: 'Legacy / reference books',
    legacyEdition: 'Legacy / archive',
    philosophy: 'Philosophy',
    partialAi: 'Partial AI translation',
    englishEdition: 'Current English edition',
  },
  fa: {
    title: 'کتاب‌ها',
    desc: 'نوشته‌های طولانی‌تر (کتاب‌های درسی، مقدمات و قاب‌های روایی) برای پروژه FRC.',
    noBooks: 'هنوز کتابی منتشر نشده است.',
    current: 'کتاب‌های جاری',
    currentEdition: 'ویرایش جاری',
    legacy: 'کتاب‌های قدیمی / مرجع',
    legacyEdition: 'قدیمی / بایگانی',
    philosophy: 'فلسفه',
    partialAi: 'ترجمه جزئی با هوش مصنوعی',
    englishEdition: 'ویرایش جاری انگلیسی',
  },
  es: {
    title: 'Libros',
    desc: 'Escritos de formato más largo (libros de texto, manuales y marcos narrativos) para el proyecto FRC.',
    noBooks: 'Aún no hay libros publicados.',
    current: 'Libros actuales',
    currentEdition: 'Edición actual',
    legacy: 'Libros históricos / de referencia',
    legacyEdition: 'Histórico / archivo',
    philosophy: 'Filosofía',
    partialAi: 'Traducción parcial por IA',
    englishEdition: 'Edición inglesa actual',
  },
  fr: {
    title: 'Livres',
    desc: 'Écrits de forme plus longue (manuels, abécédaires et cadres narratifs) pour le projet FRC.',
    noBooks: 'Pas encore de livres publiés.',
    current: 'Livres actuels',
    currentEdition: 'Édition actuelle',
    legacy: 'Livres historiques / de référence',
    legacyEdition: 'Historique / archives',
    philosophy: 'Philosophie',
    partialAi: 'Traduction partielle par IA',
    englishEdition: 'Édition anglaise actuelle',
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
    return fm.editionStatus === 'current' || (fm.editionStatus !== 'legacy' && CURRENT_BOOK_IDS.has(fm.id));
  };
  const currentBooks = books.filter(isCurrent);
  const legacyBooks = books.filter((book) => !isCurrent(book));

  const renderBook = (book: (typeof books)[number], legacy = false) => {
    const fm = book.frontmatter as typeof book.frontmatter & BookPresentationStatus;
    const isPartialTranslation = fm.translationStatus === 'partial-ai';
    const isPhilosophy = fm.epistemicStatus === 'philosophical';
    const englishVersion = ENGLISH_EDITIONS[fm.id];

    return (
      <article
        key={fm.id}
        className={`group relative grid grid-cols-[104px_1fr] sm:grid-cols-[128px_1fr] border transition-colors overflow-hidden min-h-48 ${
          legacy
            ? 'border-frc-blue/50 bg-frc-void hover:border-frc-blue'
            : 'border-frc-blue bg-frc-void-light hover:border-frc-gold/70'
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
            <span className={`border px-2 py-0.5 text-[0.7rem] uppercase ${legacy ? 'border-frc-blue/60 text-frc-steel' : 'border-frc-gold/50 text-frc-gold'}`}>
              {legacy ? t.legacyEdition : t.currentEdition}
            </span>
            {isPhilosophy && (
              <span className="border border-frc-blue/70 px-2 py-0.5 text-[0.7rem] uppercase text-frc-text-dim">
                {t.philosophy}
              </span>
            )}
            {isPartialTranslation && (
              <span className="border border-frc-gold/50 px-2 py-0.5 text-[0.7rem] uppercase text-frc-gold">
                {t.partialAi}
              </span>
            )}
          </div>
          <h2 className={`text-base transition-colors font-medium leading-snug ${legacy ? 'text-frc-text-dim group-hover:text-frc-text' : 'text-frc-text group-hover:text-frc-gold'}`}>
            <Link href={`${basePath}/books/${fm.id}`} className="after:absolute after:inset-0">
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
          {isPartialTranslation && englishVersion && (
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
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{t.title}</h1>
        <p className="text-frc-text-dim">
          {t.desc}
        </p>
      </header>

      {books.length === 0 ? (
        <div className="text-frc-text-dim text-sm border border-frc-blue rounded-lg p-6">
          {t.noBooks}
        </div>
      ) : (
        <div className="space-y-10">
          {currentBooks.length > 0 && (
            <section aria-labelledby="current-books-heading">
              <h2 id="current-books-heading" className="text-xs uppercase text-frc-steel mb-4">{t.current}</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {currentBooks.map((book) => renderBook(book))}
              </div>
            </section>
          )}

          {legacyBooks.length > 0 && (
            <details className="border-t border-frc-blue/50 pt-5">
              <summary className="cursor-pointer select-none text-xs uppercase text-frc-steel hover:text-frc-text transition-colors">
                {t.legacy} <span className="font-mono ms-2">{legacyBooks.length}</span>
              </summary>
              <div className="grid md:grid-cols-2 gap-5 mt-5">
                {legacyBooks.map((book) => renderBook(book, true))}
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
