## 2026-04-05 - ReDoS in Ask API Search Scoring
**Vulnerability:** User-provided search terms were passed unescaped directly into a `new RegExp(term, 'g')` constructor in `functions/api/ask.ts`.
**Learning:** Passing unescaped strings to `RegExp` can lead to Regular Expression Denial of Service (ReDoS) or cause unhandled `SyntaxError` crashes when users input special regex characters.
**Prevention:** Use pure string-based search methods like `indexOf` in a loop when counting substring occurrences of user input, instead of dynamically allocating regular expressions.
