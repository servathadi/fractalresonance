'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function canonicalizeFrcLikeId(rawId: string): string {
  let s = decodeURIComponent(String(rawId || '')).trim();
  if (!s) return s;
  s = s.replace(/^frc\s+/i, 'FRC-'); // "FRC 100.001" -> "FRC-100.001"
  s = s.replace(/^frc-/i, 'FRC-');
  s = s.replace(/\s+/g, '-');
  s = s.replace(/\./g, '-');
  s = s.replace(/_+/g, '-');
  s = s.replace(/-+/g, '-');
  return s.toUpperCase();
}

export function NotFoundRedirect() {
  const pathname = usePathname() || '';

  useEffect(() => {
    // Soft-land 404s for deep links by redirecting to a canonical path when possible,
    // otherwise fall back to the section index.
    const m = pathname.match(/^\/(en|es|fr|fa)(?:\/river)?\/(papers|articles|blog|books|topics|concepts|people)\/(.+)$/);
    if (!m) return;

    const lang = m[1];
    const section = m[2];
    const rawId = m[3];

    // Attempt canonical redirect for legacy FRC-like IDs (spaces/dots/underscores).
    if (/^frc[\s-]/i.test(rawId) || /%20/.test(rawId) || /\./.test(rawId)) {
      const canonical = canonicalizeFrcLikeId(rawId);
      if (canonical && canonical !== rawId) {
        window.location.replace(`/${lang}/${section}/${encodeURIComponent(canonical)}`);
        return;
      }
    }

    window.location.replace(`/${lang}/${section}`);
  }, [pathname]);

  return null;
}
