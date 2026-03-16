## 2025-03-16 - Faster frontmatter parsing
**Learning:** Full-file capturing regular expressions like `([\s\S]*)$` in markdown parsers cause a massive performance bottleneck when reading long markdown files, since the regex engine must scan and buffer the entire content body unnecessarily.
**Action:** Replace full-file regex matching with `indexOf('\n---')` and `slice` to only extract the frontmatter chunk without processing the entire file body.
