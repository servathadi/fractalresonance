import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-frc-blue mt-auto">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/brand/sigil-64.png" alt="FRC" width={24} height={24} className="opacity-70" />
              <span className="text-frc-gold text-sm font-medium tracking-wide">
                Fractal Resonance Coherence
              </span>
            </div>
            <p className="text-frc-text-dim text-xs leading-relaxed max-w-sm mb-4">
              A theoretical physics framework proposing deterministic,
              self-similar dynamics governing complex systems from quantum
              substrate to cosmological scales.
            </p>
            <div className="flex items-center gap-4 text-xs text-frc-steel">
              <span>Hadi Servat</span>
              <span className="text-frc-blue">|</span>
              <span>CC BY-NC-ND 4.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">Navigate</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/en/about" className="text-frc-text-dim hover:text-frc-gold">About</Link>
              <Link href="/en/articles" className="text-frc-text-dim hover:text-frc-gold">Articles</Link>
              <Link href="/en/papers" className="text-frc-text-dim hover:text-frc-gold">Papers</Link>
              <Link href="/en/formulas" className="text-frc-text-dim hover:text-frc-gold">Formulas</Link>
              <Link href="/en/positioning" className="text-frc-text-dim hover:text-frc-gold">Positioning</Link>
              <Link href="/en/mu-levels" className="text-frc-text-dim hover:text-frc-gold">μ-Levels</Link>
            </div>
          </div>

          {/* External */}
          <div>
            <p className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">External</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://zenodo.org/communities/frc" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Zenodo
              </a>
              <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ORCID
              </a>
              <a href="https://www.researchgate.net/profile/Hadi-Servat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ResearchGate
              </a>
              <a href="https://independent.academia.edu/HadiServat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Academia.edu
              </a>
              <a href="https://github.com/servathadi/fractalresonance" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                GitHub
              </a>
              <a href="https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Ask AI (NotebookLM)
              </a>
              <Link href="/llms.txt" className="text-frc-text-dim hover:text-frc-gold">
                llms.txt
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-frc-blue/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-mono text-[0.5625rem] text-frc-steel tracking-wider">
            dS + k* d ln C = 0
          </span>
          <span className="font-mono text-[0.5625rem] text-frc-steel tracking-wider">
            FRC {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
