## 2025-03-01 - [XSS via dangerouslySetInnerHTML in SchemaScript]
**Vulnerability:** XSS injection when using `JSON.stringify` within `dangerouslySetInnerHTML` for `<script>` tags without proper HTML character escaping.
**Learning:** `JSON.stringify` does not escape HTML characters (e.g. `<`, `>`). Injecting JSON derived from user data directly into the DOM can lead to executing arbitrary JavaScript if data includes HTML tags like `</script><script>alert()</script>`.
**Prevention:** Explicitly escape `<` and `>` with `.replace(/</g, '\\u003c').replace(/>/g, '\\u003e')` after stringification, or avoid injecting raw stringified JSON directly via `dangerouslySetInnerHTML` when alternative safe serialization exists.
