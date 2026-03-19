## 2024-05-16 - Prevent ReDoS and unhandled SyntaxError in scoreDocument
**Vulnerability:** The application was dynamically passing unsanitized user query terms (`term`) directly into `new RegExp(term, 'g')` in `functions/api/ask.ts`. This exposed the `scoreDocument` function to Regular Expression Denial of Service (ReDoS) and unhandled crashes if a user searched for invalid regex characters (like `[`).
**Learning:** Using `new RegExp` with unsanitized user input is risky and can lead to server crashes or resource exhaustion, even if the matches are later capped.
**Prevention:** Avoid dynamically generating regular expressions with user input. When possible, prefer pure string-based search methods like `indexOf` within a `while` loop, particularly for simple term-counting logic.
