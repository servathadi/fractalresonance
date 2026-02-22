'use client';

import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { getLangFromPathname } from '@/lib/site';

export function SkipLink() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname);
  const dict = getDictionary(lang);
  const isRTL = lang === 'fa' || lang === 'ar' || lang === 'he';

  return (
    <a
      href="#main-content"
      className={`fixed top-4 z-[100] -translate-y-[150%] focus:translate-y-0 bg-frc-gold text-frc-void font-medium px-4 py-2 rounded shadow-lg transition-transform duration-200 outline-none focus-visible:ring-2 focus-visible:ring-frc-blue ${
        isRTL ? 'right-4' : 'left-4'
      }`}
    >
      {dict.accessibility?.skipToContent || 'Skip to content'}
    </a>
  );
}
