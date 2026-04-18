## 2025-02-28 - Pre-indexing KnowledgeGraph components
**Learning:** Re-evaluating `.toLowerCase()` repeatedly inside an `onChange` and `onKeyDown` filter loop over large graphs causes excessive main-thread CPU overhead resulting in janky rendering.
**Action:** When filtering large arrays based on string comparison during frequent events like keypresses, replace on-the-fly string conversions with a pre-indexed `Map` and array of pre-lowercased objects in a `useMemo` block. This reduces string conversions from O(N*len) during search to O(N*len) once during map build and O(1) for lookup.
