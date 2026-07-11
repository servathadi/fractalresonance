'use client';

import { useEffect } from 'react';

export default function Home() {
  // Cloudflare Pages is a static host (Next `output: 'export'`), so server-side
  // redirects are not reliable. Do a tiny client-side redirect as a fallback.
  // A `_redirects` rule (public/_redirects) handles this at the edge in prod.
  useEffect(() => {
    window.location.replace('/en');
  }, []);

  return null;
}
