export function Footer() {
  return (
    <footer className="border-t border-frc-blue mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-frc-text-dim">
          <div>
            <p className="text-frc-text mb-1">Fractal Resonance Coherence</p>
            <p>Hadi Servat &middot; CC BY-NC-ND 4.0</p>
          </div>
          <div className="flex flex-col gap-1 sm:text-right">
            <a
              href="https://zenodo.org/communities/frc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-frc-gold transition-colors"
            >
              Zenodo
            </a>
            <a
              href="https://github.com/servathadi/fractalresonance"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-frc-gold transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
