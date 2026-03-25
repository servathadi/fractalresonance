## 2025-02-14 - Replace full-file regex captures with indexOf and slice
**Learning:** Using massive full-file capturing regular expressions like `([\s\S]*)$` for markdown frontmatter parsing degrades performance significantly when scaling to large files.
**Action:** Avoid full-file capturing regular expressions. Instead, use `indexOf` and `slice` to efficiently scan for frontmatter delimiters.
