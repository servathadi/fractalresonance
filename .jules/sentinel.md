## 2025-02-28 - Unescaped JSON.stringify in Script Tags
**Vulnerability:** XSS vulnerability via unescaped HTML characters (<, >, &) in JSON.stringify output injected into a <script> tag using dangerouslySetInnerHTML.
**Learning:** The assumption that JSON.stringify escapes forward slashes and HTML characters by default is false. This can lead to script injection if the JSON contains strings like `</script><script>...`.
**Prevention:** Always manually escape HTML control characters with their unicode equivalents (e.g., `\u003c`) when injecting JSON into HTML script tags.
