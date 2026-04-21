## $(date +%Y-%m-%d) - Pre-index data for KnowledgeGraph exact and partial matches
**Learning:** The KnowledgeGraph component was running `.toLowerCase()` repeatedly inside map/filter operations across thousands of nodes for both exact focus lookups (O(N)) and search suggestions, wasting CPU cycles on every keystroke.
**Action:** Pre-index large datasets using a Map for O(1) exact lookups and pre-calculate lowercase strings in a dedicated array structure (`searchable`) inside a `useMemo` to dramatically improve search filtering performance and node focus lookups.
