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
import { schemaConceptPage } from '@/lib/schema';
import { getConcept, getConcepts, getLanguages, toConceptMeta, buildBacklinks, getGlossary, getAlternateLanguages, matchesPerspectiveView } from '@/lib/content';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

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
  const conceptUrl = `https://fractalresonance.com/${lang}/concepts/${fm.id}`;
  const alternates = getAlternateLanguages('concepts', fm.id);

  return {
    title: `${fm.title} — FRC Concept`,
    description: description.slice(0, 160),
    keywords: fm.tags,
    alternates: {
      canonical: conceptUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'article',
      title: fm.title,
      description: description.slice(0, 160),
      locale: lang,
    },
  };
}

export default async function ConceptPage({ params }: Props) {
  const { lang, id } = await params;
  const concept = getConcept(lang, id);
  if (!concept) notFound();

  const basePath = `/${lang}`;
  const meta = toConceptMeta(concept);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const fm = concept.frontmatter;

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const prereqLinks = (fm.prerequisites || []).map((pid) => {
    if (staticTargets.has(pid)) return { id: pid, title: pid, href: `${basePath}/${pid}` };
    const item = glossary[pid];
    return { id: pid, title: item?.title || pid, href: item?.url || `${basePath}/concepts/${pid}` };
  });

  const renderedBody = renderMarkdown(concept.body, lang, glossary, basePath);
  const tocItems = extractTocItems(concept.body);

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
            <h1 className="text-3xl font-light text-frc-gold mb-3">
              {concept.frontmatter.title}
            </h1>
            {concept.frontmatter.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {concept.frontmatter.tags.map(tag => (
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
          {concept.frontmatter.related && concept.frontmatter.related.length > 0 && (
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
