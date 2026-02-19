
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

export interface SearchIndex {
  generated: string;
  documents: SearchDocument[];
  stats: {
    total: number;
    byLang: Record<string, number>;
    byType: Record<string, number>;
  };
}

export interface AskRequest {
  query: string;
  lang?: string;
  limit?: number;
}

// Simple relevance scoring based on term frequency
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
    // FIX: Use indexOf loop instead of RegExp to prevent ReDoS and crashes on invalid regex
    let contentMatches = 0;
    let pos = contentLower.indexOf(term);
    while (pos !== -1) {
        contentMatches++;
        if (contentMatches >= 5) break; // Optimization: Stop counting once cap is reached
        pos = contentLower.indexOf(term, pos + 1);
    }
    score += Math.min(contentMatches, 5); // Cap at 5 to avoid bias toward long docs
  }

  return score;
}

// Search the index for relevant documents
export function searchDocuments(
  index: SearchIndex,
  query: string,
  lang?: string,
  limit = 5
): SearchDocument[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  let docs = index.documents;

  // Filter by language if specified
  if (lang) {
    docs = docs.filter(d => d.lang === lang);
  }

  // Score and sort documents
  const scored = docs.map(doc => ({
    doc,
    score: scoreDocument(doc, terms)
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return top matches with non-zero scores
  return scored
    .filter(s => s.score > 0)
    .slice(0, limit)
    .map(s => s.doc);
}

// Format context for the AI
export function formatContext(docs: SearchDocument[]): string {
  if (docs.length === 0) return '';

  return docs.map((doc, i) => {
    return `[${i + 1}] ${doc.title} (${doc.type})
URL: https://fractalresonance.com${doc.url}
${doc.abstract ? `Summary: ${doc.abstract}\n` : ''}Content: ${doc.content.slice(0, 1500)}...`;
  }).join('\n\n---\n\n');
}
