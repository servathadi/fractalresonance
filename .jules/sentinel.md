## 2026-03-20 - Fix DoS via Unescaped RegExp in Search
**Vulnerability:** Unescaped user input passed directly to `RegExp` constructor in `functions/api/ask.ts` allows DoS via unhandled SyntaxError (e.g., query with `[`) or ReDoS.
**Learning:** Never pass unescaped user input to `new RegExp`. In serverless environments like Cloudflare Workers, regex compilation errors or ReDoS can exhaust CPU limits and cause crashes.
**Prevention:** Use pure string-based search methods like `indexOf` in a loop for simple text matching instead of dynamic `RegExp` construction.