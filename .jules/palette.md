## 2024-05-15 - Missing aria-hidden on decorative SVGs
**Learning:** Decorative and inner SVGs within `button`s or `a` elements often lack `aria-hidden="true"`, causing screen readers to incorrectly read out SVG code or present redundant elements if the parent has an `aria-label`.
**Action:** Adding `aria-hidden="true"` to inner `<svg>` elements is a very simple < 50 line UX fix.
