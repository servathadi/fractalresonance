## 2025-02-20 - RegExp vs indexOf for limited substring counting
**Learning:** Using `String.match(new RegExp(term, 'g'))` to count occurrences of a term in a long string is inefficient, especially when capped at a low limit (e.g., 5). It allocates a new RegExp object and scans the entire string unnecessarily.
**Action:** Use an `indexOf` loop with a match limit (e.g., `while (matches < limit && pos !== -1)`) to avoid RegExp allocation and early-exit once the limit is reached.
