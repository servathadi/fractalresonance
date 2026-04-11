## 2026-04-11 - Pre-indexing for React Component Search Efficiency
**Learning:** In React components processing large arrays, repeated user interactions can trigger redundant O(N) string conversions (`.toLowerCase()`) and traversals when searching or filtering.
**Action:** Pre-index data within `useMemo` into a `Map` for O(1) exact lookups and an array of objects with pre-lowercased strings for case-insensitive partial matches, reducing CPU cycles spent on redundant conversions.
