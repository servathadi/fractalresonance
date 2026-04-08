## 2024-05-18 - Escape HTML control characters in JSON.stringify for script tags
**Vulnerability:** Potential XSS when injecting `JSON.stringify` output directly into `<script>` tags via `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` does not escape HTML control characters like `<` and `>`. If the data contains `</script>`, it can break out of the script tag.
**Prevention:** Always manually escape HTML control characters using `.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')` after stringifying data intended for script tags.
