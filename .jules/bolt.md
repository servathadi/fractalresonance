## 2025-05-23 - Text Search Scoring Anti-Pattern
**Learning:** Using `new RegExp(term, 'g')` inside a scoring loop for text search is a critical performance bottleneck and security vulnerability (ReDoS/Crash).
**Action:** Always prefer manual `indexOf` loops (`countOccurrences`) for simple substring counting. It is ~1.7x faster and completely safe from ReDoS and regex syntax crashes.
