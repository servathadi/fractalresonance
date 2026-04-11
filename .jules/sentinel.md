## 2026-04-11 - Error Details Information Disclosure
**Vulnerability:** The API endpoint `/api/ask` (in `functions/api/ask.ts`) leaks the raw error message (`error.message`) to the client when a 500 error occurs.
**Learning:** This could expose internal implementation details or stack traces to external users.
**Prevention:** Catch errors and respond with generic error messages like "Failed to process question", logging the detailed error server-side instead.
