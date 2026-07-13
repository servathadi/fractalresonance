import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaPaperPage } from '@/lib/schema';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import {
  estimateReadTime,
  getLegacyPaperIds,
  getPaper,
  getPapers,
  getLanguages,
  toPaperMeta,
  buildBacklinks,
  getGlossary,
  getAlternateLanguages,
  getPaperCanonStatus,
  isRevisionPendingPaper,
  normalizeContentPerspective,
  matchesPerspectiveView,
} from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { generatePageMetadata, generateCitationMetadata } from '@/lib/metadata';
import { TierBadge, inferTier } from '@/components/TierBadge';
import { RelatedContent } from '@/components/RelatedContent';
import { DownloadMarkdown } from '@/components/DownloadMarkdown';
import { PaperStatusPanel } from '@/components/PaperStatusPanel';
import { TaxonomyLink } from '@/components/TaxonomyLink';
import { deriveSeriesTaxon } from '@/lib/taxonomy';
import { getMuLevel } from '@/lib/mu-levels';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];
  const seen = new Set<string>();

  for (const lang of languages) {
    const papers = getPapers(lang);
    for (const paper of papers) {
      if (!matchesPerspectiveView(paper.frontmatter.perspective, 'kasra')) continue;
      if (paper.frontmatter.id) {
        for (const legacyId of getLegacyPaperIds(paper.frontmatter.id)) {
          const key = `${lang}:${legacyId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          params.push({ lang, id: legacyId });
        }
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
  const norm = normalizeContentPerspective(fm.perspective);
  const canonicalUrl = `/${lang}/papers/${fm.id}`;
  const alternates = getAlternateLanguages('papers', fm.id);

  const ogImage = fm.video?.thumbnailUrl;

  const baseMetadata = generatePageMetadata({
    type: 'article',
    title: fm.title,
    description: fm.abstract || '',
    url: canonicalUrl,
    lang,
    publishedTime: fm.date,
    author,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    section: 'Research Papers',
    noindex: norm === 'river' || isRevisionPendingPaper(fm.id) || fm.publicationState?.toLowerCase() === 'revision pending',
    image: ogImage,
  }, alternates);

  return {
    ...baseMetadata,
    other: generateCitationMetadata({
      title: fm.title,
      author,
      date: fm.date,
      doi: fm.doi,
      id: fm.id,
      lang,
      url: `https://fractalresonance.com${canonicalUrl}`,
    }),
  };
}

export default async function PaperPage({ params }: Props) {
  const { lang, id } = await params;
  const paper = getPaper(lang, id);
  if (!paper) notFound();
  const norm = normalizeContentPerspective(paper.frontmatter.perspective);
  if (!matchesPerspectiveView(paper.frontmatter.perspective, 'kasra')) notFound();

  const basePath = `/${lang}`;
  const canonicalId = paper.frontmatter.id;
  const hasPdf = fs.existsSync(path.join(process.cwd(), 'public', 'paper-pdfs', `${canonicalId}.pdf`));
  const meta = toPaperMeta(paper);
  const backlinks = buildBacklinks(lang, 'kasra');
  const pageBacklinks = backlinks[canonicalId] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = paper.frontmatter;
  const seriesTaxon = deriveSeriesTaxon(fm.id);
  const readTime = fm.read_time || estimateReadTime(paper.body);
  const canonStatus = getPaperCanonStatus(fm);
  const muLevel = getMuLevel(fm.muLevel);
  const doiEntries = [
    fm.conceptDoi ? { label: 'Concept DOI', value: fm.conceptDoi } : null,
    fm.doi && fm.doi !== fm.conceptDoi ? { label: 'DOI', value: fm.doi } : null,
  ].filter((entry): entry is { label: string; value: string } => entry !== null);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  // Content is from trusted local markdown files (not user input).
  // Rendered at build time via static generation.
  const renderedBody = renderMarkdown(paper.body, lang, glossary, basePath);
  const tocItems = extractTocItems(paper.body).filter((t) => t.level === 2);

  return (
    <>
      <SchemaScript data={schemaPaperPage(meta)} />

      <PageShell
        leftMobile={<Sidebar lang={lang} currentId={canonicalId} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<Sidebar lang={lang} currentId={canonicalId} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
        articleClassName="w-full"
      >
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={basePath} className="hover:text-frc-gold">FRC</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/papers`} className="hover:text-frc-gold">Papers</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{canonicalId}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="min-w-0">
                <div className="font-mono text-xs text-frc-gold mb-2">
                  {fm.id}{fm.version ? ` · ${fm.version}` : ''}
                </div>
                <h1 className="text-3xl font-light text-frc-gold mb-3">
                  {fm.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-frc-text-dim">
                  <span>{fm.author || 'H. Servat'}</span>
                  <span>{fm.date}</span>
                  <span className="font-mono text-xs">{readTime}</span>
                  {seriesTaxon ? (
                    <TaxonomyLink taxon={seriesTaxon} basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
                  ) : fm.series ? <span className="tag">{fm.series}</span> : null}
                  <TierBadge tier={inferTier(fm.tier, canonicalId)} lang={lang} size="md" />
                  {muLevel && <span className="tag mu-tag" title={muLevel.description}>{muLevel.symbol} {muLevel.title}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {doiEntries.map(({ label, value }) => (
                    <a
                      key={label}
                      href={`https://doi.org/${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full flex-wrap items-center gap-x-2 text-xs font-mono px-3 py-1.5 border border-frc-blue rounded-md text-frc-text-dim hover:text-frc-gold hover:border-frc-gold transition-colors"
                    >
                      <span>{label}</span>
                      <span className="text-frc-text break-all">{value}</span>
                    </a>
                  ))}
                  {hasPdf && (
                    <a
                      href={`/paper-pdfs/${canonicalId}.pdf`}
                      download
                      title="Download the DOI-stamped PDF (also permanently archived on Zenodo via the DOI)"
                      className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 border border-frc-blue rounded-md text-frc-text-dim hover:text-frc-gold hover:border-frc-gold transition-colors"
                    >
                      <span>PDF</span>
                      <span className="text-frc-text">Download</span>
                    </a>
                  )}
                  <DownloadMarkdown
                    id={canonicalId}
                    title={fm.title}
                    content={paper.raw}
                    lang={lang}
                  />
                </div>
                {Array.isArray(fm.tags) && fm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {fm.tags.map(tag => <TaxonomyLink key={tag} taxon={tag} basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />)}
                  </div>
                )}
            </div>
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
            tldr={undefined}
            keyPoints={fm.key_points}
            prerequisites={prereqLinks}
            readTime={readTime}
          />

          <PaperStatusPanel frontmatter={fm} canonStatus={canonStatus} lang={lang} />

          <InlineToc items={tocItems} />

          {norm === 'river' ? (
            <div className="frc-formal-only mb-8" />
          ) : null}

          {/* Abstract */}
          {paper.frontmatter.abstract && (
            <blockquote className="border-l-3 border-frc-gold pl-4 text-frc-text-dim italic mb-8">
              {paper.frontmatter.abstract}
            </blockquote>
          )}

          {fm.cover && (
            <figure className="mb-10 flex justify-center">
              <img
                src={fm.cover}
                alt={`Cover art for ${fm.id}: ${fm.title}`}
                className="w-full max-w-md border border-frc-blue object-cover"
                width={1024}
                height={1536}
              />
            </figure>
          )}

          {/* Body — rendered from trusted local markdown files at build time */}
          <div className={`content-body min-w-0 max-w-full overflow-x-hidden ${norm === 'river' ? 'frc-interpretation-only' : ''}`} suppressHydrationWarning>
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
          <div className="min-w-0 max-w-full [&_.related-content_a]:min-w-0">
            <RelatedContent
              relatedIds={Array.isArray(fm.related) ? fm.related : []}
              tags={Array.isArray(fm.tags) ? fm.tags : []}
              currentId={canonicalId}
              glossary={glossary}
              basePath={basePath}
              lang={lang}
            />
          </div>
      </PageShell>
    </>
  );
}
