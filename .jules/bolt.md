## 2026-03-14 - Optimize scoreDocument relevance scoring
**Learning:** Using `new RegExp(term, 'g')` to count occurrences inside a loop over search terms and documents causes a performance bottleneck due to repetitive regex allocation and full-string scanning.
**Action:** Use `indexOf` in a `while` loop with a match limit (e.g., 5) to efficiently count string occurrences and avoid regular expression overhead for simple exact-match term frequency scoring.
