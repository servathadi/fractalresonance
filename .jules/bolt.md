## 2025-02-27 - Fast Content Resolution
**Learning:** Finding single files via `readdirSync` + full markdown frontmatter parsing is an O(N) operation that scales poorly with directory size and causes high memory pressure. However, file paths often perfectly match their IDs.
**Action:** When retrieving a single markdown file by ID, explicitly check if `${id}.md` exists on disk using `fs.existsSync` to perform an O(1) lookup. Only fallback to `readdirSync` if the exact file path is not found.
