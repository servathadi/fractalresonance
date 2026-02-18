import { describe, it, expect } from 'vitest';

// The function to be tested (copied from functions/api/ask.ts to verify logic)
function countOccurrences(text: string, term: string): number {
  if (!term) return 0;
  let count = 0;
  let pos = text.indexOf(term);
  while (pos !== -1) {
    count++;
    pos = text.indexOf(term, pos + term.length);
  }
  return count;
}

describe('countOccurrences', () => {
  it('counts simple occurrences correctly', () => {
    expect(countOccurrences('hello world hello', 'hello')).toBe(2);
    expect(countOccurrences('hello world', 'world')).toBe(1);
    expect(countOccurrences('hello world', 'foo')).toBe(0);
  });

  it('handles overlapping occurrences correctly (non-overlapping count)', () => {
    // "aaa" contains "aa" at 0 and 1 if overlapping allowed.
    // Standard regex /aa/g matches "aa" at 0, then "a" remains. count is 1.
    // Our implementation uses pos + term.length, so it should match regex /g behavior.
    expect(countOccurrences('aaa', 'aa')).toBe(1);
    expect(countOccurrences('aaaa', 'aa')).toBe(2);
  });

  it('handles special regex characters literally', () => {
    // This is the key fix: "c++" should be treated as literal "c++", not regex.
    expect(countOccurrences('c++ is great', 'c++')).toBe(1);
    expect(countOccurrences('c++ c++ c++', 'c++')).toBe(3);
    expect(countOccurrences('a.b a.b', 'a.b')).toBe(2);
    // With regex, "axb" would match "a.b". Here it should NOT.
    expect(countOccurrences('axb', 'a.b')).toBe(0);
  });

  it('handles empty text or term', () => {
    expect(countOccurrences('', 'term')).toBe(0);
    expect(countOccurrences('text', '')).toBe(0);
  });

  it('is case sensitive (caller handles lowercasing)', () => {
    expect(countOccurrences('Hello', 'hello')).toBe(0);
    expect(countOccurrences('hello', 'hello')).toBe(1);
  });
});
