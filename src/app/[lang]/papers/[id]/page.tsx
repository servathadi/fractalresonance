import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingMode } from '@/components/ReadingMode';
import { estimateReadTime, getPaper, getPapers, getLanguages, toPaperMeta, buildBacklinks, getGlossary, getAlternateLanguages } from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const papers = getPapers(lang);
    for (const paper of papers) {
      if (paper.frontmatter.id) {
        params.push({ lang, id: paper.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const paper = getPaper(lang, id);
  if (!paper) return { title: 'Not Found' };

  const fm = paper.frontmatter;
  const author = fm.author || 'H. Servat';
  const paperUrl = `https://fractalresonance.com/${lang}/papers/${fm.id}`;
  const alternates = getAlternateLanguages('papers', fm.id);

  return {
    title: fm.title,
    description: fm.abstract,
    keywords: fm.tags,
    authors: [{ name: author }],
    alternates: {
      canonical: paperUrl,
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
    other: {
      // Google Scholar meta tags
      'citation_title': fm.title,
      'citation_author': author,
      ...(fm.date && { 'citation_publication_date': fm.date }),
      'citation_journal_title': 'Fractal Resonance Coherence',
      ...(fm.doi && { 'citation_doi': fm.doi }),
      'citation_abstract_html_url': paperUrl,
      'citation_language': lang,
      ...(fm.id && { 'citation_technical_report_number': fm.id }),
      // Dublin Core for additional discoverability
      'DC.title': fm.title,
      'DC.creator': author,
      ...(fm.date && { 'DC.date': fm.date }),
      'DC.type': 'Text',
      'DC.format': 'text/html',
      'DC.language': lang,
      ...(fm.doi && { 'DC.identifier': `doi:${fm.doi}` }),
    },
  };
}

export default async function PaperPage({ params }: Props) {
  const { lang, id } = await params;
  const paper = getPaper(lang, id);
  if (!paper) notFound();

  const meta = toPaperMeta(paper);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang);
  const fm = paper.frontmatter;
  const readTime = fm.read_time || estimateReadTime(paper.body);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `/${lang}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `/${lang}/concepts/${pid}` };
  });

  // Content is from trusted local markdown files (not user input).
  // Rendered at build time via static generation.
  const renderedBody = renderMarkdown(paper.body, lang, glossary);
  const tocItems = extractTocItems(paper.body);

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
            <a href={`/${lang}/papers`} className="hover:text-frc-gold">Papers</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{paper.frontmatter.id}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-light text-frc-gold mb-3">
              {paper.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-frc-text-dim">
              <span>{paper.frontmatter.author || 'H. Servat'}</span>
              <span>{paper.frontmatter.date}</span>
              <span className="font-mono text-xs">{readTime}</span>
              {paper.frontmatter.series && (
                <span className="tag">{paper.frontmatter.series}</span>
              )}
            </div>
            {paper.frontmatter.doi && (
              <div className="mt-3">
                <a
                  href={`https://zenodo.org/doi/${paper.frontmatter.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 border border-frc-blue rounded-md text-frc-text-dim hover:text-frc-gold hover:border-frc-gold transition-colors"
                >
                  <span>DOI</span>
                  <span className="text-frc-text">{paper.frontmatter.doi}</span>
                </a>
              </div>
            )}
            {paper.frontmatter.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {paper.frontmatter.tags.map(tag => (
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

          {/* Video embed (if available) */}
          {meta.video && (
            <div className="mb-8 rounded-lg overflow-hidden border border-frc-blue">
              {meta.video.embedUrl ? (
                <iframe
                  src={meta.video.embedUrl}
                  className="w-full aspect-video"
                  allowFullScreen
                  title={`${paper.frontmatter.title} — Video Explainer`}
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

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={prereqLinks}
            readTime={readTime}
          />

          {/* Abstract */}
          {paper.frontmatter.abstract && (
            <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
              {paper.frontmatter.abstract}
            </blockquote>
          )}

          {/* Body — rendered from trusted local markdown files at build time */}
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

          {/* Rating */}
          {meta.rating && (
            <div className="mt-8 text-sm text-frc-text-dim">
              Rating: {meta.rating.value}/{meta.rating.best || 5} ({meta.rating.count} reviews)
            </div>
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
