import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarkdownContent } from '@/components/MarkdownContent';
import { PeopleSidebar } from '@/components/PeopleSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getPerson,
  getPeople,
  getLanguages,
  buildBacklinks,
  getGlossary,
  matchesPerspectiveView,
} from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const people = getPeople(lang);
    for (const p of people) {
      if (p.frontmatter.id && matchesPerspectiveView(p.frontmatter.perspective, 'river')) {
        params.push({ lang, id: p.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const person = getPerson(lang, id);
  if (!person) return { title: 'Not Found' };
  const fm = person.frontmatter;

  return {
    title: fm.title,
    description: fm.tagline || fm.abstract,
    keywords: fm.tags,
    authors: [{ name: fm.title }],
    alternates: {
      canonical: `https://fractalresonance.com/${lang}/river/people/${fm.id}`,
    },
    openGraph: {
      type: 'profile',
      title: fm.title,
      description: fm.tagline || fm.abstract,
      locale: lang,
    },
  };
}

export default async function RiverPersonPage({ params }: Props) {
  const { lang, id } = await params;
  const person = getPerson(lang, id);
  if (!person) notFound();
  if (!matchesPerspectiveView(person.frontmatter.perspective, 'river')) notFound();

  const basePath = `/${lang}/river`;
  const fm = person.frontmatter;
  const glossary = getGlossary(lang, { basePath, view: 'river' });
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const readTime = fm.read_time || estimateReadTime(person.body);

  const renderedBody = renderMarkdown(person.body, lang, glossary, basePath);
  const tocItems = extractTocItems(person.body);

  return (
    <PageShell
      leftMobile={<PeopleSidebar lang={lang} currentId={id} basePath={basePath} view="river" variant="mobile" />}
      leftDesktop={<PeopleSidebar lang={lang} currentId={id} basePath={basePath} view="river" />}
      right={<TableOfContents items={tocItems} />}
    >
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={basePath} className="hover:text-frc-gold">FRC</a>
        <span className="mx-2">/</span>
        <a href={`${basePath}/people`} className="hover:text-frc-gold">Voices</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">{fm.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{fm.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
          {fm.role && <span>{fm.role}</span>}
          {fm.date && <span>{fm.date}</span>}
          <span className="font-mono text-xs">{readTime}</span>
        </div>
        {fm.tagline && <p className="mt-4 text-frc-text-dim leading-relaxed max-w-2xl">{fm.tagline}</p>}

        {Array.isArray(fm.links) && fm.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {fm.links
              .filter((l) => l?.url)
              .map((l, idx) => (
                <a
                  key={idx}
                  href={l.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
                >
                  {l.label || l.url}
                </a>
              ))}
          </div>
        )}
      </header>

      <InlineToc items={tocItems} />

      <div className="content-body" suppressHydrationWarning>
        <MarkdownContent html={renderedBody} glossary={glossary} />
      </div>

      {pageBacklinks.length > 0 && (
        <section className="mt-12 border-t border-frc-blue pt-6">
          <h2 className="text-lg font-light text-frc-text mb-3">Referenced by</h2>
          <ul className="space-y-1 text-sm">
            {pageBacklinks.map((bid) => (
              <li key={bid}>
                {glossary[bid]?.url ? (
                  <Link href={glossary[bid].url} className="text-frc-text-dim hover:text-frc-gold transition-colors">
                    {glossary[bid].title || bid}
                  </Link>
                ) : (
                  <span className="text-frc-text-dim">{bid}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}

