import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'investors');
  const canonical = '/en/investors';

  return {
    title: page?.frontmatter.title || 'Investors',
    description: page?.frontmatter.description || 'Investment overview for FRC.',
    alternates: { canonical },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function InvestorsPage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'investors');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const primary = '/en/investors';
  
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);
  
  const fm = page.frontmatter as any;
  const claims = fm.claims || [];
  const nextSteps = fm.next_steps || [];
  const evaluation = fm.evaluation || [];

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
        <span className="mx-2">/</span>
        <span className="text-frc-text">{fm.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{fm.title}</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          {fm.description}
        </p>
        {lang !== 'en' && (
          <p className="text-xs text-frc-text-dim mt-4 max-w-2xl leading-relaxed">
            This page is translated for accessibility. Primary version: <Link className="underline hover:text-frc-gold" href={primary}>/en/investors</Link>
          </p>
        )}
      </header>

      {claims.length > 0 && (
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {claims.map((claim: any, i: number) => (
            <div key={i} className="border border-frc-blue rounded-lg p-6 flex flex-col">
              <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">{claim.title}</div>
              <p className="text-sm text-frc-text-dim leading-relaxed">
                {claim.desc}
              </p>
            </div>
          ))}
        </section>
      )}

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="order-2 md:order-1">
            <MarkdownContent html={bodyHtml} glossary={glossary} />
          </div>
          <div className="order-1 md:order-2 rounded-lg border border-frc-blue overflow-hidden bg-frc-void/20 sticky top-24">
            <img
              src="/media/en/papers/FRC-840-LTM-001/ltm_architecture_diagrams.png"
              alt="LTM architecture comparison diagrams"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link href={`${basePath}/papers/FRC-840-001`} className="card block p-5 group">
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-001</h2>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">The Engine (LTM): attention → resonance.</p>
        </Link>
        <Link href={`${basePath}/papers/FRC-16D-001`} className="card block p-5 group">
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-16D-001</h2>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Protocol: Universal Vector for cognitive state.</p>
        </Link>
        <Link href={`${basePath}/papers/FRC-840-LTM-001`} className="card block p-5 group">
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-LTM-001</h2>
          <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Empirical: LTM vs Transformer on phase coherence.</p>
        </Link>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {nextSteps.length > 0 && (
          <section className="border border-frc-blue rounded-lg p-6">
            <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">What we’re building next</h2>
            <ul className="space-y-2 text-sm text-frc-text-dim">
              {nextSteps.map((step: string, i: number) => (
                <li key={i}>- {step}</li>
              ))}
            </ul>
          </section>
        )}

        {evaluation.length > 0 && (
          <section className="border border-frc-blue rounded-lg p-6">
            <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">What to evaluate</h2>
            <ul className="space-y-2 text-sm text-frc-text-dim">
              {evaluation.map((item: string, i: number) => (
                <li key={i}>- {item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Link
          href={`${basePath}/start-here`}
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Start Here
        </Link>
        <Link
          href={`${basePath}/pitch`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Pitch →
        </Link>
        <Link
          href={`${basePath}/join`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Join →
        </Link>
        <Link
          href={`${basePath}/builders`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          Builders →
        </Link>
      </div>
    </main>
  );
}
