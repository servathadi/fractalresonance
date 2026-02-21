## 2025-02-14 - Singular vs Plural Content Fetching
**Learning:** In a flat-file CMS architecture (like this project), singular content getters (e.g., `getPaper`) that read files directly are an anti-pattern when plural getters (e.g., `getPapers`) are also used on the same page (e.g., for navigation/sidebars).
**Action:** Always implement singular getters by filtering the result of a cached plural getter. This converts O(N) file system reads per component into O(1) memory lookups after the initial load, significantly reducing build times and server response times.
