## 2025-02-14 - Icon-Only Buttons
**Learning:** Icon-only buttons in popovers (like TextSharePopover) were missing `aria-label`, relying only on `title`. This is a common pattern in this codebase for "micro-ui" elements.
**Action:** Always check `aria-label` on SVG-based buttons.
