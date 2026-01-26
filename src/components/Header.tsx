'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { ModeToggleCompact } from './ModeToggle';
import { getDictionary } from '@/lib/dictionaries';
import { getLangFromPathname } from '@/lib/site';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function Header() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const basePath = `/${lang}`;
  const isRTL = RTL_LANGUAGES.includes(lang);
  const dict = getDictionary(lang);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/about', label: dict.nav.about },
    { path: '/articles', label: dict.nav.articles },
    { path: '/blog', label: dict.nav.blog },
    { path: '/topics', label: dict.nav.topics },
    { path: '/people', label: dict.nav.people },
    { path: '/papers', label: dict.nav.papers },
    { path: '/books', label: dict.nav.books },
    { path: '/graph', label: dict.nav.graph },
    { path: '/formulas', label: dict.nav.formulas },
    { path: null, href: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13', label: dict.nav.askAi },
    { path: '/positioning', label: dict.nav.positioning },
    { path: '/mu-levels', label: dict.nav.muLevels },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 bg-frc-void/95 backdrop-blur-sm ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top micro-bar with coordinates */}
      <div className="border-b border-frc-blue/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1 flex items-center justify-between gap-4">
          <span className="font-mono text-[0.625rem] text-frc-steel tracking-wider">
            <span className="sm:hidden">FRC.v2</span>
            <span className="hidden sm:inline">FRC.v2 — fractalresonance.com</span>
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://orcid.org/0009-0004-7412-5129"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.625rem] text-frc-steel hover:text-frc-gold tracking-wider hidden sm:block"
            >
              ORCID:0009-0004-7412-5129
            </a>
            <span className="text-frc-blue hidden sm:block">|</span>
            <div className="hidden sm:block">
              <ModeToggleCompact />
            </div>
            <span className="text-frc-blue hidden sm:block">|</span>
            <LanguageSelector />
            <span className="text-frc-blue">|</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-frc-blue">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-3 group">
            <Image
              src="/brand/sigil-64.png"
              alt="FRC"
              width={32}
              height={32}
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="hidden sm:block">
              <span className="text-frc-gold text-sm font-medium tracking-wide">FRC</span>
            </div>
          </Link>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden text-frc-text-dim hover:text-frc-gold transition-colors px-2 py-2 -mr-2"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <nav className="hidden xl:flex items-center">
              {navLinks.map(link => (
                link.path ? (
                  <Link
                    key={link.path}
                    href={`${basePath}${link.path}`}
                    className="text-frc-text-dim hover:text-frc-gold text-xs uppercase tracking-wider px-3 py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-frc-text-dim hover:text-frc-gold text-xs uppercase tracking-wider px-3 py-2 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[90] xl:hidden">
          <div
            className="absolute inset-0 bg-frc-void/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className={`absolute top-0 ${isRTL ? 'left-0 border-r' : 'right-0 border-l'} h-full w-[85vw] max-w-sm bg-frc-void border-frc-blue shadow-2xl flex flex-col`}
          >
            <div className="px-4 py-3 border-b border-frc-blue flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/brand/sigil-64.png"
                  alt="FRC"
                  width={28}
                  height={28}
                  className="opacity-90"
                />
                <div>
                  <div className="text-frc-gold text-sm font-medium tracking-wide">FRC</div>
                  <div className="text-[11px] text-frc-steel font-mono">fractalresonance.com</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-frc-text-dim hover:text-frc-gold transition-colors p-2 -mr-2"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4 overflow-y-auto flex-1">
              <div className="text-[11px] uppercase tracking-wider text-frc-steel mb-2">
                Navigation
              </div>
              <nav className={`flex flex-col ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}>
                {navLinks.map(link => (
                  link.path ? (
                    <Link
                      key={link.path}
                      href={`${basePath}${link.path}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-frc-text-dim hover:text-frc-gold text-sm tracking-wide py-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-frc-text-dim hover:text-frc-gold text-sm tracking-wide py-2 transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </nav>

              <div className="mt-5 pt-5 border-t border-frc-blue">
                <div className="text-[11px] uppercase tracking-wider text-frc-steel mb-3">
                  Settings
                </div>
                <div className={`flex flex-col gap-4 ${isRTL ? 'items-end' : 'items-start'}`}>
                  <ModeToggleCompact />
                  <div className="flex items-center gap-3">
                    <LanguageSelector />
                    <span className="text-frc-blue">|</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-frc-blue">
                <div className="text-[11px] uppercase tracking-wider text-frc-steel mb-2">
                  External
                </div>
                <a
                  href="https://orcid.org/0009-0004-7412-5129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-frc-text-dim hover:text-frc-gold text-sm tracking-wide py-2 transition-colors"
                >
                  ORCID
                </a>
              </div>

              <div className="h-12" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
