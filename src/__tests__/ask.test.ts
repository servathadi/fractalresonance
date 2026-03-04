import { describe, it, expect } from 'vitest';
import { scoreDocument, searchDocuments } from '../../functions/api/ask';

describe('Search API Function', () => {
  const doc = {
    id: 'test',
    type: 'paper',
    lang: 'en',
    title: 'Test document title',
    abstract: 'An abstract with test words',
    tags: ['test', 'document'],
    content: 'This is the test content with test occurrences. test test test test test.',
    url: '/test',
    date: '2025-01-01'
  };

  it('scores correctly with capped content occurrences', () => {
    // Should hit title, abstract, tags, and cap content matches at 5
    const score = scoreDocument(doc, ['test']);
    expect(score).toBeGreaterThan(0);
    // 10 (title) + 5 (abstract) + 5 (tags) + 5 (content max) = 25
    expect(score).toBe(25);
  });

  it('searches documents correctly', () => {
    const index = {
      generated: 'now',
      documents: [doc, { ...doc, id: 'test2', title: 'other', tags: [], abstract: 'none', content: 'test test' }],
      stats: { total: 2, byLang: { en: 2 }, byType: { paper: 2 } }
    };

    const results = searchDocuments(index, 'test document', 'en', 5);
    expect(results.length).toBe(2);
    expect(results[0].id).toBe('test');
  });
});
