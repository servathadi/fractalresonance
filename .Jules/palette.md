## 2025-02-18 - Perspective Toggle Accessibility
**Learning:** Toggle buttons that visually indicate state (like "River" vs "Kasra") must use `aria-pressed` or `aria-current` to communicate that state to screen readers. Relying on visual background color changes is insufficient. Also, compact icon-only buttons need explicit `aria-label`s describing the *action* (e.g., "Switch to River"), not just the current state.
**Action:** Always check toggle components for state communication attributes (`aria-pressed`) and ensure icon buttons have action-oriented labels.
