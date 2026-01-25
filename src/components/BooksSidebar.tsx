import Link from 'next/link';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface BooksSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function BooksSidebar({ lang, currentId, basePath, view, variant = 'desktop' }: BooksSidebarProps) {
  const books = getBooks(lang)
    .filter((b) => (view ? matchesPerspectiveView(b.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';

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
            <span className="text-xs uppercase tracking-wider text-frc-steel">Browse books</span>
          </summary>
        )}
        <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0'}>
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">Books</h3>
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
          <div className="mt-6 pt-4 border-t border-frc-blue">
            <Link href={`${base}/blog`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Blog
            </Link>
            <Link href={`${base}/topics`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Topics
            </Link>
            <Link href={`${base}/articles`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Articles
            </Link>
            <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Papers
            </Link>
            <Link href={`${base}/concepts`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Concepts
            </Link>
          </div>
        </nav>
      </details>
    </aside>
  );
}
