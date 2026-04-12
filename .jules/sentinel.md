## 2024-04-12 - Fix ReDoS/SyntaxError in search terms
**Vulnerability:** Constructing `RegExp` objects directly from user search queries without escaping special characters.
**Learning:** This leads to unhandled `SyntaxError` crashes when queries contain invalid regex syntax (e.g., `[`) and introduces potential ReDoS vulnerabilities.
**Prevention:** Use safe string search methods like `indexOf` in a loop to count substring occurrences, or properly escape user input before passing it to the `RegExp` constructor. Ensure to check `term.length > 0` when using `indexOf` loops to prevent infinite loops.
