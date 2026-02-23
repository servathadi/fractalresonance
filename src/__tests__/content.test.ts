import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from '@/lib/content';

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
});

