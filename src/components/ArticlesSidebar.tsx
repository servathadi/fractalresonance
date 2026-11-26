import Link from 'next/link';
import { getArticles, isCurrentReadingContent, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
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
    .filter((a) => isCurrentReadingContent('article', a.frontmatter) && (view ? matchesPerspectiveView(a.frontmatter.perspective, view) : true))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';
  const dict = getDictionary(lang);
  const t = SIDEBAR_DICT[lang] || SIDEBAR_DICT.en;

  const navContent = (
    <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-16'}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-frc-gold mb-2 px-2">{t.header}</h3>
        <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pe-1">
          {articles.map((article) => {
            const active = currentId === article.frontmatter.id;
            return (
              <li key={article.frontmatter.id}>
                <Link
                  href={`${base}/articles/${article.frontmatter.id}`}
                  className={`block py-1.5 transition-colors truncate ${
                    active
                      ? 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium'
                      : 'ps-3 text-frc-text-dim hover:text-frc-text'
                  }`}
                  title={article.frontmatter.title}
                >
                  {article.frontmatter.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-6 pt-4 border-t border-frc-blue space-y-1">
        <Link href={`${base}/papers`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.papers}
        </Link>
        <Link href={`${base}/books`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.books}
        </Link>
        <Link href={`${base}/falsifications`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.falsifications}
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
