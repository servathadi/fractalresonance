import Link from 'next/link';
import { getPapers } from '@/lib/content';

export default function Home() {
  const papers = getPapers('en');

  return (
    <main className="min-h-[80vh] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-light text-frc-gold mb-4">
            Fractal Resonance Coherence
          </h1>
          <p className="text-frc-text-dim text-lg mb-10">
            A theoretical framework exploring the reciprocal relationship between entropy
            and coherence across quantum, biological, and cosmological systems.
          </p>
          <div className="inline-block border border-frc-blue rounded-lg px-6 py-4 text-left font-mono text-sm mb-10">
            <p className="text-frc-text-dim mb-1">// Entropy–Coherence Reciprocity (FRC 566.001)</p>
            <p className="text-frc-text">
              dS + k<span className="text-frc-gold">*</span> d ln C = 0
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/en/papers"
              className="px-5 py-2.5 bg-frc-blue hover:bg-frc-blue-light text-frc-text text-sm rounded-lg transition-colors"
            >
              Read Papers
            </Link>
            <a
              href="https://orcid.org/0009-0004-7412-5129"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-frc-blue hover:border-frc-gold text-frc-text-dim hover:text-frc-gold text-sm rounded-lg transition-colors"
            >
              Author (ORCID)
            </a>
          </div>
        </div>
      </section>

      {/* Recent papers */}
      {papers.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg text-frc-text font-medium">Recent Papers</h2>
            <Link href="/en/papers" className="text-sm text-frc-text-dim hover:text-frc-gold transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-3">
            {papers.slice(-4).reverse().map(paper => {
              const fm = paper.frontmatter;
              return (
                <Link
                  key={fm.id}
                  href={`/en/papers/${fm.id}`}
                  className="block border border-frc-blue rounded-lg px-5 py-3.5 hover:border-frc-gold-light transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm truncate">
                        {fm.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-frc-text-dim">
                        <span className="font-mono">{fm.id}</span>
                        <span>{fm.date}</span>
                      </div>
                    </div>
                    <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Core equations */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-16">
        <h2 className="text-lg text-frc-text font-medium mb-6">Core Equations</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-frc-blue rounded-lg px-5 py-4">
            <h3 className="text-sm text-frc-text-dim mb-2">Coherence</h3>
            <p className="font-mono text-sm text-frc-text">
              C = (1/N) &Sigma;<sub>i&lt;j</sub> cos(&phi;<sub>i</sub> - &phi;<sub>j</sub>)
            </p>
          </div>
          <div className="border border-frc-blue rounded-lg px-5 py-4">
            <h3 className="text-sm text-frc-text-dim mb-2">Lambda Field</h3>
            <p className="font-mono text-sm text-frc-text">
              &Lambda;(x) &equiv; &Lambda;<sub>0</sub> ln C(x)
            </p>
          </div>
          <div className="border border-frc-blue rounded-lg px-5 py-4">
            <h3 className="text-sm text-frc-text-dim mb-2">Universal Coherence Condition</h3>
            <p className="font-mono text-sm text-frc-text">
              d&Lambda;/dt + &nabla;&middot;J<sub>&Lambda;</sub> = &sigma;<sub>&Lambda;</sub> - &gamma;<sub>&Lambda;</sub>
            </p>
          </div>
          <div className="border border-frc-blue rounded-lg px-5 py-4">
            <h3 className="text-sm text-frc-text-dim mb-2">Free Energy Relation</h3>
            <p className="font-mono text-sm text-frc-text">
              &Delta;G = &minus;k*T &Delta;ln C
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
