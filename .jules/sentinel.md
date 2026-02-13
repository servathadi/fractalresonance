## 2026-02-13 - Regex Injection in Search
**Vulnerability:** The search scoring function used `new RegExp(userInput, 'g')` to count term occurrences. This allowed users to inject invalid regex characters (like `[`), causing a `SyntaxError` that crashed the Cloudflare Worker (DoS). It also exposed the application to potential ReDoS attacks.
**Learning:** `new RegExp()` with untrusted input is a critical stability and security risk. Even if not exploited for ReDoS, simple syntax errors can cause service interruption.
**Prevention:** Avoid `new RegExp(userInput)`. Use `String.prototype.split(term).length - 1` to count occurrences of a literal string, or strictly escape the input first.
