## 2025-03-16 - Custom visual indicators for collapsible sections
**Learning:** Default browser `<details>` markers are inconsistent and difficult to style correctly, leading to poor visual feedback for expandable UI components.
**Action:** Always implement collapsible sections by hiding default markers on `<summary>` using `list-none [&::-webkit-details-marker]:hidden`, adding standard focus-visible rings for keyboard accessibility, and using a custom SVG chevron controlled by Tailwind's `group` and `group-open` modifiers for reliable state-based rotation.
