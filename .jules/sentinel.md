# Sentinel Journal

## 2024-05-18 - Prevent ReDOS in term scoring
**Vulnerability:** Regular Expression Denial of Service (ReDoS) was possible in `functions/api/ask.ts` because a regular expression was dynamically constructed directly from user input without escaping special characters. A malicious user could submit a query containing specifically crafted characters causing catastrophic backtracking or blocking execution.
**Learning:** Even internal helper functions like `scoreDocument` should be wary of inputs passed to `RegExp` constructors.
**Prevention:** Avoid dynamically constructing RegExps using unescaped user input. String based techniques like `indexOf` should be used for simple keyword matching instead.

## 2024-05-18 - XSS vulnerability in SchemaScript.tsx
**Vulnerability:** XSS vulnerability was present in `src/components/SchemaScript.tsx` because `JSON.stringify` does not escape HTML special characters like `<` and `>`. Injecting `JSON.stringify` data into a `<script>` tag via `dangerouslySetInnerHTML` allows for escaping the script tag if the data contains `</script>`.
**Learning:** `JSON.stringify` does not inherently protect against XSS when its output is injected directly into HTML contexts (like script tags).
**Prevention:** Manually escape HTML control characters like `<` and `>` when injecting `JSON.stringify` output into script tags, typically using replacements like `replace(/</g, '\\u003c')`.
