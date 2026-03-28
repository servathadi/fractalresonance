## 2026-03-28 - Fix XSS Vulnerability in JSON-LD Script Tag
**Vulnerability:** XSS via `JSON.stringify` inside `<script>` tags using `dangerouslySetInnerHTML`. The code incorrectly assumed `JSON.stringify` escaped HTML special characters (`<`, `>`).
**Learning:** `JSON.stringify` does NOT escape HTML characters. Attackers can inject `</script>` tags into JSON fields (like titles) to break out of the script context and execute arbitrary JS.
**Prevention:** Always escape `<` (`\u003c`), `>` (`\u003e`), and `&` (`\u0026`) after `JSON.stringify` when injecting into script tags, even if the data originates from internal schemas.
