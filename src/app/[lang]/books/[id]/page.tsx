import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingMode } from '@/components/ReadingMode';
import { estimateReadTime, getBook, getBooks, getBookChapters, getLanguages, toPaperMeta, buildBacklinks, getGlossary, getAlternateLanguages } from '@/lib/content';
import { schemaPaperPage } from '@/lib/schema';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const books = getBooks(lang);
    for (const book of books) {
      if (book.frontmatter.id) {
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
  const bookUrl = `https://fractalresonance.com/${lang}/books/${fm.id}`;
  const alternates = getAlternateLanguages('books', fm.id);

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: bookUrl,
      languages: alternates,
    },
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

export default async function BookPage({ params }: Props) {
  const { lang, id } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();

  const meta = toPaperMeta(book);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang);
  const fm = book.frontmatter;
  const readTime = fm.read_time || estimateReadTime(book.body);
  const chapters = getBookChapters(lang, id);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `/${lang}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `/${lang}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(book.body, lang, glossary);
  const tocItems = extractTocItems(book.body);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <main className="min-h-screen flex">
        <Sidebar lang={lang} currentId={id} />
        <article className="flex-1 max-w-3xl mx-auto px-6 py-12 min-w-0">
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href="/" className="hover:text-frc-gold">FRC</a>
            <span className="mx-2">/</span>
            <a href={`/${lang}/books`} className="hover:text-frc-gold">Books</a>
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
                    href={`/${lang}/tags/${encodeURIComponent(tag)}`}
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

          {/* Abstract */}
          {book.frontmatter.abstract && (
            <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
              {book.frontmatter.abstract}
            </blockquote>
          )}

          {/* Body */}
          {chapters.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs text-frc-steel uppercase tracking-widest mb-3">Chapters</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {chapters.map((c, idx) => (
                  <a
                    key={c.filename}
                    href={`#${c.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}`}
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
                  </a>
                ))}
              </div>
            </section>
          )}

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
                  const href = item?.url || `/${lang}/papers/${linkId}`;
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
        </article>
        <TableOfContents items={tocItems} />
      </main>
      <ReadingMode />
    </>
  );
}
