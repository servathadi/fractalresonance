import Link from 'next/link';
import { getBlogPosts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface BlogSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function BlogSidebar({ lang, currentId, basePath, view, variant = 'desktop' }: BlogSidebarProps) {
  const posts = getBlogPosts(lang)
    .filter((p) => (view ? matchesPerspectiveView(p.frontmatter.perspective, view) : true))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

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
            <span className="text-xs uppercase tracking-wider text-frc-steel">Browse blog</span>
          </summary>
        )}
        <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0'}>
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">Blog</h3>
            <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
              {posts.map((post) => (
                <li key={post.frontmatter.id}>
                  <Link
                    href={`${base}/blog/${post.frontmatter.id}`}
                    className={`block px-2 py-1 rounded transition-colors truncate ${
                      currentId === post.frontmatter.id
                        ? 'text-frc-gold bg-frc-blue/30'
                        : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
                    }`}
                    title={post.frontmatter.title}
                  >
                    {post.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-frc-blue">
            <Link href={`${base}/topics`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Topics
            </Link>
            <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Papers
            </Link>
            <Link href={`${base}/articles`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Articles
            </Link>
            <Link href={`${base}/books`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              Books
            </Link>
          </div>
        </nav>
      </details>
    </aside>
  );
}
