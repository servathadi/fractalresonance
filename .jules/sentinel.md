## 2024-10-25 - XSS Vulnerability in JSON.stringify
**Vulnerability:** XSS vulnerability in `src/components/SchemaScript.tsx` due to injecting `JSON.stringify` output directly into a `<script>` tag via `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` alone is not safe for generating script tag content because it doesn't escape HTML control characters like `<` and `>`, allowing attackers to close the tag early.
**Prevention:** Always manually escape `<`, `>`, and `&` to Unicode sequences (`\u003c`, `\u003e`, `\u0026`) when injecting JSON into HTML script tags.
