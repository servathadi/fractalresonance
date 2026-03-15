## YYYY-MM-DD - Unescaped JSON in Script Tags
**Vulnerability:** Potential XSS vulnerability due to injecting raw `JSON.stringify` output into a `<script>` tag via `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` does not escape HTML control characters (`<`, `>`), allowing malicious data to break out of the script tag or execute as HTML if the data contains such characters.
**Prevention:** Manually escape `<` and `>` using unicode escape sequences (`\u003c` and `\u003e`) before injecting JSON into script tags.
