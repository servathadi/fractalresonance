## 2026-02-23 - Client-side Localization for Interactions
**Learning:** Client-side interactive components (like `SearchTrigger`) that exist outside of page layouts must independently detect the current language using `usePathname` and `getLangFromPathname` to provide localized accessibility labels (ARIA) and tooltips, ensuring a consistent experience for non-English users.
**Action:** When building global interactive components, always import language utilities to localize `aria-label` and `title` attributes dynamically.
