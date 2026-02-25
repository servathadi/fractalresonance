## 2026-02-25 - Regex Injection DoS in Search
**Vulnerability:** The search scoring function used `new RegExp(user_input, 'g')` to count term occurrences. Invalid regex syntax (e.g., `???`) caused the function to crash, enabling a Denial of Service.
**Learning:** Avoid `new RegExp(input)` when simple string matching suffices. It exposes the application to ReDoS and syntax errors.
**Prevention:** Use manual `indexOf` loops or escape all special regex characters before creating a RegExp instance.
