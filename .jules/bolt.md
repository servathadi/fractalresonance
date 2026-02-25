## 2025-02-19 - Client-Side Sanitization Bottleneck
**Learning:** `sanitize-html` was being imported and run client-side in `MarkdownContent.tsx`, causing a significant bundle size increase and a hydration delay (FOUC). This pattern defeated the purpose of SSG for markdown content.
**Action:** Always perform heavy text processing (sanitization, markdown parsing) at build-time or server-side. Pass pre-computed, safe HTML to client components.

## 2025-02-19 - Unconfigured Linter Blocking CI
**Learning:** `npm run lint` in this project executes `next lint`, which triggers an interactive setup wizard if ESLint is unconfigured. This blocks automated verification steps that blindly run `npm run lint`.
**Action:** Check for `.eslintrc` or similar config before running lint commands in CI/automation, or accept that linting might be skipped if unconfigured.
