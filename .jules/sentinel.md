## 2024-03-01 - JSON.stringify XSS Vulnerability in Script Tags
**Vulnerability:** XSS via `JSON.stringify` injected into `<script>` tags using `dangerouslySetInnerHTML`. The code wrongly assumed `JSON.stringify` produced completely safe output.
**Learning:** `JSON.stringify` does not escape HTML control characters like `<` and `>`. If a malicious string contains `</script><script>alert(1)</script>`, it breaks out of the context.
**Prevention:** Always escape `<` to `\u003c`, `>` to `\u003e`, and `&` to `\u0026` after `JSON.stringify` when injecting directly into a script tag context.
