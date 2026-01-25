import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { BlogSidebar } from '@/components/BlogSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { VoiceTag } from '@/components/VoiceTag';
import { estimateReadTime, getBlogPost, getBlogPosts, getLanguages, toPaperMeta, buildBacklinks, getGlossary, matchesPerspectiveView } from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const posts = getBlogPosts(lang);
    for (const post of posts) {
      if (post.frontmatter.id && matchesPerspectiveView(post.frontmatter.perspective, 'river')) {
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
  if (!matchesPerspectiveView(post.frontmatter.perspective, 'river')) return { title: 'Not Found' };

  const fm = post.frontmatter;
  const postUrl = `https://fractalresonance.com/${lang}/river/blog/${fm.id}`;

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    alternates: { canonical: postUrl },
    openGraph: {
      type: 'article',
      title: fm.title,
      description: fm.abstract,
      publishedTime: fm.date,
      locale: lang,
    },
  };
}

export default async function RiverBlogPostPage({ params }: Props) {
  const { lang, id } = await params;
  const post = getBlogPost(lang, id);
  if (!post) notFound();
  if (!matchesPerspectiveView(post.frontmatter.perspective, 'river')) notFound();

  const basePath = `/${lang}/river`;
  const meta = toPaperMeta(post);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'river' });
  const fm = post.frontmatter;
  const readTime = fm.read_time || estimateReadTime(post.body);
  const tocItems = extractTocItems(post.body);
  const renderedBody = renderMarkdown(post.body, lang, glossary, basePath);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'blog', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const voice = fm.voice || (fm.perspective === 'river' ? 'river' : fm.perspective === 'kasra' ? 'kasra' : undefined);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<BlogSidebar lang={lang} currentId={id} basePath={basePath} view="river" variant="mobile" />}
        leftDesktop={<BlogSidebar lang={lang} currentId={id} basePath={basePath} view="river" />}
        right={<TableOfContents items={tocItems} />}
      >
        <nav className="text-sm text-frc-text-dim mb-8">
          <a href={`/${lang}/river`} className="hover:text-frc-gold">River</a>
          <span className="mx-2">/</span>
          <a href={`${basePath}/blog`} className="hover:text-frc-gold">Blog</a>
          <span className="mx-2">/</span>
          <span className="text-frc-text">{post.frontmatter.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-light text-frc-gold mb-3">
            {post.frontmatter.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim items-center">
            <VoiceTag voice={voice} />
            {post.frontmatter.date && <span>{post.frontmatter.date}</span>}
            <span className="font-mono text-xs">{readTime}</span>
          </div>
          {post.frontmatter.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.frontmatter.tags.map(tag => (
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

        {post.frontmatter.abstract && (
          <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
            {post.frontmatter.abstract}
          </blockquote>
        )}

        <div className="content-body" suppressHydrationWarning>
          <MarkdownContent html={renderedBody} glossary={glossary} />
        </div>

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

