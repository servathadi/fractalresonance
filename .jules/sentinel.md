## 2025-05-23 - Content Security Policy for Static Next.js on Cloudflare
**Vulnerability:** Missing CSP headers in static export.
**Learning:** Next.js `next.config.js` headers do not apply to `output: 'export'`. Cloudflare Pages requires `public/_headers`.
**Prevention:** Use `public/_headers` to define CSP. Configuration must allow 'unsafe-inline' for Next.js hydration and 'unsafe-eval' if required by dependencies, plus whitelisting Google Analytics/Fonts if used.
