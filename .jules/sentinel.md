# Sentinel's Journal

## 2025-02-14 - Initial Scan
**Vulnerability:** ReDoS risk in search logic
**Learning:** Using `new RegExp(user_input, 'g')` for simple counting exposes the application to Regular Expression Denial of Service (ReDoS) if the input contains malicious patterns.
**Prevention:** Use `indexOf` with a loop or `split` to count occurrences of a substring without regex parsing.
