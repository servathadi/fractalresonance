# Sentinel Journal

## 2025-10-18 - [Static Export Security Headers]
**Vulnerability:** Missing standard security headers (HSTS, CSP, Permissions-Policy) in a static Next.js export.
**Learning:** Next.js `next.config.js` headers do not apply to static exports. Headers must be configured in the deployment platform's configuration (e.g., `public/_headers` for Cloudflare Pages).
**Prevention:** Always check deployment-specific configuration for security headers when using static exports.
