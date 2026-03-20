
## 2025-02-18 - Fast Frontmatter Parsing
**Learning:** Using full-file capturing regular expressions (`([\s\S]*)$`) for markdown parsing creates severe memory pressure and latency for large files, due to capturing massive strings into match arrays.
**Action:** Use `indexOf` and `slice` for string isolation when searching for specific delimiters (like `---`) at the top of a document, rather than reading the entire content with regex.
