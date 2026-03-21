
## 2024-05-18 - Fast Content File Lookup
**Learning:** Using `fs.readdirSync` to find a specific markdown file by parsing every file's frontmatter creates an O(N) bottleneck, particularly as the directory size grows.
**Action:** Always attempt an O(1) file existence check `fs.existsSync(path.join(dir, \`${id}.md\`))` before falling back to full directory scanning, while ensuring path sanitization to prevent directory traversal.
