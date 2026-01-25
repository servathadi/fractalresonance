import Link from 'next/link';
import { getPeople, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

export function PeopleIndex({
  lang,
  basePath,
  view,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  embedded?: boolean;
}) {
  const people = getPeople(lang).filter((p) => matchesPerspectiveView(p.frontmatter.perspective, view));

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-light text-frc-gold tracking-tight">Voices</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
        </div>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          Site personas and contributors. Content can be visible on Kasra, River, or both sides.
        </p>
      </header>

      {people.length === 0 ? (
        <section className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">No profiles yet.</section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => {
            const fm = p.frontmatter;
            const href = `${basePath}/people/${fm.id}`;
            return (
              <Link
                key={fm.id}
                href={href}
                className="group border border-frc-blue rounded-lg p-5 hover:border-frc-gold transition-colors bg-frc-void/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-frc-text font-medium truncate group-hover:text-frc-gold transition-colors">
                      {fm.title}
                    </h2>
                    {fm.role && <div className="text-xs text-frc-steel mt-1">{fm.role}</div>}
                  </div>
                  {fm.perspective && (
                    <span className="text-[10px] uppercase tracking-widest font-mono text-frc-text-dim border border-frc-blue/60 rounded px-2 py-1">
                      {fm.perspective}
                    </span>
                  )}
                </div>
                {fm.tagline && <p className="text-sm text-frc-text-dim mt-3 leading-relaxed line-clamp-3">{fm.tagline}</p>}
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}

