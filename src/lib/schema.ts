/**
 * Schema.org JSON-LD generators for FRC
 *
 * 13 schema types:
 * Site-level: WebSite, SearchAction, ResearchProject, Organization, Person
 * Paper-level: ScholarlyArticle, VideoObject, ImageObject, AggregateRating,
 *              BreadcrumbList, CreativeWorkSeries, LearningResource
 * Concept-level: DefinedTerm, DefinedTermSet
 * Data-level: Dataset
 */

const SITE_URL = 'https://fractalresonance.com';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PaperMeta {
  id: string;
  title: string;
  series: string;
  author: string;
  date: string; // ISO 8601
  abstract: string;
  tags: string[];
  lang: string;
  doi?: string;
  video?: {
    url: string;
    embedUrl?: string;
    thumbnailUrl: string;
    duration?: string; // ISO 8601 duration (PT5M30S)
    uploadDate?: string;
  };
  images?: {
    url: string;
    caption: string;
    width?: number;
    height?: number;
  }[];
  rating?: {
    value: number;
    count: number;
    best?: number;
  };
}

export interface ConceptMeta {
  id: string;
  title: string;
  description: string;
  tags: string[];
  related: string[];
  lang: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ─── Site-Level Schemas ────────────────────────────────────────────────────

/** WebSite + SearchAction — enables sitelinks search box */
export function schemaWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Fractal Resonance Coherence',
    url: SITE_URL,
    description: 'Research platform for the Fractal Resonance Coherence framework — exploring consciousness, coherence, and quantum foundations.',
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** ResearchProject — FRC as an active research project */
export function schemaResearchProject() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    '@id': `${SITE_URL}/#project`,
    name: 'Fractal Resonance Coherence (FRC)',
    url: SITE_URL,
    description: 'A research framework formalizing the reciprocal relationship between entropy and coherence, with applications in quantum mechanics, thermodynamics, and consciousness studies.',
    foundingDate: '2024',
    founder: { '@id': `${SITE_URL}/#author` },
    knowsAbout: [
      'Quantum Coherence',
      'Entropy-Coherence Reciprocity',
      'Universal Coherence Condition',
      'Consciousness',
      'Thermodynamics',
    ],
  };
}

/** Organization — Fractal Resonance entity */
export function schemaOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: 'Fractal Resonance',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    sameAs: [
      'https://github.com/servathadi/fractalresonance',
      'https://zenodo.org/communities/frc',
    ],
    founder: { '@id': `${SITE_URL}/#author` },
  };
}

/** Person — Author (Hadi Servat) */
export function schemaPerson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: 'Hadi Servat',
    url: SITE_URL,
    sameAs: [
      'https://orcid.org/0009-0004-7412-5129',
      'https://www.researchgate.net/profile/Hadi-Servat',
      'https://independent.academia.edu/HadiServat',
      'https://github.com/servathadi',
    ],
    jobTitle: 'Researcher',
    knowsAbout: [
      'Fractal Resonance Coherence',
      'Quantum Mechanics',
      'Entropy',
      'Coherence Theory',
    ],
  };
}

// ─── Paper-Level Schemas ───────────────────────────────────────────────────

/** ScholarlyArticle — individual paper */
export function schemaScholarlyArticle(paper: PaperMeta) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    headline: paper.title,
    name: paper.title,
    description: paper.abstract,
    author: { '@id': `${SITE_URL}/#author` },
    datePublished: paper.date,
    inLanguage: paper.lang,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      '@id': `${SITE_URL}/#series-${paper.series.replace(/\s+/g, '-').toLowerCase()}`,
      name: paper.series,
    },
    keywords: paper.tags,
    publisher: { '@id': `${SITE_URL}/#org` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
    ...(paper.doi && {
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'DOI',
        value: paper.doi,
      },
      sameAs: `https://doi.org/${paper.doi}`,
    }),
  };

  if (paper.rating) {
    schema.aggregateRating = schemaAggregateRating(paper);
  }

  if (paper.video) {
    schema.video = schemaVideoObject(paper);
  }

  if (paper.images && paper.images.length > 0) {
    schema.image = paper.images.map(img => schemaImageObject(img, paper));
  }

  return schema;
}

/** VideoObject — paper explainer video */
export function schemaVideoObject(paper: PaperMeta) {
  if (!paper.video) return null;

  return {
    '@type': 'VideoObject',
    name: `${paper.title} — Video Explainer`,
    description: paper.abstract,
    thumbnailUrl: paper.video.thumbnailUrl,
    uploadDate: paper.video.uploadDate || paper.date,
    contentUrl: paper.video.url,
    embedUrl: paper.video.embedUrl,
    duration: paper.video.duration,
    author: { '@id': `${SITE_URL}/#author` },
    about: {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
    inLanguage: paper.lang,
  };
}

/** ImageObject — infographic/slide image */
export function schemaImageObject(
  image: { url: string; caption: string; width?: number; height?: number },
  paper: PaperMeta
) {
  return {
    '@type': 'ImageObject',
    contentUrl: image.url,
    caption: image.caption,
    width: image.width,
    height: image.height,
    author: { '@id': `${SITE_URL}/#author` },
    about: {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
    representativeOfPage: false,
  };
}

/** AggregateRating — paper rating */
export function schemaAggregateRating(paper: PaperMeta) {
  if (!paper.rating) return null;

  return {
    '@type': 'AggregateRating',
    ratingValue: paper.rating.value,
    bestRating: paper.rating.best || 5,
    worstRating: 1,
    ratingCount: paper.rating.count,
    itemReviewed: {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
  };
}

/** CreativeWorkSeries — paper series (FRC 100, 200, etc.) */
export function schemaCreativeWorkSeries(
  seriesName: string,
  papers: PaperMeta[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    '@id': `${SITE_URL}/#series-${seriesName.replace(/\s+/g, '-').toLowerCase()}`,
    name: seriesName,
    author: { '@id': `${SITE_URL}/#author` },
    url: `${SITE_URL}/en/papers?series=${encodeURIComponent(seriesName)}`,
    hasPart: papers.map(p => ({
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${p.lang}/papers/${p.id}`,
      name: p.title,
      datePublished: p.date,
    })),
  };
}

/** LearningResource — paper as educational content */
export function schemaLearningResource(paper: PaperMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}#learning`,
    name: paper.title,
    description: paper.abstract,
    author: { '@id': `${SITE_URL}/#author` },
    educationalLevel: 'Advanced',
    learningResourceType: 'Research Paper',
    teaches: paper.tags.map(tag => ({
      '@type': 'DefinedTerm',
      name: tag,
      inDefinedTermSet: { '@id': `${SITE_URL}/#termset-frc` },
    })),
    inLanguage: paper.lang,
    isPartOf: { '@id': `${SITE_URL}/#project` },
  };
}

/** BreadcrumbList — navigation trail */
export function schemaBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ─── Concept-Level Schemas ─────────────────────────────────────────────────

/** DefinedTermSet — the FRC glossary */
export function schemaDefinedTermSet(concepts: ConceptMeta[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/#termset-frc`,
    name: 'FRC Concepts',
    description: 'Core concepts and terminology of the Fractal Resonance Coherence framework.',
    url: `${SITE_URL}/en/concepts`,
    creator: { '@id': `${SITE_URL}/#author` },
    hasDefinedTerm: concepts.map(c => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/${c.lang}/concepts/${c.id}`,
      name: c.title,
      description: c.description,
      termCode: c.id,
      inDefinedTermSet: { '@id': `${SITE_URL}/#termset-frc` },
    })),
  };
}

/** DefinedTerm — individual concept */
export function schemaDefinedTerm(concept: ConceptMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/${concept.lang}/concepts/${concept.id}`,
    name: concept.title,
    description: concept.description,
    termCode: concept.id,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE_URL}/#termset-frc`,
      name: 'FRC Concepts',
    },
    sameAs: concept.related.map(r => `${SITE_URL}/${concept.lang}/concepts/${r}`),
  };
}

// ─── Data-Level Schemas ────────────────────────────────────────────────────

/** Dataset — API data endpoints */
export function schemaDataset() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${SITE_URL}/#dataset`,
    name: 'Fractal Resonance Coherence Research Data',
    description: 'Structured research data from the FRC framework including papers, concepts, equations, and knowledge graph relationships.',
    url: `${SITE_URL}/for-ai`,
    creator: { '@id': `${SITE_URL}/#author` },
    license: 'https://opensource.org/licenses/BSL-1.1',
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE_URL}/api/concepts`,
        name: 'FRC Concepts API',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE_URL}/api/papers`,
        name: 'FRC Papers API',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE_URL}/api/graph`,
        name: 'FRC Knowledge Graph API',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/plain',
        contentUrl: `${SITE_URL}/llms.txt`,
        name: 'FRC LLM Summary',
      },
    ],
    keywords: [
      'coherence',
      'entropy',
      'quantum mechanics',
      'consciousness',
      'FRC',
      'fractal resonance',
    ],
    isAccessibleForFree: true,
    measurementTechnique: 'Theoretical framework with mathematical formalization',
  };
}

// ─── Composite Helpers ─────────────────────────────────────────────────────

/** Generate all site-level schemas as a @graph */
export function schemaSiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...schemaWebSite(), '@context': undefined },
      { ...schemaResearchProject(), '@context': undefined },
      { ...schemaOrganization(), '@context': undefined },
      { ...schemaPerson(), '@context': undefined },
    ],
  };
}

/** Generate all schemas for a paper page */
export function schemaPaperPage(paper: PaperMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'Papers', url: `/${paper.lang}/papers` },
    { name: paper.title, url: `/${paper.lang}/papers/${paper.id}` },
  ]);

  const article = schemaScholarlyArticle(paper);
  const learning = schemaLearningResource(paper);

  const graph: Record<string, unknown>[] = [
    { ...breadcrumbs, '@context': undefined },
    { ...article, '@context': undefined },
    { ...learning, '@context': undefined },
  ];

  // Add standalone VideoObject for video rich result
  if (paper.video) {
    const video = schemaVideoObject(paper);
    if (video) {
      graph.push(video);
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/** Generate all schemas for a concept page */
export function schemaConceptPage(concept: ConceptMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'Concepts', url: `/${concept.lang}/concepts` },
    { name: concept.title, url: `/${concept.lang}/concepts/${concept.id}` },
  ]);

  const term = schemaDefinedTerm(concept);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...term, '@context': undefined },
    ],
  };
}
