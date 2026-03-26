## 2025-03-26 - Optimize Frontmatter Parsing
**Learning:** Using full-file capturing regexes like `([\s\S]*)$` for frontmatter extraction causes a massive performance bottleneck on large markdown files due to capturing the entire body in memory during the match.
**Action:** Replace full-body regex captures with efficient `indexOf` and `slice` operations to scan for delimiters, reducing parse time by over 90%.
