## 2024-05-14 - Prevent Error Message Leakage in API Responses
**Vulnerability:** The API endpoint `functions/api/ask.ts` was returning internal error messages (`error.message`) in its 500 responses to the client. This could potentially expose internal application logic or configuration details to an attacker.
**Learning:** In Cloudflare Pages Functions, or any public-facing API, we must avoid leaking internal error details to the client.
**Prevention:** Only return generic error messages to the client. Log the detailed error message server-side for debugging purposes.
