## 2026-03-31 - JSON.stringify XSS Risk in Script Tags
**Vulnerability:** Unescaped HTML control characters in JSON string injected via dangerouslySetInnerHTML.
**Learning:** JSON.stringify does not escape characters like `<`, `>`, and `&` which allows attackers to terminate script tags and execute malicious scripts.
**Prevention:** Always manually escape `<`, `>`, and `&` (e.g. using `replace`) when passing stringified JSON into dangerouslySetInnerHTML for script tags.
