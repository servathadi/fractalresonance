import { describe, it, expect } from 'vitest';
import {
  getPaperCanonStatus,
  isPaperCatalogEntry,
  parseFrontmatter,
  sortPapersForLibrary,
  type ParsedContent,
} from '@/lib/content';

describe('Content utilities', () => {
  it('parses frontmatter when closing delimiter has an inline comment', () => {
    const raw = `---
title: μ-Levels
id: mu-levels
lang: en
---# μ-Levels

Body text
`;

    const parsed = parseFrontmatter(raw);
    expect(parsed.frontmatter.id).toBe('mu-levels');
    expect(parsed.frontmatter.title).toBe('μ-Levels');
    expect(parsed.body).toContain('Body text');
  });

  it('parses paper library metadata from frontmatter', () => {
    const parsed = parseFrontmatter(`---
title: Current paper
id: FRC-100-099
conceptDoi: 10.5281/zenodo.123
doi: 10.5281/zenodo.456
canonStatus: frontier
cover: /media/custom/cover.png
---
Body`);

    expect(parsed.frontmatter).toMatchObject({
      conceptDoi: '10.5281/zenodo.123',
      doi: '10.5281/zenodo.456',
      canonStatus: 'frontier',
      cover: '/media/custom/cover.png',
    });
  });

  it('parses unindented YAML tag sequences used by legacy corpus files', () => {
    const parsed = parseFrontmatter(`---
id: FRC-100-099
tags:
- coherence
- FRC
abstract: Tagged paper
---
Body`);

    expect(parsed.frontmatter.tags).toEqual(['coherence', 'FRC']);
  });

  it.each([
    ['FRC-787-787', 'frontier'],
    ['FRC-826-829', 'frontier'],
    ['FRC-840-101', 'frontier'],
    ['FRC-841-004', 'frontier'],
    ['FRC-16D-001', 'archive'],
    ['FRC-821-100', 'archive'],
    ['FRC-100-007', 'living-core'],
    ['FRC-566-030', 'living-core'],
  ] as const)('classifies %s as %s', (id, expected) => {
    expect(getPaperCanonStatus({ id })).toBe(expected);
  });

  it('lets canonStatus frontmatter override inferred hierarchy', () => {
    expect(getPaperCanonStatus({ id: 'FRC-100-001', canonStatus: 'archive' })).toBe('archive');
  });

  it('keeps the duplicate orientation page out of the normal catalog', () => {
    expect(isPaperCatalogEntry({ id: 'FRC-000-START-HERE' })).toBe(false);
    expect(isPaperCatalogEntry({ id: 'FRC-100-000' })).toBe(true);
  });

  it('orders living core before frontier and archive, with current core first', () => {
    const paper = (id: string, date: string): ParsedContent => ({
      frontmatter: { id, title: id, date },
      body: '',
      raw: '',
    });
    const sorted = sortPapersForLibrary([
      paper('FRC-821-100', '2026-01-26'),
      paper('FRC-100-001', '2025-03-23'),
      paper('FRC-840-101', '2026-05-27'),
      paper('FRC-100-002', '2026-07-09'),
    ]);

    expect(sorted.map((item) => item.frontmatter.id)).toEqual([
      'FRC-100-002',
      'FRC-100-001',
      'FRC-840-101',
      'FRC-821-100',
    ]);
  });

});
