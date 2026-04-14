## 2024-04-14 - Add aria-label to TextSharePopover buttons
**Learning:** Icon-only buttons in popovers frequently lack `aria-label` attributes, relying only on `title`. For screen readers, both are necessary to ensure accessibility, particularly for dynamic states like "Copied!". Also `svg` elements in icon-only buttons need `aria-hidden="true"`.
**Action:** Always add `aria-label` to icon-only buttons matching the `title` attribute, and hide inner `svg` elements with `aria-hidden="true"`. Ensure dynamic state changes (like "Copied!") are reflected in both attributes.
