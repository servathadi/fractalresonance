## 2026-02-18 - Regex Injection in Search
**Vulnerability:** `new RegExp(term, 'g')` was used with user-controlled input, allowing attackers to crash the function with invalid regex (e.g., `((((((`) or potentially cause ReDoS.
**Learning:** Developers often reach for Regex for simple substring counting without considering the security implications of user input in the pattern constructor.
**Prevention:** Use manual string search loops (e.g., `indexOf` or `split`) for simple substring counting. Always sanitize or escape user input before passing to `new RegExp`.
