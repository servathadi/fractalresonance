## 2026-02-07 - Client-Side Sanitization Patterns
**Learning:** Using `useState` + `useEffect` for HTML sanitization in client components causes an initial flash of empty content (FOUC) and a double render (empty -> content).
**Action:** Use `useMemo` for synchronous derived state like sanitization, even in client components, to ensure content is available for the first paint and avoid layout shifts.

## 2026-02-07 - Missing Dependencies Impact on Tools
**Learning:** A missing required module (like `src/lib/formulas.ts`) can break compilation for dependent components (`MarkdownContent.tsx`), masking other errors and preventing verification of optimizations.
**Action:** Ensure all imported modules exist (even as stubs) before optimizing a component. `tsc` is critical for verifying structural integrity when tests are missing.
