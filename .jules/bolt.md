## 2025-02-13 - Missing React.cache in Content Fetching
**Learning:** `src/lib/content.ts` functions were performing synchronous file I/O on every call without memoization, despite being called multiple times per request (e.g., `getPaper`, `buildBacklinks`, `getGlossary`). The `React.cache` wrapper was missing.
**Action:** Wrapped all heavy data fetching functions in `src/lib/content.ts` with `React.cache` to deduplicate file reads and parsing within a request lifecycle. Always verify implementation details even if memory suggests optimization exists.
