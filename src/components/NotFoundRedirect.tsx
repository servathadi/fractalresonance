'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function NotFoundRedirect() {
  const pathname = usePathname() || '';

  useEffect(() => {
    // Soft-land 404s for deep links by redirecting to the section index.
    // This keeps legacy links from the old site usable without an exhaustive map.
    const m = pathname.match(/^\/(en|es|fr|fa)(\/river)?\/(papers|articles|blog|books|topics|concepts|people)\/.+/);
    if (!m) return;

    const lang = m[1];
    const river = m[2] || '';
    const section = m[3];
    window.location.replace(`/${lang}${river}/${section}`);
  }, [pathname]);

  return null;
}
