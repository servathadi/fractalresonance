## 2024-05-24 - Frontmatter Parsing Optimization
**Learning:** Full-file regex capturing `([\s\S]*)$` for frontmatter in large markdown files causes significant performance degradation because the regex engine has to scan the entire string.
**Action:** Use `indexOf` and `slice` to efficiently scan for frontmatter delimiters instead of regex, drastically reducing parse time for massive markdown files.
