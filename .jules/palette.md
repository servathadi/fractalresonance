## 2025-05-18 - Missing Visual Indicators for Details Elements
**Learning:** The `<details>` element provides native accordion functionality, but without a visual indicator (like a chevron), users may not realize the content is collapsible, especially when custom styling (`list-none`) removes the default marker.
**Action:** Always include a visual indicator (e.g., a rotating chevron icon) and utilize `group` and `group-open:` modifiers in Tailwind to animate the state change, improving affordance and clarity.
