## 2025-02-18 - Reverse Tabnabbing via sanitize-html

**Vulnerability:** External links with `target="_blank"` rendered via `sanitize-html` did not include `rel="noopener noreferrer"`.
**Learning:** `sanitize-html` does not automatically add `rel` attributes to `target="_blank"` links by default. It requires explicit `transformTags` configuration.
**Prevention:** Configure `sanitize-html` with `transformTags` to enforce `rel="noopener noreferrer"` on all `a` tags with `target="_blank"`.
