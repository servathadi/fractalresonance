## 2025-05-15 - Vitest Config Build Failure
**Learning:** The project build fails because `vitest.config.ts` is included in the compilation context but `vitest` is not installed. It must be excluded in `tsconfig.json`.
**Action:** Ensure `vitest.config.ts` is in the `exclude` list of `tsconfig.json` before running build.
