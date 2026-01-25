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

export function renderMarkdown(
  body: string,
  lang: string,
  glossary?: Record<string, { type?: string }>
): string {
  let html = body;

  // Code blocks (must be first to prevent inner processing)
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`);
    return `<!--CODE_BLOCK_${idx}-->`;
  });

  // Headings (with IDs for TOC anchoring)
  html = html.replace(/^(#{1,4}) (.+)$/gm, (_, hashes, text) => {
    const level = hashes.length;
    const id = text
      .replace(/[*_`]/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Images: ![alt](url) or ![alt](url "title")
  html = html.replace(/!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)/g, (_, alt, url, title) => {
    const safeAlt = escapeHtml(String(alt || ''));
    const safeUrl = escapeHtml(String(url || ''));
    const safeTitle = title ? ` title="${escapeHtml(String(title))}"` : '';
    return `<img src="${safeUrl}" alt="${safeAlt}"${safeTitle} />`;
  });

  // Wikilinks with display text: [[ID|text]]
  html = html.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, id, display) => {
    const { cleanId } = splitWikilinkId(id);
    const href = resolveWikilinkHref(id, lang, glossary);
    return `<a href="${href}" class="wikilink" data-wikilink-id="${cleanId}">${display}</a>`;
  });

  // Wikilinks plain: [[ID]]
  html = html.replace(/\[\[([^\]]+)\]\]/g, (_, id) => {
    const { cleanId } = splitWikilinkId(id);
    const href = resolveWikilinkHref(id, lang, glossary);
    return `<a href="${href}" class="wikilink" data-wikilink-id="${cleanId}">${id}</a>`;
  });

  // Regular markdown links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Lists (use lightweight tagging to distinguish ul vs ol before wrapping)
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li data-list="ol">$1</li>');
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li data-list="ul">$1</li>');
  html = html.replace(/((?:<li data-list="ol">.*<\/li>\n?)+)/g, '<ol>$1</ol>');
  html = html.replace(/((?:<li data-list="ul">.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/<li data-list="(ol|ul)">/g, '<li>');

  // Tables (GitHub-style)
  html = convertTables(html);

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
function resolveWikilinkHref(
  id: string,
  lang: string,
  glossary?: Record<string, { type?: string }>
): string {
  const { cleanId, section } = splitWikilinkId(id);
  const itemType = glossary?.[cleanId]?.type;

  if (itemType === 'paper') return `/${lang}/papers/${cleanId}${section}`;
  if (itemType === 'concept') return `/${lang}/concepts/${cleanId}${section}`;
  if (itemType === 'book') return `/${lang}/books/${cleanId}${section}`;
  if (itemType === 'article') return `/${lang}/articles/${cleanId}${section}`;

  // Fallback: infer from ID format
  if (cleanId.match(/^FRC-\d/)) return `/${lang}/papers/${cleanId}${section}`;
  return `/${lang}/concepts/${cleanId}${section}`;
}

function splitWikilinkId(id: string): { cleanId: string; section: string } {
  if (!id.includes('#')) return { cleanId: id, section: '' };
  const [cleanId, sectionPart] = id.split('#');
  return { cleanId, section: sectionPart ? `#${sectionPart}` : '' };
}

function convertTables(src: string): string {
  const lines = src.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const headerLine = lines[i];
    const dividerLine = lines[i + 1];

    if (headerLine && dividerLine && looksLikeTableRow(headerLine) && looksLikeTableDivider(dividerLine)) {
      const headers = parseTableRow(headerLine);
      const aligns = parseTableAlignments(dividerLine, headers.length);

      const bodyRows: string[][] = [];
      i += 2;

      while (i < lines.length && looksLikeTableRow(lines[i])) {
        bodyRows.push(parseTableRow(lines[i]));
        i++;
      }

      i -= 1; // compensate for outer loop i++
      out.push(renderTableHtml(headers, aligns, bodyRows));
      continue;
    }

    out.push(lines[i]);
  }

  return out.join('\n');
}

function looksLikeTableRow(line: string): boolean {
  // Very small heuristic: at least two pipes and not a code fence marker.
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('```')) return false;
  const pipeCount = (trimmed.match(/\|/g) || []).length;
  return pipeCount >= 2;
}

function looksLikeTableDivider(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // e.g. | --- | :---: | ---: |
  return /^[\|\s:-]+$/.test(trimmed) && trimmed.includes('-') && trimmed.includes('|');
}

function parseTableRow(line: string): string[] {
  const parts = line.split('|').map(p => p.trim());
  // Drop leading/trailing empties from optional outer pipes
  if (parts.length && parts[0] === '') parts.shift();
  if (parts.length && parts[parts.length - 1] === '') parts.pop();
  return parts;
}

function parseTableAlignments(dividerLine: string, count: number): Array<'left' | 'center' | 'right'> {
  const cols = parseTableRow(dividerLine);
  const aligns: Array<'left' | 'center' | 'right'> = [];

  for (let i = 0; i < count; i++) {
    const raw = (cols[i] || '').trim();
    const starts = raw.startsWith(':');
    const ends = raw.endsWith(':');
    if (starts && ends) aligns.push('center');
    else if (ends) aligns.push('right');
    else aligns.push('left');
  }

  return aligns;
}

function renderTableHtml(
  headers: string[],
  aligns: Array<'left' | 'center' | 'right'>,
  rows: string[][]
): string {
  const ths = headers
    .map((h, idx) => `<th align="${aligns[idx] || 'left'}">${h}</th>`)
    .join('');

  const trs = rows
    .map((r) => {
      const tds = headers.map((_, idx) => `<td align="${aligns[idx] || 'left'}">${r[idx] || ''}</td>`).join('');
      return `<tr>${tds}</tr>`;
    })
    .join('');

  return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
}

/** Extract table-of-contents items from markdown heading lines */
export function extractTocItems(body: string): { id: string; text: string; level: number }[] {
  const items: { id: string; text: string; level: number }[] = [];
  const lines = body.split('\n');

  for (const line of lines) {
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (!heading) continue;

    const level = heading[1].length;
    const text = heading[2].replace(/[*_`]/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    items.push({ id, text, level });
  }

  return items;
}

/** Escape HTML special characters in code blocks */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
