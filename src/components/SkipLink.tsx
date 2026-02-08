'use client';

import { usePathname } from 'next/navigation';
import { getLangFromPathname } from '@/lib/site';

interface SkipLinkProps {
  className?: string;
}

const DICT: Record<string, string> = {
  en: 'Skip to content',
  es: 'Saltar al contenido',
  fr: 'Aller au contenu',
  fa: 'پرش به محتوا',
};

const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function SkipLink({ className = '' }: SkipLinkProps) {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const isRTL = RTL_LANGUAGES.includes(lang);

  return (
    <a
      href="#main-content"
      className={`sr-only focus:not-sr-only fixed top-4 z-[100] px-4 py-2 bg-frc-gold text-frc-void font-medium rounded shadow-lg outline-none ring-2 ring-frc-blue transition-opacity ${
        isRTL ? 'focus:right-4' : 'focus:left-4'
      } ${className}`}
    >
      {DICT[lang] || DICT['en']}
    </a>
  );
}
