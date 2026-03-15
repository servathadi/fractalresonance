## 2024-03-15 - Fast term frequency counting with `indexOf`
**Learning:** Using `String.prototype.match` with a dynamically constructed `RegExp` in a loop across large documents (like full document contents) causes unnecessary allocations and full-string scans. It is also a ReDoS risk if the input isn't properly escaped.
**Action:** Use a `while` loop with `indexOf` when counting term frequencies, and exit early when the cap (e.g., max 5 matches) is reached to significantly improve performance on large text fields.
