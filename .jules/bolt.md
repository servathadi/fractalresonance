## 2025-04-05 - Avoid full-file capturing regexes for markdown parsing
**Learning:** Using full-file capturing regular expressions like `([\s\S]*)$` in `src/lib/content.ts` caused massive memory pressure and performance degradation in Node.js/V8 when parsing large markdown files.
**Action:** Include a fast-fail check like `content.startsWith('---')` to bypass regex execution entirely when possible, and use a non-greedy regex to match only the frontmatter block, extracting the rest with `String.prototype.slice()`.
