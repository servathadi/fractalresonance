## 2025-04-17 - Prevent XSS in Script Tag Injection
**Vulnerability:** Unescaped JSON output injected via `dangerouslySetInnerHTML` into `<script>` tags, making it vulnerable to XSS if `</script>` exists in the payload.
**Learning:** `JSON.stringify` does not escape HTML control characters (`<`, `>`, `&`). The previous code erroneously assumed it was safe.
**Prevention:** Always manually escape `<`, `>`, and `&` using literal double backslashes (e.g., `\\u003c`) when using `JSON.stringify` inside `<script>` tags via `dangerouslySetInnerHTML`.
