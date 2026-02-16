## 2025-05-20 - Dynamic Accessibility for Icon-Only Buttons
**Learning:** Icon-only buttons with state changes (e.g., Copy -> Copied) must dynamically update `aria-label` to communicate status to screen readers, as `title` is insufficient.
**Action:** Use conditional `aria-label` strings (e.g., `aria-label={copied ? "Copied" : "Copy"}`) in interactive components.
