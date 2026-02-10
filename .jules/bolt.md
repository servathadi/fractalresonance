# Bolt's Journal

## 2026-02-10 - Server-Side Sanitization for Performance
**Learning:** Moving `sanitize-html` from a client-side component (`MarkdownContent`) to a server-side/build-time utility (`renderMarkdown`) significantly reduces the client bundle size (~20kb gzipped) and prevents double-renders (FOUC/CLS) caused by `useEffect` sanitization.
**Action:** Always prefer sanitizing HTML at the source (server/build) rather than on the client, especially for static content.
