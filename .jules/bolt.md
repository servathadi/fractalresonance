## 2025-02-14 - Regex Optimization for Large Files
**Learning:** Using full-file capturing regular expressions like `([\s\S]*)$` causes massive memory pressure in Node.js/V8 when parsing large markdown files.
**Action:** Use a fast-fail check like `content.startsWith('---')` to bypass regex execution when possible, and use a non-greedy regex to match only the target block combined with `String.prototype.slice()` to efficiently extract the remaining body.
