import { describe, it, expect } from 'vitest';
import { scoreDocument, SearchDocument } from '../../functions/api/ask';

describe('scoreDocument', () => {
  const mockDoc: SearchDocument = {
    id: 'test-doc',
    type: 'paper',
    lang: 'en',
    title: 'Test Document Title',
    abstract: 'This is a test abstract.',
    tags: ['tag1', 'tag2'],
    content: 'This is the test content with multiple occurrences of the word test. test test.',
    url: '/test-url',
    date: '2023-01-01',
  };

  it('correctly counts occurrences', () => {
    // title match: "Test Document Title" (contains "test") -> +10
    // abstract match: "This is a test abstract." (contains "test") -> +5
    // tags match: no "test" in tags -> +0
    // content match: "test" appears 4 times in contentLower. +4 (capped at 5).
    // Total score: 10 + 5 + 0 + 4 = 19.
    const score = scoreDocument(mockDoc, ['test']);
    expect(score).toBe(19);
  });

  it('handles special characters in query without throwing', () => {
    // This should throw SyntaxError with current implementation due to new RegExp('c++', 'g')
    // We expect it NOT to throw after fix.
    // For now, let's just assert it doesn't throw, which will fail if it does.
    expect(() => {
        scoreDocument(mockDoc, ['c++']);
    }).not.toThrow();
  });
});
