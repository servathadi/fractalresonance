import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaBlogPostPage, type BlogPostMeta } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { BlogSidebar } from '@/components/BlogSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { RelatedContent } from '@/components/RelatedContent';
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { EdgeScopeBadge } from '@/components/EdgeScopeBadge';
import { PrimarySourcesBlock } from '@/components/PrimarySourcesBlock';
import { ArchivedContentBanner } from '@/components/ArchivedContentBanner';
import { TaxonomyLink } from '@/components/TaxonomyLink';
import {
  estimateReadTime,
  getBlogPost,
  getBlogPosts,
  getLanguages,
  buildBacklinks,
  getGlossary,
  getAlternateLanguages,
  getContentEpistemicStatus,
  getContentStatusNote,
  normalizeEdgeScopeTag,
  normalizePrimarySources,
  matchesPerspectiveView,
} from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { generatePageMetadata } from '@/lib/metadata';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const posts = getBlogPosts(lang);
    for (const post of posts) {
      if (post.frontmatter.id && matchesPerspectiveView(post.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: post.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const post = getBlogPost(lang, id);
  if (!post) return { title: 'Not Found' };

  const fm = post.frontmatter;
  const postUrl = `/${lang}/blog/${fm.id}`;
  const alternates = getAlternateLanguages('blog', fm.id);
  const epistemicStatus = getContentEpistemicStatus('blog', fm);

  return generatePageMetadata({
    type: 'article',
    title: fm.title,
    description: fm.abstract || '',
    url: postUrl,
    lang,
    publishedTime: fm.date,
    author: fm.author || 'H. Servat',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    section: 'Blog',
    noindex: epistemicStatus === 'archive',
  }, alternates);
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, id } = await params;
  const post = getBlogPost(lang, id);
  if (!post) notFound();
  if (!matchesPerspectiveView(post.frontmatter.perspective, 'kasra')) notFound();

  const basePath = `/${lang}`;
  const backlinks = buildBacklinks(lang, 'kasra');
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = post.frontmatter;
  const epistemicStatus = getContentEpistemicStatus('blog', fm);
  const statusNote = getContentStatusNote('blog', fm);
  const scopeTag = normalizeEdgeScopeTag(fm.scopeTag);
  const primarySources = normalizePrimarySources(fm.primarySources);
  const readTime = fm.read_time || estimateReadTime(post.body);
  const tocItems = extractTocItems(post.body).filter((t) => t.level === 2);
  const renderedBody = renderMarkdown(post.body, lang, glossary, basePath);

  // Build BlogPostMeta for schema
  const blogMeta: BlogPostMeta = {
    id: fm.id,
    title: fm.title || 'Untitled Post',
    description: fm.abstract || '',
    author: fm.author,
    date: fm.date || '',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    lang,
    wordCount: post.body.split(/\s+/).length,
  };

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'blog', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  return (
    <>
      <SchemaScript data={schemaBlogPostPage(blogMeta)} />

      <PageShell
        leftMobile={<BlogSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<BlogSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
        {/* Breadcrumb */}
        <nav className="text-sm text-frc-text-dim mb-8">
          <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
          <span className="mx-2 text-frc-blue">/</span>
          <Link href={`${basePath}/blog`} className="hover:text-frc-gold transition-colors">Field Notes</Link>
          <span className="mx-2 text-frc-blue">/</span>
          <span className="text-frc-text">{post.frontmatter.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8 pb-6 border-b border-frc-blue">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <EpistemicBadge status={epistemicStatus} lang={lang} />
            {scopeTag && <EdgeScopeBadge scopeTag={scopeTag} lang={lang} />}
          </div>
          <h1 className="text-3xl sm:text-[2.125rem] font-light text-frc-gold tracking-[-0.025em] leading-[1.15] mb-3">
            {post.frontmatter.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim items-center tabular-nums">
            <span>{post.frontmatter.author || 'Hadi Servat'}</span>
            {post.frontmatter.date && <span>{post.frontmatter.date}</span>}
            <span className="font-mono text-[0.8125rem] text-frc-steel">{readTime}</span>
          </div>

          {scopeTag && epistemicStatus !== 'archive' && (
            <EdgeScopeBadge scopeTag={scopeTag} lang={lang} variant="banner" basePath={basePath} />
          )}

          {statusNote && (
            epistemicStatus === 'archive' ? (
              <ArchivedContentBanner lang={lang} note={statusNote} />
            ) : (
              <p className="mt-4 border-s-2 border-frc-gold/60 ps-3.5 text-sm text-frc-text-dim">
                {statusNote}
              </p>
            )
          )}
          {Array.isArray(post.frontmatter.tags) && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.frontmatter.tags.map(tag => <TaxonomyLink key={tag} taxon={tag} basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />)}
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

        {post.frontmatter.abstract && (
          <blockquote className="border-s-2 border-frc-gold ps-5 text-base text-frc-text-dim leading-relaxed max-w-[65ch] mb-8">
            {post.frontmatter.abstract}
          </blockquote>
        )}

        <div className="content-body min-w-0 max-w-full overflow-x-hidden" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

        <PrimarySourcesBlock sources={primarySources} lang={lang} />

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

        {/* Related Content */}
        <RelatedContent
          relatedIds={Array.isArray(fm.related) ? fm.related : []}
          tags={Array.isArray(fm.tags) ? fm.tags : []}
          currentId={id}
          glossary={glossary}
          basePath={basePath}
          lang={lang}
        />
      </PageShell>
    </>
  );
}
