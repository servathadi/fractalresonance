# Sentinel's Journal

## 2025-02-18 - RegExp Injection in Search Function
**Vulnerability:** The search function constructed a `RegExp` directly from user input without escaping: `new RegExp(term, 'g')`. This allowed users to inject regex control characters, causing `SyntaxError` crashes (DoS) and potentially ReDoS.
**Learning:** Developers often use regex for simple case-insensitive matching or counting, overlooking that user input can be invalid regex.
**Prevention:** Use `string.split(term).length - 1` for counting occurrences of a substring. It is safer, faster, and avoids regex parsing entirely. Alternatively, escape all user input passed to `new RegExp`.
