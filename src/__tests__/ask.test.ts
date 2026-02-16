import { describe, it, expect } from 'vitest';
import { scoreDocument, SearchDocument } from '../../functions/api/ask';

describe('scoreDocument', () => {
  const mockDoc: SearchDocument = {
    id: 'test-doc',
    type: 'article',
    lang: 'en',
    title: 'Test Document',
    abstract: 'This is a test abstract.',
    tags: ['test', 'document'],
    content: 'This is the content with some terms.',
    url: '/test-url',
    date: '2023-01-01',
  };

  it('should calculate score correctly for simple terms', () => {
    const score = scoreDocument(mockDoc, ['test']);
    expect(score).toBeGreaterThan(0);
  });

  it('should not crash with regex special characters', () => {
    // This should fail (crash) with the current implementation if 'new RegExp' is used insecurely
    const score = scoreDocument(mockDoc, ['[']);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
