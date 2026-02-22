import { scoreDocument, countOccurrences, SearchDocument } from '../../functions/api/search-logic';
import { describe, it, expect } from 'vitest';

describe('Search Logic', () => {
  it('countOccurrences correctly counts substrings', () => {
    expect(countOccurrences('hello world hello', 'hello')).toBe(2);
    expect(countOccurrences('hello world', 'world')).toBe(1);
    expect(countOccurrences('hello world', 'foo')).toBe(0);
    // Non-overlapping check
    expect(countOccurrences('aaaaa', 'aa')).toBe(2);
  });

  it('countOccurrences handles special regex characters safely', () => {
    expect(countOccurrences('foo(bar)', '(')).toBe(1);
    expect(countOccurrences('foo[bar]', '[')).toBe(1);
    expect(countOccurrences('foo.bar', '.')).toBe(1);
    expect(countOccurrences('foo*bar', '*')).toBe(1);
    expect(countOccurrences('foo\\bar', '\\')).toBe(1);
  });

  it('scoreDocument calculates scores correctly', () => {
    const doc: SearchDocument = {
      id: '1',
      type: 'paper',
      lang: 'en',
      title: 'Fractal Resonance',
      abstract: 'A study on coherence.',
      tags: ['physics', 'resonance'],
      content: 'The coherence of the lambda field is important.',
      url: '/doc1',
      date: '2023-01-01'
    };

    // "resonance" in title (10), tag (5) -> 15
    expect(scoreDocument(doc, ['resonance'])).toBe(15);

    // "coherence" in abstract (5), content (1) -> 6
    expect(scoreDocument(doc, ['coherence'])).toBe(6);

    // "lambda" in content (1) -> 1
    expect(scoreDocument(doc, ['lambda'])).toBe(1);
  });

  it('scoreDocument is robust against ReDoS attempts', () => {
    const doc: SearchDocument = {
      id: '1',
      type: 'paper',
      lang: 'en',
      title: 'Test',
      abstract: 'Test',
      tags: [],
      content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      url: '/test',
      date: '2023-01-01'
    };

    // A regex like /(a+)+$/ would be slow here if used naively.
    // Our implementation uses indexOf so it should be instant.
    const start = performance.now();
    // This string would break regex or cause ReDoS if interpreted as regex
    scoreDocument(doc, ['(a+)+$']);
    const end = performance.now();
    expect(end - start).toBeLessThan(50); // Should be extremely fast
  });

  it('scoreDocument handles regex syntax errors gracefully', () => {
     const doc: SearchDocument = {
      id: '1',
      type: 'paper',
      lang: 'en',
      title: 'Test',
      abstract: 'Test',
      tags: [],
      content: 'some content with (parentheses)',
      url: '/test',
      date: '2023-01-01'
    };

    // An invalid regex
    expect(() => scoreDocument(doc, ['('])).not.toThrow();
    // Should match literal '('
    expect(scoreDocument(doc, ['('])).toBeGreaterThan(0);
  });
});
