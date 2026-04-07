## 2024-05-18 - Fix ReDoS and Information Leakage in API
**Vulnerability:** Unescaped user input passed directly to `new RegExp()` in `functions/api/ask.ts`, and internal error details leaked in the 500 response.
**Learning:** Dynamic generation of regular expressions based on user input allows for ReDoS (Regular Expression Denial of Service) and unhandled errors when invalid regex syntax is entered. Further, `error.message` should never be exposed in API error responses.
**Prevention:** Always use safe string methods like `indexOf` for simple text searches instead of regex, or escape user input before using it in a regex. Always return generic error messages for 500 status codes.
