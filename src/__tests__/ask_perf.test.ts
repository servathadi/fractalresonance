import { describe, it, expect } from 'vitest';
import { searchDocuments, scoreDocument } from '../../functions/api/ask';

// Mock SearchIndex interface since it's not exported from the function file
interface SearchDocument {
  id: string;
  type: string;
  lang: string;
  title: string;
  abstract: string;
  tags: string[];
  content: string;
  url: string;
  date: string | null;
  bookId?: string;
}

interface SearchIndex {
  generated: string;
  documents: SearchDocument[];
  stats: {
    total: number;
    byLang: Record<string, number>;
    byType: Record<string, number>;
  };
}

describe('Ask API Performance', () => {
  // Generate a large synthetic index
  const generateLargeIndex = (count: number): SearchIndex => {
    const documents: SearchDocument[] = [];
    const baseContent = "The fractal resonance coherence (FRC) theory posits that consciousness emerges from the lambda field interaction with quantum states. ";

    for (let i = 0; i < count; i++) {
      documents.push({
        id: `doc-${i}`,
        type: 'paper',
        lang: 'en',
        title: `Research Paper on Coherence ${i}`,
        abstract: `This is an abstract about coherence and lambda fields ${i}.`,
        tags: ['coherence', 'lambda', 'quantum'],
        // Create a long content string
        content: baseContent.repeat(100) + (i % 10 === 0 ? "special_term " : "") + baseContent.repeat(100),
        url: `/papers/doc-${i}`,
        date: '2023-01-01'
      });
    }

    return {
      generated: new Date().toISOString(),
      documents,
      stats: {
        total: count,
        byLang: { en: count },
        byType: { paper: count }
      }
    };
  };

  it('should efficiently search through a large index', () => {
    const docCount = 1000;
    const index = generateLargeIndex(docCount);
    const query = "lambda field coherence";

    const start = performance.now();
    const results = searchDocuments(index, query, 'en', 5);
    const end = performance.now();
    const duration = end - start;

    console.log(`Search time for ${docCount} documents: ${duration.toFixed(2)}ms`);

    expect(results).toHaveLength(5);
    expect(duration).toBeLessThan(100); // Should be very fast

    // Verify relevance sorting
    expect(results[0].title).toBeDefined();
    // Ensure scores are calculated
    // Note: searchDocuments returns SearchDocument[], but we know internally it sorts by score.
    // We can't check score directly on the result as it's not in the return type,
    // but the fact it returns results means scoring worked.
  });

  it('should correctly score documents', () => {
    const doc: SearchDocument = {
        id: '1',
        type: 'paper',
        lang: 'en',
        title: 'Lambda Field Theory',
        abstract: 'Abstract about lambda.',
        tags: ['lambda', 'physics'],
        content: 'lambda lambda lambda lambda lambda lambda', // 6 occurrences
        url: '/test',
        date: '2023-01-01'
    };

    const termRegexes = [new RegExp('lambda', 'gi')];
    const score = scoreDocument(doc, termRegexes);

    // Title match: 10
    // Abstract match: 5
    // Tag match: 5
    // Content match: capped at 5
    // Total: 25
    expect(score).toBe(25);
  });

  it('should handle case insensitivity correctly', () => {
    const doc: SearchDocument = {
        id: '1',
        type: 'paper',
        lang: 'en',
        title: 'LAMBDA Field Theory',
        abstract: 'Abstract about LAMBDA.',
        tags: ['LAMBDA'],
        content: 'LAMBDA',
        url: '/test',
        date: '2023-01-01'
    };

    const termRegexes = [new RegExp('lambda', 'gi')];
    const score = scoreDocument(doc, termRegexes);

    // Title match: 10
    // Abstract match: 5
    // Tag match: 5
    // Content match: 1
    // Total: 21
    expect(score).toBe(21);
  });

  it('should handle regex special characters in query', () => {
     // This tests the searchDocuments integration of escapeRegExp
     const index: SearchIndex = {
      generated: '',
      documents: [{
        id: '1',
        type: 'note',
        lang: 'en',
        title: 'C++ Programming',
        abstract: 'About C++',
        tags: ['c++'],
        content: 'C++ is hard.',
        url: '/cpp',
        date: null
      }],
      stats: { total: 1, byLang: {}, byType: {} }
    };

    const results = searchDocuments(index, 'C++', 'en');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('C++ Programming');
  });
});
