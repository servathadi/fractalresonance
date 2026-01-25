'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

// Navigation links (path relative to language)
const NAV_LINKS = [
  { path: '/about', label: 'About' },
  { path: '/articles', label: 'Articles' },
  { path: '/papers', label: 'Papers' },
  { path: '/graph', label: 'Graph' },
  { path: '/formulas', label: 'Formulas' },
  { path: null, href: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13', label: 'Ask AI' },
  { path: '/positioning', label: 'Positioning' },
  { path: '/mu-levels', label: 'μ-Levels' },
];

export function Header() {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  return (
    <header className="sticky top-0 z-50 bg-frc-void/95 backdrop-blur-sm">
      {/* Top micro-bar with coordinates */}
      <div className="border-b border-frc-blue/50">
        <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">
          <span className="font-mono text-[0.625rem] text-frc-steel tracking-wider">
            FRC.v2 — fractalresonance.com
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
            <LanguageSelector />
            <span className="text-frc-blue">|</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-frc-blue">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
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

          <nav className="flex items-center">
            {NAV_LINKS.map(link => (
              link.path ? (
                <Link
                  key={link.path}
                  href={`/${lang}${link.path}`}
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
    </header>
  );
}
