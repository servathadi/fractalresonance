## 2024-03-09 - Collapsible Section Markers
**Learning:** Collapsible sections implemented with `<details>` and `<summary>` require the `list-none` class and `[&::-webkit-details-marker]:hidden` to remove the default browser triangle marker. They also require visual indicators (e.g., a chevron) and utilize Tailwind's `group` and `group-open` modifiers for state-based styling.
**Action:** When working with `<details>`/`<summary>`, verify that the default triangle is hidden and a custom visual indicator with state modifiers (`group`, `group-open`) is implemented.
