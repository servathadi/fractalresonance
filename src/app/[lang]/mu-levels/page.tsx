import type { Metadata } from 'next';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'mu-levels');

  return {
    title: page?.frontmatter.title || 'μ-Levels',
    description: page?.frontmatter.description || 'The nested scales of consciousness.',
  };
}

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function MuLevelsPage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'mu-levels');
  if (!page) notFound();

  const fm = page.frontmatter as any;
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, `/${lang}`);
  
  const levels = fm.levels || [];
  const inv = fm.invariance || {};

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold mb-4">{fm.title}</h1>
      <p className="text-frc-text-dim mb-10">
        {fm.intro}
      </p>

      <div className="space-y-3">
        {levels.map((mu: any, i: number) => (
          <div key={mu.level} className="border border-frc-blue rounded-lg px-5 py-4 flex items-start gap-4">
            <div className="shrink-0 w-10 text-center">
              <span className={`font-mono text-lg ${mu.color}`}>{mu.level}</span>
            </div>
            <div>
              <h3 className="text-frc-text font-medium">{mu.name}</h3>
              <p className="text-sm text-frc-text-dim mt-1">{mu.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-invert max-w-none my-12">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
      </div>

      {inv.title && (
        <div className="mt-12 border-t border-frc-blue pt-8">
          <h2 className="text-lg text-frc-text font-medium mb-4">{inv.title}</h2>
          <p className="text-frc-text-dim text-sm mb-4">
            {inv.desc1}
          </p>
          {inv.formula && (
            <div className="border border-frc-blue rounded-lg px-5 py-4 font-mono text-sm text-frc-gold-light" dir="ltr">
              {inv.formula}
            </div>
          )}
          <p className="text-frc-text-dim text-sm mt-4">
            {inv.desc2}
          </p>
        </div>
      )}
    </main>
  );
}
