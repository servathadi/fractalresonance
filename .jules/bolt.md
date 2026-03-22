
## 2025-02-23 - Fast frontmatter parsing using indexOf
**Learning:** Full-file capturing regular expressions like `([\s\S]*)$` cause massive performance drops and memory overhead when parsing large markdown files.
**Action:** Use `indexOf` and `slice` to efficiently scan for delimiters instead of regex captures to extract frontmatter and body blocks.
