## 2024-05-23 - Double Render in MarkdownContent
**Learning:** Using `useState` + `useEffect` for derived state (like HTML sanitization) causes double renders and flashes of empty content/layout shifts. It also prevents the server from rendering the content, hurting LCP.
**Action:** Use `useMemo` for derived state when possible, even for heavy operations (unless they block the main thread significantly), to ensure content is available on the first render pass and for SSR.

## 2024-05-23 - Broken Build Environment
**Learning:** The build was broken due to missing `src/lib/formulas.ts` and unexcluded `vitest.config.ts`.
**Action:** Always verify `npm run build` succeeds before starting work to establish a known good state. Restored missing file as stub and fixed tsconfig.
