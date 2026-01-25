import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { MarkdownContent } from '@/components/MarkdownContent';
import { Sidebar } from '@/components/Sidebar';
import { schemaConceptPage } from '@/lib/schema';
import { getConcept, getConcepts, getLanguages, toConceptMeta, buildBacklinks, getGlossary, getAlternateLanguages } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    const concepts = getConcepts(lang);
    for (const concept of concepts) {
      if (concept.frontmatter.id) {
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

  const meta = toConceptMeta(concept);
  const backlinks = buildBacklinks(lang);
  const pageBacklinks = backlinks[id] || [];
  const glossary = getGlossary(lang);

  const renderedBody = renderMarkdown(concept.body, lang);

  return (
    <>
      <SchemaScript data={schemaConceptPage(meta)} />

      <main className="min-h-screen flex">
        <Sidebar lang={lang} currentId={id} />
        <article className="flex-1 max-w-3xl mx-auto px-6 py-12 min-w-0">
          {/* Breadcrumb */}
          <nav className="text-sm text-frc-text-dim mb-8">
            <a href="/" className="hover:text-frc-gold">FRC</a>
            <span className="mx-2">/</span>
            <a href={`/${lang}/concepts`} className="hover:text-frc-gold">Concepts</a>
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
                    href={`/${lang}/tags/${encodeURIComponent(tag)}`}
                    className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

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
                {concept.frontmatter.related.map(rel => (
                  <a
                    key={rel}
                    href={`/${lang}/concepts/${rel}`}
                    className="text-frc-gold hover:underline text-sm"
                  >
                    {rel}
                  </a>
                ))}
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
      </main>
    </>
  );
}
