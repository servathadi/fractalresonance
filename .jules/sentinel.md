## 2024-05-24 - JSON.stringify XSS in Script Tags
**Vulnerability:** XSS vulnerability via unescaped HTML control characters in JSON stringified data injected into script tags using `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` does not automatically escape HTML characters like `<` and `>`, allowing malicious payload execution if injected into a `<script>` tag.
**Prevention:** Always manually escape `<` and `>` (e.g., `.replace(/</g, '\u003c').replace(/>/g, '\u003e')`) when using `JSON.stringify` inside `<script>` tags.
