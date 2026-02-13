import { describe, it, expect } from 'vitest';
import { scoreDocument, SearchDocument } from './ask';

const mockDoc: SearchDocument = {
  id: '1',
  type: 'paper',
  lang: 'en',
  title: 'Test Document',
  abstract: 'This is a test abstract.',
  tags: ['test'],
  content: 'Here is some content with a lot of aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  url: '/test',
  date: '2023-01-01',
};

describe('scoreDocument', () => {
  it('should handle invalid regex characters in query', () => {
    const terms = ['['];
    // This currently throws, so this test will fail until fixed.
    expect(() => scoreDocument(mockDoc, terms)).not.toThrow();
  });

  it('should not be vulnerable to ReDoS-like input', () => {
     const terms = ['(a+)+'];
     expect(() => scoreDocument(mockDoc, terms)).not.toThrow();
  });

  it('should match terms correctly', () => {
      const doc = { ...mockDoc, content: 'term term term' };
      const terms = ['term'];
      // Content matches contribute to score
      const score = scoreDocument(doc, terms);
      expect(score).toBeGreaterThan(0);
  });
});
