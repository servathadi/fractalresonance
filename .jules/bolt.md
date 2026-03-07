
## 2025-03-09 - Markdown Parsing Bottleneck
**Learning:** Full-file capturing regular expressions (`/^---([\s\S]*?)---([\s\S]*)$/`) in Node.js on massive markdown strings cause severe performance degradation due to string allocation overhead and engine backtracking, taking over 30x longer than string searches.
**Action:** Always prefer `indexOf` and `slice` loops over capturing regexes when scanning for delimiters in large strings.
