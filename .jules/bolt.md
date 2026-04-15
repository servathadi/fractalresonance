## 2025-01-20 - KnowledgeGraph Search Optimization
**Learning:** In large React component arrays like `KnowledgeGraph.tsx`, filtering and searching arrays using `toLowerCase()` causes redundant string allocations and high CPU cycles during user typing events.
**Action:** Pre-index the data inside the `useMemo` block into a `Map` for O(1) exact lookups and an array of objects with pre-lowercased strings for faster O(N) partial text matching.
