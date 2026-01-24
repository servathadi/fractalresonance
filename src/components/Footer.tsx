import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-frc-blue mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-frc-gold font-medium mb-3">Fractal Resonance Coherence</p>
            <p className="text-frc-text-dim text-xs leading-relaxed">
              A theoretical physics framework proposing deterministic,
              self-similar dynamics governing complex systems across fractal scales.
            </p>
            <p className="text-frc-steel text-xs mt-3">
              Hadi Servat &middot; CC BY-NC-ND 4.0
            </p>
          </div>
          <div>
            <p className="text-frc-text text-xs uppercase tracking-wider mb-3">Navigate</p>
            <div className="flex flex-col gap-2">
              <Link href="/en/about" className="text-frc-text-dim hover:text-frc-gold transition-colors">About</Link>
              <Link href="/en/articles" className="text-frc-text-dim hover:text-frc-gold transition-colors">Articles</Link>
              <Link href="/en/papers" className="text-frc-text-dim hover:text-frc-gold transition-colors">Papers</Link>
              <Link href="/en/formulas" className="text-frc-text-dim hover:text-frc-gold transition-colors">Formulas</Link>
              <Link href="/en/positioning" className="text-frc-text-dim hover:text-frc-gold transition-colors">Positioning</Link>
              <Link href="/en/mu-levels" className="text-frc-text-dim hover:text-frc-gold transition-colors">μ-Levels</Link>
            </div>
          </div>
          <div>
            <p className="text-frc-text text-xs uppercase tracking-wider mb-3">External</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://zenodo.org/communities/frc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frc-text-dim hover:text-frc-gold transition-colors"
              >
                Zenodo Community
              </a>
              <a
                href="https://orcid.org/0009-0004-7412-5129"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frc-text-dim hover:text-frc-gold transition-colors"
              >
                ORCID Profile
              </a>
              <a
                href="https://github.com/servathadi/fractalresonance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-frc-text-dim hover:text-frc-gold transition-colors"
              >
                GitHub
              </a>
              <Link href="/llms.txt" className="text-frc-text-dim hover:text-frc-gold transition-colors">
                For AI (llms.txt)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
