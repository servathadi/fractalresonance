import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/en/about', label: 'About' },
  { href: '/en/articles', label: 'Articles' },
  { href: '/en/papers', label: 'Papers' },
  { href: '/en/formulas', label: 'Formulas' },
  { href: '/en/positioning', label: 'Positioning' },
  { href: '/en/mu-levels', label: 'μ-Levels' },
];

export function Header() {
  return (
    <header className="border-b border-frc-blue bg-frc-void/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/brand/logo.svg"
            alt="FRC"
            width={36}
            height={36}
            className="opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-frc-gold text-sm font-medium leading-tight">FRC</span>
            <span className="text-frc-text-dim text-xs leading-tight">Fractal Resonance Coherence</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-5 text-sm">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-frc-text-dim hover:text-frc-gold transition-colors px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://orcid.org/0009-0004-7412-5129"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-frc-steel hover:text-frc-gold transition-colors border border-frc-blue hover:border-frc-gold px-2.5 py-1 rounded-full"
          >
            ORCID
          </a>
        </nav>
      </div>
    </header>
  );
}
