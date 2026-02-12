## 2025-02-18 - Missing Input Validation in AI Endpoint
**Vulnerability:** The AI search endpoint `functions/api/ask.ts` lacked input validation for query length and content, and did not properly sanitize error messages.
**Learning:** Cloudflare Pages Functions are not automatically protected by WAF or framework-level validation. Manual validation is critical for API endpoints, especially those interacting with LLMs or databases.
**Prevention:** Implement strict input validation (length, type, content) and sanitization (remove control chars) at the entry point of every Function. Ensure error responses are generic and do not leak internal details.
