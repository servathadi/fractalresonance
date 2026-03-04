
## 2024-05-15 - Fast text search relevance scoring
**Learning:** In simple JS search algorithms, using `String.match(new RegExp(term, 'g'))` on large strings inside a loop is very slow because it creates a new RegExp object on every iteration, parses the string, and allocates an array of all matches.
**Action:** Use `indexOf` in a `while` loop, or pre-compile `RegExp` objects with the `g` flag outside the document loop and use `exec()` up to the desired cap. `indexOf` is generally faster for simple string matching, especially when bounded.
