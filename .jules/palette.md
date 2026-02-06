## 2025-02-19 - Accessible Collapsible Sections
**Learning:** Collapsible sections (`<details>`) lack visual indicators by default. Using Tailwind's `group` on the details element and `group-open:rotate-90` on a chevron icon provides a robust, CSS-only state indicator without needing React state.
**Action:** When implementing accordions or collapsible content, always wrap in `group` and use `group-open:` modifiers for the indicator icon to ensure visual feedback matches the `open` state.
