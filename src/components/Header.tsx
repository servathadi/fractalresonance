'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { ModeToggleCompact } from './ModeToggle';
import { getDictionary } from '@/lib/dictionaries';
import { getBasePath, getLangFromPathname, getPerspectiveFromPathname } from '@/lib/site';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

const MOBILE_GROUPS: Record<string, { explore: string; library: string; tools: string; meta: string; open: string; close: string }> = {
  en: { explore: 'Explore', library: 'Library', tools: 'Tools', meta: 'Meta', open: 'Open section', close: 'Close section' },
  fa: { explore: 'کاوش', library: 'کتابخانه', tools: 'ابزارها', meta: 'متا', open: 'باز کردن بخش', close: 'بستن بخش' },
  es: { explore: 'Explorar', library: 'Biblioteca', tools: 'Herramientas', meta: 'Meta', open: 'Abrir sección', close: 'Cerrar sección' },
  fr: { explore: 'Explorer', library: 'Bibliothèque', tools: 'Outils', meta: 'Meta', open: 'Ouvrir la section', close: 'Fermer la section' },
};

export function Header() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const perspective = getPerspectiveFromPathname(pathname);
  const basePath = getBasePath(lang, perspective);
  const isRTL = RTL_LANGUAGES.includes(lang);
  const dict = getDictionary(lang);
  const g = MOBILE_GROUPS[lang] || MOBILE_GROUPS['en'];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // intent
  const [isMobileMenuRendered, setIsMobileMenuRendered] = useState(false); // mounted
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false); // animated in/out
  const [mobileGroupOpen, setMobileGroupOpen] = useState<Record<string, boolean>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const DRAWER_ANIMATION_MS = 200;

  type MobileLink = { path: string; label: string } | { href: string; label: string };

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
    { path: '/oracle', label: dict.nav.oracle },
    { path: null, href: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13', label: dict.nav.askAi },
    { path: '/join', label: dict.nav.join },
    { path: '/investors', label: dict.nav.investors },
    { path: '/builders', label: dict.nav.builders },
    { path: '/positioning', label: dict.nav.positioning },
    { path: '/mu-levels', label: dict.nav.muLevels },
  ];

  const mobileGroups: Array<{ id: string; label: string; openByDefault: boolean; links: MobileLink[] }> = useMemo(
    () => [
      {
        id: 'explore',
        label: g.explore,
        openByDefault: true,
        links: [
          { path: '/articles', label: dict.nav.articles },
          { path: '/blog', label: dict.nav.blog },
          { path: '/topics', label: dict.nav.topics },
          { path: '/people', label: dict.nav.people },
          { path: '/oracle', label: dict.nav.oracle },
        ],
      },
      {
        id: 'library',
        label: g.library,
        openByDefault: false,
        links: [
          { path: '/papers', label: dict.nav.papers },
          { path: '/books', label: dict.nav.books },
          { path: '/concepts', label: dict.nav.concepts },
          { path: '/formulas', label: dict.nav.formulas },
          { path: '/graph', label: dict.nav.graph },
        ],
      },
      {
        id: 'tools',
        label: g.tools,
        openByDefault: false,
        links: [
          { path: '/join', label: dict.nav.join },
          { href: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13', label: dict.nav.askAi },
        ],
      },
      {
        id: 'meta',
        label: g.meta,
        openByDefault: false,
        links: [
          { path: '/about', label: dict.nav.about },
          { path: '/investors', label: dict.nav.investors },
          { path: '/builders', label: dict.nav.builders },
          { path: '/positioning', label: dict.nav.positioning },
          { path: '/mu-levels', label: dict.nav.muLevels },
        ],
      },
    ],
    [dict.nav.about, dict.nav.articles, dict.nav.askAi, dict.nav.blog, dict.nav.books, dict.nav.concepts, dict.nav.formulas, dict.nav.graph, dict.nav.muLevels, dict.nav.papers, dict.nav.people, dict.nav.positioning, dict.nav.topics, g.explore, g.library, g.meta, g.tools]
  );

  const normalizedPathname = useMemo(() => {
    const p = pathname || '/';
    return p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p;
  }, [pathname]);

  const isActivePath = (path: string | null) => {
    if (!path) return false;
    const target = `${basePath}${path}`.replace(/\/$/, '');
    return normalizedPathname === target || normalizedPathname.startsWith(`${target}/`);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      setIsMobileMenuRendered(true);
      lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      window.requestAnimationFrame(() => setIsMobileMenuVisible(true));
      setMobileGroupOpen((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const next: Record<string, boolean> = {};
        for (const group of mobileGroups) next[group.id] = group.openByDefault;
        return next;
      });
      return undefined;
    }

    setIsMobileMenuVisible(false);
    if (!isMobileMenuRendered) return undefined;

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsMobileMenuRendered(false);
      closeTimeoutRef.current = null;
      if (lastFocusedRef.current) lastFocusedRef.current.focus();
    }, DRAWER_ANIMATION_MS);

    return undefined;
  }, [isMobileMenuOpen, isMobileMenuRendered]);

  useEffect(() => {
    if (!isMobileMenuVisible) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        return;
      }

      if (e.key !== 'Tab') return;

      const root = panelRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.tabIndex !== -1);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === null)) {
        e.preventDefault();
        last.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuVisible]);

  useEffect(() => {
    if (!isMobileMenuRendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuRendered]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

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
            <div className="hidden md:flex items-center gap-3 font-mono text-[0.625rem] text-frc-steel tracking-wider">
              <Link href={`${basePath}/investors`} className="hover:text-frc-gold">{dict.nav.investors}</Link>
              <span className="text-frc-blue">|</span>
              <Link href={`${basePath}/builders`} className="hover:text-frc-gold">{dict.nav.builders}</Link>
            </div>
            <span className="text-frc-blue hidden md:block">|</span>
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
              className="xl:hidden text-frc-text-dim hover:text-frc-gold transition-colors w-11 h-11 inline-flex items-center justify-center -mr-2"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="frc-mobile-menu"
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
                    className={`text-xs uppercase tracking-wider px-3 py-2 transition-colors ${
                      isActivePath(link.path) ? 'text-frc-gold' : 'text-frc-text-dim hover:text-frc-gold'
                    }`}
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

      {isMobileMenuRendered ? (
        <div className="fixed inset-0 z-[90] xl:hidden">
          <div
            className={`absolute inset-0 bg-frc-void/80 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
              isMobileMenuVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            id="frc-mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={`absolute top-0 ${isRTL ? 'left-0 border-r' : 'right-0 border-l'} h-full w-[85vw] max-w-sm bg-frc-void border-frc-blue shadow-2xl flex flex-col transform transition-transform duration-200 motion-reduce:transition-none ${
              isMobileMenuVisible
                ? 'translate-x-0'
                : isRTL
                  ? '-translate-x-full'
                  : 'translate-x-full'
            } pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
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
                ref={closeButtonRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-frc-text-dim hover:text-frc-gold transition-colors w-11 h-11 inline-flex items-center justify-center -mr-2"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4 overflow-y-auto flex-1 overscroll-contain">
              <div className="text-[11px] uppercase tracking-wider text-frc-steel mb-2">
                Navigation
              </div>
              <div className={`flex flex-col gap-2 ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}>
                {mobileGroups.map((group) => (
                  <details
                    key={group.id}
                    open={!!mobileGroupOpen[group.id]}
                    onToggle={(e) => setMobileGroupOpen((prev) => ({ ...prev, [group.id]: (e.currentTarget as HTMLDetailsElement).open }))}
                    className="group w-full border border-frc-blue/60 rounded-lg bg-frc-void-light/30"
                  >
                    <summary
                      className={`px-3 py-3 cursor-pointer select-none list-none flex items-center justify-between gap-3 ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                      aria-label={`${mobileGroupOpen[group.id] ? g.close : g.open}: ${group.label}`}
                    >
                      <span className="text-[11px] uppercase tracking-wider text-frc-steel">{group.label}</span>
                      <svg
                        className="w-4 h-4 text-frc-steel transition-transform motion-reduce:transition-none group-open:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>

                    <nav className="px-3 pb-2">
                      {group.links.map((link) =>
                        'path' in link ? (
                          <Link
                            key={`${group.id}:${link.path}`}
                            href={`${basePath}${link.path}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block w-full text-sm tracking-wide py-2 transition-colors ${
                              isActivePath(link.path) ? 'text-frc-gold' : 'text-frc-text-dim hover:text-frc-gold'
                            }`}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            key={`${group.id}:${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-frc-text-dim hover:text-frc-gold text-sm tracking-wide py-2 transition-colors"
                          >
                            {link.label}
                          </a>
                        )
                      )}
                    </nav>
                  </details>
                ))}
              </div>

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
