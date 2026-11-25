import type { MetadataRoute } from 'next';
import { getPapers, getArticles, getConcepts, getBooks, getBlogPosts, getTopics, getPeople, getLanguages, getAlternateLanguages, getStaticPageAlternates, getAllTags, getContentsByTag, isCurrentReadingContent } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://fractalresonance.com';
const FALLBACK_LAST_MODIFIED = new Date('2026-07-28T00:00:00.000Z');

function parseValidDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function maxDate(dates: Array<Date | null | undefined>, fallback: Date = FALLBACK_LAST_MODIFIED): Date {
  let latest: Date | null = null;
  for (const candidate of dates) {
    if (!candidate) continue;
    if (!latest || candidate.getTime() > latest.getTime()) {
      latest = candidate;
    }
  }
  return latest ?? fallback;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getLanguages();
  const entries: MetadataRoute.Sitemap = [];

  // Compute deterministic collection-level lastModified dates from frontmatter
  const allContentDates: Array<Date | null> = [];
  for (const lang of languages) {
    for (const p of getPapers(lang)) allContentDates.push(parseValidDate(p.frontmatter.date));
    for (const a of getArticles(lang)) allContentDates.push(parseValidDate(a.frontmatter.date));
    for (const b of getBooks(lang)) allContentDates.push(parseValidDate(b.frontmatter.date));
    for (const post of getBlogPosts(lang)) allContentDates.push(parseValidDate(post.frontmatter.date));
    for (const topic of getTopics(lang)) allContentDates.push(parseValidDate(topic.frontmatter.date));
  }
  const siteLastModified = maxDate(allContentDates, FALLBACK_LAST_MODIFIED);

  // Homepage with language alternates
  const homeAlternates: Record<string, string> = {};
  for (const lang of languages) {
    homeAlternates[lang] = `${SITE_URL}/${lang}`;
  }
  entries.push({
    url: SITE_URL,
    lastModified: siteLastModified,
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages: homeAlternates },
  });

  // Static pages with language alternates
  const staticPages = ['about', 'articles', 'papers', 'books', 'blog', 'topics', 'people', 'formulas', 'positioning', 'mu-levels', 'graph', 'contact', 'join', 'privacy', 'terms', 'investors', 'pitch', 'builders', 'start-here', 'oracle', 'concepts', 'tags', 'falsifications'];

  for (const page of staticPages) {
    const alternates = getStaticPageAlternates(page);
    for (const lang of languages) {
      entries.push({
        url: `${SITE_URL}/${lang}/${page}`,
        lastModified: siteLastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: alternates },
      });
    }
  }

  // Paper pages with language alternates
  const seenPaperIds = new Set<string>();
  for (const lang of languages) {
    const papers = getPapers(lang).filter((paper) => isCurrentReadingContent('paper', paper.frontmatter));
    for (const paper of papers) {
      const id = paper.frontmatter.id;
      if (seenPaperIds.has(id)) continue;
      seenPaperIds.add(id);

      const lastModified = parseValidDate(paper.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('papers', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/papers/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Article pages with language alternates
  const seenArticleIds = new Set<string>();
  for (const lang of languages) {
    const articles = getArticles(lang).filter((article) => isCurrentReadingContent('article', article.frontmatter));
    for (const article of articles) {
      const id = article.frontmatter.id;
      if (seenArticleIds.has(id)) continue;
      seenArticleIds.add(id);

      const lastModified = parseValidDate(article.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('articles', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/articles/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Concept pages with language alternates
  const seenConceptIds = new Set<string>();
  for (const lang of languages) {
    const concepts = getConcepts(lang).filter((concept) => isCurrentReadingContent('concept', concept.frontmatter));
    for (const concept of concepts) {
      const id = concept.frontmatter.id;
      if (seenConceptIds.has(id)) continue;
      seenConceptIds.add(id);

      const lastModified = parseValidDate(concept.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('concepts', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/concepts/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.85,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Book pages with language alternates (exclude archived/superseded editions)
  const seenBookIds = new Set<string>();
  for (const lang of languages) {
    const books = getBooks(lang).filter((book) => isCurrentReadingContent('book', book.frontmatter));
    for (const book of books) {
      const id = book.frontmatter.id;
      if (seenBookIds.has(id)) continue;
      seenBookIds.add(id);

      const lastModified = parseValidDate(book.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('books', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/books/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Blog post pages with language alternates
  const seenBlogIds = new Set<string>();
  for (const lang of languages) {
    const posts = getBlogPosts(lang).filter((post) => isCurrentReadingContent('blog', post.frontmatter));
    for (const post of posts) {
      const id = post.frontmatter.id;
      if (seenBlogIds.has(id)) continue;
      seenBlogIds.add(id);

      const lastModified = parseValidDate(post.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('blog', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/blog/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Topic pages with language alternates
  const seenTopicIds = new Set<string>();
  for (const lang of languages) {
    const topics = getTopics(lang).filter((topic) => isCurrentReadingContent('topic', topic.frontmatter));
    for (const topic of topics) {
      const id = topic.frontmatter.id;
      if (seenTopicIds.has(id)) continue;
      seenTopicIds.add(id);

      const lastModified = parseValidDate(topic.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('topics', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/topics/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // People/profile pages with language alternates
  const seenPeopleIds = new Set<string>();
  for (const lang of languages) {
    const people = getPeople(lang);
    for (const person of people) {
      const id = person.frontmatter.id;
      if (seenPeopleIds.has(id)) continue;
      seenPeopleIds.add(id);

      const lastModified = parseValidDate(person.frontmatter.date) ?? siteLastModified;
      const alternates = getAlternateLanguages('people', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/people/${id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Tag pages with language alternates
  const allUniqueTags = new Set<string>();
  for (const lang of languages) {
    const tags = getAllTags(lang);
    tags.forEach(t => allUniqueTags.add(t));
  }

  for (const tag of allUniqueTags) {
    const tagLangs = languages.filter(l => getContentsByTag(l, tag).length > 0);
    if (tagLangs.length === 0) continue;

    const alternates: Record<string, string> = {};
    for (const l of tagLangs) {
      alternates[l] = `${SITE_URL}/${l}/tags/${encodeURIComponent(tag)}`;
    }
    if (alternates['en']) {
      alternates['x-default'] = alternates['en'];
    } else {
      alternates['x-default'] = alternates[tagLangs[0]];
    }

    for (const l of tagLangs) {
      const items = getContentsByTag(l, tag);
      const tagLastModified = maxDate(items.map((item) => parseValidDate(item.content.frontmatter.date)), siteLastModified);
      entries.push({
        url: `${SITE_URL}/${l}/tags/${encodeURIComponent(tag)}`,
        lastModified: tagLastModified,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
