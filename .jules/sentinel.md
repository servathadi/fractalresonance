## 2026-02-02 - [Fix] Reverse Tabnabbing
**Vulnerability:** External links with `target="_blank"` were missing `rel="noopener noreferrer"`, allowing the target page to access `window.opener` and potentially hijack the original tab.
**Learning:** `sanitize-html` does not automatically enforce `rel="noopener noreferrer"` even when `allowedAttributes` permits `rel`. It must be explicitly handled via `transformTags`.
**Prevention:** Use `transformTags` in `sanitize-html` configuration to intercept `a` tags and force `rel="noopener noreferrer"` when `target="_blank"` is present.
