'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

// Language configuration
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fa', name: 'Farsi', nativeName: 'فارسی' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
] as const;

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Extract current language from pathname
  const pathParts = pathname.split('/');
  const currentLangCode = pathParts[1] || 'en';
  const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];
  const isRTL = RTL_LANGUAGES.includes(currentLangCode);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle language switch
  function switchLanguage(langCode: string) {
    const newPathParts = [...pathParts];
    newPathParts[1] = langCode;
    const newPath = newPathParts.join('/') || `/${langCode}`;
    router.push(newPath);
    setIsOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 font-mono text-[0.625rem] text-frc-steel hover:text-frc-gold tracking-wider uppercase transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span>{currentLang.code}</span>
        <svg
          className={`w-2.5 h-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 min-w-[140px] bg-frc-void border border-frc-blue z-50 animate-fade-in ${isRTL ? 'left-0' : 'right-0'}`}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full px-3 py-2 text-xs flex items-center justify-between gap-3 transition-colors ${
                lang.code === currentLangCode
                  ? 'bg-frc-blue/20 text-frc-gold'
                  : 'text-frc-text-dim hover:bg-frc-blue/10 hover:text-frc-text'
              }`}
              dir="ltr"
            >
              <span className="font-mono uppercase tracking-wider">{lang.code}</span>
              <span className={lang.code === 'fa' ? 'font-farsi' : ''} dir={lang.code === 'fa' ? 'rtl' : 'ltr'}>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
