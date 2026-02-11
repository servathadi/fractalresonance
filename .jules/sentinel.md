## 2025-02-12 - Secure Error Handling in Cloudflare Functions
**Vulnerability:** Cloudflare Pages Functions can leak internal error details (stack traces, paths) to the client if exceptions are not caught and sanitized.
**Learning:** Default error handling in `catch` blocks often exposes `error.message`. While useful for debugging, it can be a security risk.
**Prevention:** Always catch errors at the top-level handler, log the full error server-side, and return a generic, sanitized error message to the client.
