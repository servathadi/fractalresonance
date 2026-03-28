## 2024-05-24 - Optimize Markdown Frontmatter Parsing
**Learning:** Full-file capturing regular expressions (like `([\s\S]*)$`) applied to massive markdown files incur catastrophic performance overhead due to regex engine state allocations, especially on large strings.
**Action:** Avoid regex for chunking/splitting massive strings where possible; prefer pure string-scanning operations like `indexOf` and `substring`.
