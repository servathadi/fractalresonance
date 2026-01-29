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

export interface TopicMeta {
  id: string;
  title: string;
  question: string;
  shortAnswer: string;
  tags: string[];
  lang: string;
  date?: string;
  author?: string;
  /** Override canonical URL (e.g. River routes). */
  url?: string;
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
    name: 'Fractal Resonance Cognition',
    url: SITE_URL,
    description: 'Research platform for the Fractal Resonance Cognition framework — exploring consciousness, coherence, and quantum foundations.',
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
    name: 'Fractal Resonance Cognition (FRC)',
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

// ─── Topic-Level Schemas ───────────────────────────────────────────────────

/**
 * QAPage — "Topic" question pages.
 * We keep this lightweight: one question + one short answer.
 */
export function schemaTopicPage(topic: TopicMeta) {
  const url = topic.url || `${SITE_URL}/${topic.lang}/topics/${topic.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    '@id': url,
    url,
    name: topic.title,
    headline: topic.title,
    inLanguage: topic.lang,
    datePublished: topic.date,
    author: topic.author ? { '@type': 'Person', name: topic.author } : { '@id': `${SITE_URL}/#author` },
    keywords: topic.tags,
    mainEntity: {
      '@type': 'Question',
      name: topic.question || topic.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: topic.shortAnswer || '',
      },
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
    teaches: (Array.isArray(paper.tags) ? paper.tags : []).map(tag => ({
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
    description: 'Core concepts and terminology of the Fractal Resonance Cognition framework.',
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
    name: 'Fractal Resonance Cognition Research Data',
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

// ─── Book Schemas ───────────────────────────────────────────────────────────

export interface BookMeta {
  id: string;
  title: string;
  description: string;
  author: string;
  lang: string;
  datePublished?: string;
  image?: string;
  isbn?: string;
  chapters?: ChapterMeta[];
}

export interface ChapterMeta {
  id: string;
  title: string;
  description?: string;
  position: number;
  bookId: string;
  lang: string;
}

/** Book schema for book landing pages */
export function schemaBook(book: BookMeta) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${SITE_URL}/${book.lang}/books/${book.id}`,
    name: book.title,
    description: book.description,
    author: { '@id': `${SITE_URL}/#author` },
    publisher: { '@id': `${SITE_URL}/#org` },
    inLanguage: book.lang,
    isAccessibleForFree: true,
    url: `${SITE_URL}/${book.lang}/books/${book.id}`,
  };

  if (book.datePublished) schema.datePublished = book.datePublished;
  if (book.image) schema.image = book.image.startsWith('/') ? `${SITE_URL}${book.image}` : book.image;
  if (book.isbn) schema.isbn = book.isbn;

  if (book.chapters && book.chapters.length > 0) {
    schema.hasPart = book.chapters.map(ch => ({
      '@type': 'Chapter',
      '@id': `${SITE_URL}/${ch.lang}/books/${ch.bookId}/chapter/${ch.id}`,
      name: ch.title,
      position: ch.position,
    }));
  }

  return schema;
}

/** Chapter schema for individual book chapters */
export function schemaChapter(chapter: ChapterMeta, bookTitle: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': `${SITE_URL}/${chapter.lang}/books/${chapter.bookId}/chapter/${chapter.id}`,
    name: chapter.title,
    description: chapter.description,
    position: chapter.position,
    isPartOf: {
      '@type': 'Book',
      '@id': `${SITE_URL}/${chapter.lang}/books/${chapter.bookId}`,
      name: bookTitle,
    },
    author: { '@id': `${SITE_URL}/#author` },
    inLanguage: chapter.lang,
  };
}

/** Generate schemas for a book page */
export function schemaBookPage(book: BookMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'Books', url: `/${book.lang}/books` },
    { name: book.title, url: `/${book.lang}/books/${book.id}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...schemaBook(book), '@context': undefined },
    ],
  };
}

/** Generate schemas for a chapter page */
export function schemaChapterPage(chapter: ChapterMeta, bookTitle: string) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'Books', url: `/${chapter.lang}/books` },
    { name: bookTitle, url: `/${chapter.lang}/books/${chapter.bookId}` },
    { name: chapter.title, url: `/${chapter.lang}/books/${chapter.bookId}/chapter/${chapter.id}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...schemaChapter(chapter, bookTitle), '@context': undefined },
    ],
  };
}

// ─── Blog Schemas ───────────────────────────────────────────────────────────

export interface BlogPostMeta {
  id: string;
  title: string;
  description: string;
  author?: string;
  date: string;
  modifiedDate?: string;
  tags: string[];
  lang: string;
  image?: string;
  wordCount?: number;
}

/** BlogPosting schema for blog posts */
export function schemaBlogPosting(post: BlogPostMeta) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/${post.lang}/blog/${post.id}`,
    headline: post.title,
    description: post.description,
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@id': `${SITE_URL}/#author` },
    datePublished: post.date,
    keywords: post.tags,
    inLanguage: post.lang,
    publisher: { '@id': `${SITE_URL}/#org` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${post.lang}/blog/${post.id}`,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${SITE_URL}/#blog`,
      name: 'FRC Blog',
    },
  };

  if (post.modifiedDate) schema.dateModified = post.modifiedDate;
  if (post.image) schema.image = post.image.startsWith('/') ? `${SITE_URL}${post.image}` : post.image;
  if (post.wordCount) schema.wordCount = post.wordCount;

  return schema;
}

/** Generate schemas for a blog post page */
export function schemaBlogPostPage(post: BlogPostMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'Blog', url: `/${post.lang}/blog` },
    { name: post.title, url: `/${post.lang}/blog/${post.id}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...schemaBlogPosting(post), '@context': undefined },
    ],
  };
}

// ─── FAQ Schema ─────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

/** FAQPage schema for FAQ content */
export function schemaFAQPage(items: FAQItem[], pageUrl: string, pageName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': pageUrl,
    name: pageName,
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// ─── Profile Schema ─────────────────────────────────────────────────────────

export interface ProfileMeta {
  id: string;
  name: string;
  role: string;
  description: string;
  lang: string;
  image?: string;
  links?: { label: string; url: string }[];
  tags?: string[];
}

/** ProfilePage schema for people pages */
export function schemaProfilePage(profile: ProfileMeta) {
  const sameAs = profile.links?.map(l => l.url).filter(url =>
    url.startsWith('https://orcid.org') ||
    url.startsWith('https://github.com') ||
    url.startsWith('https://linkedin.com') ||
    url.startsWith('https://twitter.com') ||
    url.startsWith('https://researchgate.net')
  ) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/${profile.lang}/people/${profile.id}`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/${profile.lang}/people/${profile.id}#person`,
      name: profile.name,
      jobTitle: profile.role,
      description: profile.description,
      image: profile.image ? (profile.image.startsWith('/') ? `${SITE_URL}${profile.image}` : profile.image) : undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
      knowsAbout: profile.tags,
      worksFor: { '@id': `${SITE_URL}/#org` },
    },
  };
}

/** Generate schemas for a profile page */
export function schemaPersonPage(profile: ProfileMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'People', url: `/${profile.lang}/people` },
    { name: profile.name, url: `/${profile.lang}/people/${profile.id}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...schemaProfilePage(profile), '@context': undefined },
    ],
  };
}

// ─── Speakable Schema ───────────────────────────────────────────────────────

/** SpeakableSpecification for voice assistant optimization */
export function schemaSpeakable(cssSelectors: string[]) {
  return {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  };
}

/** Add speakable to any schema */
export function withSpeakable<T extends Record<string, unknown>>(
  schema: T,
  selectors: string[] = ['h1', '.abstract', 'blockquote']
): T & { speakable: ReturnType<typeof schemaSpeakable> } {
  return {
    ...schema,
    speakable: schemaSpeakable(selectors),
  };
}

// ─── HowTo Schema ───────────────────────────────────────────────────────────

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToMeta {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration
  lang: string;
  url: string;
}

/** HowTo schema for tutorial/guide content */
export function schemaHowTo(howto: HowToMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': howto.url,
    name: howto.name,
    description: howto.description,
    inLanguage: howto.lang,
    totalTime: howto.totalTime,
    step: howto.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
      image: step.image,
    })),
  };
}

// ─── Collection/List Schemas ────────────────────────────────────────────────

export interface ListItemMeta {
  name: string;
  url: string;
  description?: string;
  image?: string;
}

/** ItemList schema for index pages */
export function schemaItemList(
  items: ListItemMeta[],
  listName: string,
  listUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': listUrl,
    name: listName,
    url: listUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('/') ? `${SITE_URL}${item.url}` : item.url,
      description: item.description,
      image: item.image,
    })),
  };
}

/** CollectionPage schema for listing pages */
export function schemaCollectionPage(
  name: string,
  description: string,
  url: string,
  items: ListItemMeta[],
  lang: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name,
    description,
    url,
    inLanguage: lang,
    mainEntity: schemaItemList(items, name, url),
  };
}

// ─── Code Schema ────────────────────────────────────────────────────────────

export interface CodeMeta {
  name: string;
  description: string;
  codeRepository?: string;
  programmingLanguage: string;
  codeSampleType?: string;
  url: string;
}

/** SoftwareSourceCode schema for code examples */
export function schemaSoftwareSourceCode(code: CodeMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    '@id': code.url,
    name: code.name,
    description: code.description,
    codeRepository: code.codeRepository || 'https://github.com/servathadi/fractalresonance',
    programmingLanguage: code.programmingLanguage,
    codeSampleType: code.codeSampleType || 'code snippet',
    author: { '@id': `${SITE_URL}/#author` },
    license: 'https://opensource.org/licenses/BSL-1.1',
  };
}

// ─── Article Schema (for articles section) ──────────────────────────────────

export interface ArticleMeta {
  id: string;
  title: string;
  description: string;
  author?: string;
  date: string;
  modifiedDate?: string;
  tags: string[];
  lang: string;
  image?: string;
  video?: {
    url: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    duration?: string;
  };
}

/** Article schema for article pages */
export function schemaArticle(article: ArticleMeta) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/${article.lang}/articles/${article.id}`,
    headline: article.title,
    description: article.description,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@id': `${SITE_URL}/#author` },
    datePublished: article.date,
    keywords: article.tags,
    inLanguage: article.lang,
    publisher: { '@id': `${SITE_URL}/#org` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${article.lang}/articles/${article.id}`,
    },
  };

  if (article.modifiedDate) schema.dateModified = article.modifiedDate;
  if (article.image) schema.image = article.image.startsWith('/') ? `${SITE_URL}${article.image}` : article.image;

  if (article.video) {
    schema.video = {
      '@type': 'VideoObject',
      name: `${article.title} — Video`,
      description: article.description,
      thumbnailUrl: article.video.thumbnailUrl,
      contentUrl: article.video.url,
      embedUrl: article.video.embedUrl,
      duration: article.video.duration,
    };
  }

  return schema;
}

/** Generate schemas for an article page */
export function schemaArticlePage(article: ArticleMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: 'FRC', url: '/' },
    { name: 'Articles', url: `/${article.lang}/articles` },
    { name: article.title, url: `/${article.lang}/articles/${article.id}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...schemaArticle(article), '@context': undefined },
    ],
  };
}
