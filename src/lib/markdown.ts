/**
 * Minimal markdown to HTML renderer — no external dependencies.
 *
 * Handles: headings, code blocks, inline code, bold, italic,
 * wikilinks, regular links, lists, blockquotes, paragraphs.
 *
 * Safety: This function processes content from trusted local
 * markdown files in the content/ directory. It is called at
 * build time during static generation. No user input passes
 * through this function.
 */

export function renderMarkdown(body: string, lang: string): string {
  let html = body;

  // Code blocks (must be first to prevent inner processing)
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`);
    return `<!--CODE_BLOCK_${idx}-->`;
  });

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Wikilinks with display text: [[ID|text]]
  html = html.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, id, display) => {
    const href = resolveWikilinkHref(id, lang);
    return `<a href="${href}" class="wikilink">${display}</a>`;
  });

  // Wikilinks plain: [[ID]]
  html = html.replace(/\[\[([^\]]+)\]\]/g, (_, id) => {
    const href = resolveWikilinkHref(id, lang);
    return `<a href="${href}" class="wikilink">${id}</a>`;
  });

  // Regular markdown links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');

  // Paragraphs
  html = html
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return trimmed;
      if (trimmed.startsWith('<!--CODE_BLOCK_')) return trimmed;
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  // Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    html = html.replace(`<!--CODE_BLOCK_${i}-->`, codeBlocks[i]);
  }

  return html;
}

/** Resolve wikilink ID to href */
function resolveWikilinkHref(id: string, lang: string): string {
  let cleanId = id;
  let section = '';

  if (id.includes('#')) {
    const parts = id.split('#');
    cleanId = parts[0];
    section = `#${parts[1]}`;
  }

  // Determine if it's a paper or concept based on ID format
  if (cleanId.match(/^FRC-\d/)) {
    return `/${lang}/papers/${cleanId}${section}`;
  }
  return `/${lang}/concepts/${cleanId}${section}`;
}

/** Escape HTML special characters in code blocks */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
