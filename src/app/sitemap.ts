import type { MetadataRoute } from 'next';
import { getPapers, getArticles, getConcepts, getBooks, getBlogPosts, getTopics, getPeople, getLanguages, getAlternateLanguages, getStaticPageAlternates } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://fractalresonance.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getLanguages();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage with language alternates
  const homeAlternates: Record<string, string> = {};
  for (const lang of languages) {
    homeAlternates[lang] = `${SITE_URL}/${lang}`;
  }
  entries.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages: homeAlternates },
  });

  // Static pages with language alternates
  const staticPages = ['about', 'articles', 'papers', 'books', 'blog', 'topics', 'people', 'formulas', 'positioning', 'mu-levels', 'graph', 'contact', 'join', 'privacy', 'terms'];

  for (const page of staticPages) {
    const alternates = getStaticPageAlternates(page);
    for (const lang of languages) {
      entries.push({
        url: `${SITE_URL}/${lang}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: alternates },
      });
    }
  }

  // Paper pages with language alternates
  // Get unique paper IDs across all languages
  const seenPaperIds = new Set<string>();
  for (const lang of languages) {
    const papers = getPapers(lang);
    for (const paper of papers) {
      const id = paper.frontmatter.id;
      if (seenPaperIds.has(id)) continue;
      seenPaperIds.add(id);

      const alternates = getAlternateLanguages('papers', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/papers/${id}`,
          lastModified: paper.frontmatter.date ? new Date(paper.frontmatter.date) : new Date(),
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
    const articles = getArticles(lang);
    for (const article of articles) {
      const id = article.frontmatter.id;
      if (seenArticleIds.has(id)) continue;
      seenArticleIds.add(id);

      const alternates = getAlternateLanguages('articles', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/articles/${id}`,
          lastModified: article.frontmatter.date ? new Date(article.frontmatter.date) : new Date(),
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
    const concepts = getConcepts(lang);
    for (const concept of concepts) {
      const id = concept.frontmatter.id;
      if (seenConceptIds.has(id)) continue;
      seenConceptIds.add(id);

      const alternates = getAlternateLanguages('concepts', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/concepts/${id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.85,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // Book pages with language alternates
  const seenBookIds = new Set<string>();
  for (const lang of languages) {
    const books = getBooks(lang);
    for (const book of books) {
      const id = book.frontmatter.id;
      if (seenBookIds.has(id)) continue;
      seenBookIds.add(id);

      const alternates = getAlternateLanguages('books', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/books/${id}`,
          lastModified: book.frontmatter.date ? new Date(book.frontmatter.date) : new Date(),
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
    const posts = getBlogPosts(lang);
    for (const post of posts) {
      const id = post.frontmatter.id;
      if (seenBlogIds.has(id)) continue;
      seenBlogIds.add(id);

      const alternates = getAlternateLanguages('blog', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/blog/${id}`,
          lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : new Date(),
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
    const topics = getTopics(lang);
    for (const topic of topics) {
      const id = topic.frontmatter.id;
      if (seenTopicIds.has(id)) continue;
      seenTopicIds.add(id);

      const alternates = getAlternateLanguages('topics', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/topics/${id}`,
          lastModified: topic.frontmatter.date ? new Date(topic.frontmatter.date) : new Date(),
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

      const alternates = getAlternateLanguages('people', id);
      for (const altLang of Object.keys(alternates).filter(l => l !== 'x-default')) {
        entries.push({
          url: `${SITE_URL}/${altLang}/people/${id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: alternates },
        });
      }
    }
  }

  return entries;
}
