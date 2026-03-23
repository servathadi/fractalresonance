## 2024-05-28 - [CRITICAL] Fix ReDoS in Search API
**Vulnerability:** User input was passed unescaped directly into a `RegExp` constructor in `functions/api/ask.ts` during search scoring, allowing potential Regular Expression Denial of Service (ReDoS) attacks.
**Learning:** When performing simple string searches (especially with frequency counting), unescaped user input in `RegExp` creates a significant vulnerability.
**Prevention:** Use pure string operations like `indexOf` in a loop, or properly escape user input before passing it to `RegExp`.
