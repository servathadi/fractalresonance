## 2025-02-14 - Search Trigger Accessibility
**Learning:** Icon-only search buttons often rely on visual context (e.g. magnifying glass) but screen readers miss this if `aria-label` is generic ("Open search"). Including the keyboard shortcut in the label ("Search (Cmd+K)") aids discoverability for keyboard users who rely on screen readers.
**Action:** When adding keyboard shortcuts, always expose them in `aria-label`, `title`, and `aria-keyshortcuts`.
