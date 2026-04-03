## 2025-02-18 - Prevent ReDoS in Search Scoring
**Vulnerability:** Passing unescaped user input directly into a `RegExp` constructor in the Ask API search function caused a Regular Expression Denial of Service (ReDoS) vulnerability and the potential for unhandled `SyntaxError` exceptions that crash the process.
**Learning:** Always treat user-provided search terms as unsafe for regex compilation unless properly escaped.
**Prevention:** Use pure string search methods like `indexOf` in a loop when counting occurrences, especially since the match count was already artificially capped at 5.
