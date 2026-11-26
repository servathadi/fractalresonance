import Link from 'next/link';
import { getBooks, getContentEpistemicStatus, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import type { DerivedChapterMeta } from '@/lib/bookChapters';
import { getDictionary } from '@/lib/dictionaries';

interface BooksSidebarProps {
  lang: string;
  currentId?: string;
  chapters?: DerivedChapterMeta[];
  activeChapterSlug?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

const SIDEBAR_DICT: Record<string, { browse: string; inThisBook: string; fullBook: string; currentBooks: string; archivedBooks: string }> = {
  en: { browse: 'Browse books', inThisBook: 'In this book', fullBook: 'Full book', currentBooks: 'Current (2026)', archivedBooks: 'Archived (2025)' },
  fa: { browse: 'مرور کتاب‌ها', inThisBook: 'در این کتاب', fullBook: 'کتاب کامل', currentBooks: 'جاری (۲۰۲۶)', archivedBooks: 'بایگانی (۲۰۲۵)' },
  es: { browse: 'Explorar libros', inThisBook: 'En este libro', fullBook: 'Libro completo', currentBooks: 'Actuales (2026)', archivedBooks: 'Archivados (2025)' },
  fr: { browse: 'Parcourir les livres', inThisBook: 'Dans ce livre', fullBook: 'Livre complet', currentBooks: 'Actuels (2026)', archivedBooks: 'Archivés (2025)' },
};

export function BooksSidebar({ lang, currentId, chapters, activeChapterSlug, basePath, view, variant = 'desktop' }: BooksSidebarProps) {
  const books = getBooks(lang)
    .filter((b) => (view ? matchesPerspectiveView(b.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));
  const currentBooks = books.filter((b) => getContentEpistemicStatus('book', b.frontmatter) !== 'archive');
  const archivedBooks = books.filter((b) => getContentEpistemicStatus('book', b.frontmatter) === 'archive');
  const enCurrentBooks = currentBooks.length === 0 && lang !== 'en'
    ? getBooks('en').filter((b) => getContentEpistemicStatus('book', b.frontmatter) !== 'archive')
    : [];

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';
  const bookPath = currentId ? `${base}/books/${currentId}` : '';
  const showChapters = Boolean(
    currentId &&
      chapters &&
      chapters.length > 0 &&
      !(chapters.length === 1 && chapters[0]?.slug === 'full')
  );

  const dict = getDictionary(lang);
  const t = SIDEBAR_DICT[lang] || SIDEBAR_DICT['en'];

  const navContent = (
    <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-16'}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-frc-gold mb-2 px-2">{t.currentBooks}</h3>
        <ul className="space-y-0.5 max-h-[40vh] overflow-y-auto pe-1">
          {(currentBooks.length > 0 ? currentBooks : enCurrentBooks).map((book) => {
            const useEn = currentBooks.length === 0;
            const active = !useEn && currentId === book.frontmatter.id;
            return (
              <li key={book.frontmatter.id}>
                <Link
                  href={useEn ? `/en/books/${book.frontmatter.id}` : `${base}/books/${book.frontmatter.id}`}
                  className={`block py-1.5 transition-colors truncate ${
                    active
                      ? 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium'
                      : 'ps-3 text-frc-text-dim hover:text-frc-text'
                  }`}
                  title={book.frontmatter.title}
                >
                  {book.frontmatter.title}
                </Link>
              </li>
            );
          })}
        </ul>
        {archivedBooks.length > 0 && (
          <div className="mt-4 pt-3 border-t border-frc-blue/50">
            <h3 className="text-sm font-medium text-frc-steel mb-2 px-2">{t.archivedBooks}</h3>
            <ul className="space-y-0.5 max-h-[30vh] overflow-y-auto pe-1">
              {archivedBooks.map((book) => {
                const active = currentId === book.frontmatter.id;
                return (
                  <li key={book.frontmatter.id}>
                    <Link
                      href={`${base}/books/${book.frontmatter.id}`}
                      className={`block py-1.5 transition-colors truncate ${
                        active
                          ? 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium'
                          : 'ps-3 text-frc-steel hover:text-frc-text-dim'
                      }`}
                      title={book.frontmatter.title}
                    >
                      {book.frontmatter.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {showChapters && (
        <div className="mt-6 pt-4 border-t border-frc-blue">
          <h3 className="text-sm font-medium text-frc-text mb-2 px-2">{t.inThisBook}</h3>
          <ul className="space-y-0.5 max-h-[50vh] overflow-y-auto pe-1">
            <li>
              <Link
                href={bookPath}
                className={`block py-1.5 transition-colors truncate ${
                  !activeChapterSlug
                    ? 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium'
                    : 'ps-3 text-frc-text-dim hover:text-frc-text'
                }`}
                title={t.fullBook}
              >
                {t.fullBook}
              </Link>
            </li>
            {chapters?.map((c) => (
              <li key={c.anchorId}>
                <Link
                  href={`${bookPath}/chapter/${c.slug}`}
                  className={`block py-1.5 transition-colors truncate ${
                    activeChapterSlug === c.slug
                      ? 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium'
                      : 'ps-3 text-frc-text-dim hover:text-frc-text'
                  }`}
                  title={c.title}
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-frc-blue space-y-1">
        <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.papers}
        </Link>
        <Link href={`${base}/falsifications`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.falsifications}
        </Link>
        <Link href={`${base}/articles`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.articles}
        </Link>
        <Link href={`${base}/blog`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.blog}
        </Link>
      </div>
    </nav>
  );

  return (
    <aside
      data-sidebar
      className={
        isMobile
          ? 'w-full border-b border-frc-blue block lg:hidden'
          : 'w-60 xl:w-72 shrink-0 border-r border-frc-blue hidden lg:block'
      }
    >
      {isMobile ? (
        <details>
          <summary className="px-4 py-3 text-sm font-medium text-frc-text-dim cursor-pointer select-none">
            {t.browse}
          </summary>
          {navContent}
        </details>
      ) : (
        navContent
      )}
    </aside>
  );
}
