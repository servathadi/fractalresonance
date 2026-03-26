## 2026-03-26 - Prevent XSS in JSON-LD Script Tags
**Vulnerability:** XSS vulnerability in `SchemaScript.tsx` where `JSON.stringify` data was injected into `<script>` tags using `dangerouslySetInnerHTML` without escaping HTML control characters.
**Learning:** `JSON.stringify` does not automatically escape `<` or `>` characters. If user-controlled data containing `</script><script>alert(1)</script>` is passed, it breaks out of the JSON-LD script block and executes arbitrary JavaScript.
**Prevention:** Always manually escape HTML control characters like `<` (as `\u003c`) and `>` (as `\u003e`) when injecting stringified JSON into HTML using `dangerouslySetInnerHTML`.
