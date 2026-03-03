## 2024-05-23 - JSON-LD Script Injection via JSON.stringify
**Vulnerability:** XSS vulnerability in `<script>` tags rendering JSON. `JSON.stringify` does not escape HTML control characters like `<` or `>`. When its output is placed in a `<script>` tag via `dangerouslySetInnerHTML`, a malicious string containing `</script>` can break out of the script tag and execute arbitrary JS.
**Learning:** Never assume `JSON.stringify` output is safe for raw HTML injection in a script block. HTML context requires its own escaping rules independent of valid JSON syntax.
**Prevention:** Always manually replace `<` with `\u003c` and `>` with `\u003e` (and optionally `&` and `\u2028`, `\u2029`) when interpolating JSON directly into script tags.
