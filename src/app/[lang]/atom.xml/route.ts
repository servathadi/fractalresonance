import { getPapers, getArticles, getBlogPosts, getLanguages, isCurrentReadingContent } from '@/lib/content';

const SITE_URL = 'https://fractalresonance.com';

interface FeedEntry {
  id: string;
  title: string;
  link: string;
  summary: string;
  updated: Date;
  published: Date;
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

function generateAtom(lang: string, entries: FeedEntry[]): string {
  const langNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fa: 'Persian',
    fr: 'French',
  };

  const sortedEntries = [...entries].sort((a, b) => b.updated.getTime() - a.updated.getTime());
  const lastUpdated = sortedEntries.length > 0 ? sortedEntries[0].updated : new Date();

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${lang}">
  <id>${SITE_URL}/${lang}/</id>
  <title>Fractal Resonance - ${langNames[lang] || lang}</title>
  <subtitle>Research papers, articles, and insights on Fractal Resonance Coherence (FRC)</subtitle>
  <link href="${SITE_URL}/${lang}" rel="alternate" type="text/html"/>
  <link href="${SITE_URL}/${lang}/atom.xml" rel="self" type="application/atom+xml"/>
  <updated>${lastUpdated.toISOString()}</updated>
  <author>
    <name>Hadi Servat</name>
    <uri>${SITE_URL}</uri>
  </author>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/brand/fractal-resonance-logo.jpg</logo>
  <rights>Copyright ${new Date().getFullYear()} Hadi Servat. All rights reserved.</rights>
  ${sortedEntries.map(entry => `
  <entry>
    <id>${entry.id}</id>
    <title>${escapeXml(entry.title)}</title>
    <link href="${entry.link}" rel="alternate" type="text/html"/>
    <published>${entry.published.toISOString()}</published>
    <updated>${entry.updated.toISOString()}</updated>
    <summary>${escapeXml(entry.summary)}</summary>
    <category term="${escapeXml(entry.category)}"/>
    <author>
      <name>Hadi Servat</name>
    </author>
  </entry>`).join('')}
</feed>`;
}

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const entries: FeedEntry[] = [];

  // Add papers
  const papers = getPapers(lang).filter((paper) => isCurrentReadingContent('paper', paper.frontmatter));
  for (const paper of papers) {
    const fm = paper.frontmatter;
    const date = fm.date ? new Date(fm.date) : new Date('2025-01-01');
    entries.push({
      id: `${SITE_URL}/${lang}/papers/${fm.id}`,
      title: fm.title || fm.id,
      link: `${SITE_URL}/${lang}/papers/${fm.id}`,
      summary: fm.abstract || fm.description || `Research paper: ${fm.title || fm.id}`,
      updated: date,
      published: date,
      category: 'Research Paper',
    });
  }

  // Add articles
  const articles = getArticles(lang).filter((article) => isCurrentReadingContent('article', article.frontmatter));
  for (const article of articles) {
    const fm = article.frontmatter;
    const date = fm.date ? new Date(fm.date) : new Date('2025-01-01');
    entries.push({
      id: `${SITE_URL}/${lang}/articles/${fm.id}`,
      title: fm.title || fm.id,
      link: `${SITE_URL}/${lang}/articles/${fm.id}`,
      summary: fm.abstract || fm.description || `Article: ${fm.title || fm.id}`,
      updated: date,
      published: date,
      category: 'Article',
    });
  }

  // Add blog posts
  const posts = getBlogPosts(lang).filter((post) => isCurrentReadingContent('blog', post.frontmatter));
  for (const post of posts) {
    const fm = post.frontmatter;
    const date = fm.date ? new Date(fm.date) : new Date('2025-01-01');
    entries.push({
      id: `${SITE_URL}/${lang}/blog/${fm.id}`,
      title: fm.title || fm.id,
      link: `${SITE_URL}/${lang}/blog/${fm.id}`,
      summary: fm.abstract || fm.description || `Blog post: ${fm.title || fm.id}`,
      updated: date,
      published: date,
      category: 'Blog',
    });
  }

  const atom = generateAtom(lang, entries);

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
