import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { ContentDigest } from '@/components/ContentDigest';
import { BooksSidebar } from '@/components/BooksSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { RiverInterpretationNotice } from '@/components/PerspectiveNotice';
import {
  estimateReadTime,
  getBook,
  getBooks,
  getLanguages,
  toPaperMeta,
  buildBacklinks,
  getGlossary,
  getAlternateLanguages,
  normalizeContentPerspective,
  matchesPerspectiveView,
} from '@/lib/content';
import { schemaPaperPage } from '@/lib/schema';
import { getChapterList } from '@/lib/bookChapters';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const books = getBooks(lang);
    for (const book of books) {
      if (book.frontmatter.id && matchesPerspectiveView(book.frontmatter.perspective, 'river')) {
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
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'river')) return { title: 'Not Found' };

  const fm = book.frontmatter;
  const author = fm.author || 'H. Servat';
  const norm = normalizeContentPerspective(fm.perspective);
  const canonicalUrl =
    norm === 'river'
      ? `https://fractalresonance.com/${lang}/river/books/${fm.id}`
      : `https://fractalresonance.com/${lang}/books/${fm.id}`;
  const alternates = getAlternateLanguages('books', fm.id);

  return {
    title: `${fm.title} (River)`,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    ...(norm === 'river' ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: 'book',
      title: fm.title,
      description: fm.abstract,
      authors: [author],
      tags: fm.tags,
      locale: lang,
    },
  };
}

export default async function RiverBookPage({ params }: Props) {
  const { lang, id } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'river')) notFound();

  const basePath = `/${lang}/river`;
  const kasraBase = `/${lang}`;
  const meta = toPaperMeta(book);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'river' });
  const fm = book.frontmatter;
  const readTime = fm.read_time || estimateReadTime(book.body);
  const norm = normalizeContentPerspective(fm.perspective);
  const canonicalHref = `${kasraBase}/books/${fm.id}`;

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'contact', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const chapterItems = getChapterList(book.body);
  const tocItems = chapterItems.map((c) => ({ id: c.anchorId, text: c.title, level: 1 }));
  const startChapter = chapterItems[0]?.slug;

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} basePath={basePath} view="river" variant="mobile" />}
        leftDesktop={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} basePath={basePath} view="river" />}
        right={<TableOfContents items={tocItems} minBreakpoint="md" title="Book index" />}
      >
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={`/${lang}/river`} className="hover:text-frc-gold">River</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/books`} className="hover:text-frc-gold">Books</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{book.frontmatter.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-light text-frc-gold mb-3">
              {book.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
              <span>{book.frontmatter.author || 'H. Servat'}</span>
              {book.frontmatter.date && <span>{book.frontmatter.date}</span>}
              <span className="font-mono text-xs">{readTime}</span>
            </div>
            {book.frontmatter.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {book.frontmatter.tags.map(tag => (
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

          {norm !== 'river' ? <RiverInterpretationNotice canonicalHref={canonicalHref} /> : null}

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={prereqLinks}
            readTime={readTime}
          />

          <InlineToc items={tocItems} title="Book index" />

          <section className="mb-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs text-frc-steel uppercase tracking-widest">Reading</h2>
              <div className="flex flex-wrap gap-3">
                {startChapter ? (
                  <Link
                    href={`${basePath}/books/${id}/chapter/${startChapter}`}
                    className="px-4 py-2 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-xs uppercase tracking-wider transition-colors"
                  >
                    Start reading
                  </Link>
                ) : null}
                <Link
                  href={canonicalHref}
                  className="px-4 py-2 border border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold text-xs uppercase tracking-wider transition-colors"
                >
                  Full book (Kasra)
                </Link>
              </div>
            </div>
          </section>

          {chapterItems.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs text-frc-steel uppercase tracking-widest mb-3">Chapters</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {chapterItems.map((c, idx) => (
                  <Link
                    key={c.slug}
                    href={`${basePath}/books/${id}/chapter/${c.slug}`}
                    className="card block p-4 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-frc-steel shrink-0 tabular-nums mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-frc-text group-hover:text-frc-gold transition-colors">
                        {c.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Backlinks */}
          {pageBacklinks.length > 0 && (
            <section className="mt-12 pt-8 border-t border-frc-blue/30">
              <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-3">
                Linked from
              </h3>
              <ul className="space-y-1">
                {pageBacklinks.map((linkId) => {
                  const item = glossary[linkId];
                  const href = item?.url || `${basePath}/concepts/${linkId}`;
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
