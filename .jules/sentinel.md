## 2025-02-18 - Fix ReDoS and XSS Vulnerabilities
**Vulnerability:** Unescaped user input passed directly into `new RegExp` in `functions/api/ask.ts` and missing HTML control character escaping when injecting `JSON.stringify` data into script tags via `dangerouslySetInnerHTML` in `src/components/SchemaScript.tsx`.
**Learning:** `JSON.stringify` does not automatically sanitize `<` and `>` characters, leading to XSS when injected directly into script tags. Also, unescaped user input can lead to ReDoS and syntax errors when passed into `RegExp`.
**Prevention:** Use string-based search methods like `indexOf` for user input, and manually escape `<` and `>` when injecting JSON into HTML script tags.
