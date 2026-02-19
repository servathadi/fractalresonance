/**
 * Cloudflare Pages Function: /api/ask
 * AI-powered search endpoint using Workers AI
 */

import {
  type SearchDocument,
  type SearchIndex,
  type AskRequest,
  searchDocuments,
  formatContext
} from './search-logic';

interface Env {
  AI: {
    run(model: string, options: { messages: Array<{ role: string; content: string }>; max_tokens?: number }): Promise<{ response: string }>;
  };
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

  // @ts-ignore - Create a new context with the POST request
  return onRequestPost({ ...context, request: postRequest });
};
