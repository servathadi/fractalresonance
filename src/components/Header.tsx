'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { SearchTrigger } from './SearchTrigger';
import { BrandMark } from './BrandMark';
import { getDictionary } from '@/lib/dictionaries';
import { getBasePath, getLangFromPathname, getPerspectiveFromPathname } from '@/lib/site';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

const NAV_GROUPS: Record<
  string,
  { more: string; research: string; notes: string; tools: string; open: string; close: string; menu: string; settings: string; external: string }
> = {
  en: { more: 'Corpus', research: 'Research', notes: 'Notes & essays', tools: 'Reference & tools', open: 'Open section', close: 'Close section', menu: 'Navigation', settings: 'Preferences', external: 'External' },
  fa: { more: 'پیکره', research: 'پژوهش', notes: 'یادداشت‌ها و جستارها', tools: 'مرجع و ابزارها', open: 'باز کردن بخش', close: 'بستن بخش', menu: 'ناوبری', settings: 'تنظیمات', external: 'پیوندهای بیرونی' },
  es: { more: 'Corpus', research: 'Investigación', notes: 'Notas y ensayos', tools: 'Referencia y herramientas', open: 'Abrir sección', close: 'Cerrar sección', menu: 'Navegación', settings: 'Preferencias', external: 'Externo' },
  fr: { more: 'Corpus', research: 'Recherche', notes: 'Notes et essais', tools: 'Référence et outils', open: 'Ouvrir la section', close: 'Fermer la section', menu: 'Navigation', settings: 'Préférences', external: 'Externe' },
};

export function Header() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const perspective = getPerspectiveFromPathname(pathname);
  const basePath = getBasePath(lang, perspective);
  const isRTL = RTL_LANGUAGES.includes(lang);
  const dict = getDictionary(lang);
  const g = NAV_GROUPS[lang] || NAV_GROUPS.en;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuRendered, setIsMobileMenuRendered] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<Record<string, boolean>>({});
  const [moreOpen, setMoreOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const DRAWER_ANIMATION_MS = 200;

  type NavLinkItem = { path: string; label: string } | { href: string; label: string };

  const primaryDesktopLinks = useMemo(
    () => [
      { path: '/start-here', label: dict.nav.startHere },
      { path: '/papers', label: dict.nav.papers },
      { path: '/books', label: dict.nav.books },
      { path: '/falsifications', label: dict.nav.falsifications },
      { path: '/articles', label: dict.nav.articles },
      { path: '/blog', label: dict.nav.blog },
    ],
    [dict.nav.articles, dict.nav.blog, dict.nav.books, dict.nav.falsifications, dict.nav.papers, dict.nav.startHere],
  );

  const moreLinks: NavLinkItem[] = useMemo(
    () => [
      { path: '/formulas', label: dict.nav.formulas },
      { path: '/concepts', label: dict.nav.concepts },
      { path: '/mu-levels', label: dict.nav.muLevels },
      { path: '/topics', label: dict.nav.topics },
      { path: '/graph', label: dict.nav.graph },
      { path: '/tags', label: dict.nav.tags },
      { path: '/about', label: dict.nav.about },
      { path: '/positioning', label: dict.nav.positioning },
      { path: '/join', label: dict.nav.join },
      { href: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13', label: dict.nav.askAi },
    ],
    [dict.nav.about, dict.nav.askAi, dict.nav.concepts, dict.nav.formulas, dict.nav.graph, dict.nav.join, dict.nav.muLevels, dict.nav.positioning, dict.nav.tags, dict.nav.topics],
  );

  const mobileGroups: Array<{ id: string; label: string; openByDefault: boolean; links: NavLinkItem[] }> = useMemo(
    () => [
      {
        id: 'research',
        label: g.research,
        openByDefault: true,
        links: [
          { path: '/start-here', label: dict.nav.startHere },
          { path: '/papers', label: dict.nav.papers },
          { path: '/books', label: dict.nav.books },
          { path: '/falsifications', label: dict.nav.falsifications },
        ],
      },
      {
        id: 'notes',
        label: g.notes,
        openByDefault: true,
        links: [
          { path: '/articles', label: dict.nav.articles },
          { path: '/blog', label: dict.nav.blog },
          { path: '/topics', label: dict.nav.topics },
          { path: '/concepts', label: dict.nav.concepts },
        ],
      },
      {
        id: 'tools',
        label: g.tools,
        openByDefault: false,
        links: [
          { path: '/formulas', label: dict.nav.formulas },
          { path: '/mu-levels', label: dict.nav.muLevels },
          { path: '/graph', label: dict.nav.graph },
          { path: '/tags', label: dict.nav.tags },
          { path: '/about', label: dict.nav.about },
          { path: '/positioning', label: dict.nav.positioning },
          { path: '/join', label: dict.nav.join },
          { href: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13', label: dict.nav.askAi },
        ],
      },
    ],
    [dict.nav, g.notes, g.research, g.tools],
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
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [moreOpen]);

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
  }, [isMobileMenuOpen, isMobileMenuRendered, mobileGroups]);

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
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
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
    <header
      className={`sticky top-0 z-50 bg-frc-void/95 backdrop-blur-sm border-b border-frc-blue ${isRTL ? 'font-farsi' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Masthead wordmark — stronger presence than nav links */}
        <Link href={basePath} className="flex items-center gap-3 shrink-0 group">
          <BrandMark alt="FRC" width={28} height={28} className="opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="text-frc-gold text-base sm:text-[1.0625rem] font-semibold tracking-tight">
            FRC
          </span>
        </Link>

        {/* Single-line desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {primaryDesktopLinks.map((item) => (
            <Link
              key={item.path}
              href={`${basePath}${item.path}`}
              className={`text-sm px-3 py-2 transition-colors whitespace-nowrap ${
                isActivePath(item.path)
                  ? 'text-frc-gold font-medium'
                  : 'text-frc-text-dim hover:text-frc-text'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div
            ref={moreRef}
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className="text-sm px-3 py-2 text-frc-text-dim hover:text-frc-text transition-colors inline-flex items-center gap-1 whitespace-nowrap"
            >
              {g.more}
              <svg
                className={`w-3.5 h-3.5 text-frc-steel transition-transform motion-reduce:transition-none ${
                  moreOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreOpen ? (
              <div className={`absolute top-full min-w-[14rem] ${isRTL ? 'left-0' : 'right-0'}`}>
                <div className="h-2" aria-hidden="true" />
                <div role="menu" className="border border-frc-blue bg-frc-void py-2">
                  {moreLinks.map((link) =>
                    'path' in link ? (
                      <Link
                        key={`more:${link.path}`}
                        href={`${basePath}${link.path}`}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActivePath(link.path)
                            ? 'text-frc-gold bg-frc-void-light'
                            : 'text-frc-text-dim hover:text-frc-text hover:bg-frc-void-light'
                        }`}
                        role="menuitem"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={`more:${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2 text-sm text-frc-text-dim hover:text-frc-text hover:bg-frc-void-light transition-colors"
                        role="menuitem"
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </nav>

        {/* Utility cluster */}
        <div className="flex items-center gap-3 shrink-0">
          <SearchTrigger />
          <span className="h-4 w-px bg-frc-blue/70" aria-hidden="true" />
          <LanguageSelector />
          <span className="h-4 w-px bg-frc-blue/70 hidden sm:block" aria-hidden="true" />
          <div className="hidden sm:flex items-center">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-frc-text-dim hover:text-frc-gold transition-colors w-10 h-10 inline-flex items-center justify-center -me-2"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="frc-mobile-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuRendered ? (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className={`absolute inset-0 bg-frc-void/85 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
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
            className={`absolute top-0 ${isRTL ? 'left-0 border-r' : 'right-0 border-l'} h-full w-[85vw] max-w-sm bg-frc-void border-frc-blue flex flex-col transform transition-transform duration-200 motion-reduce:transition-none ${
              isMobileMenuVisible
                ? 'translate-x-0'
                : isRTL
                  ? '-translate-x-full'
                  : 'translate-x-full'
            } pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
          >
            <div className="px-5 py-4 border-b border-frc-blue flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandMark alt="FRC" width={26} height={26} className="opacity-90" />
                <span className="text-frc-gold text-base font-semibold tracking-tight">FRC</span>
              </div>

              <button
                type="button"
                ref={closeButtonRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-frc-text-dim hover:text-frc-gold transition-colors w-10 h-10 inline-flex items-center justify-center -me-2"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-5 overflow-y-auto flex-1 overscroll-contain">
              <div className="divide-y divide-frc-blue/60">
                {mobileGroups.map((group) => (
                  <details
                    key={group.id}
                    open={!!mobileGroupOpen[group.id]}
                    onToggle={(e) => {
                      const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                      setMobileGroupOpen((prev) => ({ ...prev, [group.id]: isOpen }));
                    }}
                    className="group py-3 first:pt-0"
                  >
                    <summary
                      className="py-1.5 cursor-pointer select-none list-none flex items-center justify-between gap-3"
                      aria-label={`${mobileGroupOpen[group.id] ? g.close : g.open}: ${group.label}`}
                    >
                      <span className="text-sm font-medium text-frc-text">{group.label}</span>
                      <svg
                        className="w-4 h-4 text-frc-steel transition-transform motion-reduce:transition-none group-open:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>

                    <nav className="pt-2 pb-1 space-y-1">
                      {group.links.map((link) =>
                        'path' in link ? (
                          <Link
                            key={`${group.id}:${link.path}`}
                            href={`${basePath}${link.path}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block py-2 text-sm transition-colors ${
                              isActivePath(link.path) ? 'text-frc-gold font-medium' : 'text-frc-text-dim hover:text-frc-text'
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
                            className="block py-2 text-sm text-frc-text-dim hover:text-frc-text transition-colors"
                          >
                            {link.label}
                          </a>
                        ),
                      )}
                    </nav>
                  </details>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-frc-blue flex items-center justify-between">
                <span className="text-sm text-frc-text-dim">{g.settings}</span>
                <div className="flex items-center gap-3">
                  <LanguageSelector />
                  <span className="h-4 w-px bg-frc-blue" aria-hidden="true" />
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-frc-blue">
                <a
                  href="https://orcid.org/0009-0004-7412-5129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-frc-text-dim hover:text-frc-gold py-1 transition-colors"
                >
                  ORCID: 0009-0004-7412-5129
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
