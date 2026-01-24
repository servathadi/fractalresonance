import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLanguages, getAllTags, getContentsByTag } from '@/lib/content';

interface Props {
  params: Promise<{ lang: string; tag: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; tag: string }[] = [];

  for (const lang of languages) {
    const tags = getAllTags(lang);
    for (const tag of tags) {
      params.push({ lang, tag });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Tag: ${decodedTag}`,
    description: `Articles, papers, and concepts tagged with "${decodedTag}".`,
  };
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const content = getContentsByTag(lang, decodedTag);

  if (content.length === 0) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-frc-text-dim mb-4">
          <Link href="/" className="hover:text-frc-gold">Home</Link>
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
          const type = fm.id.startsWith('FRC') ? 'papers' : 'concepts';
          const typeLabel = type === 'papers' ? 'Paper' : 'Concept';

          return (
            <Link 
              key={fm.id} 
              href={`/${lang}/${type}/${fm.id}`}
              className="card block p-6 group"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] uppercase tracking-widest font-mono ${type === 'papers' ? 'text-frc-gold' : 'text-frc-blue'}`}>
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
                <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">
                  {fm.abstract}
                </p>
              ) : (
                // Try to find description from body for concepts
                <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">
                  {item.body.split('\n\n').find(p => p && !p.startsWith('#') && !p.startsWith('---'))?.replace(/[[|]]/g, '') || ''}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
