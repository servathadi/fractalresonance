import Link from 'next/link';
import { getPapers, getConcepts } from '@/lib/content';

interface SidebarProps {
  lang: string;
  currentId?: string;
}

export function Sidebar({ lang, currentId }: SidebarProps) {
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);

  const series100 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-100'));
  const series566 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-566'));
  const series800 = papers.filter(p => p.frontmatter.id?.startsWith('FRC-8'));

  return (
    <aside data-sidebar className="w-56 shrink-0 border-r border-frc-blue overflow-y-auto hidden xl:block">
      <nav className="py-6 px-4 text-sm sticky top-0">
        <SidebarSection title="100 — Core Theory" items={series100} lang={lang} currentId={currentId} />
        <SidebarSection title="566 — Reciprocity" items={series566} lang={lang} currentId={currentId} />
        <SidebarSection title="800 — Applications" items={series800} lang={lang} currentId={currentId} />
        {concepts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">Concepts</h3>
            <ul className="space-y-0.5">
              {concepts.map(c => (
                <li key={c.frontmatter.id}>
                  <Link
                    href={`/${lang}/concepts/${c.frontmatter.id}`}
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
          <Link href={`/${lang}/formulas`} className="block px-2 py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
            Formulas Reference
          </Link>
        </div>
      </nav>
    </aside>
  );
}

function SidebarSection({
  title,
  items,
  lang,
  currentId,
}: {
  title: string;
  items: { frontmatter: { id: string; title: string } }[];
  lang: string;
  currentId?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-frc-steel mb-2 px-2">{title}</h3>
      <ul className="space-y-0.5">
        {items.map(paper => (
          <li key={paper.frontmatter.id}>
            <Link
              href={`/${lang}/papers/${paper.frontmatter.id}`}
              className={`block px-2 py-1 rounded transition-colors truncate ${
                currentId === paper.frontmatter.id
                  ? 'text-frc-gold bg-frc-blue/30'
                  : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-blue/20'
              }`}
              title={paper.frontmatter.title}
            >
              {paper.frontmatter.id.replace('FRC-', '')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
