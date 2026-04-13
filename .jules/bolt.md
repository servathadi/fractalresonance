## 2026-04-13 - Pre-indexing large datasets for React search/filter components
**Learning:** Performing multiple `.toLowerCase()` string conversions during array traversal inside high-frequency user events (like typing to trigger `useMemo` for suggestions or key presses) is a performance bottleneck for large component data sets.
**Action:** When filtering or searching large arrays in React components, pre-index the data inside `useMemo` into an array of objects with pre-lowercased strings for partial matches, and a `Map` for O(1) exact lookups.
