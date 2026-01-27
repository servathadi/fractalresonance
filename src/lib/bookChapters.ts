export interface DerivedChapterMeta {
  /** Anchor ID used inside the rendered HTML (may include non-ASCII if authored that way). */
  anchorId: string;
  /** Human-readable title (without `{#...}` suffix). */
  title: string;
  /** URL-safe slug used for chapter routes. */
  slug: string;
}

export interface DerivedChapter extends DerivedChapterMeta {
  /** Markdown slice for this chapter (includes the chapter heading line). */
  markdown: string;
}

/**
 * Derive chapter boundaries from a single-file book.
 *
 * Strategy:
 * - Prefer H1 headings (`# ...`) as chapter separators.
 * - If no H1 headings exist, return a single "full" chapter.
 */
export function deriveChaptersFromMarkdown(body: string): DerivedChapter[] {
  const lines = (body || '').split('\n');

  // Prefer explicit markdown H1 (`# ...`) *when there are multiple*, otherwise fall back to
  // "book-style" separators like `Chapter 1: ...`, `Part II: ...`, `Appendix A: ...`, etc.
  //
  // Note: Many books in this repo are assembled from multiple markdown files and use `## ...`
  // for chapter headings, so we also support chapter-like separators at any heading level.
  const headingIdxs: Array<{ idx: number; raw: string; kind: 'h1' | 'line' }> = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#)\s+(.+)$/);
    if (!m) continue;
    headingIdxs.push({ idx: i, raw: m[2], kind: 'h1' });
  }

  // Only treat H1s as chapter boundaries if there are multiple.
  if (headingIdxs.length <= 1) {
    headingIdxs.length = 0;
  }

  // Fall back to headings (any level) that look like chapter separators.
  if (headingIdxs.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^(#{1,6})\s+(.+)$/);
      if (!m) continue;
      const parsed = parseHeadingText(m[2]);
      if (!looksLikeChapterSeparator(parsed.text)) continue;
      headingIdxs.push({ idx: i, raw: m[2], kind: 'h1' });
    }
  }

  // Final fallback: plain lines that look like separators (e.g. single-file exports).
  if (headingIdxs.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = (lines[i] || '').trim();
      if (!line) continue;
      if (looksLikeChapterSeparator(line)) {
        headingIdxs.push({ idx: i, raw: line, kind: 'line' });
      }
    }
  }

  if (headingIdxs.length === 0) {
    return [
      {
        anchorId: 'full',
        title: 'Full text',
        slug: 'full',
        markdown: body || '',
      },
    ];
  }

  const chapters: DerivedChapter[] = [];

  for (let i = 0; i < headingIdxs.length; i++) {
    const start = headingIdxs[i].idx;
    const end = i + 1 < headingIdxs.length ? headingIdxs[i + 1].idx : lines.length;
    const parsed = parseHeadingText(headingIdxs[i].raw);

    const slice = lines.slice(start, end);
    // If we derived chapters from "plain" lines like `Chapter 12: ...`, upgrade the
    // first line to a markdown heading so it becomes navigable and styled like a chapter.
    if (headingIdxs[i].kind === 'line' && slice.length > 0) {
      slice[0] = `# ${headingIdxs[i].raw}`;
    }

    chapters.push({
      anchorId: parsed.id,
      title: parsed.text,
      slug: toUrlSlug(parsed.id || parsed.text),
      markdown: slice.join('\n').trim() + '\n',
    });
  }

  // De-duplicate slugs (rare but possible with repeated headings)
  const seen = new Map<string, number>();
  for (const c of chapters) {
    const n = seen.get(c.slug) || 0;
    if (n > 0) c.slug = `${c.slug}-${n + 1}`;
    seen.set(c.slug, n + 1);
  }

  return chapters;
}

export function getChapterList(body: string): DerivedChapterMeta[] {
  return deriveChaptersFromMarkdown(body).map(({ anchorId, title, slug }) => ({ anchorId, title, slug }));
}

export function findChapterBySlug(body: string, slug: string): DerivedChapter | null {
  const chapters = deriveChaptersFromMarkdown(body);
  return chapters.find((c) => c.slug === slug) || null;
}

function parseHeadingText(raw: string): { text: string; id: string } {
  const trimmed = (raw || '').trim();
  const m = trimmed.match(/^(.*?)(?:\s*\{#([^\}]+)\}\s*)$/);
  const text = (m ? m[1] : trimmed).trim();
  const explicitId = (m ? m[2] : '').trim();
  const id = explicitId || slugifyHeading(text);
  return { text, id };
}

function slugifyHeading(text: string): string {
  return (text || '')
    .replace(/[*_`]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function toUrlSlug(text: string): string {
  // Make the route segment conservative (ASCII-ish) even if author used non-ASCII in {#...}.
  return (text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function looksLikeChapterSeparator(line: string): boolean {
  // Intentionally conservative to avoid matching narrative sentences.
  // We require ":" after the number/label to reduce false positives.
  if (/^preface$/i.test(line)) return true;
  if (/^introduction\b.*$/i.test(line) && line.includes(':')) return true;
  if (/^reader'?s overture\b.*$/i.test(line)) return true;

  // English
  if (/^part\s+[ivxlcdm0-9]+\s*:/i.test(line)) return true;
  if (/^chapter\s+\d+\s*:/i.test(line)) return true;
  if (/^appendix\s+[a-z0-9]+\s*:/i.test(line)) return true;

  // Back matter (no colon required)
  if (/^acknowledgm?ents?$/i.test(line)) return true;
  if (/^afterword$/i.test(line)) return true;
  if (/^bibliography$/i.test(line)) return true;
  if (/^references?$/i.test(line)) return true;
  if (/^index$/i.test(line)) return true;
  if (/^about the author$/i.test(line)) return true;

  // French / Spanish (common translations)
  if (/^chapitre\s+\d+\s*[:—-]/i.test(line)) return true;
  if (/^cap[ií]tulo\s+\d+\s*[:—-]/i.test(line)) return true;

  // Persian
  if (/^\u0641\u0635\u0644\s*\d+\s*[:\u2014-]/.test(line)) return true;

  return false;
}
