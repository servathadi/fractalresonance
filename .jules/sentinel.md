## 2026-04-09 - Unsanitized User Input in RegExp Constructor
**Vulnerability:** User input from search queries was passed directly into `new RegExp(term, 'g')` in `functions/api/ask.ts`.
**Learning:** This leads to a Denial of Service (DoS/ReDoS) vulnerability, as an invalid regex string like `***` causes a `SyntaxError` that crashes the function, and malicious regexes can cause CPU exhaustion.
**Prevention:** Avoid passing unescaped user input to `RegExp`. For simple substring counting or searching, prefer pure string methods like `indexOf()`.
