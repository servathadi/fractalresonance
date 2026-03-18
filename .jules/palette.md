## 2024-05-18 - Missing Focus States on Mode Toggles
**Learning:** Found that custom toggle buttons like `ModeToggleCompact` and `ModeSwitchButton` frequently lack default browser focus indicators when styled with Tailwind, making them completely invisible to keyboard navigators.
**Action:** When implementing custom interactive elements, always explicitly define `focus-visible:ring-2 focus-visible:ring-frc-gold focus-visible:outline-none` (or similar brand colors) to ensure keyboard accessibility without compromising mouse/touch UX.
