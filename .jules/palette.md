## 2026-02-17 - Localized Keyboard Triggers
**Learning:** Purely visual keyboard hints (like `<kbd>K</kbd>`) are insufficient for screen readers and touch users. Adding a localized `aria-label` and `title` attribute with the full shortcut (e.g., "Search (Cmd+K)") bridges the gap between power users and casual visitors.
**Action:** When implementing global shortcuts, ensure the trigger button explicitly communicates the shortcut via `title` for mouse users and `aria-label` (localized) for assistive tech.
