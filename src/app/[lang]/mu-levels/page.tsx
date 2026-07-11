import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getConcept, getGlossary, getLanguages, getSitePage } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const page = getSitePage('en', 'mu-levels');
  return {
    title: page?.frontmatter.title || 'μ-Level Registers',
    description: page?.frontmatter.description || 'A practical map for declaring the layer a paper or claim addresses.',
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function MuLevelsPage({ params }: Props) {
  const { lang } = await params;
  // Until the revised register map is translated, serve the owner-approved
  // English source rather than older localized hierarchy claims.
  const page = getSitePage('en', 'mu-levels');
  const concept = getConcept('en', 'mu-levels');
  if (!page || !concept) notFound();

  const fm = page.frontmatter as typeof page.frontmatter & {
    intro?: string;
    levels?: Array<{ level: string; name: string; desc: string; color?: string }>;
  };
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(concept.body, lang, glossary, `/${lang}`);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold mb-4">{fm.title}</h1>
      {fm.intro && <p className="text-frc-text-dim mb-8 leading-relaxed">{fm.intro}</p>}
      {fm.statusNote && <p className="border-l-2 border-frc-gold pl-4 py-1 mb-8 text-sm text-frc-text-dim">{fm.statusNote}</p>}
      <div className="space-y-3">
        {(fm.levels || []).map((level) => (
          <section key={level.level} className="border border-frc-blue rounded-lg px-5 py-4 flex items-start gap-4">
            <span className={`shrink-0 w-10 text-center font-mono text-lg ${level.color || 'text-frc-gold'}`}>{level.level}</span>
            <div>
              <h2 className="text-frc-text font-medium">{level.name}</h2>
              <p className="text-sm text-frc-text-dim mt-1">{level.desc}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="prose prose-invert max-w-none my-12">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
      </div>
    </main>
  );
}
