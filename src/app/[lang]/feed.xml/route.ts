import { getPapers, getArticles, getBlogPosts, getLanguages, isCurrentReadingContent } from '@/lib/content';

const SITE_URL = 'https://fractalresonance.com';

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  guid: string;
  category: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRss(lang: string, items: FeedItem[]): string {
  const langNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fa: 'Persian',
    fr: 'French',
  };

  const sortedItems = [...items].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Fractal Resonance - ${langNames[lang] || lang}</title>
    <link>${SITE_URL}/${lang}</link>
    <description>Current research papers, commentary, and reading guides for the versioned Fractal Resonance Coherence corpus.</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/${lang}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/brand/fractal-resonance-logo.jpg</url>
      <title>Fractal Resonance</title>
      <link>${SITE_URL}/${lang}</link>
    </image>
    ${sortedItems.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
      <category>${escapeXml(item.category)}</category>
      <dc:creator>Hadi Servat</dc:creator>
    </item>`).join('')}
  </channel>
</rss>`;
}

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const items: FeedItem[] = [];

  // Add papers
  const papers = getPapers(lang).filter((paper) => isCurrentReadingContent('paper', paper.frontmatter));
  for (const paper of papers) {
    const fm = paper.frontmatter;
    items.push({
      title: fm.title || fm.id,
      link: `${SITE_URL}/${lang}/papers/${fm.id}`,
      description: fm.abstract || fm.description || `Research paper: ${fm.title || fm.id}`,
      pubDate: fm.date ? new Date(fm.date) : new Date('2025-01-01'),
      guid: `${SITE_URL}/${lang}/papers/${fm.id}`,
      category: 'Research Paper',
    });
  }

  // Add articles
  const articles = getArticles(lang).filter((article) => isCurrentReadingContent('article', article.frontmatter));
  for (const article of articles) {
    const fm = article.frontmatter;
    items.push({
      title: fm.title || fm.id,
      link: `${SITE_URL}/${lang}/articles/${fm.id}`,
      description: fm.abstract || fm.description || `Article: ${fm.title || fm.id}`,
      pubDate: fm.date ? new Date(fm.date) : new Date('2025-01-01'),
      guid: `${SITE_URL}/${lang}/articles/${fm.id}`,
      category: 'Article',
    });
  }

  // Add blog posts
  const posts = getBlogPosts(lang).filter((post) => isCurrentReadingContent('blog', post.frontmatter));
  for (const post of posts) {
    const fm = post.frontmatter;
    items.push({
      title: fm.title || fm.id,
      link: `${SITE_URL}/${lang}/blog/${fm.id}`,
      description: fm.abstract || fm.description || `Blog post: ${fm.title || fm.id}`,
      pubDate: fm.date ? new Date(fm.date) : new Date('2025-01-01'),
      guid: `${SITE_URL}/${lang}/blog/${fm.id}`,
      category: 'Blog',
    });
  }

  const rss = generateRss(lang, items);

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
