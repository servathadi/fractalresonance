## 2024-03-24 - Optimize scoreDocument text search
**Learning:** Passing unescaped user input into `RegExp` for text search scoring is both a performance bottleneck (due to repeated regex compilation) and a ReDoS/SyntaxError security risk.
**Action:** Used a `while` loop with `indexOf` and an explicit match limit (5) to improve performance and eliminate the vulnerability.
