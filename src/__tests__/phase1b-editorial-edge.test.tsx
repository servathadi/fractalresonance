import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  EDGE_SCOPE_TAGS,
  getBlogPost,
  normalizeEdgeScopeTag,
  normalizePrimarySources,
  parseFrontmatter,
} from '@/lib/content';
import { EdgeScopeBadge } from '@/components/EdgeScopeBadge';
import { PrimarySourcesBlock } from '@/components/PrimarySourcesBlock';
import { VoiceTag } from '@/components/VoiceTag';
import { HomeHub } from '@/components/pages/HomeHub';
import { BooksIndex } from '@/components/pages/BooksIndex';
import FalsificationsPage from '@/app/[lang]/falsifications/page';

describe('Phase 1B editorial polish and Edge / Field Notes readiness', () => {
  it('parses and normalizes scopeTag and primarySources from YAML frontmatter', () => {
    const parsed = parseFrontmatter(`---
id: edge-2026-11-28
title: "Edge Dispatch: Non-equilibrium phase-locking in driven open cavities"
date: 2026-11-28
status: published
scopeTag: "test-idea"
primarySources:
  - title: "Driven-dissipative synchronization in photonic lattices"
    authors: "A. Researcher, B. Author"
    year: 2026
    venue: "Physical Review Letters"
    doi: "10.1103/PhysRevLett.136.010001"
    arxiv: "2601.01234"
    note: "Experimental benchmark candidate for cross-mechanism coherence transport."
  - "H. Servat, FRC 787.787: Operational Lambda-Flight Protocol (2026)"
lang: en
---

Dispatch body.`);

    expect(normalizeEdgeScopeTag(parsed.frontmatter.scopeTag)).toBe('Test Idea');
    expect(normalizeEdgeScopeTag('Structural Analogy')).toBe('Structural Analogy');
    expect(normalizeEdgeScopeTag('open-question')).toBe('Open Question');
    expect(normalizeEdgeScopeTag('counter evidence')).toBe('Counter-Evidence');
    expect(normalizeEdgeScopeTag('not-a-valid-tag')).toBeUndefined();

    const sources = normalizePrimarySources(parsed.frontmatter.primarySources);
    expect(sources).toHaveLength(2);
    expect(sources[0]).toMatchObject({
      title: 'Driven-dissipative synchronization in photonic lattices',
      authors: 'A. Researcher, B. Author',
      year: 2026,
      venue: 'Physical Review Letters',
      doi: '10.1103/PhysRevLett.136.010001',
      arxiv: '2601.01234',
    });
    expect(sources[1]).toEqual({
      title: 'H. Servat, FRC 787.787: Operational Lambda-Flight Protocol (2026)',
    });
  });

  it('renders EdgeScopeBadge across all 4 scope tags and PrimarySourcesBlock with safe links', () => {
    for (const tag of EDGE_SCOPE_TAGS) {
      const inlineHtml = renderToStaticMarkup(
        React.createElement(EdgeScopeBadge, { scopeTag: tag, lang: 'en', variant: 'inline' }),
      );
      expect(inlineHtml).toContain(`data-edge-scope="${tag}"`);
      expect(inlineHtml).toContain(tag);

      const bannerHtml = renderToStaticMarkup(
        React.createElement(EdgeScopeBadge, { scopeTag: tag, lang: 'en', variant: 'banner', basePath: '/en' }),
      );
      expect(bannerHtml).toContain(`data-edge-scope="${tag}"`);
      expect(bannerHtml).toContain('/en/papers');
      expect(bannerHtml).not.toMatch(/Kasra|River \(Oracle\)/i);
    }

    const sourcesHtml = renderToStaticMarkup(
      React.createElement(PrimarySourcesBlock, {
        lang: 'en',
        sources: [
          {
            title: 'Valid external paper',
            authors: 'Jane Doe',
            year: 2026,
            doi: '10.5281/zenodo.21385391',
            arxiv: '2601.01234',
          },
          {
            title: 'Unsafe protocol test',
            url: 'javascript:alert(1)',
          },
        ],
      }),
    );

    expect(sourcesHtml).toContain('data-primary-sources="true"');
    expect(sourcesHtml).toContain('https://doi.org/10.5281/zenodo.21385391');
    expect(sourcesHtml).toContain('https://arxiv.org/abs/2601.01234');
    expect(sourcesHtml).toContain('Unsafe protocol test');
    expect(sourcesHtml).not.toContain('javascript:');
  });

  it('keeps blog-welcome and VoiceTag free of internal persona leaks across all locales', () => {
    for (const lang of ['en', 'es', 'fr', 'fa']) {
      const post = getBlogPost(lang, 'blog-welcome');
      expect(post, `${lang}/blog/blog-welcome should exist`).not.toBeNull();
      expect(post!.raw).not.toMatch(/River \(Oracle\)|Kasra \(Architect\)|voice:\s*(kasra|river)/i);
      expect(normalizeEdgeScopeTag(post!.frontmatter.scopeTag)).toBe('Open Question');
    }

    expect(renderToStaticMarkup(React.createElement(VoiceTag, { voice: 'kasra' }))).toBe('');
    expect(renderToStaticMarkup(React.createElement(VoiceTag, { voice: 'river' }))).toBe('');
  });

  it('renders homepage with falsifiable core statement and 3-pillar research entry', async () => {
    const el = await HomeHub({ lang: 'en', view: 'kasra' });
    const html = renderToStaticMarkup(el);

    expect(html).toContain('dS + k');
    expect(html).toContain('d ln C = 0');
    expect(html).toContain('566.001');
    expect(html).toContain('830.000');
    expect(html).toContain('700.000');
    expect(html).toContain('787.787');
    expect(html).toContain('826.829');
    expect(html).toContain('The Open System');
    expect(html).toContain('The Mind in the Coupling');
    expect(html).toContain('/en/falsifications');
    expect(html).toContain('/en/books');
    expect(html).toContain('/en/papers');
  });

  it('renders BooksIndex separating Current 2026 books from Archived 2025 books', () => {
    const html = renderToStaticMarkup(
      React.createElement(BooksIndex, { lang: 'en', basePath: '/en', view: 'kasra', embedded: true }),
    );
    expect(html).toContain('Current 2026 books');
    expect(html).toContain('The Open System');
    expect(html).toContain('The Mind in the Coupling');
    expect(html).toContain('Archived 2025 books');
    expect(html).toContain('ecr-textbook');
    expect(html).toContain('the-resonance-code');
  });

  it('renders FalsificationsPage with all 5 dispositions and zero forbidden neon color classes', async () => {
    const el = await FalsificationsPage({ params: Promise.resolve({ lang: 'en' }) });
    const html = renderToStaticMarkup(el);

    for (const disp of ['CONTRADICTED', 'NO_GAIN', 'UNDERPOWERED', 'STRUCTURAL_OBSTRUCTION', 'DEMOTED']) {
      expect(html).toContain(`data-disposition="${disp}"`);
    }
    expect(html).not.toMatch(/\b(?:red|amber|sky|violet|purple|emerald|cyan)-\d{3}\b/);
  });
});
