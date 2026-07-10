import Link from 'next/link';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
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

const SIDEBAR_DICT: Record<string, { browse: string; inThisBook: string; fullBook: string }> = {
  en: { browse: 'Browse books', inThisBook: 'In this book', fullBook: 'Full book' },
  fa: { browse: 'مرور کتاب‌ها', inThisBook: 'در این کتاب', fullBook: 'کتاب کامل' },
  es: { browse: 'Explorar libros', inThisBook: 'En este libro', fullBook: 'Libro completo' },
  fr: { browse: 'Parcourir les livres', inThisBook: 'Dans ce livre', fullBook: 'Livre complet' },
};

export function BooksSidebar({ lang, currentId, chapters, activeChapterSlug, basePath, view, variant = 'desktop' }: BooksSidebarProps) {
  const books = getBooks(lang)
    .filter((b) => (view ? matchesPerspectiveView(b.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

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

  return (
    <aside
      data-sidebar
      className={
        isMobile
          ? 'w-full border-b border-frc-blue block lg:hidden'
          : 'w-60 xl:w-72 shrink-0 border-r border-frc-blue hidden lg:block'
      }
    >
      <details open={!isMobile}>
        {isMobile && (
          <summary className="px-4 py-3 text-sm text-frc-text cursor-pointer select-none">
            <span className="text-xs uppercase tracking-wider text-frc-steel">{t.browse}</span>
          </summary>
        )}
        <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0'}>
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">{dict.nav.books}</h3>
            <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
              {books.map((book) => (
                <li key={book.frontmatter.id}>
                  <Link
                    href={`${base}/books/${book.frontmatter.id}`}
                    className={`block px-2 py-1 rounded transition-colors truncate ${
                      currentId === book.frontmatter.id
                        ? 'text-frc-gold bg-frc-blue/30'
                        : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
                    }`}
                    title={book.frontmatter.title}
                  >
                    {book.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {showChapters && (
            <div className="mt-6 pt-4 border-t border-frc-blue">
              <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">{t.inThisBook}</h3>
              <ul className="space-y-0.5 max-h-[50vh] overflow-y-auto pr-1">
                <li>
                  <Link
                    href={bookPath}
                    className={`block px-2 py-1 rounded transition-colors truncate ${
                      !activeChapterSlug
                        ? 'text-frc-gold bg-frc-blue/30'
                        : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
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
                      className={`block px-2 py-1 rounded transition-colors truncate ${
                        activeChapterSlug === c.slug
                          ? 'text-frc-gold bg-frc-blue/30'
                          : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
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
          <div className="mt-6 pt-4 border-t border-frc-blue">
            <Link href={`${base}/blog`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.blog}
            </Link>
            <Link href={`${base}/topics`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.topics}
            </Link>
            <Link href={`${base}/articles`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.articles}
            </Link>
            <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.papers}
            </Link>
            <Link href={`${base}/concepts`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.concepts}
            </Link>
          </div>
        </nav>
      </details>
    </aside>
  );
}
