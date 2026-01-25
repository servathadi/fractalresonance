import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { ArticlesSidebar } from '@/components/ArticlesSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { estimateReadTime, getArticle, getArticles, getLanguages, toPaperMeta, buildBacklinks, getGlossary, getAlternateLanguages, matchesPerspectiveView } from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const articles = getArticles(lang);
    for (const article of articles) {
      if (article.frontmatter.id && matchesPerspectiveView(article.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: article.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const article = getArticle(lang, id);
  if (!article) return { title: 'Not Found' };

  const fm = article.frontmatter;
  const author = fm.author || 'H. Servat';
  const articleUrl = `https://fractalresonance.com/${lang}/articles/${fm.id}`;
  const alternates = getAlternateLanguages('articles', fm.id);

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: articleUrl,
      languages: alternates,
    },
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

export default async function ArticlePage({ params }: Props) {
  const { lang, id } = await params;
  const article = getArticle(lang, id);
  if (!article) notFound();

  const basePath = `/${lang}`;
  // Reuse PaperMeta for schema as it fits article structure well enough
  const meta = toPaperMeta(article);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = article.frontmatter;
  const readTime = fm.read_time || estimateReadTime(article.body);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(article.body, lang, glossary, basePath);
  const tocItems = extractTocItems(article.body);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<ArticlesSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<ArticlesSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={basePath} className="hover:text-frc-gold">FRC</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/articles`} className="hover:text-frc-gold">Articles</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{article.frontmatter.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-light text-frc-gold mb-3">
              {article.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
              <span>{article.frontmatter.author || 'H. Servat'}</span>
              <span>{article.frontmatter.date}</span>
              <span className="font-mono text-xs">{readTime}</span>
            </div>
            
            {article.frontmatter.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {article.frontmatter.tags.map(tag => (
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

          {/* Video embed (if available) */}
          {meta.video && (
            <div className="mb-8 rounded-lg overflow-hidden border border-frc-blue">
              {meta.video.embedUrl ? (
                <iframe
                  src={meta.video.embedUrl}
                  className="w-full aspect-video"
                  allowFullScreen
                  title={`${article.frontmatter.title} — Video Explainer`}
                />
              ) : (
                <video
                  src={meta.video.url}
                  poster={meta.video.thumbnailUrl}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}

          {/* Abstract */}
          {article.frontmatter.abstract && (
            <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
              {article.frontmatter.abstract}
            </blockquote>
          )}

          {/* Body */}
          <div className="content-body" suppressHydrationWarning>
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>

          {/* Images gallery */}
          {meta.images && meta.images.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-light text-frc-text mb-4">Figures</h2>
              <div className="grid gap-4">
                {meta.images.map((img, i) => (
                  <figure key={i} className="border border-frc-blue rounded-lg overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full"
                      width={img.width}
                      height={img.height}
                    />
                    <figcaption className="px-4 py-2 text-sm text-frc-text-dim">
                      {img.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

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
                      <a
                        href={href}
                        className="text-frc-gold hover:underline text-sm"
                      >
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
