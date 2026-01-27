import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'pitch');
  const canonical = '/en/pitch';

  return {
    title: page?.frontmatter.title || 'Pitch',
    description: page?.frontmatter.description || 'A concise pitch for FRC.',
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PitchPage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'pitch');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const primary = '/en/pitch';
  
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);
  
  const fm = page.frontmatter as any;

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
            This page is translated for accessibility. Primary version: <Link className="underline hover:text-frc-gold" href={primary}>/en/pitch</Link>
          </p>
        )}
      </header>

      {fm.one_liner && (
        <section className="border border-frc-blue rounded-lg p-6 mb-8">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">One-liner</h2>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            {fm.one_liner}
          </p>
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Problem</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {(fm.problem || []).map((p: string, i: number) => (
              <li key={i}>- {p}</li>
            ))}
          </ul>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Solution</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {(fm.solution || []).map((s: string, i: number) => (
              <li key={i}>- {s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border border-frc-blue rounded-lg p-6 mb-8">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <Link href={`${basePath}/papers/FRC-840-LTM-001`} className="card block p-5 group">
            <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-LTM-001</h3>
            <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Empirical benchmark + architecture/result figures.</p>
          </Link>
          <Link href={`${basePath}/papers/FRC-840-001`} className="card block p-5 group">
            <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-840-001</h3>
            <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Λ‑Tensor Model overview.</p>
          </Link>
          <Link href={`${basePath}/papers/FRC-16D-001`} className="card block p-5 group">
            <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium">FRC-16D-001</h3>
            <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">Protocol + state representation.</p>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Moat</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {(fm.moat || []).map((m: string, i: number) => (
              <li key={i}>- {m}</li>
            ))}
          </ul>
        </div>
        <div className="border border-frc-blue rounded-lg p-6">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Roadmap</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {(fm.roadmap || []).map((r: string, i: number) => (
              <li key={i}>- {r}</li>
            ))}
          </ul>
        </div>
      </section>

      {fm.ask && (
        <section className="border border-frc-blue rounded-lg p-6 mb-10">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">Ask</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {(fm.ask || []).map((a: string, i: number) => (
              <li key={i}>- {a}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-4 items-center">
        <Link
          href={`${basePath}/investors`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          ← Investors
        </Link>
        <Link
          href={`${basePath}/start-here`}
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Start Here
        </Link>
      </div>
    </main>
  );
}

