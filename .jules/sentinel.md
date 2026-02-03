## 2025-02-18 - Mismatch in Security Implementation State
**Vulnerability:** Reverse Tabnabbing (target="_blank" without rel="noopener noreferrer") was present in `MarkdownContent.tsx`, despite codebase memory indicating it was already handled.
**Learning:** The memory explicitly stated `MarkdownContent.tsx` "includes transformTags to enforce rel=noopener noreferrer", but the code did not. Reliance on memory/docs without code verification is a security gap.
**Prevention:** Always verify the actual implementation code before assuming a security control is in place, regardless of what documentation or memory says. "Trust but verify."
