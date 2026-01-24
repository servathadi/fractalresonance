/**
 * MarkdownContent — Server component for rendering sanitized markdown HTML.
 *
 * Uses sanitize-html to ensure only safe HTML tags/attributes are rendered.
 * Content originates from local markdown files in the content/ directory.
 */

import sanitizeHtml from 'sanitize-html';

interface MarkdownContentProps {
  html: string;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'pre', 'code',
    'blockquote',
    'a', 'strong', 'em', 'del',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'figure', 'figcaption',
    'div', 'span', 'sup', 'sub',
  ],
  allowedAttributes: {
    a: ['href', 'class', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'class'],
    code: ['class'],
    pre: ['class'],
    div: ['class'],
    span: ['class'],
    td: ['align'],
    th: ['align'],
  },
  allowedClasses: {
    a: ['wikilink'],
    code: ['*'],
    pre: ['*'],
  },
};

export function MarkdownContent({ html }: MarkdownContentProps) {
  const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
