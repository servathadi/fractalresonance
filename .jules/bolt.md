## 2025-02-09 - Optimize frontmatter regex parsing
**Learning:** Using full-file capturing regular expressions (like `([\s\S]*)$`) for massive markdown files causes unnecessary memory pressure and slowdowns in Node.js/V8 due to regex engine execution overhead.
**Action:** Add a fast-fail check like `content.startsWith('---')` to bypass regex entirely when possible, and use a non-greedy matching regex combined with `String.prototype.slice()` to efficiently extract the body.
