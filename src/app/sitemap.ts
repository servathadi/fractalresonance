import type { MetadataRoute } from 'next';
import { getPapers, getArticles, getConcepts, getBooks, getLanguages, getAlternateLanguages, getStaticPageAlternates } from '@/lib/content';

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
  const staticPages = ['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'contact', 'privacy', 'terms'];

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
          url: alternates[altLang],
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
          url: alternates[altLang],
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
          url: alternates[altLang],
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
          url: alternates[altLang],
          lastModified: book.frontmatter.date ? new Date(book.frontmatter.date) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: { languages: alternates },
        });
      }
    }
  }

  return entries;
}
