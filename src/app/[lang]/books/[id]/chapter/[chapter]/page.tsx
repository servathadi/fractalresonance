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
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { ArchivedBookBanner } from '@/components/ArchivedBookBanner';
import {
  estimateReadTime,
  getBook,
  getBooks,
  getBookChapters,
  getLanguages,
  getGlossary,
  getAlternateLanguages,
  getContentEpistemicStatus,
  matchesPerspectiveView,
} from '@/lib/content';
import { schemaChapterPage, type ChapterMeta } from '@/lib/schema';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { generatePageMetadata } from '@/lib/metadata';

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
  const chapterUrl = `/${lang}/books/${fm.id}/chapter/${chapter}`;
  const alternates = getAlternateLanguages('books', fm.id);
  const isArchived = getContentEpistemicStatus('book', fm) === 'archive' || fm.noindex === true;

  return {
    ...generatePageMetadata({
      type: 'book',
      title: `${fm.title} — ${ch.title}`,
      description: fm.abstract || '',
      url: chapterUrl,
      lang,
      author,
      tags: Array.isArray(fm.tags) ? [...fm.tags, 'chapter'] : ['chapter'],
      noindex: isArchived,
    }, alternates),
    robots: isArchived ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function BookChapterPage({ params }: Props) {
  const { lang, id, chapter } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'kasra')) notFound();

  const basePath = `/${lang}`;
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

  // Build ChapterMeta for schema
  const chapterMeta: ChapterMeta = {
    id: chapter,
    title: current.title,
    description: fm.abstract,
    position: idx + 1,
    bookId: id,
    lang,
  };

  // Strip the leading heading from content (it's shown in header)
  const contentBody = stripLeadingHeading(current.body);
  const renderedBody = renderMarkdown(contentBody, lang, glossary, basePath);

  // Extract section headings for TOC (level 2-3 within chapter)
  const tocItems = extractTocItems(contentBody).filter((t) => t.level <= 3);

  return (
    <>
      <SchemaScript data={schemaChapterPage(chapterMeta, fm.title || 'Untitled Book')} />
      <BookExperience />

      <PageShell
        leftMobile={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} activeChapterSlug={chapter} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} activeChapterSlug={chapter} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} minBreakpoint="lg" title="In this chapter" />}
        articleClassName="pt-14"
      >
          <nav className="text-sm text-frc-text-dim mb-8 flex flex-wrap items-center gap-y-1">
            <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
            <span className="mx-2 text-frc-blue">/</span>
            <Link href={`${basePath}/books`} className="hover:text-frc-gold transition-colors">Books</Link>
            <span className="mx-2 text-frc-blue">/</span>
            <Link href={`${basePath}/books/${id}`} className="hover:text-frc-gold transition-colors">{book.frontmatter.title}</Link>
          </nav>

          <header className="mb-10 pb-7 border-b border-frc-blue">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <EpistemicBadge
                status={getContentEpistemicStatus('book', fm)}
                lang={lang}
              />
              <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">
                {idx + 1} / {chapterItems.length}
              </span>
            </div>
            <Link
              href={`${basePath}/books/${id}`}
              className="inline-block text-sm text-frc-text-dim hover:text-frc-gold transition-colors mb-2"
            >
              {book.frontmatter.title}
            </Link>
            <h1 className="text-3xl sm:text-[2.125rem] font-light text-frc-gold tracking-[-0.025em] leading-[1.16] mb-4">
              {current.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-frc-text-dim tabular-nums">
              <span>{book.frontmatter.author || 'Hadi Servat'}</span>
              {book.frontmatter.date && <span>{book.frontmatter.date}</span>}
              <span className="font-mono text-[0.8125rem] text-frc-steel">{readTime}</span>
              <Link href={`${basePath}/books/${id}`} className="text-frc-gold hover:underline">
                Book contents
              </Link>
            </div>
          </header>

          {getContentEpistemicStatus('book', fm) === 'archive' && (
            <ArchivedBookBanner lang={lang} bookId={fm.id} statusNote={fm.statusNote} />
          )}

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={(fm.prerequisites || []).map((pid) => ({ id: pid, title: pid, href: `${basePath}/concepts/${pid}` }))}
            readTime={readTime}
          />

          <InlineToc items={tocItems} title="In this chapter" />

          <div className="content-body min-w-0 max-w-full overflow-x-hidden" suppressHydrationWarning>
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>

          {/* Unobtrusive chapter navigation footer */}
          <nav
            aria-label="Chapter navigation"
            className="mt-14 pt-8 border-t border-frc-blue grid sm:grid-cols-2 gap-6"
          >
            <div>
              {prev ? (
                <Link
                  className="group block py-1"
                  href={`${basePath}/books/${id}/chapter/${prev.slug}`}
                >
                  <span className="block text-[0.8125rem] text-frc-steel mb-1">Previous chapter</span>
                  <span className="text-base text-frc-text group-hover:text-frc-gold transition-colors">
                    ← {prev.title}
                  </span>
                </Link>
              ) : (
                <Link className="group block py-1" href={`${basePath}/books/${id}`}>
                  <span className="block text-[0.8125rem] text-frc-steel mb-1">Book overview</span>
                  <span className="text-base text-frc-text group-hover:text-frc-gold transition-colors">
                    ← {book.frontmatter.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-end">
              {next ? (
                <Link
                  className="group block py-1"
                  href={`${basePath}/books/${id}/chapter/${next.slug}`}
                >
                  <span className="block text-[0.8125rem] text-frc-steel mb-1">Next chapter</span>
                  <span className="text-base text-frc-gold group-hover:underline">
                    {next.title} →
                  </span>
                </Link>
              ) : (
                <Link className="group block py-1" href={`${basePath}/books/${id}`}>
                  <span className="block text-[0.8125rem] text-frc-steel mb-1">End of book</span>
                  <span className="text-base text-frc-gold group-hover:underline">
                    Back to contents →
                  </span>
                </Link>
              )}
            </div>
          </nav>
      </PageShell>
    </>
  );
}
