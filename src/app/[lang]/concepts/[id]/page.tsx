import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContentDigest } from '@/components/ContentDigest';
import { ConceptsSidebar } from '@/components/ConceptsSidebar';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineToc } from '@/components/InlineToc';
import { PageShell } from '@/components/PageShell';
import { EpistemicBadge } from '@/components/EpistemicBadge';
import { TaxonomyLink } from '@/components/TaxonomyLink';
import { schemaConceptPage } from '@/lib/schema';
import { getConcept, getConcepts, getLanguages, toConceptMeta, buildBacklinks, getGlossary, getAlternateLanguages, getContentEpistemicStatus, getContentStatusNote, matchesPerspectiveView } from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';
import { generatePageMetadata } from '@/lib/metadata';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const concepts = getConcepts(lang);
    for (const concept of concepts) {
      if (concept.frontmatter.id && matchesPerspectiveView(concept.frontmatter.perspective, 'kasra')) {
        params.push({ lang, id: concept.frontmatter.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const concept = getConcept(lang, id);
  if (!concept) return { title: 'Not Found' };

  const fm = concept.frontmatter;
  const description = concept.body.split('\n\n').find(p => p && !p.startsWith('#')) || '';
  const conceptUrl = `/${lang}/concepts/${fm.id}`;
  const alternates = getAlternateLanguages('concepts', fm.id);
  const epistemicStatus = getContentEpistemicStatus('concept', fm);

  return generatePageMetadata({
    type: 'article',
    title: fm.title,
    description: description,
    url: conceptUrl,
    lang,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    section: 'Concepts',
    noindex: epistemicStatus === 'archive',
  }, alternates);
}

export default async function ConceptPage({ params }: Props) {
  const { lang, id } = await params;
  const concept = getConcept(lang, id);
  if (!concept) notFound();

  const basePath = `/${lang}`;
  const meta = toConceptMeta(concept);
  const backlinks = buildBacklinks(lang, 'kasra');
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = concept.frontmatter;
  const epistemicStatus = getContentEpistemicStatus('concept', fm);
  const statusNote = getContentStatusNote('concept', fm);

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(concept.body, lang, glossary, basePath);
  const tocItems = extractTocItems(concept.body).filter((t) => t.level === 2);

  return (
    <>
      <SchemaScript data={schemaConceptPage(meta)} />

      <PageShell
        leftMobile={<ConceptsSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" variant="mobile" />}
        leftDesktop={<ConceptsSidebar lang={lang} currentId={id} basePath={basePath} view="kasra" />}
        right={<TableOfContents items={tocItems} />}
      >
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href={basePath} className="hover:text-frc-gold">FRC</a>
            <span className="mx-2">/</span>
            <a href={`${basePath}/concepts`} className="hover:text-frc-gold">Concepts</a>
            <span className="mx-2">/</span>
            <span className="text-frc-text">{concept.frontmatter.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <EpistemicBadge status={epistemicStatus} lang={lang} className="mb-3" />
            <h1 className="text-3xl font-light text-frc-gold mb-3">
              {concept.frontmatter.title}
            </h1>
            {statusNote && (
              <p className="mt-4 border-l-2 border-frc-gold/60 pl-3 text-sm text-frc-text-dim">
                {statusNote}
              </p>
            )}
            {Array.isArray(concept.frontmatter.tags) && concept.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {concept.frontmatter.tags.map(tag => <TaxonomyLink key={tag} taxon={tag} basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />)}
              </div>
            )}
          </header>

          <ContentDigest
            tldr={fm.tldr}
            keyPoints={fm.key_points}
            prerequisites={prereqLinks}
          />

          <InlineToc items={tocItems} />

          {/* Body */}
          <div className="content-body">
            <MarkdownContent html={renderedBody} glossary={glossary} />
          </div>

          {/* Related concepts */}
          {Array.isArray(concept.frontmatter.related) && concept.frontmatter.related.length > 0 && (
            <section className="mt-12 border-t border-frc-blue pt-6">
              <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-3">
                Related Concepts
              </h3>
              <div className="flex flex-wrap gap-3">
                {concept.frontmatter.related.map(rel => {
                  const item = glossary[rel];
                  const href = item?.url || `${basePath}/concepts/${rel}`;
                  return (
                    <a
                      key={rel}
                      href={href}
                      className="text-frc-gold hover:underline text-sm"
                    >
                      {item?.title || rel}
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Backlinks */}
          {pageBacklinks.length > 0 && (
            <section className="backlinks">
              <h3 className="text-sm font-medium text-frc-text-dim uppercase tracking-wider mb-3">
                Referenced by
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
      </PageShell>
    </>
  );
}
