## 2024-05-24 - JSON.stringify XSS Vulnerability in Script Tags
**Vulnerability:** JSON-LD script tags generated with dangerouslySetInnerHTML and JSON.stringify are vulnerable to XSS.
**Learning:** JSON.stringify does not escape HTML control characters like <, >, and &. If injected data contains `</script><script>alert(1)</script>`, it can execute arbitrary code.
**Prevention:** Always manually escape HTML control characters (`<`, `>`, `&`) using unicode escape sequences (`\\u003c`, `\\u003e`, `\\u0026`) when embedding JSON strings inside HTML script tags.
