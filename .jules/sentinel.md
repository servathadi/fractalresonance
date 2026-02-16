## 2025-05-23 - ReDoS and Crash Vulnerability in Search API
**Vulnerability:** The `scoreDocument` function in `functions/api/ask.ts` used `new RegExp(term, 'g')` to count occurrences of search terms in content. User input was not escaped, allowing an attacker to inject invalid regex characters (e.g., `[`), causing the Cloudflare Worker to crash (DoS).
**Learning:** Using `new RegExp()` with untrusted input is risky even if it's just for counting matches. It can lead to crashes (invalid syntax) or ReDoS (catastrophic backtracking).
**Prevention:** Avoid `new RegExp` for simple string matching or counting. Use `string.split(term).length - 1` for counting occurrences of a substring. Always validate and sanitize user input before using it in sensitive operations like regex creation.
