'use client';

import { usePathname } from 'next/navigation';
import { getLangFromPathname } from '@/lib/site';
import { getDictionary } from '@/lib/dictionaries';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function SkipLink() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const dict = getDictionary(lang);
  const isRTL = RTL_LANGUAGES.includes(lang);

  return (
    <a
      href="#main-content"
      className={`fixed top-4 z-[100] px-4 py-2 bg-frc-gold text-frc-void font-medium rounded shadow-lg transition-transform duration-200 transform -translate-y-[150%] focus:translate-y-0 ${
        isRTL ? 'right-4 font-farsi' : 'left-4'
      }`}
    >
      {dict.skipLink}
    </a>
  );
}
