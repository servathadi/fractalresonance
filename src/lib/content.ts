/**
 * Content parser — reads markdown files with YAML frontmatter.
 * Parses wikilinks, extracts metadata, builds backlink index.
 *
 * NOTE: This module uses only 'fs' and 'path' for file reading.
 * No shell commands or child processes are used.
 */

import fs from 'fs';
import path from 'path';
import type { PaperMeta, ConceptMeta } from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// ─── Frontmatter Parser ────────────────────────────────────────────────────

interface RawFrontmatter {
  title: string;
  id: string;
  description?: string;
  series?: string;
  author?: string;
  date?: string;
  status?: string;
  perspective?: 'kasra' | 'river' | 'both';
  // Authorial voice used for labeling content (independent of visibility perspective).
  voice?: string;
  // Multiple voices (preferred over `voice` when present).
  voices?: string[];
  // Topic/Q&A fields (used by Topics pages).
  question?: string;
  short_answer?: string;
  authorities?: Array<{
    name?: string;
    title?: string;
    url?: string;
    quote?: string;
    publisher?: string;
    published_at?: string;
    accessed_at?: string;
    type?: string;
  }>;
  answers?: Array<{
    lens?: string;
    by?: string;
    role?: string;
    stance?: string;
    answer?: string;
    url?: string;
  }>;
  tags?: string[];
  abstract?: string;
  tldr?: string;
  key_points?: string[];
  prerequisites?: string[];
  read_time?: string;
  lang?: string;
  doi?: string;
  license?: string;
  related?: string[];
  intros?: {
    river?: string;
    kasra?: string;
  };
  startHere?: {
    river?: Array<{ k?: string; title?: string; desc?: string; target?: string; url?: string }>;
    kasra?: Array<{ k?: string; title?: string; desc?: string; target?: string; url?: string }>;
  };
  video?: {
    url: string;
    embedUrl?: string;
    thumbnailUrl: string;
    duration?: string;
    uploadDate?: string;
  };
  images?: {
    url: string;
    caption: string;
    width?: number;
    height?: number;
  }[];
  rating?: {
    value: number;
    count: number;
    best?: number;
  };

  // Person/profile fields (used by People pages).
  role?: string;
  tagline?: string;
  avatar?: string;
  links?: Array<{ label?: string; url?: string }>;
  aliases?: string[];
}

export interface ParsedContent {
  frontmatter: RawFrontmatter;
  body: string;
}

export interface HomeConfig {
  intros?: {
    river?: string;
    kasra?: string;
  };
  startHere?: {
    river?: Array<{ k?: string; title?: string; desc?: string; target?: string; url?: string }>;
    kasra?: Array<{ k?: string; title?: string; desc?: string; target?: string; url?: string }>;
  };
}

/** Parse YAML-like frontmatter from markdown string */
export function parseFrontmatter(content: string): ParsedContent {
  // Allow whitespace on delimiter lines (some translated files contain `--- `).
  const fmRegex = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/;
  const match = content.match(fmRegex);

  if (!match) {
    return { frontmatter: { title: '', id: '' }, body: content };
  }

  const [, fmRaw, body] = match;
  const frontmatter = parseYamlFrontmatter(fmRaw);

  return { frontmatter: frontmatter as unknown as RawFrontmatter, body: body.trim() };
}

type YamlValue =
  | string
  | number
  | boolean
  | null
  | YamlValue[]
  | { [key: string]: YamlValue };

function parseYamlFrontmatter(src: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  const stack: Array<{ indent: number; container: Record<string, unknown> | unknown[] }> = [
    { indent: -1, container: root },
  ];

  const lines = src.split('\n');
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    i++;

    if (!rawLine || /^\s*$/.test(rawLine)) continue;

    const indent = rawLine.match(/^ */)?.[0].length ?? 0;
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Close containers when indentation decreases.
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const ctx = stack[stack.length - 1].container;

    // Sequence item
    if (line.startsWith('- ')) {
      if (!Array.isArray(ctx)) continue;

      const rest = line.slice(2).trim();
      if (!rest) {
        const obj: Record<string, unknown> = {};
        ctx.push(obj);
        stack.push({ indent, container: obj });
        continue;
      }

      const kv = splitYamlKeyValue(rest);
      if (!kv) {
        ctx.push(parseYamlValue(rest));
        continue;
      }

      const [k, vRaw] = kv;
      const obj: Record<string, unknown> = {};
      ctx.push(obj);
      stack.push({ indent, container: obj });

      if (vRaw === '') {
        const nested = inferYamlContainer(lines, i, indent + 2);
        obj[k] = nested;
        // Child properties live two spaces deeper than the dash indent.
        stack.push({ indent: indent + 2, container: nested });
      } else {
        obj[k] = parseYamlValue(vRaw);
      }
      continue;
    }

    // Mapping entry
    const kv = splitYamlKeyValue(line);
    if (!kv || Array.isArray(ctx)) continue;

    const [key, rawVal] = kv;
    if (rawVal === '') {
      const nested = inferYamlContainer(lines, i, indent + 2);
      (ctx as Record<string, unknown>)[key] = nested;
      stack.push({ indent, container: nested });
      continue;
    }

    (ctx as Record<string, unknown>)[key] = parseYamlValue(rawVal);
  }

  return root;
}

function splitYamlKeyValue(line: string): [string, string] | null {
  const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
  if (!match) return null;
  return [match[1], match[2] ?? ''];
}

function inferYamlContainer(lines: string[], startIndex: number, childIndent: number): Record<string, unknown> | unknown[] {
  for (let j = startIndex; j < lines.length; j++) {
    const rawLine = lines[j];
    if (!rawLine || /^\s*$/.test(rawLine)) continue;

    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const indent = rawLine.match(/^ */)?.[0].length ?? 0;
    if (indent < childIndent) break;

    return line.startsWith('- ') ? [] : {};
  }

  // Default to mapping when there's no obvious child structure.
  return {};
}

function parseYamlValue(raw: string): YamlValue {
  const val = raw.trim();

  // Inline array: [a, b, c]
  if (val.startsWith('[') && val.endsWith(']')) {
    const inner = val.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => parseYamlValue(s.trim()));
  }

  if (val === 'null' || val === '~') return null;
  if (val === 'true') return true;
  if (val === 'false') return false;

  // Numbers (avoid coercing dates/ids like 2025-01-01)
  if (/^-?\d+(\.\d+)?$/.test(val)) {
    const num = Number(val);
    if (!Number.isNaN(num)) return num;
  }

  return stripYamlQuotes(val);
}

function stripYamlQuotes(val: string): string {
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    return val.slice(1, -1);
  }
  return val;
}

// ─── Content Loaders ───────────────────────────────────────────────────────

/** Get all papers for a language */
export function getPapers(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'papers');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return parseFrontmatter(raw);
    })
    .sort((a, b) => String(a.frontmatter.date || '').localeCompare(String(b.frontmatter.date || '')));
}

/** Get all articles (blog/episodes) for a language */
export function getArticles(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'articles');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return parseFrontmatter(raw);
    })
    .sort((a, b) => String(a.frontmatter.date || '').localeCompare(String(b.frontmatter.date || '')));
}

/** Get all blog posts for a language */
export function getBlogPosts(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'blog');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return parseFrontmatter(raw);
    })
    .sort((a, b) => String(a.frontmatter.date || '').localeCompare(String(b.frontmatter.date || '')));
}

/** Get a single blog post by id */
export function getBlogPost(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'blog');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }
  return null;
}

/** Get all topics for a language */
export function getTopics(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'topics');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return parseFrontmatter(raw);
    })
    .sort((a, b) => String(a.frontmatter.date || '').localeCompare(String(b.frontmatter.date || '')));
}

/** Get a single topic by id */
export function getTopic(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'topics');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }
  return null;
}

/** Get all people/profiles for a language */
export function getPeople(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'people');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return parseFrontmatter(raw);
    })
    .sort((a, b) => String(a.frontmatter.title || '').localeCompare(String(b.frontmatter.title || '')));
}

/** Get a single person/profile by id */
export function getPerson(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'people');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }
  return null;
}

/** Get a single paper by id */
export function getPaper(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'papers');
  if (!fs.existsSync(dir)) return null;

  const normalize = (rawId: string) => {
    // Keep this intentionally forgiving to preserve legacy URLs like:
    // - "FRC 100.001"
    // - "FRC-100.001"
    // - "frc 893.phy"
    let s = (rawId || '').trim();
    s = s.replace(/^frc\s+/i, 'FRC-'); // "FRC 100.001" -> "FRC-100.001"
    s = s.replace(/^frc-/i, 'FRC-');
    s = s.replace(/\s+/g, '-');
    s = s.replace(/\./g, '-');
    s = s.replace(/_+/g, '-');
    s = s.replace(/-+/g, '-');
    return s.toUpperCase();
  };

  const requested = normalize(id);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
    if (normalize(parsed.frontmatter.id) === requested) return parsed;
  }
  return null;
}

export function getLegacyPaperIds(canonicalId: string): string[] {
  const out: string[] = [];
  const push = (s: string) => {
    if (!s) return;
    if (!out.includes(s)) out.push(s);
  };

  push(canonicalId);

  const m = canonicalId.match(/^FRC-(.+)$/i);
  if (!m) return out;

  const rest = m[1]; // e.g. "100-001", "893-PHY"
  const [series, ...suffixParts] = rest.split('-');
  if (!series || suffixParts.length === 0) return out;

  const suffix = suffixParts.join('-');
  // Avoid emitting space-based routes (they become %20 URLs and duplicate SEO surfaces).
  // We keep dot-variant for legacy compatibility.
  push(`FRC-${series}.${suffix}`);

  return out;
}

/** Get all books for a language */
export function getBooks(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'books');
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir);
  const books: ParsedContent[] = [];

  for (const e of entries) {
    const full = path.join(dir, e);
    const stat = fs.statSync(full);

    // Single-file book: books/<id>.md
    if (stat.isFile() && e.endsWith('.md')) {
      const raw = fs.readFileSync(full, 'utf-8');
      books.push(parseFrontmatter(raw));
      continue;
    }

    // Folder book: books/<id>/index.md (or first chapter file)
    if (stat.isDirectory()) {
      const indexPath = path.join(full, 'index.md');
      const chapterFiles = fs.readdirSync(full).filter(f => f.endsWith('.md')).sort();
      const pick = fs.existsSync(indexPath) ? indexPath : (chapterFiles[0] ? path.join(full, chapterFiles[0]) : null);
      if (!pick) continue;
      const raw = fs.readFileSync(pick, 'utf-8');
      books.push(parseFrontmatter(raw));
    }
  }

  return books.sort((a, b) => String(a.frontmatter.date || '').localeCompare(String(b.frontmatter.date || '')));
}

/** Get a single book by id */
export function getBook(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'books');
  if (!fs.existsSync(dir)) return null;

  // 1) Single-file book
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }

  // 2) Folder book: books/<id>/(index.md + chapters)
  const bookDir = path.join(dir, id);
  if (!fs.existsSync(bookDir) || !fs.statSync(bookDir).isDirectory()) return null;

  const indexPath = path.join(bookDir, 'index.md');
  const chapterFiles = fs.readdirSync(bookDir).filter(f => f.endsWith('.md') && f !== 'index.md');
  const sortedChapters = chapterFiles.sort(sortChapterFilenames);

  if (fs.existsSync(indexPath)) {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const parsed = parseFrontmatter(raw);
    // Return only the index content - chapter content lives on individual chapter pages
    // This avoids duplicate content issues and keeps the book landing page lightweight
    return parsed;
  }

  // If there's no index.md, treat the first chapter file as the book page.
  if (sortedChapters.length === 0) return null;
  const raw = fs.readFileSync(path.join(bookDir, sortedChapters[0]), 'utf-8');
  return parseFrontmatter(raw);
}

export interface BookChapter {
  filename: string;
  title: string;
  body: string;
}

export function getBookChapters(lang: string, id: string): BookChapter[] {
  const bookDir = path.join(CONTENT_DIR, lang, 'books', id);
  if (!fs.existsSync(bookDir) || !fs.statSync(bookDir).isDirectory()) return [];

  const extractTitleFromBody = (body: string, fallback: string): string => {
    const lines = String(body || '').split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
      if (!m) continue;
      // Strip explicit anchor suffix: "Title {#id}"
      const txt = m[1].replace(/\s*\{#[^\}]+\}\s*$/, '').trim();
      if (txt) return txt;
    }
    return fallback;
  };

  const chapterFiles = fs
    .readdirSync(bookDir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort(sortChapterFilenames);

  return chapterFiles.map((filename) => {
    const raw = fs.readFileSync(path.join(bookDir, filename), 'utf-8');
    const parsed = parseFrontmatter(raw);
    const fallbackTitle = filename.replace(/\.md$/, '');
    const title =
      parsed.frontmatter.title ||
      extractTitleFromBody(parsed.body, fallbackTitle);
    return { filename, title, body: parsed.body };
  });
}

/**
 * Sort chapter filenames in proper book order:
 * 1. Preface
 * 2. Reader's overture / Introduction
 * 3. Parts with chapters (Part I → Ch 1-10, Part II → Ch 11-20, etc.)
 * 4. Appendices (A-Z)
 * 5. Acknowledgments / Afterword
 */
function sortChapterFilenames(a: string, b: string): number {
  return getChapterSortKey(a) - getChapterSortKey(b);
}

function getChapterSortKey(filename: string): number {
  const lower = filename.toLowerCase();

  // Front matter (0-99)
  if (lower.startsWith('preface')) return 10;
  if (lower.includes('reader') || lower.includes('overture')) return 20;
  if (lower.startsWith('introduction')) return 30;

  // Parts: part-i = 100, part-ii = 200, part-iii = 300
  const partMatch = lower.match(/^part[_-]?(i{1,3}|iv|v|[0-9]+)/);
  if (partMatch) {
    const partNum = romanOrNumToInt(partMatch[1]);
    return 100 * partNum;
  }

  // Chapters: extract number, place after corresponding part
  // chapter-1 to chapter-10 → 101-110 (after Part I = 100)
  // chapter-11 to chapter-20 → 201-210 (after Part II = 200)
  const chapterMatch = lower.match(/^chapter[_-]?(\d+)/);
  if (chapterMatch) {
    const chNum = parseInt(chapterMatch[1], 10);
    const partGroup = Math.ceil(chNum / 10); // 1-10 → Part 1, 11-20 → Part 2, etc.
    const offset = ((chNum - 1) % 10) + 1; // 1-10 within each part
    return 100 * partGroup + offset;
  }

  // Back matter (1000+)
  const appendixMatch = lower.match(/^appendix[_-]?([a-z])/);
  if (appendixMatch) {
    return 1000 + (appendixMatch[1].charCodeAt(0) - 96); // a=1, b=2, etc.
  }

  if (lower.startsWith('acknowledgment') || lower.startsWith('afterword')) return 1100;
  if (lower.startsWith('bibliography') || lower.startsWith('reference')) return 1110;
  if (lower.startsWith('index')) return 1120;

  // Unknown files go to end
  return 9000;
}

function romanOrNumToInt(val: string): number {
  const lower = val.toLowerCase();
  const romanMap: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5 };
  if (romanMap[lower]) return romanMap[lower];
  const num = parseInt(val, 10);
  return isNaN(num) ? 999 : num;
}

/** Get all concepts for a language */
export function getConcepts(lang: string = 'en'): ParsedContent[] {
  const dir = path.join(CONTENT_DIR, lang, 'concepts');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return parseFrontmatter(raw);
    });
}

/** Get a single concept by id */
export function getConcept(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'concepts');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }
  return null;
}

/** Get all available languages */
export function getLanguages(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return ['en'];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => {
      const full = path.join(CONTENT_DIR, f);
      return fs.statSync(full).isDirectory() && f !== 'inbox';
    });
}

export function getHomeConfig(lang: string = 'en'): HomeConfig | null {
  // Keep home CMS config outside normal content types.
  const tryPaths = [
    path.join(CONTENT_DIR, lang, 'site', 'home.md'),
    path.join(CONTENT_DIR, 'en', 'site', 'home.md'),
  ];

  for (const p of tryPaths) {
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf-8');
    const parsed = parseFrontmatter(raw);
    const fm = parsed.frontmatter as unknown as HomeConfig;
    return {
      intros: fm.intros,
      startHere: fm.startHere,
    };
  }

  return null;
}

/** Get a single site page (investors, contact, etc.) */
export function getSitePage(lang: string, slug: string): ParsedContent | null {
  const p = path.join(CONTENT_DIR, lang, 'site', `${slug}.md`);
  if (!fs.existsSync(p)) {
    // Fallback to English if not found in requested language
    const fallback = path.join(CONTENT_DIR, 'en', 'site', `${slug}.md`);
    if (!fs.existsSync(fallback)) return null;
    return parseFrontmatter(fs.readFileSync(fallback, 'utf-8'));
  }
  return parseFrontmatter(fs.readFileSync(p, 'utf-8'));
}

/** Get a single article by id */
export function getArticle(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'articles');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }
  return null;
}

// ─── Schema Converters ─────────────────────────────────────────────────────

export function toPaperMeta(parsed: ParsedContent): PaperMeta {
  const fm = parsed.frontmatter;
  return {
    id: fm.id,
    title: fm.title,
    series: fm.series || 'FRC',
    author: fm.author || 'H. Servat',
    date: String(fm.date || new Date().toISOString().split('T')[0]),
    abstract: fm.abstract || '',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    lang: fm.lang || 'en',
    doi: fm.doi,
    video: fm.video,
    images: fm.images,
    rating: fm.rating,
  };
}

/** Convert parsed frontmatter to ConceptMeta for schema generation */
export function toConceptMeta(parsed: ParsedContent): ConceptMeta {
  const fm = parsed.frontmatter;
  // Extract first paragraph as description
  const firstPara = parsed.body
    .split('\n\n')
    .find(p => p && !p.startsWith('#') && !p.startsWith('---'));

  return {
    id: fm.id,
    title: fm.title,
    description: firstPara || '',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    related: Array.isArray(fm.related) ? fm.related : [],
    lang: fm.lang || 'en',
  };
}

export interface GlossaryItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'paper' | 'concept' | 'book' | 'article' | 'blog' | 'topic' | 'person';
  url: string;
  perspective: ContentPerspective;
}

export interface PersonWorkItem {
  id: string;
  title: string;
  type: 'paper' | 'concept' | 'book' | 'article' | 'blog' | 'topic';
  url: string;
  date?: string;
}

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.-]+/gu, ' ') // keep letters/numbers/space/dot/dash
    .replace(/\s+/g, ' ')
    .trim();
}

function fieldMatchesAny(field: unknown, keys: string[]): boolean {
  if (typeof field !== 'string') return false;
  const hay = normalizeKey(field);
  if (!hay) return false;
  for (const k of keys) {
    const nk = normalizeKey(k);
    if (!nk) continue;
    if (hay === nk) return true;
    if (hay.includes(nk)) return true;
  }
  return false;
}

function fieldMatchesAnyMulti(field: unknown, keys: string[]): boolean {
  if (typeof field === 'string') return fieldMatchesAny(field, keys);
  if (Array.isArray(field)) {
    for (const v of field) {
      if (typeof v !== 'string') continue;
      if (fieldMatchesAny(v, keys)) return true;
    }
  }
  return false;
}

/** Collect content items authored/voiced by a person profile. */
export function getWorkForPerson(
  lang: string,
  personFrontmatter: { id: string; title: string; aliases?: string[] },
  opts: { basePath: string; view: PerspectiveView; glossary: Record<string, GlossaryItem> }
): PersonWorkItem[] {
  const keys = Array.from(
    new Set([personFrontmatter.id, personFrontmatter.title, ...(personFrontmatter.aliases || [])].filter(Boolean))
  );

  const { basePath, view, glossary } = opts;
  const mk = (parsed: ParsedContent, type: PersonWorkItem['type']): PersonWorkItem => {
    const fm = parsed.frontmatter;
    const url = glossary[fm.id]?.url || `${basePath}/${type === 'topic' ? 'topics' : `${type}s`}/${fm.id}`;
    return { id: fm.id, title: fm.title, type, url, date: fm.date };
  };

  const results: PersonWorkItem[] = [];
  const consider = (items: ParsedContent[], type: PersonWorkItem['type']) => {
    for (const item of items) {
      const fm = item.frontmatter as RawFrontmatter;
      if (!matchesPerspectiveView(fm.perspective, view)) continue;
      const isMatch =
        fieldMatchesAnyMulti(fm.author, keys) ||
        fieldMatchesAnyMulti(fm.voice, keys) ||
        fieldMatchesAnyMulti(fm.voices, keys) ||
        (typeof fm.voice === 'string' && normalizeKey(fm.voice) === normalizeKey(personFrontmatter.id));
      if (!isMatch) continue;
      results.push(mk(item, type));
    }
  };

  consider(getPapers(lang), 'paper');
  consider(getArticles(lang), 'article');
  consider(getBlogPosts(lang), 'blog');
  consider(getBooks(lang), 'book');
  consider(getConcepts(lang), 'concept');
  consider(getTopics(lang), 'topic');

  // Sort by date desc then title.
  results.sort((a, b) => {
    const da = a.date || '';
    const db = b.date || '';
    if (da && db && da !== db) return db.localeCompare(da);
    return a.title.localeCompare(b.title);
  });

  return results;
}

export type ContentPerspective = 'kasra' | 'river' | 'both';
export type PerspectiveView = 'kasra' | 'river';

export function normalizeContentPerspective(p: unknown): ContentPerspective {
  if (p === 'kasra' || p === 'river' || p === 'both') return p;
  // Default: treat as Kasra unless explicitly marked otherwise.
  return 'kasra';
}

export function matchesPerspectiveView(p: unknown, view: PerspectiveView): boolean {
  const norm = normalizeContentPerspective(p);
  // River view is a "digest layer" over the whole corpus: it includes Kasra + River content by default.
  // Kasra view remains strict: only Kasra + Both.
  if (view === 'river') return true;
  return norm === 'both' || norm === view;
}

/** Get a glossary map of all content for tooltips */
export function getGlossary(
  lang: string = 'en',
  opts?: { basePath?: string; view?: PerspectiveView }
): Record<string, GlossaryItem> {
  const glossary: Record<string, GlossaryItem> = {};
  const basePath = opts?.basePath || `/${lang}`;
  const view = opts?.view;
  const shouldInclude = (p: unknown) => (view ? matchesPerspectiveView(p, view) : true);
  
  // Process Papers
  const papers = getPapers(lang);
  for (const p of papers) {
    const fm = p.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.abstract || 'No abstract available.',
      type: 'paper',
      url: `${basePath}/papers/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  // Process Concepts
  const concepts = getConcepts(lang);
  for (const c of concepts) {
    const fm = c.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    // Use first paragraph as excerpt
    const firstPara = c.body
      .split('\n\n')
      .find(p => p && !p.startsWith('#') && !p.startsWith('---'))
      ?.replace(/\[\[|\]\]/g, '') // strip wikilink brackets
      .slice(0, 150) + (c.body.length > 150 ? '...' : '') || 'No description.';

    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: firstPara,
      type: 'concept',
      url: fm.id === 'mu-levels' ? `${basePath}/mu-levels` : `${basePath}/concepts/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  // Process Books
  const books = getBooks(lang);
  for (const b of books) {
    const fm = b.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.abstract || 'No description available.',
      type: 'book',
      url: `${basePath}/books/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  // Process Articles
  const articles = getArticles(lang);
  for (const a of articles) {
    const fm = a.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.abstract || 'No description available.',
      type: 'article',
      url: `${basePath}/articles/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  // Process Blog
  const posts = getBlogPosts(lang);
  for (const p of posts) {
    const fm = p.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.abstract || 'No description available.',
      type: 'blog',
      url: `${basePath}/blog/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  // Process Topics
  const topics = getTopics(lang);
  for (const t of topics) {
    const fm = t.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.abstract || fm.short_answer || 'No description available.',
      type: 'topic',
      url: `${basePath}/topics/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  // Process People
  const people = getPeople(lang);
  for (const p of people) {
    const fm = p.frontmatter;
    if (!shouldInclude(fm.perspective)) continue;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.tagline || fm.abstract || 'Profile.',
      type: 'person',
      url: `${basePath}/people/${fm.id}`,
      perspective: normalizeContentPerspective(fm.perspective),
    };
  }

  return glossary;
}

// ─── Tag Processing ────────────────────────────────────────────────────────

/** Get all unique tags across all content */
export function getAllTags(lang: string = 'en'): string[] {
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  const books = getBooks(lang);
  const articles = getArticles(lang);
  const posts = getBlogPosts(lang);
  const topics = getTopics(lang);
  const people = getPeople(lang);
  const tags = new Set<string>();

  [...papers, ...concepts, ...books, ...articles, ...posts, ...topics, ...people].forEach(item => {
    (item.frontmatter.tags || []).forEach(t => tags.add(t));
  });

  return Array.from(tags).sort();
}

/** Get all content items that have a specific tag */
export function getContentsByTag(lang: string, tag: string): ParsedContent[] {
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  const books = getBooks(lang);
  const articles = getArticles(lang);
  const posts = getBlogPosts(lang);
  const topics = getTopics(lang);
  const people = getPeople(lang);
  
  // Normalize tag for comparison (case-insensitive? or exact?)
  // Let's do exact match for now, maybe case-insensitive later
  return [...papers, ...concepts, ...books, ...articles, ...posts, ...topics, ...people]
    .filter(item => Array.isArray(item.frontmatter.tags) && item.frontmatter.tags.includes(tag))
    .sort((a, b) => {
      // Sort by date desc, then title
      const dateA = a.frontmatter.date || '';
      const dateB = b.frontmatter.date || '';
      if (dateA && dateB) return dateB.localeCompare(dateA);
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
}

// ─── Graph Generation ──────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  title: string;
  type: 'paper' | 'concept' | 'article' | 'blog' | 'book' | 'topic' | 'person';
  val: number; // radius based on connections
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/** Generate graph data for visualization */
export function getGraphData(lang: string = 'en', view: PerspectiveView = 'kasra'): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();
  const idLowerToCanonical: Record<string, string> = {};

  const sources: Array<{ type: GraphNode['type']; items: ParsedContent[] }> = [
    { type: 'paper', items: getPapers(lang) },
    { type: 'concept', items: getConcepts(lang) },
    { type: 'topic', items: getTopics(lang) },
    { type: 'article', items: getArticles(lang) },
    { type: 'blog', items: getBlogPosts(lang) },
    { type: 'book', items: getBooks(lang) },
    { type: 'person', items: getPeople(lang) },
  ];

  // 1. Create Nodes
  for (const src of sources) {
    for (const c of src.items) {
      const id = c.frontmatter.id;
      if (!id) continue;
      if (!matchesPerspectiveView(c.frontmatter.perspective, view)) continue;
      if (nodeIds.has(id)) continue;
      nodes.push({
        id,
        title: c.frontmatter.title,
        type: src.type,
        val: 1 // base size
      });
      nodeIds.add(id);
      idLowerToCanonical[String(id).toLowerCase()] = id;
    }
  }

  // 2. Create Links
  const allContent: ParsedContent[] = sources.flatMap((s) => s.items);
  for (const c of allContent) {
    const sourceId = c.frontmatter.id;
    if (!sourceId) continue;
    if (!nodeIds.has(sourceId)) continue;
    const extracted = extractWikilinks(c.body);
    
    // Dedup links per file
    const targetIds = new Set(extracted.map(l => l.id.split('#')[0]));

    for (const targetId of targetIds) {
      const norm = canonicalizeFrcLikeIdForGraph(targetId);
      const canonicalTarget = idLowerToCanonical[String(norm).toLowerCase()] || idLowerToCanonical[String(targetId).toLowerCase()];

      // Only link if target exists in our content (internal links)
      if (canonicalTarget && nodeIds.has(canonicalTarget) && sourceId !== canonicalTarget) {
        links.push({ source: sourceId, target: canonicalTarget });
        
        // Increase size of target node (centrality)
        const targetNode = nodes.find(n => n.id === canonicalTarget);
        if (targetNode) targetNode.val += 0.5;
        
        // Increase size of source node
        const sourceNode = nodes.find(n => n.id === sourceId);
        if (sourceNode) sourceNode.val += 0.2;
      }
    }
  }

  return { nodes, links };
}

function canonicalizeFrcLikeIdForGraph(raw: string): string {
  const s = String(raw || '').trim();
  if (!s) return s;
  if (s.match(/^FRC-\d/i)) return s;

  // Accept forms like:
  // - "FRC 100.001"
  // - "FRC-100.001"
  // - "FRC 100.001 - Title"
  // - "FRC 893.PHY"
  const m = s.match(/^(FRC)\s*[- ]?\s*(\d{2,4})\.(\d+(?:\.\d+)*|[A-Za-z]+)(?:\b|[^A-Za-z0-9].*)$/i);
  if (!m) return s;

  const series = m[2];
  const suffix = m[3];
  const normSuffix = suffix.replace(/\./g, '-').toUpperCase();
  return `FRC-${series}-${normSuffix}`;
}

// ─── Wikilink Processing ───────────────────────────────────────────────────

export interface WikiLink {
  raw: string;       // [[FRC-566-001|link text]]
  id: string;        // FRC-566-001
  display: string;   // link text (or id if no pipe)
  section?: string;  // #section if present
}

/** Extract wikilinks from markdown body */
export function extractWikilinks(body: string): WikiLink[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links: WikiLink[] = [];
  let match;

  while ((match = regex.exec(body)) !== null) {
    const inner = match[1];
    let id = inner;
    let display = inner;
    let section: string | undefined;

    // Handle [[ID|display]]
    if (inner.includes('|')) {
      const [idPart, displayPart] = inner.split('|');
      id = idPart;
      display = displayPart;
    }

    // Handle [[ID#section]]
    if (id.includes('#')) {
      const [idPart, sectionPart] = id.split('#');
      id = idPart;
      section = sectionPart;
    }

    links.push({ raw: match[0], id, display, section });
  }

  return links;
}

// ─── SEO Helpers ────────────────────────────────────────────────────────────

const SITE_URL = 'https://fractalresonance.com';

export type ContentType = 'papers' | 'articles' | 'concepts' | 'books' | 'blog' | 'topics' | 'people';

/** Check if content exists in a specific language */
export function contentExistsInLang(type: ContentType, lang: string, id: string): boolean {
  const getters = {
    papers: getPaper,
    articles: getArticle,
    concepts: getConcept,
    books: getBook,
    blog: getBlogPost,
    topics: getTopic,
    people: getPerson,
  } as const;
  return getters[type](lang, id) !== null;
}

export function estimateReadTime(body: string, wordsPerMinute: number = 220): string {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ') // ignore code blocks
    .replace(/[#*_`>\[\]\(\)\|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} min`;
}

/** Get all languages where a content item exists */
export function getContentLanguages(type: ContentType, id: string): string[] {
  return getLanguages().filter(lang => contentExistsInLang(type, lang, id));
}

/** Generate hreflang alternates for a content item */
export function getAlternateLanguages(type: ContentType, id: string): Record<string, string> {
  const languages = getContentLanguages(type, id);
  const alternates: Record<string, string> = {};

  for (const lang of languages) {
    alternates[lang] = `${SITE_URL}/${lang}/${type}/${id}`;
  }

  // Add x-default pointing to English (or first available)
  if (alternates['en']) {
    alternates['x-default'] = alternates['en'];
  } else if (languages.length > 0) {
    alternates['x-default'] = alternates[languages[0]];
  }

  return alternates;
}

/** Generate hreflang alternates for static pages */
export function getStaticPageAlternates(page: string): Record<string, string> {
  const languages = getLanguages();
  const alternates: Record<string, string> = {};

  for (const lang of languages) {
    alternates[lang] = `${SITE_URL}/${lang}/${page}`;
  }

  alternates['x-default'] = `${SITE_URL}/en/${page}`;
  return alternates;
}

// ─── Content Statistics ─────────────────────────────────────────────────────

export interface ContentStats {
  papers: number;
  series: string[];
  seriesCount: number;
  articles: number;
  books: number;
  concepts: number;
  topics: number;
  blog: number;
  people: number;
}

/** Get content statistics for a language */
export function getContentStats(lang: string = 'en'): ContentStats {
  const papers = getPapers(lang);
  const seriesSet = new Set<string>();

  for (const p of papers) {
    const id = p.frontmatter.id || '';
    // Extract series from ID like FRC-100-001 -> "100", FRC-16D-001 -> "16D"
    const match = id.match(/^FRC-([A-Z0-9]+)-/i);
    if (match) {
      seriesSet.add(match[1]);
    }
  }

  return {
    papers: papers.length,
    series: Array.from(seriesSet).sort(),
    seriesCount: seriesSet.size,
    articles: getArticles(lang).length,
    books: getBooks(lang).length,
    concepts: getConcepts(lang).length,
    topics: getTopics(lang).length,
    blog: getBlogPosts(lang).length,
    people: getPeople(lang).length,
  };
}

// ─── Backlinks ──────────────────────────────────────────────────────────────

/** Build backlinks index: { targetId: [sourceIds] } */
export function buildBacklinks(lang: string = 'en', view: PerspectiveView = 'kasra'): Record<string, string[]> {
  const backlinks: Record<string, string[]> = {};
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  const books = getBooks(lang);
  const articles = getArticles(lang);
  const topics = getTopics(lang);
  const people = getPeople(lang);
  const allContent = [...papers, ...concepts, ...books, ...articles, ...topics, ...people].filter((c) =>
    matchesPerspectiveView(c.frontmatter.perspective, view)
  );

  for (const content of allContent) {
    const sourceId = content.frontmatter.id;
    if (!sourceId) continue;
    const links = extractWikilinks(content.body);

    for (const link of links) {
      if (!backlinks[link.id]) {
        backlinks[link.id] = [];
      }
      if (!backlinks[link.id].includes(sourceId)) {
        backlinks[link.id].push(sourceId);
      }
    }
  }

  return backlinks;
}
