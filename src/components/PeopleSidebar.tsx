import Link from 'next/link';
import { getPeople, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';

interface PeopleSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

const SIDEBAR_DICT: Record<string, { browse: string; header: string }> = {
  en: { browse: 'People', header: 'Voices' },
  fa: { browse: 'افراد', header: 'صداها' },
  es: { browse: 'Personas', header: 'Voces' },
  fr: { browse: 'Personnes', header: 'Voix' },
};

export function PeopleSidebar({ lang, currentId, basePath, view, variant = 'desktop' }: PeopleSidebarProps) {
  const people = getPeople(lang)
    .filter(
      (p) =>
        (view ? matchesPerspectiveView(p.frontmatter.perspective, view) : true) &&
        p.frontmatter.status !== 'archived' &&
        p.frontmatter.noindex !== true,
    )
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';
  const dict = getDictionary(lang);
  const t = SIDEBAR_DICT[lang] || SIDEBAR_DICT['en'];

  const navContent = (
    <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-16'}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-frc-gold mb-2 px-2">{t.header}</h3>
        <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pe-1">
          {people.map((p) => (
            <li key={p.frontmatter.id}>
              <Link
                href={`${base}/people/${p.frontmatter.id}`}
                className={`block py-1.5 transition-colors truncate ${
                  currentId === p.frontmatter.id
                    ? 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium'
                    : 'ps-3 text-frc-text-dim hover:text-frc-text'
                }`}
                title={p.frontmatter.title}
              >
                {p.frontmatter.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-frc-blue space-y-1">
        <Link href={`${base}/topics`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.topics}
        </Link>
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
        <Link href={`${base}/books`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          {dict.nav.books}
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

