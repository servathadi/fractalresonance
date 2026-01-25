import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { BooksSidebar } from '@/components/BooksSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getBook,
  getBooks,
  getLanguages,
  toPaperMeta,
  getGlossary,
  getAlternateLanguages,
  matchesPerspectiveView,
} from '@/lib/content';
import { schemaPaperPage } from '@/lib/schema';
import { deriveChaptersFromMarkdown, findChapterBySlug, getChapterList } from '@/lib/bookChapters';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string; id: string; chapter: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: Array<{ lang: string; id: string; chapter: string }> = [];
  const seen = new Set<string>();

  for (const lang of languages) {
    const books = getBooks(lang).filter((b) => matchesPerspectiveView(b.frontmatter.perspective, 'river'));
    for (const book of books) {
      const full = getBook(lang, book.frontmatter.id);
      if (!full) continue;
      const chapters = getChapterList(full.body);
      for (const c of chapters) {
        const key = `${lang}:${book.frontmatter.id}:${c.slug}`;
        if (seen.has(key)) continue;
        seen.add(key);
        params.push({ lang, id: book.frontmatter.id, chapter: c.slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id, chapter } = await params;
  const book = getBook(lang, id);
  if (!book) return { title: 'Not Found' };
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'river')) return { title: 'Not Found' };

  const ch = findChapterBySlug(book.body, chapter);
  if (!ch) return { title: 'Not Found' };

  const fm = book.frontmatter;
  const author = fm.author || 'H. Servat';
  const canonicalBookUrl = `https://fractalresonance.com/${lang}/books/${fm.id}`;
  const chapterUrl = `https://fractalresonance.com/${lang}/river/books/${fm.id}/chapter/${ch.slug}`;
  const alternates = getAlternateLanguages('books', fm.id);

  return {
    title: `${fm.title} — ${ch.title}`,
    description: fm.abstract,
    keywords: [...(fm.tags || []), 'chapter'],
    authors: [{ name: author }],
    alternates: {
      canonical: canonicalBookUrl,
      languages: alternates,
    },
    robots: { index: false, follow: true },
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

export default async function RiverBookChapterPage({ params }: Props) {
  const { lang, id, chapter } = await params;
  const book = getBook(lang, id);
  if (!book) notFound();
  if (!matchesPerspectiveView(book.frontmatter.perspective, 'river')) notFound();

  const basePath = `/${lang}/river`;
  const meta = toPaperMeta(book);
  const glossary = getGlossary(lang, { basePath, view: 'river' });
  const fm = book.frontmatter;
  const readTime = fm.read_time || estimateReadTime(book.body);

  const derived = deriveChaptersFromMarkdown(book.body);
  const current = derived.find((c) => c.slug === chapter) || null;
  if (!current) notFound();

  const idx = derived.findIndex((c) => c.slug === chapter);
  const prev = idx > 0 ? derived[idx - 1] : null;
  const next = idx >= 0 && idx + 1 < derived.length ? derived[idx + 1] : null;

  const renderedBody = renderMarkdown(current.markdown, lang, glossary, basePath);
  const tocItems = extractTocItems(current.markdown).filter((t) => t.level === 2);
  const chapterItems = getChapterList(book.body);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} activeChapterSlug={chapter} basePath={basePath} view="river" variant="mobile" />}
        leftDesktop={<BooksSidebar lang={lang} currentId={id} chapters={chapterItems} activeChapterSlug={chapter} basePath={basePath} view="river" />}
        right={<TableOfContents items={tocItems} minBreakpoint="lg" title="In this chapter" />}
      >
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={`/${lang}/river`} className="hover:text-frc-gold">River</a>
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

          <article className="prose prose-invert max-w-none">
            <MarkdownContent html={renderedBody} />
          </article>

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

