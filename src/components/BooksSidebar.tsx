import Link from 'next/link';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface BooksSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
}

export function BooksSidebar({ lang, currentId, basePath, view }: BooksSidebarProps) {
  const books = getBooks(lang)
    .filter((b) => (view ? matchesPerspectiveView(b.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

  const base = basePath || `/${lang}`;

  return (
    <aside data-sidebar className="w-56 shrink-0 border-r border-frc-blue hidden lg:block">
      <nav className="py-6 px-4 text-sm sticky top-0">
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
          <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
            Papers
          </Link>
          <Link href={`${base}/concepts`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
            Concepts
          </Link>
        </div>
      </nav>
    </aside>
  );
}

