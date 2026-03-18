## 2025-03-18 - Replacing RegExp with indexOf and capping match counts
**Learning:** Text search scoring in `functions/api/ask.ts` had a performance bottleneck and ReDoS vulnerability due to using RegExp and a full string scan for term occurrences. Capping matches at 5 and using `indexOf` in a while loop prevents redundant operations and avoids unescaped user input vulnerabilities.
**Action:** Always favor `indexOf` with bounded match loops instead of `match(new RegExp())` for frequency scoring, especially when scanning massive markdown documents.
