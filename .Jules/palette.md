# Palette's Journal 🎨

## 2024-05-22 - Accessibility in Selection Popovers
**Learning:** Contextual tools like text selection popovers are invisible to screen reader users unless explicitly labeled and managed. When UI elements appear outside the natural tab flow based on user interaction (like selection), they need `role="toolbar"` and clear `aria-labels` to be discoverable and usable.
**Action:** Always add `aria-label` to icon-only buttons in popovers, and consider how keyboard users might discover these "delight" features. For selection popovers, ensuring the actions are semantically described is the first step, even if focus management remains a challenge for text selection workflows.
