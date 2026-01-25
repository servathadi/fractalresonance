import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingMode } from '@/components/ReadingMode';
import { getBook, getBooks, getLanguages, toPaperMeta, buildBacklinks, getGlossary, getAlternateLanguages } from '@/lib/content';
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

  const renderedBody = renderMarkdown(book.body, lang);
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

          {/* Abstract */}
          {book.frontmatter.abstract && (
            <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
              {book.frontmatter.abstract}
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
                {pageBacklinks.map(linkId => (
                  <li key={linkId}>
                    <a
                      href={`/${lang}/papers/${linkId}`}
                      className="text-frc-gold hover:underline text-sm"
                    >
                      {linkId}
                    </a>
                  </li>
                ))}
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
