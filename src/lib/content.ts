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
  series?: string;
  author?: string;
  date?: string;
  status?: string;
  tags?: string[];
  abstract?: string;
  lang?: string;
  doi?: string;
  license?: string;
  related?: string[];
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
}

export interface ParsedContent {
  frontmatter: RawFrontmatter;
  body: string;
}

/** Parse YAML-like frontmatter from markdown string */
export function parseFrontmatter(content: string): ParsedContent {
  const fmRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(fmRegex);

  if (!match) {
    return { frontmatter: { title: '', id: '' }, body: content };
  }

  const [, fmRaw, body] = match;
  const frontmatter: Record<string, unknown> = {};

  let currentKey = '';
  let currentArray: unknown[] | null = null;
  let currentObject: Record<string, unknown> | null = null;

  for (const line of fmRaw.split('\n')) {
    // Array item (top-level)
    if (currentArray !== null && !currentObject && line.match(/^\s{2,}-\s/)) {
      const val = line.replace(/^\s*-\s*/, '').trim();
      currentArray.push(parseValue(val));
      continue;
    }

    // Object property (nested under array)
    if (currentObject && line.match(/^\s{4,}\w/)) {
      const objMatch = line.match(/^\s+(\w+):\s*(.*)$/);
      if (objMatch) {
        currentObject[objMatch[1]] = parseValue(objMatch[2]);
      }
      continue;
    }

    // Array item that starts an object
    if (currentArray !== null && line.match(/^\s{2,}-\s+\w+:/)) {
      if (currentObject) {
        currentArray.push(currentObject);
      }
      currentObject = {};
      const objMatch = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
      if (objMatch) {
        currentObject[objMatch[1]] = parseValue(objMatch[2]);
      }
      continue;
    }

    // Flush previous array/object
    if (currentArray !== null && !line.match(/^\s/)) {
      if (currentObject) {
        currentArray.push(currentObject);
        currentObject = null;
      }
      frontmatter[currentKey] = currentArray;
      currentArray = null;
    }

    // Top-level key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, rawVal] = kvMatch;
      currentKey = key;

      // Inline array: [a, b, c]
      if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        frontmatter[key] = rawVal
          .slice(1, -1)
          .split(',')
          .map(s => parseValue(s.trim()));
        continue;
      }

      // Start of block array/object
      if (rawVal === '') {
        currentArray = [];
        continue;
      }

      frontmatter[key] = parseValue(rawVal);
    }
  }

  // Flush trailing array
  if (currentArray !== null) {
    if (currentObject) {
      currentArray.push(currentObject);
    }
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter: frontmatter as unknown as RawFrontmatter, body: body.trim() };
}

function parseValue(val: string): string | number | boolean {
  if (val === 'true') return true;
  if (val === 'false') return false;
  const num = Number(val);
  if (!isNaN(num) && val !== '') return num;
  return val.replace(/^["']|["']$/g, '');
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
    .sort((a, b) => (a.frontmatter.date || '').localeCompare(b.frontmatter.date || ''));
}

/** Get a single paper by id */
export function getPaper(lang: string, id: string): ParsedContent | null {
  const dir = path.join(CONTENT_DIR, lang, 'papers');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (parsed.frontmatter.id === id) return parsed;
  }
  return null;
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

// ─── Schema Converters ─────────────────────────────────────────────────────

/** Convert parsed frontmatter to PaperMeta for schema generation */
export function toPaperMeta(parsed: ParsedContent): PaperMeta {
  const fm = parsed.frontmatter;
  return {
    id: fm.id,
    title: fm.title,
    series: fm.series || 'FRC',
    author: fm.author || 'H. Servat',
    date: fm.date || new Date().toISOString().split('T')[0],
    abstract: fm.abstract || '',
    tags: fm.tags || [],
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
    tags: fm.tags || [],
    related: fm.related || [],
    lang: fm.lang || 'en',
  };
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

/** Build backlinks index: { targetId: [sourceIds] } */
export function buildBacklinks(lang: string = 'en'): Record<string, string[]> {
  const backlinks: Record<string, string[]> = {};
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  const allContent = [...papers, ...concepts];

  for (const content of allContent) {
    const sourceId = content.frontmatter.id;
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
