/**
 * Cloudflare Pages Function: /api/ask
 * AI-powered search endpoint using Workers AI
 */

interface Env {
  AI: {
    run(model: string, options: { messages: Array<{ role: string; content: string }>; max_tokens?: number }): Promise<{ response: string }>;
  };
}

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

interface AskRequest {
  query: string;
  lang?: string;
  limit?: number;
}

// Simple relevance scoring based on term frequency
function scoreDocument(doc: SearchDocument, terms: string[]): number {
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
    const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length;
    score += Math.min(contentMatches, 5); // Cap at 5 to avoid bias toward long docs
  }

  return score;
}

// Search the index for relevant documents
function searchDocuments(
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
function formatContext(docs: SearchDocument[]): string {
  if (docs.length === 0) return '';

  return docs.map((doc, i) => {
    return `[${i + 1}] ${doc.title} (${doc.type})
URL: https://fractalresonance.com${doc.url}
${doc.abstract ? `Summary: ${doc.abstract}\n` : ''}Content: ${doc.content.slice(0, 1500)}...`;
  }).join('\n\n---\n\n');
}

// Fetch and cache the search index
let cachedIndex: SearchIndex | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSearchIndex(request: Request): Promise<SearchIndex> {
  const now = Date.now();
  if (cachedIndex && (now - cacheTime) < CACHE_TTL) {
    return cachedIndex;
  }

  // Fetch from the same origin
  const url = new URL(request.url);
  const indexUrl = `${url.origin}/search-index.json`;

  const response = await fetch(indexUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch search index: ${response.status}`);
  }

  cachedIndex = await response.json();
  cacheTime = now;
  return cachedIndex!;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: AskRequest = await request.json();
    const { query, lang, limit = 5 } = body;

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get search index
    const index = await getSearchIndex(request);

    // Search for relevant documents
    const relevantDocs = searchDocuments(index, query, lang, limit);

    if (relevantDocs.length === 0) {
      return new Response(JSON.stringify({
        answer: "I couldn't find any relevant content for your question. Try rephrasing or ask about FRC concepts like coherence, lambda field, reciprocity, or witness magnitude.",
        sources: [],
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format context for AI
    const contextText = formatContext(relevantDocs);

    // Create the prompt
    const systemPrompt = `You are a helpful assistant for the Fractal Resonance Coherence (FRC) research platform. Answer questions using ONLY the provided context. Be concise and cite sources using [1], [2], etc.

Key FRC concepts:
- Coherence (C): Measure of phase alignment, C = (1/N) Σ cos(φᵢ - φⱼ)
- Lambda field (Λ): Λ(x) = Λ₀ ln C(x), where Λ₀ ≈ 10⁻³⁵ J
- Witness magnitude (W): W = |⟨ψ|Ô|ψ⟩| / ||Ô||
- Universal Coherence Continuity (UCC): ∂_t ln C = −∇·J_C + S_C
- Reciprocity Law: dS + k* d ln C = 0

If the context doesn't contain the answer, say so honestly.`;

    const userPrompt = `Context:
${contextText}

Question: ${query}

Provide a helpful answer based on the context above. Cite sources using [1], [2], etc.`;

    // Call Workers AI
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1024,
    });

    // Format sources
    const sources = relevantDocs.map((doc, i) => ({
      index: i + 1,
      title: doc.title,
      type: doc.type,
      url: `https://fractalresonance.com${doc.url}`,
    }));

    return new Response(JSON.stringify({
      answer: aiResponse.response,
      sources,
      query,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Ask API error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process question',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Also handle GET for simple queries
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const lang = url.searchParams.get('lang') || undefined;

  if (!query) {
    return new Response(JSON.stringify({
      error: 'Query parameter "q" is required',
      usage: '/api/ask?q=your+question&lang=en',
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Reuse POST handler logic
  const postRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, lang }),
  });

  return onRequestPost({ ...context, request: postRequest });
};
