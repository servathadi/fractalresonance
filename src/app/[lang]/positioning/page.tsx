import type { Metadata } from 'next';
import Link from 'next/link';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'positioning');
  const canonical = '/en/positioning';

  return {
    title: page?.frontmatter.title || 'Positioning',
    description: page?.frontmatter.description || 'How FRC compares to other theories.',
    alternates: { canonical },
  };
}

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PositioningPage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'positioning');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);
  
  const fm = page.frontmatter as any;
  const comparisons = fm.comparisons || [];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-sm text-frc-text-dim mb-8">
        <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
        <span className="mx-2">/</span>
        <span className="text-frc-text">{fm.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-4">{fm.title}</h1>
        <p className="text-frc-text-dim leading-relaxed max-w-2xl">
          {fm.description}
        </p>
      </header>

      <div className="border border-frc-blue rounded-lg p-6 mb-12 bg-frc-void/20">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-4">FRC Distinctive Features</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          <li>- A real scalar field (Λ) governing coherence — not abstract or metaphysical</li>
          <li>- Deterministic collapse via resonant attractors — no randomness postulate</li>
          <li>- Born rule derived from ensemble averaging — not axiomatic</li>
          <li>- Falsifiable: predicts measurable deviations under resonant driving</li>
          <li>- Thermodynamically consistent: entropy–coherence reciprocity proven</li>
        </ul>
      </div>

      <div className="prose prose-invert max-w-none mb-12">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
      </div>

      {comparisons.length > 0 && (
        <section>
          <h2 className="text-lg text-frc-text font-medium mb-6">Comparison Table</h2>
          <div className="grid gap-4">
            {comparisons.map((c: any, i: number) => (
              <div key={i} className="border border-frc-blue rounded-lg px-5 py-4 hover:border-frc-gold/30 transition-colors group">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-frc-text font-medium group-hover:text-frc-gold transition-colors">{c.theory}</h3>
                  <span className="text-xs text-frc-steel shrink-0">{c.axis}</span>
                </div>
                <p className="text-sm text-frc-text-dim mb-3">{c.relation}</p>
                {c.link && (
                  <Link 
                    href={`${basePath}/papers/${c.link}`} 
                    className="text-[10px] uppercase tracking-widest text-frc-blue hover:text-frc-gold transition-colors"
                  >
                    View Detail →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
