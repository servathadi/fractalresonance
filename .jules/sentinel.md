## 2025-03-01 - JSON.stringify XSS in SchemaScript
**Vulnerability:** `src/components/SchemaScript.tsx` directly injected `JSON.stringify` output into `<script dangerouslySetInnerHTML={{ __html: ... }}>` without escaping HTML control characters.
**Learning:** `JSON.stringify` does not sanitize HTML characters like `<` and `>`. If schema data contains an embedded `</script>` tag, it can break out of the script block and execute arbitrary code (XSS). The previous comment falsely claimed it was safe.
**Prevention:** Always manually escape `<` to `\u003c`, `>` to `\u003e`, and `&` to `\u0026` after calling `JSON.stringify` when injecting into `<script>` tags.
