## 2024-04-14 - Optimize React search arrays
**Learning:** Redundant string operations (`toLowerCase()`) in array methods inside `useMemo` or event handlers cause significant CPU overhead during typing/searching on large datasets in React.
**Action:** Pre-index data within `useMemo` into a `Map` for O(1) exact lookups and an array of pre-lowercased strings for case-insensitive partial matches to reduce re-calculation.
