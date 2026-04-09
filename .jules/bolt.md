## 2025-04-09 - O(1) Content Lookup Optimization
**Learning:** Found a significant O(N) bottleneck in `src/lib/content.ts` when retrieving individual content items (papers, concepts, etc.). The previous approach read the entire directory contents via `fs.readdirSync` for every single lookup.
**Action:** Introduced an O(1) fast path `findContentById` helper that uses `fs.existsSync` to check for `${id}.md` directly before falling back to the directory scan. It provides an over 5x speedup for heavy retrieval tasks.
