# Bolt's Journal

## 2025-01-29 - React.cache for Static Content
**Learning:** In Next.js App Router (13+), `React.cache` works for deduping requests even in static exports (`next build`). This is crucial for optimizing data fetching logic that is called multiple times across components (e.g., Sidebar + Page).
**Action:** Wrap singular getters (`getPaper`) to use cached plural getters (`getPapers`) to avoid redundant file system reads.
