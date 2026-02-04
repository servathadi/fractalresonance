import type { MetadataRoute } from 'next';
import { getPapers, getArticles, getConcepts, getBooks, getLanguages, getAlternateLanguages, getStaticPageAlternates } from '@/lib/content';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

const SITE_URL = 'https://fractalresonance.com';

function safeDateMs(raw: unknown): number | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : null;
}

function maxMs(values: Array<number | null | undefined>): number | null {
  let out: number | null = null;
  for (const v of values) {
    if (typeof v !== 'number' || !Number.isFinite(v)) continue;
    out = out === null ? v : Math.max(out, v);
  }
  return out;
}

function safeFileMtimeMs(relPathFromRepoRoot: string): number | null {
  try {
    const full = path.join(process.cwd(), relPathFromRepoRoot);
    const stat = fs.statSync(full);
    return stat.mtimeMs;
  } catch {
    return null;
  }
}

function latestItemDateMs(lang: string, getter: (lang: string) => any[]): number | null {
  const items = getter(lang);
  return maxMs(items.map((i) => safeDateMs(i?.frontmatter?.date)));
}

function latestContentDateMs(languages: string[]): number | null {
  const values: Array<number | null> = [];
  for (const lang of languages) {
    values.push(latestItemDateMs(lang, getPapers));
    values.push(latestItemDateMs(lang, getArticles));
    values.push(latestItemDateMs(lang, getConcepts));
    values.push(latestItemDateMs(lang, getBooks));
  }
  return maxMs(values);
}

function itemDateMsById(getter: (lang: string) => any[], lang: string, id: string): number | null {
  const items = getter(lang);
  const found = items.find((i) => i?.frontmatter?.id === id);
  return safeDateMs(found?.frontmatter?.date);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getLanguages();
  const globalLastModifiedMs =
    latestContentDateMs(languages) ??
    safeFileMtimeMs('content') ??
    safeFileMtimeMs('README.md') ??
    Date.now();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage with language alternates
  const homeAlternates: Record<string, string> = {};
  for (const lang of languages) {
    homeAlternates[lang] = `${SITE_URL}/${lang}`;
  }
  homeAlternates['x-default'] = `${SITE_URL}/en`;
  entries.push({
    url: SITE_URL,
    lastModified: new Date(globalLastModifiedMs),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages: homeAlternates },
  });

  // Static pages with language alternates
  const staticPages = ['about', 'articles', 'papers', 'books', 'concepts', 'formulas', 'positioning', 'mu-levels', 'graph', 'contact', 'privacy', 'terms'];

  for (const page of staticPages) {
    const alternates = getStaticPageAlternates(page);
    for (const lang of languages) {
      const url = alternates[lang] || `${SITE_URL}/${lang}/${page}`;
      const lastMs =
        page === 'papers'
          ? latestItemDateMs(lang, getPapers)
          : page === 'articles'
            ? latestItemDateMs(lang, getArticles)
            : page === 'concepts'
              ? latestItemDateMs(lang, getConcepts)
              : page === 'books'
                ? latestItemDateMs(lang, getBooks)
                : safeFileMtimeMs(`src/app/[lang]/${page}/page.tsx`);
      entries.push({
        url,
        lastModified: new Date(lastMs ?? globalLastModifiedMs),
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
        const lastMs = itemDateMsById(getPapers, altLang, id) ?? globalLastModifiedMs;
        entries.push({
          url: `${SITE_URL}/${altLang}/papers/${id}`,
          lastModified: new Date(lastMs),
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
        const lastMs = itemDateMsById(getArticles, altLang, id) ?? globalLastModifiedMs;
        entries.push({
          url: `${SITE_URL}/${altLang}/articles/${id}`,
          lastModified: new Date(lastMs),
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
        const lastMs = itemDateMsById(getConcepts, altLang, id) ?? globalLastModifiedMs;
        entries.push({
          url: `${SITE_URL}/${altLang}/concepts/${id}`,
          lastModified: new Date(lastMs),
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
        const lastMs = itemDateMsById(getBooks, altLang, id) ?? globalLastModifiedMs;
        entries.push({
          url: `${SITE_URL}/${altLang}/books/${id}`,
          lastModified: new Date(lastMs),
          changeFrequency: 'monthly',
          priority: 0.9,
          alternates: { languages: alternates },
        });
      }
    }
  }

  return entries;
}
