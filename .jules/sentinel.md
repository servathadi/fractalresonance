## 2025-02-28 - Fix ReDoS vulnerability in search API
**Vulnerability:** Unescaped user input passed directly to `new RegExp` and sensitive error details exposed in API response.
**Learning:** Creating a regular expression from user input without escaping special characters enables ReDoS attacks and server crashes. Also, error objects should not be sent directly to clients.
**Prevention:** Use purely string-based methods like `indexOf` for counting occurrences when using unescaped user input. Always return generic error messages for 500 responses.
