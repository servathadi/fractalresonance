## 2025-03-31 - O(1) Content Lookups
**Learning:** Functions retrieving content by ID in `src/lib/content.ts` performed inefficient O(N) directory scans by parsing frontmatter for every file. Because filenames usually match frontmatter IDs exactly, O(N) directory parsing is a major performance bottleneck, especially as the number of content files grows.
**Action:** Always prefer direct O(1) file lookups (using a `safeReadContent` helper) before falling back to O(N) directory scans. Remember to sanitize IDs to prevent path traversal vulnerabilities.
