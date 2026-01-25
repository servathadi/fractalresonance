'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function NotFoundRedirect() {
  const pathname = usePathname() || '';

  useEffect(() => {
    // For missing paper URLs, prefer redirecting to the papers index rather than leaving a hard 404.
    // This keeps legacy links "soft landing" without needing to maintain an explicit map.
    const m = pathname.match(/^\/(en|es|fr|fa)(\/river)?\/papers\/.+/);
    if (!m) return;

    const lang = m[1];
    const river = m[2] || '';
    window.location.replace(`/${lang}${river}/papers`);
  }, [pathname]);

  return null;
}

