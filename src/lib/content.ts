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

export interface GlossaryItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'paper' | 'concept';
  url: string;
}

/** Get a glossary map of all content for tooltips */
export function getGlossary(lang: string = 'en'): Record<string, GlossaryItem> {
  const glossary: Record<string, GlossaryItem> = {};
  
  // Process Papers
  const papers = getPapers(lang);
  for (const p of papers) {
    const fm = p.frontmatter;
    glossary[fm.id] = {
      id: fm.id,
      title: fm.title,
      excerpt: fm.abstract || 'No abstract available.',
      type: 'paper',
      url: `/${lang}/papers/${fm.id}`
    };
  }

  // Process Concepts
  const concepts = getConcepts(lang);
  for (const c of concepts) {
    const fm = c.frontmatter;
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
      url: `/${lang}/concepts/${fm.id}`
    };
  }

  return glossary;
}

// ─── Tag Processing ────────────────────────────────────────────────────────

/** Get all unique tags across all content */
export function getAllTags(lang: string = 'en'): string[] {
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  const tags = new Set<string>();

  [...papers, ...concepts].forEach(item => {
    (item.frontmatter.tags || []).forEach(t => tags.add(t));
  });

  return Array.from(tags).sort();
}

/** Get all content items that have a specific tag */
export function getContentsByTag(lang: string, tag: string): ParsedContent[] {
  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  
  // Normalize tag for comparison (case-insensitive? or exact?)
  // Let's do exact match for now, maybe case-insensitive later
  return [...papers, ...concepts]
    .filter(item => (item.frontmatter.tags || []).includes(tag))
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
  type: 'paper' | 'concept';
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
export function getGraphData(lang: string = 'en'): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();

  const papers = getPapers(lang);
  const concepts = getConcepts(lang);
  const allContent = [...papers, ...concepts];

  // 1. Create Nodes
  for (const c of allContent) {
    const id = c.frontmatter.id;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        title: c.frontmatter.title,
        type: c.frontmatter.id.startsWith('FRC') ? 'paper' : 'concept',
        val: 1 // base size
      });
      nodeIds.add(id);
    }
  }

  // 2. Create Links
  for (const c of allContent) {
    const sourceId = c.frontmatter.id;
    const extracted = extractWikilinks(c.body);
    
    // Dedup links per file
    const targetIds = new Set(extracted.map(l => l.id.split('#')[0]));

    for (const targetId of targetIds) {
      // Only link if target exists in our content (internal links)
      if (nodeIds.has(targetId) && sourceId !== targetId) {
        links.push({ source: sourceId, target: targetId });
        
        // Increase size of target node (centrality)
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode) targetNode.val += 0.5;
        
        // Increase size of source node
        const sourceNode = nodes.find(n => n.id === sourceId);
        if (sourceNode) sourceNode.val += 0.2;
      }
    }
  }

  return { nodes, links };
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

export type ContentType = 'papers' | 'articles' | 'concepts';

/** Check if content exists in a specific language */
export function contentExistsInLang(type: ContentType, lang: string, id: string): boolean {
  const getter = type === 'papers' ? getPaper : type === 'articles' ? getArticle : getConcept;
  return getter(lang, id) !== null;
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

// ─── Backlinks ──────────────────────────────────────────────────────────────

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
