## 2024-05-10 - Fast Markdown Parsing
**Learning:** Using full-file capturing regex ([\s\S]*)$ for markdown frontmatter causes massive memory pressure and slow parsing for large files.
**Action:** Use startsWith('---') for fast-fail, non-greedy frontmatter match, and String.prototype.slice() for the file body.
