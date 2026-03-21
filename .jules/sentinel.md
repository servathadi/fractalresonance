## 2025-03-21 - JSON-LD Script Tag XSS
**Vulnerability:** JSON-LD script tags via `dangerouslySetInnerHTML` were vulnerable to XSS due to unescaped HTML characters (`<` and `>`) in `JSON.stringify`.
**Learning:** `JSON.stringify` does not automatically escape HTML control characters, allowing attackers to break out of `<script>` tags if input contains `</script>`.
**Prevention:** Manually escape `<` as `\u003c` and `>` as `\u003e` (using `replace(/</g, '\\u003c').replace(/>/g, '\\u003e')`) before injection.