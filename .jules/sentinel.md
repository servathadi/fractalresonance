## 2024-05-24 - Fix XSS vulnerability in SchemaScript
**Vulnerability:** JSON.stringify does not escape HTML control characters like `<` and `>`. When injected into `<script>` tags via dangerouslySetInnerHTML, it could lead to XSS if the data contained `</script>`.
**Learning:** Developers incorrectly assumed JSON.stringify was safe for script tags.
**Prevention:** Always manually escape HTML control characters (e.g., using `.replace(/</g, '\\u003c').replace(/>/g, '\\u003e')`) when injecting JSON into HTML via script tags.
