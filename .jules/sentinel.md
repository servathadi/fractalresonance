## 2024-04-10 - JSON.stringify XSS in SchemaScript
**Vulnerability:** JSON-LD script tags via dangerouslySetInnerHTML using unescaped JSON.stringify data.
**Learning:** JSON.stringify does not escape HTML control characters like <, >, or &. The code comment incorrectly assumed it was safe from HTML injection.
**Prevention:** Always manually escape < to \u003c, > to \u003e, and & to \u0026 after JSON.stringify when placing its output into script tags.
