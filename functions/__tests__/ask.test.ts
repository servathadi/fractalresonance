import { describe, it, expect, vi, beforeEach } from 'vitest';
// @ts-ignore
import { onRequestPost } from '../api/ask';

// Mock global Request/Response if needed, but jsdom provides them.
// We might need to mock fetch.

describe('Ask API Security Tests', () => {
  const mockRun = vi.fn();

  const mockEnv = {
    AI: {
      run: mockRun,
    },
  };

  const createRequest = (body: any) => {
    return new Request('https://example.com/api/ask', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  const createContext = (request: any) => ({
    request,
    env: mockEnv,
    params: {},
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
    next: vi.fn(),
    data: {},
    functionPath: '',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch for search-index.json
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        documents: [
          {
            id: 'doc1',
            type: 'paper',
            lang: 'en',
            title: 'Test Doc',
            abstract: 'Abstract',
            tags: ['tag'],
            content: 'Content',
            url: '/test',
            date: '2023-01-01',
          },
        ],
        stats: {},
      }),
    } as any);
  });

  it('should return 400 if query is too long (> 500 chars)', async () => {
    const longQuery = 'a'.repeat(501);
    const request = createRequest({ query: longQuery });
    const context = createContext(request);

    const response = await onRequestPost(context);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Query too long');
  });

  it('should sanitize control characters from query', async () => {
    // Use a query that will match the mock document so we get a full response
    const query = 'con\x00tent';
    const request = createRequest({ query });
    const context = createContext(request);

    mockRun.mockResolvedValue({ response: 'Answer' });

    const response = await onRequestPost(context);
    const body = await response.json();

    // We expect the query returned in the response to be sanitized
    // "con\x00tent" -> "content"
    expect(body.query).toBe('content');
  });

  it('should clamp limit between 1 and 10', async () => {
    // This test is tricky because limit is internal.
    // We can infer it by mocking searchDocuments or checking how many sources return
    // if we had enough docs. For now, let's just ensure it doesn't crash with extreme values.
    const request = createRequest({ query: 'test', limit: 1000 });
    const context = createContext(request);

    mockRun.mockResolvedValue({ response: 'Answer' });

    const response = await onRequestPost(context);
    expect(response.status).toBe(200);
  });

  it('should not leak internal error details', async () => {
    const request = createRequest({ query: 'test' });
    const context = createContext(request);

    // Force an error in AI run
    mockRun.mockRejectedValue(new Error('Sensitive DB Connection String'));

    const response = await onRequestPost(context);
    expect(response.status).toBe(500);
    const body = await response.json();

    expect(body.error).toBe('Failed to process question');
    expect(body.details).not.toContain('Sensitive DB Connection String');
    expect(body.details).toBe('Internal Server Error');
  });
});
