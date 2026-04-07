## 2025-02-27 - Regex Performance on Large Strings
**Learning:** Full-file capturing regular expressions like `([\s\S]*)$` cause massive memory pressure and poor performance in Node.js/V8 when parsing large files.
**Action:** Use a fast-fail check like `content.startsWith('---')` to bypass regex execution when possible, and use a non-greedy regex combined with `String.prototype.slice()` to efficiently extract the body.
