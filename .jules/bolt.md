## 2025-02-19 - [MarkdownContent SSG/SEO Blocking]
**Learning:** The `MarkdownContent` component was using `useEffect` to sanitize HTML to avoid hydration mismatches. This caused the static build (SSG) to render empty content for all articles, as `useEffect` doesn't run during build. This severely impacted SEO and LCP.
**Action:** When using `sanitize-html` or similar libraries in a Client Component that is statically generated, use `useMemo` instead of `useEffect`. Add `suppressHydrationWarning` if needed. This ensures content exists in the server-rendered HTML.
