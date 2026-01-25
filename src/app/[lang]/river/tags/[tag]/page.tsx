import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getLanguages,
  getContentsByTag,
  getGlossary,
  getPapers,
  getArticles,
  getBooks,
  getConcepts,
  getBlogPosts,
  getTopics,
  matchesPerspectiveView,
} from '@/lib/content';

interface Props {
  params: Promise<{ lang: string; tag: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; tag: string }[] = [];

  for (const lang of languages) {
    const tagSet = new Set<string>();
    const all = [
      ...getPapers(lang),
      ...getArticles(lang),
      ...getBooks(lang),
      ...getConcepts(lang),
      ...getBlogPosts(lang),
      ...getTopics(lang),
    ].filter((c) => matchesPerspectiveView(c.frontmatter.perspective, 'river'));

    for (const item of all) {
      for (const t of item.frontmatter.tags || []) tagSet.add(t);
    }

    for (const t of Array.from(tagSet).sort()) {
      params.push({ lang, tag: t });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Tag: ${decodedTag}`,
    description: `River-side items tagged with "${decodedTag}".`,
  };
}

export default async function RiverTagPage({ params }: Props) {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const content = getContentsByTag(lang, decodedTag).filter((c) => matchesPerspectiveView(c.frontmatter.perspective, 'river'));
  const basePath = `/${lang}/river`;
  const glossary = getGlossary(lang, { basePath, view: 'river' });

  if (content.length === 0) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-frc-text-dim mb-4">
          <Link href={basePath} className="hover:text-frc-gold">Home</Link>
          <span>/</span>
          <span>Tags</span>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-light text-frc-gold">
            <span className="text-frc-text-dim opacity-50">#</span> {decodedTag}
          </h1>
          <span className="text-sm text-frc-steel border border-frc-blue px-2 py-0.5 rounded-full">
            {content.length} items
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        {content.map((item) => {
          const fm = item.frontmatter;
          const g = glossary[fm.id];
          const type = g?.type;
          const typeLabel = type ? type[0].toUpperCase() + type.slice(1) : 'Content';
          const href = g?.url || `${basePath}/concepts/${fm.id}`;

          return (
            <Link key={fm.id} href={href} className="card block p-6 group">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-widest font-mono ${type === 'concept' ? 'text-frc-blue' : 'text-frc-gold'}`}>
                    {typeLabel}
                  </span>
                  {fm.date && <span className="text-xs text-frc-steel">{fm.date}</span>}
                </div>
                <span className="font-mono text-xs text-frc-steel">{fm.id}</span>
              </div>

              <h2 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-3">
                {fm.title}
              </h2>

              {fm.abstract ? (
                <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">{fm.abstract}</p>
              ) : (
                <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">
                  {item.body
                    .split('\n\n')
                    .find((p) => p && !p.startsWith('#') && !p.startsWith('---'))
                    ?.replace(/[[|]]/g, '') || ''}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

