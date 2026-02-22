export interface SearchDocument {
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

// Safer alternative to regex-based counting to prevent ReDoS
// Using indexOf loop avoids catastrophic backtracking and syntax errors
export function countOccurrences(str: string, term: string): number {
  if (!term) return 0;
  let count = 0;
  let pos = 0;
  const len = term.length;
  while (true) {
    pos = str.indexOf(term, pos);
    if (pos >= 0) {
      count++;
      pos += len;
    } else {
      break;
    }
  }
  return count;
}

export function scoreDocument(doc: SearchDocument, terms: string[]): number {
  let score = 0;
  const titleLower = doc.title.toLowerCase();
  const contentLower = doc.content.toLowerCase();
  const abstractLower = doc.abstract.toLowerCase();
  const tagsLower = doc.tags.map(t => t.toLowerCase());

  for (const term of terms) {
    // Title match (highest weight)
    if (titleLower.includes(term)) score += 10;
    // Abstract match (high weight)
    if (abstractLower.includes(term)) score += 5;
    // Tag match (high weight)
    if (tagsLower.some(t => t.includes(term))) score += 5;
    // Content match (count occurrences)
    const contentMatches = countOccurrences(contentLower, term);
    score += Math.min(contentMatches, 5); // Cap at 5 to avoid bias toward long docs
  }

  return score;
}
