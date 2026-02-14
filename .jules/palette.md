## 2025-05-15 - Rotating Chevrons with Details/Summary
**Learning:** The `group` class on a `<details>` element combined with `group-open:` modifiers on children (like `group-open:rotate-90`) allows for declarative, CSS-only state styling without React `useState`. This is particularly effective for sidebar navigation and TOC toggles.
**Action:** Prefer `group-open:` for simple expand/collapse UI states to reduce client-side JavaScript complexity.
