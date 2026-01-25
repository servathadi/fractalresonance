import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaTopicPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { TopicsSidebar } from '@/components/TopicsSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getTopic,
  getTopics,
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
    const topics = getTopics(lang);
    for (const t of topics) {
      if (t.frontmatter.id && matchesPerspectiveView(t.frontmatter.perspective, 'river')) {
        params.push({ lang, id: t.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const topic = getTopic(lang, id);
  if (!topic) return { title: 'Not Found' };

  const fm = topic.frontmatter;
  const author = fm.author || 'FRC';
  const url = `https://fractalresonance.com/${lang}/river/topics/${fm.id}`;

  return {
    title: fm.title,
    description: fm.abstract || fm.short_answer,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title: fm.title,
      description: fm.abstract || fm.short_answer,
      publishedTime: fm.date,
      authors: [author],
      tags: fm.tags,
      locale: lang,
    },
  };
}

function SpectrumBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-frc-blue rounded-lg p-5">
      <h2 className="text-xs uppercase tracking-wider text-frc-steel mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default async function RiverTopicPage({ params }: Props) {
  const { lang, id } = await params;
  const topic = getTopic(lang, id);
  if (!topic) notFound();
  if (!matchesPerspectiveView(topic.frontmatter.perspective, 'river')) notFound();

  const basePath = `/${lang}/river`;
  const fm = topic.frontmatter;
  const glossary = getGlossary(lang, { basePath, view: 'river' });
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const readTime = fm.read_time || estimateReadTime(topic.body);

  const staticTargets = new Set([
    'about',
    'articles',
    'papers',
    'books',
    'blog',
    'topics',
    'formulas',
    'positioning',
    'mu-levels',
    'graph',
    'privacy',
    'terms',
  ]);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(topic.body, lang, glossary, basePath);
  const tocItems = extractTocItems(topic.body);

  const authorities = Array.isArray(fm.authorities) ? fm.authorities : [];
  const answers = Array.isArray(fm.answers) ? fm.answers : [];

  return (
    <>
      <SchemaScript
        data={schemaTopicPage({
          id: fm.id,
          title: fm.title,
          question: fm.question || fm.title,
          shortAnswer: fm.short_answer || fm.abstract || '',
          tags: fm.tags || [],
          lang,
          date: fm.date,
          author: fm.author || 'FRC',
          url: `https://fractalresonance.com/${lang}/river/topics/${fm.id}`,
        })}
      />

      <PageShell
        leftMobile={<TopicsSidebar lang={lang} currentId={id} basePath={basePath} view="river" variant="mobile" />}
        leftDesktop={<TopicsSidebar lang={lang} currentId={id} basePath={basePath} view="river" />}
        right={<TableOfContents items={tocItems} />}
      >
        <nav className="text-sm text-frc-text-dim mb-8">
          <a href={basePath} className="hover:text-frc-gold">FRC</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/topics`} className="hover:text-frc-gold">Topics</a>
          <span className="mx-2">/</span>
          <span className="text-frc-text">{fm.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-light text-frc-gold mb-3">{fm.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
            <span>{fm.author || 'FRC'}</span>
            {fm.date && <span>{fm.date}</span>}
            <span className="font-mono text-xs">{readTime}</span>
          </div>

          {fm.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {fm.tags.map((tag) => (
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

        <ContentDigest tldr={fm.tldr} keyPoints={fm.key_points} prerequisites={prereqLinks} readTime={readTime} />

        <InlineToc items={tocItems} />

        {(fm.question || fm.short_answer || authorities.length || answers.length) && (
          <section className="grid gap-4 mb-10">
            {fm.question && (
              <SpectrumBlock title="Question">
                <p className="text-frc-text leading-relaxed">{fm.question}</p>
              </SpectrumBlock>
            )}

            {fm.short_answer && (
              <SpectrumBlock title="Short Answer">
                <p className="text-frc-text-dim leading-relaxed">{fm.short_answer}</p>
              </SpectrumBlock>
            )}

            {authorities.length > 0 && (
              <SpectrumBlock title="Authority">
                <ul className="space-y-3 text-sm">
                  {authorities.map((a, idx) => (
                    <li key={idx} className="border border-frc-blue/60 rounded-md p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-frc-text truncate">{a.title || a.name || 'Source'}</div>
                          {a.name && a.title && <div className="text-xs text-frc-text-dim truncate">{a.name}</div>}
                        </div>
                        {a.url && (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-frc-gold hover:underline shrink-0"
                          >
                            link
                          </a>
                        )}
                      </div>
                      {a.quote && (
                        <blockquote className="mt-2 text-frc-text-dim italic border-l-2 border-frc-gold/60 pl-3">
                          {a.quote}
                        </blockquote>
                      )}
                    </li>
                  ))}
                </ul>
              </SpectrumBlock>
            )}

            {answers.length > 0 && (
              <SpectrumBlock title="Answers (Spectrum)">
                <div className="space-y-3">
                  {answers.map((ans, idx) => (
                    <div key={idx} className="border border-frc-blue/60 rounded-md p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-frc-text truncate">
                            {ans.by || ans.role || 'Answer'}
                            {ans.stance ? <span className="text-frc-text-dim"> — {ans.stance}</span> : null}
                          </div>
                          {ans.role && ans.by && <div className="text-xs text-frc-text-dim truncate">{ans.role}</div>}
                        </div>
                        {ans.url && (
                          <a
                            href={ans.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-frc-gold hover:underline shrink-0"
                          >
                            link
                          </a>
                        )}
                      </div>
                      {ans.answer && <p className="mt-2 text-frc-text-dim text-sm leading-relaxed">{ans.answer}</p>}
                    </div>
                  ))}
                </div>
              </SpectrumBlock>
            )}
          </section>
        )}

        <div className="content-body" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

        {pageBacklinks.length > 0 && (
          <section className="backlinks">
            <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-3">Linked from</h3>
            <ul className="space-y-1">
              {pageBacklinks.map((linkId) => {
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

