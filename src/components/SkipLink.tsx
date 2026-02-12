'use client';

import { usePathname } from 'next/navigation';
import { getLangFromPathname } from '@/lib/site';

const DICT: Record<string, string> = {
  en: 'Skip to content',
  es: 'Saltar al contenido',
  fr: 'Aller au contenu',
  fa: 'پرش به محتوا',
};

export function SkipLink() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const label = DICT[lang] || DICT['en'];

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] px-4 py-2 bg-frc-void text-frc-gold border border-frc-gold rounded-md shadow-xl outline-none ring-2 ring-frc-blue font-mono text-sm tracking-wide"
    >
      {label}
    </a>
  );
}
