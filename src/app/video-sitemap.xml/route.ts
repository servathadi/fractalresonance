import { NextResponse } from 'next/server';
import { getArticles, getPapers, getLanguages } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://fractalresonance.com';

interface VideoEntry {
  pageUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  contentUrl?: string;
  playerUrl?: string;
  duration?: string;
  publicationDate?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getYouTubeEmbedUrl(url: string): string | null {
  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  // Handle youtube.com/watch links
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  return null;
}

function getYouTubeThumbnail(url: string): string | null {
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  const videoId = shortMatch?.[1] || watchMatch?.[1];
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
}

export async function GET() {
  const videos: VideoEntry[] = [];
  const languages = getLanguages();

  // Collect videos from articles (episode pages)
  for (const lang of languages) {
    const articles = getArticles(lang);
    for (const article of articles) {
      const fm = article.frontmatter;
      const video = fm.video as { url?: string; embedUrl?: string; thumbnailUrl?: string; duration?: string } | undefined;

      if (video?.url || video?.embedUrl) {
        const youtubeUrl = video.url || video.embedUrl || '';
        const embedUrl = video.embedUrl || getYouTubeEmbedUrl(youtubeUrl);
        const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(youtubeUrl) || `${SITE_URL}/brand/banner.jpg`;

        videos.push({
          pageUrl: `${SITE_URL}/${lang}/articles/${fm.id}`,
          thumbnailUrl: thumbnailUrl.startsWith('/') ? `${SITE_URL}${thumbnailUrl}` : thumbnailUrl,
          title: fm.title || 'Untitled Video',
          description: fm.abstract || fm.description || 'FRC video content',
          playerUrl: embedUrl || undefined,
          contentUrl: video.url,
          duration: video.duration,
          publicationDate: fm.date ? String(fm.date) : undefined,
        });
      }
    }
  }

  // Collect videos from papers
  for (const lang of languages) {
    const papers = getPapers(lang);
    for (const paper of papers) {
      const fm = paper.frontmatter;
      const video = fm.video as { url?: string; embedUrl?: string; thumbnailUrl?: string; duration?: string; uploadDate?: string } | undefined;

      if (video?.url || video?.embedUrl) {
        const youtubeUrl = video.url || video.embedUrl || '';
        const embedUrl = video.embedUrl || getYouTubeEmbedUrl(youtubeUrl);
        const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(youtubeUrl) || `${SITE_URL}/brand/banner.jpg`;

        videos.push({
          pageUrl: `${SITE_URL}/${lang}/papers/${fm.id}`,
          thumbnailUrl: thumbnailUrl.startsWith('/') ? `${SITE_URL}${thumbnailUrl}` : thumbnailUrl,
          title: `${fm.title} — Video Explainer`,
          description: fm.abstract || 'FRC paper video explainer',
          playerUrl: embedUrl || undefined,
          contentUrl: video.url,
          duration: video.duration,
          publicationDate: video.uploadDate || (fm.date ? String(fm.date) : undefined),
        });
      }
    }
  }

  // Deduplicate by pageUrl
  const seen = new Set<string>();
  const uniqueVideos = videos.filter(v => {
    if (seen.has(v.pageUrl)) return false;
    seen.add(v.pageUrl);
    return true;
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${uniqueVideos.map(v => `  <url>
    <loc>${escapeXml(v.pageUrl)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(v.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description)}</video:description>
${v.playerUrl ? `      <video:player_loc>${escapeXml(v.playerUrl)}</video:player_loc>\n` : ''}${v.contentUrl ? `      <video:content_loc>${escapeXml(v.contentUrl)}</video:content_loc>\n` : ''}${v.duration ? `      <video:duration>${v.duration}</video:duration>\n` : ''}${v.publicationDate ? `      <video:publication_date>${v.publicationDate}</video:publication_date>\n` : ''}    </video:video>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
