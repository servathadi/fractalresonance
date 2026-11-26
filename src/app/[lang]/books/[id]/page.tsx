import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { BooksSidebar } from '@/components/BooksSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { RelatedContent } from '@/components/RelatedContent';
import { BookExperience } from '@/components/BookExperience';
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { ArchivedBookBanner } from '@/components/ArchivedBookBanner';
import { TaxonomyLink } from '@/components/TaxonomyLink';
import { estimateReadTime, getBook, getBooks, getBookChapters, getLanguages, buildBacklinks, getGlossary, getAlternateLanguages, getContentEpistemicStatus, matchesPerspectiveView } from '@/lib/content';
import { schemaBookPage, type BookMeta, type ChapterMeta } from '@/lib/schema';
import { renderMarkdown } from '@/lib/markdown';
import { generatePageMetadata } from '@/lib/metadata';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

const BOOK_PDFS: Record<string, string> = {
  'the-open-system': '/books/the-open-system-v41.pdf',
  'the-mind-in-the-coupling': '/books/the-mind-in-the-coupling-v3.13.pdf',
};

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const books = getBooks(lang);
    for (const book of books) {
      if (book.frontmatter.id && matchesPerspectiveView(book.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: book.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const book = getBook(lang, id);
  if (!book) return { title: 'Not Found' };

  const fm = book.frontmatter;
  const author = fm.author || 'H. Servat';
  const bookUrl = `/${lang}/books/${fm.id}`;
  const alternates = getAlternateLanguages('books', fm.id);
  const isArchived = getContentEpistemicStatus('book', fm) === 'archive' || fm.noindex === true;

  return generatePageMetadata({
    type: 'book',
    title: fm.title,
    description: fm.abstract || '',
    url: bookUrl,
    lang,
    author,
    releaseDate: fm.date,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    noindex: isArchived,
  }, alternates);
}

export default async function BookPage({ params }: Props) {
  const { lang, id } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();

  const basePath = `/${lang}`;
  const backlinks = buildBacklinks(lang, 'kasra');
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = book.frontmatter;

  // Get chapters directly from chapter files (not from combined body)
  const chapters = getBookChapters(lang, id);
  const chapterItems = chapters.map((c) => {
    const slug = c.filename.replace(/\.md$/, '');
    return { slug, title: c.title, anchorId: slug };
  });

  // Build BookMeta for schema
  const bookMeta: BookMeta = {
    id: fm.id,
    title: fm.title || 'Untitled Book',
    description: fm.abstract || '',
    author: fm.author || 'H. Servat',
    lang,
    datePublished: fm.date,
    chapters: chapters.map((c, idx): ChapterMeta => ({
      id: c.filename.replace(/\.md$/, ''),
      title: c.title,
      position: idx + 1,
      bookId: fm.id,
      lang,
    })),
  };

  // Calculate total read time from all chapters
  const totalContent = chapters.map((c) => c.body).join('\n');
  const readTime = fm.read_time || estimateReadTime(totalContent);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  // Only render the book's index content (abstract, intro), not all chapters
  const renderedBody = renderMarkdown(book.body, lang, glossary, basePath);
  const tocItems = chapterItems.map((c) => ({ id: c.anchorId, text: c.title, level: 1 }));

  return (
    <>
      <SchemaScript data={schemaBookPage(bookMeta)} />
      <BookExperience />

      <PageShell
        leftMobile={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} minBreakpoint="md" title="Book index" />}
        articleClassName="pt-14"
      >
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
            <span className="mx-2 text-frc-blue">/</span>
            <Link href={`${basePath}/books`} className="hover:text-frc-gold transition-colors">Books</Link>
            <span className="mx-2 text-frc-blue">/</span>
            <span className="text-frc-text">{book.frontmatter.title}</span>
          </nav>

          {/* Header — academic-press monograph spread */}
          <header className="mb-10 pb-8 border-b border-frc-blue">
            <div className={book.frontmatter.cover ? 'grid sm:grid-cols-[120px_1fr] gap-6 items-start' : ''}>
              {book.frontmatter.cover && (
                <div className="relative aspect-[2/3] w-[112px] sm:w-full border border-frc-blue bg-frc-void-light shrink-0">
                  <Image
                    src={book.frontmatter.cover}
                    alt={`Cover of ${book.frontmatter.title}`}
                    fill
                    sizes="120px"
                    className="object-cover object-top"
                  />
                </div>
              )}
              <div className="min-w-0">
                <EpistemicBadge
                  status={getContentEpistemicStatus('book', fm)}
                  lang={lang}
                  className="mb-3"
                />
                <h1 className="text-3xl sm:text-[2.125rem] font-light text-frc-gold tracking-[-0.025em] leading-[1.15] mb-3">
                  {book.frontmatter.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-frc-text-dim tabular-nums">
                  <span>{book.frontmatter.author || 'Hadi Servat'}</span>
                  {book.frontmatter.version && <span className="font-mono text-frc-gold">{book.frontmatter.version}</span>}
                  {book.frontmatter.date && <span>{book.frontmatter.date}</span>}
                  <span className="font-mono text-[0.8125rem] text-frc-steel">{readTime}</span>
                  {BOOK_PDFS[id] && (
                    <a href={BOOK_PDFS[id]} target="_blank" rel="noopener noreferrer" className="text-frc-gold hover:underline">
                      Download PDF
                    </a>
                  )}
                </div>
                {Array.isArray(book.frontmatter.tags) && book.frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {book.frontmatter.tags.map(tag => (
                      <TaxonomyLink
                        key={tag}
                        taxon={tag}
                        basePath={basePath}
                        lang={lang}
                        className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {getContentEpistemicStatus('book', fm) === 'archive' && (
            <ArchivedBookBanner lang={lang} bookId={fm.id} statusNote={fm.statusNote} />
          )}

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={prereqLinks}
            readTime={readTime}
          />

          {/* Abstract */}
          {book.frontmatter.abstract && (
            <blockquote className="border-s-2 border-frc-gold ps-5 text-base text-frc-text-dim leading-relaxed max-w-[65ch] mb-10">
              {book.frontmatter.abstract}
            </blockquote>
          )}

          <InlineToc items={tocItems} title="Book index" />

          {/* Chapter contents — hairline-ruled academic monograph index */}
          {chapterItems.length > 0 && (
            <section className="mb-10" aria-labelledby="book-chapters-heading">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 id="book-chapters-heading" className="text-xl font-medium text-frc-text tracking-[-0.015em]">
                  Contents
                </h2>
                <Link
                  href={`${basePath}/books/${id}/chapter/${chapterItems[0].slug}`}
                  className="text-sm text-frc-gold hover:underline"
                >
                  Begin reading →
                </Link>
              </div>
              <ol className="divide-y divide-frc-blue/60 border-y border-frc-blue">
                {chapterItems.map((c, idx) => (
                  <li key={c.slug}>
                    <Link
                      href={`${basePath}/books/${id}/chapter/${c.slug}`}
                      className="flex items-baseline justify-between gap-4 py-3.5 group"
                    >
                      <div className="flex items-baseline gap-4 min-w-0">
                        <span className="font-mono text-sm text-frc-steel shrink-0 tabular-nums w-6">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-base text-frc-text group-hover:text-frc-gold transition-colors leading-snug">
                          {c.title}
                        </span>
                      </div>
                      <span className="text-sm text-frc-steel group-hover:text-frc-gold transition-colors shrink-0" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="content-body min-w-0 max-w-full overflow-x-hidden" suppressHydrationWarning>
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
