## 2025-02-27 - Fast Frontmatter Parsing
**Learning:** In `src/lib/content.ts`, using a full-file capturing regular expression like `([\s\S]*)$` causes massive memory pressure and CPU bottlenecks in V8 when parsing large markdown files.
**Action:** Avoid full-file regex captures. Use a fast-fail check (`content.startsWith('---')`) to bypass regex execution entirely when possible. Then use a non-greedy regex to match only the frontmatter block, and combine it with `String.prototype.slice(match[0].length)` to efficiently extract the body.
