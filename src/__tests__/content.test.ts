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

  it('parses frontmatter when both delimiters have comments and spaces', () => {
    const raw = `---  # start delimiter comment
title: test title
id: test-id
--- # end delimiter comment

Actual body content
Line 2
`;

    const parsed = parseFrontmatter(raw);
    expect(parsed.frontmatter.id).toBe('test-id');
    expect(parsed.frontmatter.title).toBe('test title');
    expect(parsed.body).toBe('Actual body content\nLine 2');
  });

  it('handles empty frontmatter safely', () => {
    const raw = `---
---
Empty FM Body
`;

    const parsed = parseFrontmatter(raw);
    expect(parsed.frontmatter).toBeDefined();
    expect(parsed.body).toBe('Empty FM Body');
  });

  it('handles content without frontmatter', () => {
    const raw = `Just some body text without frontmatter`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.frontmatter.id).toBe('');
    expect(parsed.body).toBe('Just some body text without frontmatter');
  });

  it('handles invalid frontmatter structure safely', () => {
    const raw = `---
only start delimiter, no end`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.frontmatter.id).toBe('');
    expect(parsed.body).toBe(raw);
  });
});

