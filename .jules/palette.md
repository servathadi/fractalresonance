## 2024-05-23 - Accessibility: Navigation Bypass
**Learning:** The application lacked a mechanism to bypass repeated navigation blocks (Skip to Content), which is critical for keyboard and screen reader users, especially given the sticky header.
**Action:** Implemented a localized `SkipLink` component that targets `#main-content`. Ensure all future layouts include a valid `main` region with `id="main-content"` and `tabIndex={-1}` for programmatic focus.
