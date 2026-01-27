import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'start-here');

  return {
    title: page?.frontmatter.title || 'Start Here',
    description: page?.frontmatter.description || 'A rigorous onboarding path into FRC.',
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function StartHerePage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'start-here');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);
  
  const fm = page.frontmatter as any;
  const path = fm.onboarding_path || [];
  const buildingNow = fm.building_now || [];

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
      </header>

      {path.length > 0 && (
        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          {path.map((it: any) => (
            <Link key={it.id} href={`${basePath}/papers/${it.id}`} className="card block p-5 group">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-frc-gold shrink-0 mt-0.5 tabular-nums">{it.k}</span>
                <div className="min-w-0">
                  <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug">
                    {it.title}
                  </h2>
                  <div className="text-[10px] text-frc-steel font-mono mt-2">{it.id}</div>
                  <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">{it.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {buildingNow.length > 0 && (
        <section className="border border-frc-blue rounded-lg p-6 mb-10">
          <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">What we’re building now</h2>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {buildingNow.map((step: string, i: number) => (
              <li key={i}>- {step}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="prose prose-invert max-w-none mb-10">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
      </div>

      <div className="mt-10 border border-frc-blue rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">Updates</div>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            Choose a lens (Architect / Oracle) and get the latest canon, topics, and benchmarks.
          </p>
        </div>
        <Link
          href={`${basePath}/join`}
          className="px-6 py-3 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          Join
        </Link>
      </div>
    </main>
  );
}
