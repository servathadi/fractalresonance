import { describe, it, expect } from 'vitest';
import sanitizeHtml from 'sanitize-html';
import { SANITIZE_OPTIONS } from './MarkdownContent';

describe('MarkdownContent Security', () => {
  it('should enforce rel="noopener noreferrer" on target="_blank" links', () => {
    const input = '<a href="http://example.com" target="_blank">External Link</a>';
    const output = sanitizeHtml(input, SANITIZE_OPTIONS);

    expect(output).toContain('target="_blank"');
    expect(output).toContain('rel="noopener noreferrer"');
  });

  it('should not add rel="noopener noreferrer" on internal links', () => {
    const input = '<a href="/internal">Internal Link</a>';
    const output = sanitizeHtml(input, SANITIZE_OPTIONS);

    expect(output).not.toContain('rel="noopener noreferrer"');
    expect(output).toContain('<a href="/internal">Internal Link</a>');
  });

  it('should preserve existing rel attributes while adding noopener noreferrer', () => {
    const input = '<a href="http://example.com" target="_blank" rel="nofollow">External Link</a>';
    const output = sanitizeHtml(input, SANITIZE_OPTIONS);

    // Ideally we want both
    expect(output).toContain('noopener');
    expect(output).toContain('noreferrer');
    expect(output).toContain('nofollow');
  });

  it('should handle case-insensitive target="_BLANK"', () => {
    const input = '<a href="http://example.com" target="_BLANK">External Link</a>';
    const output = sanitizeHtml(input, SANITIZE_OPTIONS);

    expect(output).toContain('rel="noopener noreferrer"');
  });
});
