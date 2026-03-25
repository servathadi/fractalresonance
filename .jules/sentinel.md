## 2026-03-25 - XSS via innerHTML in Lightbox Caption
**Vulnerability:** The `BookExperience.tsx` component used `innerHTML` to inject an image's `alt` text into a lightbox caption without HTML escaping, allowing potential Cross-Site Scripting (XSS).
**Learning:** Even when reading attributes from existing DOM elements (like `img.alt`), the values can contain malicious unescaped HTML. Injecting them back into the DOM using `innerHTML` executes the payload.
**Prevention:** Always sanitize or escape HTML control characters (`<`, `>`, `&`, `"`, `'`) before using `innerHTML`, or prefer using DOM APIs like `textContent` which natively escape text.
