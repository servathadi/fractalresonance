## 2025-02-14 - Optimize markdown frontmatter parsing
**Learning:** Full-file capturing regular expressions like `([\s\S]*)$` cause massive memory pressure and performance overhead when parsing large markdown files in Node.js.
**Action:** Use `indexOf` and `slice` to efficiently scan for frontmatter delimiters and extract the body string without loading the entire content into the regex engine.
