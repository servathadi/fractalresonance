## 2026-02-22 - ReDoS Prevention in Search Logic
**Vulnerability:** The search scoring logic used `new RegExp(term, 'g')` with user-controlled input, allowing users to trigger ReDoS or syntax errors (e.g., sending `(`).
**Learning:** Naive use of `RegExp` for substring counting is dangerous. `split(term).length - 1` or `indexOf` loops are safer alternatives.
**Prevention:** Use a manual `indexOf` loop for counting substring occurrences when the term is user-controlled.
