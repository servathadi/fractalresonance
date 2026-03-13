## 2024-05-25 - ReDoS Vulnerability in Search API
**Vulnerability:** User-provided search terms were passed unescaped directly into a `RegExp` constructor in `functions/api/ask.ts`, leading to a potential Regular Expression Denial of Service (ReDoS) if crafted input was supplied.
**Learning:** Passing unsanitized user input into regex constructors creates significant performance/stability risks.
**Prevention:** Use string-based search functions like `indexOf` in a loop when counting occurrences, rather than dynamically generating regular expressions.
