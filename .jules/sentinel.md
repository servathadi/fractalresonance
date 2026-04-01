## 2026-04-01 - Fix XSS Vulnerability in SchemaScript
**Vulnerability:** JSON.stringify output was directly injected into a <script> tag via dangerouslySetInnerHTML without escaping HTML control characters (<, >, &).
**Learning:** React dangerouslySetInnerHTML with JSON.stringify does not automatically sanitize HTML control characters, leading to XSS if user input ever makes its way into the schema.
**Prevention:** Always manually escape HTML control characters (<, >, &) when serializing JSON for injection into script tags, e.g. using .replace(/</g, '\u003c').replace(/>/g, '\u003e').replace(/&/g, '\u0026');.
