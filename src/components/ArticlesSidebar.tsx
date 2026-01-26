import Link from 'next/link';
import { getArticles, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';

interface ArticlesSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

const SIDEBAR_DICT: Record<string, { browse: string; header: string }> = {
  en: { browse: 'Browse articles', header: 'Articles' },
  fa: { browse: 'مرور مقالات', header: 'مقالات' },
  es: { browse: 'Explorar artículos', header: 'Artículos' },
  fr: { browse: 'Parcourir les articles', header: 'Articles' },
};

export function ArticlesSidebar({ lang, currentId, basePath, view, variant = 'desktop' }: ArticlesSidebarProps) {
  const articles = getArticles(lang)
    .filter((a) => (view ? matchesPerspectiveView(a.frontmatter.perspective, view) : true))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';
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
            <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">{t.header}</h3>
            <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
              {articles.map((article) => (
                <li key={article.frontmatter.id}>
                  <Link
                    href={`${base}/articles/${article.frontmatter.id}`}
                    className={`block px-2 py-1 rounded transition-colors truncate ${
                      currentId === article.frontmatter.id
                        ? 'text-frc-gold bg-frc-blue/30'
                        : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
                    }`}
                    title={article.frontmatter.title}
                  >
                    {article.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-frc-blue">
            <Link href={`${base}/blog`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.blog}
            </Link>
            <Link href={`${base}/topics`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.topics}
            </Link>
            <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.papers}
            </Link>
            <Link href={`${base}/books`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
              {dict.nav.books}
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
