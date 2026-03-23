## 2024-05-24 - O(1) File Lookups in Content Loaders
**Learning:** Using fs.readdirSync and scanning all files to find a single markdown file by ID is an O(N) operation that blocks the Node event loop and drastically slows down static builds when the content directory grows.
**Action:** Always attempt a direct O(1) fs.existsSync and fs.readFileSync for `${id}.md` before falling back to a full directory scan, especially in generator functions or paths resolving IDs to files.
