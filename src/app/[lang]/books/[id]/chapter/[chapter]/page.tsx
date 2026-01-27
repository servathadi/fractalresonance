import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { BooksSidebar } from '@/components/BooksSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { BookExperience } from '@/components/BookExperience';
import { ContentDigest } from '@/components/ContentDigest';
import {
  estimateReadTime,
  getBook,
  getBooks,
  getBookChapters,
  getLanguages,
  toPaperMeta,
  getGlossary,
  getAlternateLanguages,
  matchesPerspectiveView,
} from '@/lib/content';
import { schemaPaperPage } from '@/lib/schema';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string; id: string; chapter: string }>;
}

/** Convert filename to URL-safe slug */
function toSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/** Strip leading heading from chapter body (it's shown in header already) */
function stripLeadingHeading(body: string): string {
  const lines = body.split('\n');
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Skip the first heading (any level)
    if (/^#{1,6}\s+/.test(line)) {
      start = i + 1;
      break;
    }
    break; // Non-empty, non-heading line - don't strip anything
  }
  return lines.slice(start).join('\n').trim();
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: Array<{ lang: string; id: string; chapter: string }> = [];
  const seen = new Set<string>();

  for (const lang of languages) {
    const books = getBooks(lang).filter((b) => matchesPerspectiveView(b.frontmatter.perspective, 'kasra'));
    for (const book of books) {
      const chapters = getBookChapters(lang, book.frontmatter.id);
      for (const c of chapters) {
        const slug = toSlug(c.filename);
        const key = `${lang}:${book.frontmatter.id}:${slug}`;
        if (seen.has(key)) continue;
        seen.add(key);
        params.push({ lang, id: book.frontmatter.id, chapter: slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id, chapter } = await params;
  const book = getBook(lang, id);
  if (!book) return { title: 'Not Found' };
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'kasra')) return { title: 'Not Found' };

  const chapters = getBookChapters(lang, id);
  const ch = chapters.find((c) => toSlug(c.filename) === chapter);
  if (!ch) return { title: 'Not Found' };

  const fm = book.frontmatter;
  const author = fm.author || 'H. Servat';
  const bookUrl = `https://fractalresonance.com/${lang}/books/${fm.id}`;
  const chapterUrl = `${bookUrl}/chapter/${chapter}`;
  const alternates = getAlternateLanguages('books', fm.id);

  return {
    title: `${fm.title} — ${ch.title}`,
    description: fm.abstract,
    keywords: Array.isArray(fm.tags) ? [...fm.tags, 'chapter'] : ['chapter'],
    authors: [{ name: author }],
    alternates: {
      canonical: chapterUrl,
      languages: alternates,
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'book',
      title: `${fm.title} — ${ch.title}`,
      description: fm.abstract,
      authors: [author],
      tags: fm.tags,
      locale: lang,
      url: chapterUrl,
    },
  };
}

export default async function BookChapterPage({ params }: Props) {
  const { lang, id, chapter } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'kasra')) notFound();

  const basePath = `/${lang}`;
  const meta = toPaperMeta(book);
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = book.frontmatter;

  // Get chapters directly from chapter files
  const chapters = getBookChapters(lang, id);
  const chapterItems = chapters.map((c) => ({
    slug: toSlug(c.filename),
    title: c.title,
    anchorId: toSlug(c.filename),
  }));

  const idx = chapterItems.findIndex((c) => c.slug === chapter);
  if (idx === -1) notFound();

  const current = chapters[idx];
  const prev = idx > 0 ? chapterItems[idx - 1] : null;
  const next = idx + 1 < chapterItems.length ? chapterItems[idx + 1] : null;

  // Per-chapter read time (not whole book)
  const readTime = estimateReadTime(current.body);

  // Strip the leading heading from content (it's shown in header)
  const contentBody = stripLeadingHeading(current.body);
  const renderedBody = renderMarkdown(contentBody, lang, glossary, basePath);

  // Extract section headings for TOC (level 2-3 within chapter)
  const tocItems = extractTocItems(contentBody).filter((t) => t.level <= 3);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />
      <BookExperience />

      <PageShell
        leftMobile={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} activeChapterSlug={chapter} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} activeChapterSlug={chapter} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} minBreakpoint="lg" title="In this chapter" />}
        articleClassName="pt-14"
      >
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={basePath} className="hover:text-frc-gold">FRC</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/books`} className="hover:text-frc-gold">Books</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/books/${id}`} className="hover:text-frc-gold">{book.frontmatter.title}</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{current.title}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-light text-frc-gold mb-2">{book.frontmatter.title}</h1>
            <p className="text-frc-text-dim">{current.title}</p>

            <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim mt-3">
              <span>{book.frontmatter.author || 'H. Servat'}</span>
              {book.frontmatter.date && <span>{book.frontmatter.date}</span>}
              <span className="font-mono text-xs">{readTime}</span>
              <Link href={`${basePath}/books/${id}`} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
                Full book
              </Link>
            </div>
          </header>

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={(fm.prerequisites || []).map((pid) => ({ id: pid, title: pid, href: `${basePath}/concepts/${pid}` }))}
            readTime={readTime}
          />

          <div className="flex items-center justify-between gap-4 my-8">
            {prev ? (
              <Link className="text-sm text-frc-text-dim hover:text-frc-gold" href={`${basePath}/books/${id}/chapter/${prev.slug}`}>
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="text-sm text-frc-text-dim hover:text-frc-gold text-right" href={`${basePath}/books/${id}/chapter/${next.slug}`}>
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>

          <InlineToc items={tocItems} />

          <div className="content-body" suppressHydrationWarning>
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>

          {next && (
            <div className="mt-12 pt-8 border-t border-frc-blue/30">
              <Link className="inline-flex items-center gap-2 text-frc-gold hover:underline" href={`${basePath}/books/${id}/chapter/${next.slug}`}>
                Continue: {next.title} →
              </Link>
            </div>
          )}
      </PageShell>
    </>
  );
}
