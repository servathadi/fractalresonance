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

  const headingIdxs: Array<{ idx: number; raw: string }> = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#)\s+(.+)$/);
    if (!m) continue;
    headingIdxs.push({ idx: i, raw: m[2] });
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
    chapters.push({
      anchorId: parsed.id,
      title: parsed.text,
      slug: toUrlSlug(parsed.id || parsed.text),
      markdown: lines.slice(start, end).join('\n').trim() + '\n',
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

