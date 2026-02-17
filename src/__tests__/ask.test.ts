
import { describe, it, expect } from 'vitest';
// @ts-ignore
import { scoreDocument, SearchDocument } from '../../functions/api/ask';

const mockDoc: SearchDocument = {
  id: 'test-doc',
  type: 'concept',
  lang: 'en',
  title: 'Test Document Title',
  abstract: 'This is a test abstract with some keywords.',
  tags: ['testing', 'performance'],
  content: 'This is the main content of the document. It mentions term and another term.',
  url: '/test',
  date: '2023-01-01'
};

describe('scoreDocument', () => {
  it('should score correctly for simple terms', () => {
    const terms = ['term'];
    // title: 0, abstract: 0, tags: 0
    // content: "term" appears twice.
    // content match adds min(2, 5) = 2.
    // Total score = 2.
    const score = scoreDocument(mockDoc, terms);
    expect(score).toBe(2);
  });

  it('should score correctly for title match', () => {
      const terms = ['title'];
      // title: 1 match -> +10
      // abstract: 0
      // tags: 0
      // content: 0
      // Total = 10
      const score = scoreDocument(mockDoc, terms);
      expect(score).toBe(10);
  });

  it('should NOT crash on special regex characters', () => {
    const terms = ['c++'];
    // This should NOT throw SyntaxError anymore
    expect(() => scoreDocument(mockDoc, terms)).not.toThrow();

    const docWithCpp = { ...mockDoc, content: 'This text contains c++ twice. c++', title: 'No match', abstract: 'No match', tags: [] };
    const score = scoreDocument(docWithCpp, terms);
    // content matches: 2 -> 2 points
    expect(score).toBe(2);
  });
});
