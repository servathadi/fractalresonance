'use client';

import { usePathname } from 'next/navigation';
import { getLangFromPathname } from '@/lib/site';

const RTL_LANGUAGES = ['fa', 'ar', 'he'];

const DICT: Record<string, string> = {
  en: 'Skip to content',
  es: 'Saltar al contenido',
  fr: 'Aller au contenu',
  fa: 'پرش به محتوا',
};

export function SkipLink() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const isRTL = RTL_LANGUAGES.includes(lang);

  return (
    <a
      href="#main-content"
      className={`
        fixed z-[100] px-4 py-2 bg-frc-gold text-frc-void font-medium rounded shadow-lg
        transition-transform duration-200
        top-4
        ${isRTL ? 'right-4 font-farsi' : 'left-4'}
        -translate-y-[200%] focus:translate-y-0
      `}
    >
      {DICT[lang] || DICT['en']}
    </a>
  );
}
