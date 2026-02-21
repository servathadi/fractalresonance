## 2026-02-21 - Visual Affordances for Collapsible Elements
**Learning:** Users rely on visual indicators like chevrons to understand that an element is collapsible. `<details>` and `<summary>` elements should always include a rotating chevron to indicate state (open/closed).
**Action:** Always add a chevron icon to `<summary>` elements and use Tailwind's `group` and `group-open` utilities to rotate it when the details are open. Ensure `list-none` and `[&::-webkit-details-marker]:hidden` are used to remove the default browser marker.
