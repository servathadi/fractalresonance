import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';
import {
  getLanguages,
  getContentsByTag,
  getGlossary,
  getPapers,
  getArticles,
  getBooks,
  getConcepts,
  getBlogPosts,
  getTopics,
  getConcept,
  matchesPerspectiveView,
  type ParsedContent
} from '@/lib/content';

interface Props {
  params: Promise<{ lang: string; tag: string }>;
}

// Tag definitions for common tags
const TAG_DEFINITIONS: Record<string, { description: string; relatedTags?: string[] }> = {
  'coherence': {
    description: 'Phase alignment measure in FRC. Coherence C quantifies the degree of synchronization between oscillating components, ranging from 0 (fully incoherent) to 1 (perfectly coherent).',
    relatedTags: ['lambda-field', 'UCC', 'entropy'],
  },
  'entropy': {
    description: 'Thermodynamic measure of disorder. In FRC, entropy is reciprocally coupled to coherence via the fundamental relation dS + k* d ln C = 0.',
    relatedTags: ['coherence', 'thermodynamics', 'reciprocity'],
  },
  'lambda-field': {
    description: 'The Lambda field Λ(x) = Λ₀ ln C(x) is a scalar field encoding local coherence dynamics. It governs the flow of information and energy in complex systems.',
    relatedTags: ['coherence', 'field-theory', 'UCC'],
  },
  'UCC': {
    description: 'Universal Coherence Condition — the conservation law governing Lambda field dynamics: dΛ/dt + ∇·J_Λ = σ_Λ - γ_Λ.',
    relatedTags: ['lambda-field', 'coherence', 'thermodynamics'],
  },
  'born-rule': {
    description: 'The Born rule (P = |ψ|²) gives quantum measurement probabilities. FRC derives this as an emergent statistical equilibrium rather than a fundamental axiom.',
    relatedTags: ['quantum-foundations', 'probability', 'equilibrium'],
  },
  'quantum-chaos': {
    description: 'Study of quantum systems whose classical counterparts exhibit chaotic behavior. FRC proposes that apparent chaos emerges from underlying fractal resonance structures.',
    relatedTags: ['fractal-resonance', 'stadium-billiard', 'nodal-patterns'],
  },
  'thermodynamics': {
    description: 'Study of heat, energy, and entropy. FRC extends classical thermodynamics with the coherence field, yielding ΔG = −k*T Δln C.',
    relatedTags: ['entropy', 'free-energy', 'coherence'],
  },
  'AI': {
    description: 'Artificial Intelligence applications of FRC, including the Λ-Tensor Model (LTM) for continuous field resonance and the Universal Vector for human-AI alignment.',
    relatedTags: ['transformers', 'neural-networks', 'alignment'],
  },
  'reciprocity': {
    description: 'The entropy-coherence reciprocity principle: dS + k* d ln C = 0. This fundamental relation couples thermodynamic entropy with quantum coherence.',
    relatedTags: ['entropy', 'coherence', 'UCC'],
  },
  'framework': {
    description: 'Theoretical frameworks for understanding complex systems. FRC proposes a unified framework based on fractal resonance and coherence dynamics.',
    relatedTags: ['complex-systems', 'coherence', 'fractal-resonance'],
  },
};

const TYPE_ORDER = ['paper', 'concept', 'topic', 'article', 'blog', 'book'] as const;
const TYPE_LABELS: Record<string, string> = {
  paper: 'Papers',
  concept: 'Concepts',
  topic: 'Topics',
  article: 'Articles',
  blog: 'Blog Posts',
  book: 'Books',
};

export async function generateStaticParams() {
  const languages = getLanguages();
  const params: { lang: string; tag: string }[] = [];

  for (const lang of languages) {
    const tagSet = new Set<string>();
    const all = [
      ...getPapers(lang),
      ...getArticles(lang),
      ...getBooks(lang),
      ...getConcepts(lang),
      ...getBlogPosts(lang),
      ...getTopics(lang),
    ].filter((c) => c && c.frontmatter && matchesPerspectiveView(c.frontmatter.perspective, 'kasra'));

    for (const item of all) {
      const tags = item.frontmatter.tags;
      if (Array.isArray(tags)) {
        for (const t of tags) {
          if (typeof t === 'string') tagSet.add(t);
        }
      } else if (typeof tags === 'string') {
        tagSet.add(tags);
      }
    }

    for (const t of Array.from(tagSet).sort()) {
      params.push({ lang, tag: t });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const definition = TAG_DEFINITIONS[decodedTag.toLowerCase()];

  return {
    title: `${decodedTag} — FRC Tag`,
    description: definition?.description || `Articles, papers, and concepts tagged with "${decodedTag}" in the Fractal Resonance Coherence framework.`,
    alternates: {
      canonical: `https://fractalresonance.com/${lang}/tags/${tag}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const content = getContentsByTag(lang, decodedTag).filter((c) => matchesPerspectiveView(c.frontmatter.perspective, 'kasra'));
  const basePath = `/${lang}`;
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });

  if (content.length === 0) notFound();

  // Get tag definition
  const definition = TAG_DEFINITIONS[decodedTag.toLowerCase()];

  // Check if there's a concept page for this tag
  const conceptPage = getConcept(lang, decodedTag.toLowerCase());

  // Group content by type
  const contentByType: Record<string, ParsedContent[]> = {};
  for (const item of content) {
    const g = glossary[item.frontmatter.id];
    const type = g?.type || 'concept';
    if (!contentByType[type]) contentByType[type] = [];
    contentByType[type].push(item);
  }

  // Find related tags
  const relatedTags = new Set<string>();
  if (definition?.relatedTags) {
    definition.relatedTags.forEach(t => relatedTags.add(t));
  }
  for (const item of content) {
    const tags = item.frontmatter.tags;
    if (Array.isArray(tags)) {
      tags.forEach(t => {
        if (t !== decodedTag && relatedTags.size < 10) relatedTags.add(t);
      });
    }
  }

  // Build collection items for schema
  const items: ListItemMeta[] = content.map(item => {
    const g = glossary[item.frontmatter.id];
    return {
      name: item.frontmatter.title,
      url: g?.url || `${basePath}/concepts/${item.frontmatter.id}`,
      description: item.frontmatter.abstract || '',
    };
  });

  const collectionSchema = schemaCollectionPage(
    `${decodedTag} — FRC Tag`,
    definition?.description || `Content tagged with "${decodedTag}"`,
    `https://fractalresonance.com${basePath}/tags/${tag}`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-frc-text-dim mb-4">
            <Link href={basePath} className="hover:text-frc-gold">Home</Link>
            <span>/</span>
            <span>Tags</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-light text-frc-gold">
              <span className="text-frc-text-dim opacity-50">#</span> {decodedTag}
            </h1>
            <span className="text-sm text-frc-steel border border-frc-blue px-2 py-0.5 rounded-full">
              {content.length} items
            </span>
          </div>

          {/* Tag definition */}
          {(definition || conceptPage) && (
            <div className="border-l-2 border-frc-gold pl-4 text-frc-text-dim mb-6">
              {definition?.description && (
                <p className="text-sm leading-relaxed">{definition.description}</p>
              )}
              {conceptPage && (
                <p className="text-sm mt-2">
                  <Link href={`${basePath}/concepts/${decodedTag.toLowerCase()}`} className="text-frc-gold hover:underline">
                    Read full definition &rarr;
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* Related tags */}
          {relatedTags.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-frc-steel">Related:</span>
              {Array.from(relatedTags).slice(0, 8).map(t => (
                <Link
                  key={t}
                  href={`${basePath}/tags/${encodeURIComponent(t)}`}
                  className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Content grouped by type */}
        {TYPE_ORDER.map(type => {
          const items = contentByType[type];
          if (!items || items.length === 0) return null;

          return (
            <section key={type} className="mb-12">
              <h2 className="text-xs uppercase tracking-widest text-frc-steel mb-4 flex items-center gap-2">
                <span>{TYPE_LABELS[type] || type}</span>
                <span className="text-frc-text-dim">({items.length})</span>
              </h2>
              <div className="grid gap-4">
                {items.map((item) => {
                  const fm = item.frontmatter;
                  const g = glossary[fm.id];
                  const href = g?.url || `${basePath}/concepts/${fm.id}`;

                  return (
                    <Link
                      key={fm.id}
                      href={href}
                      className="card block p-5 group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          {fm.date && <span className="text-xs text-frc-steel">{fm.date}</span>}
                        </div>
                        <span className="font-mono text-xs text-frc-steel">{fm.id}</span>
                      </div>

                      <h3 className="text-lg text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-2">
                        {fm.title}
                      </h3>

                      {fm.abstract ? (
                        <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">
                          {fm.abstract}
                        </p>
                      ) : (
                        <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-2">
                          {item.body.split('\n\n').find(p => p && !p.startsWith('#') && !p.startsWith('---'))?.replace(/\[\[|\]\]/g, '') || ''}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
