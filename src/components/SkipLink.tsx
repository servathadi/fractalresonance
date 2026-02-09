'use client';

import { usePathname } from 'next/navigation';
import { getLangFromPathname } from '@/lib/site';

const DICT = {
  en: 'Skip to content',
  es: 'Saltar al contenido',
  fr: 'Aller au contenu',
  fa: 'پرش به محتوا',
};

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function SkipLink() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const isRTL = RTL_LANGUAGES.includes(lang);
  const text = DICT[lang as keyof typeof DICT] || DICT['en'];

  return (
    <a
      href="#main-content"
      className={`
        sr-only focus:not-sr-only
        fixed top-4 z-[100]
        px-4 py-2
        bg-frc-gold text-frc-void font-medium rounded shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frc-gold
        transition-colors
        ${isRTL ? 'right-4' : 'left-4'}
        ${isRTL ? 'font-farsi' : ''}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {text}
    </a>
  );
}
