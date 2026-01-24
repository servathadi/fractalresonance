import type { MetadataRoute } from 'next';
import { getPapers, getLanguages } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://fractalresonance.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getLanguages();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Static pages per language
  const staticPages = ['about', 'articles', 'papers', 'formulas', 'positioning', 'mu-levels'];

  for (const lang of languages) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${lang}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Paper pages
    const papers = getPapers(lang);
    for (const paper of papers) {
      entries.push({
        url: `${SITE_URL}/${lang}/papers/${paper.frontmatter.id}`,
        lastModified: paper.frontmatter.date ? new Date(paper.frontmatter.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  return entries;
}
