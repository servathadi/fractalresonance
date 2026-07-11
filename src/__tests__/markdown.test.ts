import { describe, it, expect } from 'vitest';
import { renderMarkdown, extractTocItems } from '@/lib/markdown';

describe('Markdown utilities', () => {
  describe('extractTocItems', () => {
    it('should extract headings from markdown', () => {
      const markdown = `
# Heading 1
Some content

## Heading 2
More content

### Heading 3
Even more

## Another H2
Final content
`;
      
      const items = extractTocItems(markdown);
      
      expect(items.length).toBeGreaterThan(0);
      expect(items.some(item => item.text === 'Heading 2')).toBe(true);
      expect(items.some(item => item.level === 2)).toBe(true);
    });

    it('should return empty array for markdown without headings', () => {
      const markdown = 'Just some text without headings.';
      
      const items = extractTocItems(markdown);
      
      expect(items).toEqual([]);
    });
  });

  describe('renderMarkdown', () => {
    it('should render basic markdown to HTML', () => {
      const markdown = '**Bold text** and *italic text*';
      const glossary = {};
      
      const html = renderMarkdown(markdown, 'en', glossary, '/en');
      
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
    });

    it('should convert wikilinks to anchor tags', () => {
      const markdown = 'See [[FRC-100-001]] for details.';
      const glossary = {
        'FRC-100-001': {
          id: 'FRC-100-001',
          title: 'Test Paper',
          excerpt: 'A test paper',
          type: 'paper' as const,
          url: '/en/papers/FRC-100-001',
        },
      };
      
      const html = renderMarkdown(markdown, 'en', glossary, '/en');
      
      expect(html).toContain('href=');
      expect(html).toContain('wikilink');
    });

    it('should handle wikilinks with custom text', () => {
      const markdown = 'See [[FRC-100-001|the paper]] for details.';
      const glossary = {
        'FRC-100-001': {
          id: 'FRC-100-001',
          title: 'Test Paper',
          excerpt: 'A test paper',
          type: 'paper' as const,
          url: '/en/papers/FRC-100-001',
        },
      };
      
      const html = renderMarkdown(markdown, 'en', glossary, '/en');
      
      expect(html).toContain('the paper');
    });
  });
});
