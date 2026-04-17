## 2025-04-17 - Optimize KnowledgeGraph Search and Highlight
**Learning:** React components processing large arrays (like the knowledge graph nodes) can experience significant UI thread blocking during high-frequency events (like typing in a search bar) due to redundant case conversions and array traversals (`.toLowerCase()` inside a `.find()` or `.filter()`).
**Action:** Pre-index data within `useMemo` into a Map for O(1) exact lookups and an array of objects with pre-lowercased strings for case-insensitive partial matches to reduce CPU cycles during user interactions.
