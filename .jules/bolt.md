## 2025-02-13 - [Frontmatter Parsing Bottleneck]
**Learning:** Using regex with unbounded trailing `([\s\S]*?)$` over huge string content forces the regex engine to buffer and process the entire file payload, destroying parser performance for markdown files with massive bodies.
**Action:** Replace full-file capturing regexes with substring scanning (`indexOf`) tailored exactly to the needed delimiter chunk before dispatching parsing.
