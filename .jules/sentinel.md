## 2024-02-14 - Unsafe External Links in Markdown
**Vulnerability:** `sanitize-html` configuration allowed `target="_blank"` without enforcing `rel="noopener noreferrer"`, exposing users to reverse tabnabbing attacks.
**Learning:** Standard sanitization libraries often require explicit configuration to handle `target="_blank"` safely; `allowedAttributes` is not enough.
**Prevention:** Use `transformTags` in `sanitize-html` options to automatically append `rel="noopener noreferrer"` to any `a` tag with `target="_blank"`.
