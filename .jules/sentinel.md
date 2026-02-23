## 2025-02-14 - Regex Injection in Search Logic
**Vulnerability:** The search logic used `new RegExp(userInput, 'g')` to count term occurrences, allowing attackers to cause a crash (DoS) via invalid regex or potentially exploit ReDoS.
**Learning:** Never trust user input in `RegExp` constructors. Even in serverless functions, crashes expose error details and consume resources.
**Prevention:** Use `indexOf` loop for simple substring counting, or escape user input before using in regex.
