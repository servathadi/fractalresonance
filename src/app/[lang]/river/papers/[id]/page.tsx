import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getPaper,
  getPapers,
  getLanguages,
  toPaperMeta,
  buildBacklinks,
  getGlossary,
  matchesPerspectiveView,
} from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export function generateStaticParams() {
  const languages = getLanguages();
  const params: Array<{ lang: string; id: string }> = [];

  for (const lang of languages) {
    const papers = getPapers(lang);
    for (const paper of papers) {
      if (paper.frontmatter.id && matchesPerspectiveView(paper.frontmatter.perspective, 'river')) {
        params.push({ lang, id: paper.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const paper = getPaper(lang, id);
  if (!paper) return { title: 'Not Found' };
  if (!matchesPerspectiveView(paper.frontmatter.perspective, 'river')) return { title: 'Not Found' };

  const fm = paper.frontmatter;
  const author = fm.author || 'H. Servat';
  const paperUrl = `https://fractalresonance.com/${lang}/river/papers/${fm.id}`;

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: { canonical: paperUrl },
    openGraph: {
      type: 'article',
      title: fm.title,
      description: fm.abstract,
      publishedTime: fm.date,
      authors: [author],
      tags: fm.tags,
      locale: lang,
    },
  };
}

export default async function RiverPaperPage({ params }: Props) {
  const { lang, id } = await params;
  const paper = getPaper(lang, id);
  if (!paper) notFound();
  if (!matchesPerspectiveView(paper.frontmatter.perspective, 'river')) notFound();

  const basePath = `/${lang}/river`;
  const meta = toPaperMeta(paper);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'river' });
  const fm = paper.frontmatter;
  const readTime = fm.read_time || estimateReadTime(paper.body);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(paper.body, lang, glossary, basePath);
  const tocItems = extractTocItems(paper.body);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<Sidebar lang={lang} currentId={id} basePath={basePath} view="river" variant="mobile" />}
        leftDesktop={<Sidebar lang={lang} currentId={id} basePath={basePath} view="river" />}
        right={<TableOfContents items={tocItems} />}
      >
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={`/${lang}/river`} className="hover:text-frc-gold">River</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/papers`} className="hover:text-frc-gold">Papers</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{paper.frontmatter.id}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-light text-frc-gold mb-3">
              {paper.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
              <span>{paper.frontmatter.author || 'H. Servat'}</span>
              <span>{paper.frontmatter.date}</span>
              <span className="font-mono text-xs">{readTime}</span>
              {paper.frontmatter.series && (
                <span className="tag">{paper.frontmatter.series}</span>
              )}
            </div>
            {paper.frontmatter.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {paper.frontmatter.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`${basePath}/tags/${encodeURIComponent(tag)}`}
                    className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={prereqLinks}
            readTime={readTime}
          />

          <InlineToc items={tocItems} />

          {/* Abstract */}
          {paper.frontmatter.abstract && (
            <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
              {paper.frontmatter.abstract}
            </blockquote>
          )}

          {/* Body */}
          <div className="content-body" suppressHydrationWarning>
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>

          {/* Backlinks */}
          {pageBacklinks.length > 0 && (
            <section className="backlinks">
              <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-3">
                Linked from
              </h3>
              <ul className="space-y-1">
                {pageBacklinks.map(linkId => {
                  const item = glossary[linkId];
                  const href = item?.url || `${basePath}/papers/${linkId}`;
                  return (
                    <li key={linkId}>
                      <a href={href} className="text-frc-gold hover:underline text-sm">
                        {item?.title || linkId}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
      </PageShell>
    </>
  );
}
