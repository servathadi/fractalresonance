## 2026-04-13 - Prevent ReDoS and unhandled SyntaxError in RegExp
**Vulnerability:** Passing unescaped user input directly into RegExp constructors allows Regular Expression Denial of Service (ReDoS) and crashes via unhandled SyntaxError.
**Learning:** In JavaScript, `new RegExp()` throws a SyntaxError if the string is invalid (e.g., `*`), crashing the process or request handler when given malformed user input.
**Prevention:** Avoid passing unescaped user input to RegExp; prefer pure string-based search methods like `indexOf` for simple substring matching, and ensure empty string checks to prevent infinite loops.
