import Link from 'next/link';
import { getPapers, getConcepts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface SidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function Sidebar({ lang, currentId, basePath, view, variant = 'desktop' }: SidebarProps) {
  const papers = getPapers(lang).filter((p) => (view ? matchesPerspectiveView(p.frontmatter.perspective, view) : true));
  const concepts = getConcepts(lang).filter((c) => (view ? matchesPerspectiveView(c.frontmatter.perspective, view) : true));
  const base = basePath || `/${lang}`;

  const series100 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-100'));
  const series566 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-566'));
  const series800 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-8'));
  const open100 = !!currentId && currentId.startsWith('FRC-100');
  const open566 = !!currentId && currentId.startsWith('FRC-566');
  const open800 = !!currentId && currentId.startsWith('FRC-8');
  const anySeriesOpen = open100 || open566 || open800;
  // Keep Applications visible while reading core papers so cross-series discovery
  // (e.g. "841.004") doesn't feel "missing".
  const open800Default = open800 || open100;

  const isMobile = variant === 'mobile';
  const asideClass = isMobile
    ? 'w-full border-b border-frc-blue block lg:hidden'
    : 'w-60 xl:w-72 shrink-0 border-r border-frc-blue hidden lg:block';
  const navClass = isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0';

  const nav = (
    <nav className={navClass}>
      <SidebarSection title="100 — Core Theory" items={series100} currentId={currentId} base={base} openByDefault={anySeriesOpen ? open100 : true} />
      <SidebarSection title="566 — Reciprocity" items={series566} currentId={currentId} base={base} openByDefault={open566} />
      <SidebarSection title="800 — Applications" items={series800} currentId={currentId} base={base} openByDefault={open800Default} />
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
  items: { frontmatter: { id: string; title: string } }[];
  currentId?: string;
  base: string;
  openByDefault: boolean;
}) {
  if (items.length === 0) return null;

  const displayId = (id: string) => id.replace(/^FRC-/, '').replace(/-/g, '.');
  const sortKey = (id: string) => {
    // e.g. "FRC-100-007" -> [100, 7], "FRC-893-PHY" -> [893, NaN]
    const m = id.match(/^FRC-(\d+)(?:-(\d+))?/);
    const major = m ? Number(m[1]) : Number.POSITIVE_INFINITY;
    const minor = m?.[2] ? Number(m[2]) : Number.POSITIVE_INFINITY;
    return [major, minor] as const;
  };
  const sorted = [...items].sort((a, b) => {
    const [am, an] = sortKey(a.frontmatter.id);
    const [bm, bn] = sortKey(b.frontmatter.id);
    if (am !== bm) return am - bm;
    return an - bn;
  });

  return (
    <details open={openByDefault} className="mb-4">
      <summary className="flex items-center justify-between gap-3 text-xs uppercase tracking-wider text-frc-steel px-2 cursor-pointer select-none list-none">
        <span>{title}</span>
        <span className="text-[11px] normal-case text-frc-text-dim">{sorted.length}</span>
      </summary>
      <ul className="space-y-0.5 mt-2 max-h-64 overflow-y-auto pr-1">
        {sorted.map(paper => (
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
