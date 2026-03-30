
## 2026-03-30 - Optimize markdown frontmatter parsing
**Learning:** Full-file capturing regular expressions like `([\s\S]*)$` cause massive memory pressure and high latency in Node.js/V8 when processing large markdown files.
**Action:** Use a non-greedy regex to match only the frontmatter block, preceded by a fast-fail check (`content.startsWith('---')`), and extract the rest of the body efficiently using `String.prototype.slice()`.
