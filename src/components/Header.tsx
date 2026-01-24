import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="border-b border-frc-blue">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/brand/logo.svg" alt="FRC" width={24} height={24} className="opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="text-frc-text-dim text-sm hidden sm:inline group-hover:text-frc-text transition-colors">
            Fractal Resonance Coherence
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/en/papers" className="text-frc-text-dim hover:text-frc-gold transition-colors">
            Papers
          </Link>
          <Link href="/en/formulas" className="text-frc-text-dim hover:text-frc-gold transition-colors">
            Formulas
          </Link>
          <a
            href="https://orcid.org/0009-0004-7412-5129"
            target="_blank"
            rel="noopener noreferrer"
            className="text-frc-text-dim hover:text-frc-gold transition-colors"
          >
            ORCID
          </a>
        </nav>
      </div>
    </header>
  );
}
