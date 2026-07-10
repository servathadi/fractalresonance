import Link from 'next/link';
import { TaxonomyLink } from '@/components/TaxonomyLink';
import {
  getConcepts,
  getPaperCanonStatus,
  getPapers,
  isCurrentReadingContent,
  isPaperCatalogEntry,
  matchesPerspectiveView,
  sortPapersForLibrary,
  type PaperCanonStatus,
  type PerspectiveView,
} from '@/lib/content';

interface SidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function Sidebar({ lang, currentId, basePath, view, variant = 'desktop' }: SidebarProps) {
  const papers = sortPapersForLibrary(
    getPapers(lang).filter((paper) => isPaperCatalogEntry(paper.frontmatter)
      && isCurrentReadingContent('paper', paper.frontmatter)
      && (view ? matchesPerspectiveView(paper.frontmatter.perspective, view) : true)),
  );
  const concepts = getConcepts(lang).filter((c) => isCurrentReadingContent('concept', c.frontmatter)
    && (view ? matchesPerspectiveView(c.frontmatter.perspective, view) : true));
  const base = basePath || `/${lang}`;

  const groups = papers.reduce<Record<PaperCanonStatus, typeof papers>>((out, paper) => {
    out[getPaperCanonStatus(paper.frontmatter)].push(paper);
    return out;
  }, { 'living-core': [], frontier: [], framework: [], archive: [] });
  const currentPaper = papers.find((paper) => paper.frontmatter.id === currentId);
  const currentStatus = currentPaper ? getPaperCanonStatus(currentPaper.frontmatter) : undefined;

  const isMobile = variant === 'mobile';
  const asideClass = isMobile
    ? 'w-full border-b border-frc-blue block lg:hidden'
    : 'w-60 xl:w-72 shrink-0 border-r border-frc-blue hidden lg:block';
  const navClass = isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0';

  const nav = (
    <nav className={navClass}>
      <SidebarSection title="Living core" items={groups['living-core']} currentId={currentId} base={base} openByDefault={!currentStatus || currentStatus === 'living-core'} />
      <SidebarSection title="Frontier" items={groups.frontier} currentId={currentId} base={base} openByDefault={currentStatus === 'frontier'} />
      <SidebarSection title="Framework notes" items={groups.framework} currentId={currentId} base={base} openByDefault={currentStatus === 'framework'} />
      <SidebarSection title="Archive / development history" items={groups.archive} currentId={currentId} base={base} openByDefault={currentStatus === 'archive'} />
      <div className="mt-6">
        <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">Series</h3>
        <div className="flex flex-wrap gap-2 px-2">
          <TaxonomyLink taxon="frc-100" basePath={base} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
          <TaxonomyLink taxon="frc-566" basePath={base} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
          <TaxonomyLink taxon="frc-700" basePath={base} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
          <TaxonomyLink taxon="frc-800" basePath={base} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
        </div>
      </div>
      {concepts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">Concepts</h3>
          <ul className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
            {concepts.map(c => (
              <li key={c.frontmatter.id}>
                <Link
                  href={`${base}/concepts/${c.frontmatter.id}`}
                  className={`block px-2 py-1 rounded transition-colors ${
                    currentId === c.frontmatter.id
                      ? 'text-frc-gold bg-frc-blue/30'
                      : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
                  }`}
                >
                  {c.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-frc-blue">
        <Link href={`${base}/blog`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          Blog
        </Link>
        <Link href={`${base}/topics`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          Topics
        </Link>
        <Link href={`${base}/tags`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          Corpus navigation
        </Link>
        <Link href={`${base}/people`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          Voices
        </Link>
        <Link href={`${base}/articles`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          Articles
        </Link>
        <Link href={`${base}/formulas`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
          Formulas Reference
        </Link>
      </div>
    </nav>
  );

  return (
    <aside data-sidebar className={asideClass}>
      {isMobile ? (
        <details>
          <summary className="px-4 py-3 text-sm text-frc-text cursor-pointer select-none">
            <span className="text-xs uppercase tracking-wider text-frc-steel">Browse library</span>
          </summary>
          {nav}
        </details>
      ) : (
        nav
      )}
    </aside>
  );
}

function SidebarSection({
  title,
  items,
  currentId,
  base,
  openByDefault,
}: {
  title: string;
  items: { frontmatter: { id: string; title: string; date?: string } }[];
  currentId?: string;
  base: string;
  openByDefault: boolean;
}) {
  if (items.length === 0) return null;

  const displayId = (id: string) => id.replace(/^FRC-/, '').replace(/-/g, '.');
  return (
    <details open={openByDefault} className="mb-4">
      <summary className="flex items-center justify-between gap-3 text-xs uppercase tracking-wider text-frc-steel px-2 cursor-pointer select-none list-none">
        <span>{title}</span>
        <span className="text-[11px] normal-case text-frc-text-dim">{items.length}</span>
      </summary>
      <ul className="space-y-0.5 mt-2 max-h-64 overflow-y-auto pr-1">
        {items.map(paper => (
          <li key={paper.frontmatter.id}>
            <Link
              href={`${base}/papers/${paper.frontmatter.id}`}
              className={`block px-2 py-1 rounded transition-colors truncate ${
                currentId === paper.frontmatter.id
                  ? 'text-frc-gold bg-frc-blue/30'
                  : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
              }`}
              title={paper.frontmatter.title}
            >
              {displayId(paper.frontmatter.id)}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
