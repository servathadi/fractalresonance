## 2024-03-22 - Missing Reverse Tabnabbing Protection in Markdown Sanitizer
**Vulnerability:** The client-side markdown sanitizer (`MarkdownContent.tsx`) allows `target="_blank"` attributes on links but does not enforce `rel="noopener noreferrer"`. This exposes users to reverse tabnabbing attacks where a malicious external page can access `window.opener` and redirect the original page.
**Learning:** `sanitize-html` does not automatically add `rel="noopener"` for `target="_blank"` unless explicitly configured via `transformTags`. Relying on default "safe" lists of attributes is insufficient when attributes have interactive implications.
**Prevention:** Always pair `target="_blank"` with a transformation rule that enforces `rel="noopener noreferrer"`.
