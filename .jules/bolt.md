## 2025-05-18 - Missing Dependency Blocking Build
**Learning:** The build was broken due to missing `src/lib/formulas.ts`. Created a stub to satisfy the import in `MarkdownContent.tsx`.
**Action:** Always check for missing dependencies before optimizing. Stub them if necessary to unblock verification.

## 2025-05-18 - MarkdownContent Optimization
**Learning:** `MarkdownContent.tsx` used `useState`/`useEffect` for derived data, causing double render and empty initial content. This is a common anti-pattern in Next.js/React.
**Action:** Use `useMemo` for derived data like sanitized HTML to ensure SSR compatibility and avoid double renders.
