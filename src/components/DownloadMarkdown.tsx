'use client';

import { useCallback } from 'react';

interface DownloadMarkdownProps {
  /** Paper/content ID */
  id: string;
  /** Content title for filename */
  title: string;
  /** Full markdown content (frontmatter + body) */
  content: string;
  /** Language for i18n */
  lang?: string;
}

const DICT: Record<string, { download: string; downloading: string }> = {
  en: { download: 'Download Markdown', downloading: 'Downloading...' },
  fa: { download: 'دانلود مارک‌داون', downloading: 'در حال دانلود...' },
  es: { download: 'Descargar Markdown', downloading: 'Descargando...' },
  fr: { download: 'Télécharger Markdown', downloading: 'Téléchargement...' },
};

export function DownloadMarkdown({ id, title, content, lang = 'en' }: DownloadMarkdownProps) {
  const t = DICT[lang] || DICT['en'];

  const handleDownload = useCallback(() => {
    // Create blob with markdown content
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    // Sanitize filename
    const safeTitle = title.replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-').toLowerCase();
    link.download = `${id}-${safeTitle}.md`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
  }, [content, id, title]);

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 border border-frc-blue rounded-md text-frc-text-dim hover:text-frc-gold hover:border-frc-gold transition-colors"
      title={t.download}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>.md</span>
    </button>
  );
}
