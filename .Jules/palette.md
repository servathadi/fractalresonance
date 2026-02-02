## 2025-05-23 - Skip Link Focus Management
**Learning:** A "Skip to content" link requires the target container to have `tabIndex={-1}` to ensure programmatic focus works reliably across all screen readers/browsers in a React/Next.js SPA.
**Action:** Always add `tabIndex={-1}` to the target of a skip link.
