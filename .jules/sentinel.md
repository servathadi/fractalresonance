## 2024-05-24 - JSON-LD XSS Vulnerability
**Vulnerability:** XSS vulnerability through unescaped JSON in dangerouslySetInnerHTML.
**Learning:** JSON.stringify does not escape HTML control characters (<, >, &) by default, which can lead to XSS when injected directly into a script tag.
**Prevention:** Always manually escape HTML control characters in JSON strings before using them in dangerouslySetInnerHTML.
