## 2025-02-19 - Client-side Sanitization Bottleneck
**Learning:** `MarkdownContent` component was performing HTML sanitization in a `useEffect` hook. This caused:
1. Double rendering (initial empty -> sanitized content).
2. Layout shifts and delayed LCP.
3. Unnecessary client-side processing of static content.
4. Inclusion of `sanitize-html` (~20KB) in the client bundle.
**Action:** Move sanitization to the data fetching/processing layer (`renderMarkdown` in `src/lib/markdown.ts`) which runs at build time for static sites. Pass pre-sanitized HTML to components to render directly.
