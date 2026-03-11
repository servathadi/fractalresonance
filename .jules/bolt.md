## 2025-02-26 - Optimize scoreDocument in ask.ts
**Learning:** Instantiating `RegExp` objects inside tight loops for scoring documents creates a measurable performance bottleneck and risks ReDoS. Also, `pnpm build` passes even if `tsc --noEmit` fails locally on `PagesFunction`.
**Action:** Use `indexOf` with an early-exit loop instead of `RegExp` for simple string occurrences, and don't hack types or `tsconfig.json` just to satisfy `tsc` if `pnpm build` works.
