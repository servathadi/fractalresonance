## 2025-05-27 - ReDoS in Search Logic
**Vulnerability:** The search logic in `functions/api/ask.ts` used `new RegExp(term, 'g')` to count occurrences of user-provided terms. This allowed users to crash the application with invalid regex syntax (e.g., `c++`, `(`, `[`) and introduced a ReDoS (Regular Expression Denial of Service) vector.
**Learning:** Never pass user input directly to `new RegExp()` constructor without escaping. For simple substring counting, a manual loop using `indexOf` is safer, more performant, and avoids regex compilation overhead.
**Prevention:** Use `indexOf` loops for substring counting. Refactor logic into pure functions (e.g., `search-logic.ts`) to enable easy unit testing of such edge cases without needing the full Cloudflare Workers environment.
