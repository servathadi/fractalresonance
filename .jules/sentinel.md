## 2024-03-17 - [XSS vulnerability in SchemaScript]
**Vulnerability:** XSS vulnerability in SchemaScript when injecting JSON.stringify into dangerouslySetInnerHTML without escaping HTML characters.
**Learning:** JSON.stringify does NOT automatically escape HTML characters like `<` and `>`. If this is used inside dangerouslySetInnerHTML or a script tag, attackers could break out of the script tag and execute arbitrary JS by providing `</script><script>alert(1)</script>`.
**Prevention:** Always manually escape HTML control characters after JSON.stringify when injecting into HTML.
