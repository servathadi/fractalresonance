## 2025-05-15 - Missing Dependencies and Build Config
**Learning:** The repo contains `vitest.config.ts` but `vitest` is not installed, causing type errors during build unless excluded in `tsconfig.json`. Also, `src/lib/formulas.ts` was imported but missing.
**Action:** When setting up, check `package.json` against config files. Always verify build locally. created `src/lib/formulas.ts` stub to fix build.
