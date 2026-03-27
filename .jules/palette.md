## 2024-03-27 - Accessible Icon-Only Popover Buttons
**Learning:** Icon-only buttons in text selection popovers must have `aria-label`s and visible focus states (e.g., `focus-visible:ring-2`) to ensure screen reader users and keyboard navigators can interact with them effectively after making a text selection.
**Action:** Always pair `title` tooltips with `aria-label`s on icon-only buttons and ensure interactive elements have clear focus indicators using Tailwind's `focus-visible` utilities.
