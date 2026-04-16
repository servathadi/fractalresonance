## 2025-05-18 - Prevent XSS in Script Tag Injection
**Vulnerability:** XSS vulnerability when injecting `JSON.stringify` data into script tags via `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` does not automatically sanitize HTML control characters (`<`, `>`, `&`). If user input reaches this serialization, it could be interpreted as executable HTML/JavaScript.
**Prevention:** Manually escape `<`, `>`, and `&` to their unicode equivalents (using literal double backslashes, e.g., `\\u003c`) when serializing JSON for injection into `<script>` tags.
