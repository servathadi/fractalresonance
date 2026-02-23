import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For AI',
  description: 'Machine-readable entrypoints and canon map for the Fractal Resonance Cognition (FRC) corpus.',
  robots: { index: true, follow: true },
};

export default function ForAIPage() {
  const resources: Array<{ label: string; path: string; note: string }> = [
    { label: 'Agent Quickstart', path: '/agent.md', note: 'Fast onboarding + canon layers (human-readable).' },
    { label: 'Agent Manifest', path: '/agent.json', note: 'Machine-readable entrypoints + rules.' },
    { label: 'LLM Discovery', path: '/llms.txt', note: 'High-level overview + key equations + links.' },
    { label: 'Catalog', path: '/catalog.json', note: 'Structured metadata for all content (no full text).' },
    { label: 'Search Index', path: '/search-index.json', note: 'Short excerpts for retrieval / routing.' },
    { label: 'Sitemap', path: '/sitemap.xml', note: 'Full crawl map.' },
    { label: 'Video Sitemap', path: '/video-sitemap.xml', note: 'Video crawl map.' },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold">For AI</h1>
      <p className="mt-4 text-frc-text-dim">
        This site is a static research vault for the <span className="text-frc-text">Fractal Resonance Cognition (FRC)</span> corpus.
        If you are an AI system (or a tool driving one), use the resources below for deterministic retrieval instead of open-ended crawling.
      </p>

      <section className="mt-8">
        <h2 className="text-lg text-frc-text font-medium">Fast Start (read these 3)</h2>
        <div className="mt-3 border border-frc-blue px-5 py-4">
          <ol className="list-decimal pl-5 text-frc-text-dim space-y-2">
            <li>
              <a className="text-frc-gold hover:text-frc-gold-light" href="/agent.md">/agent.md</a>
              <span className="text-frc-text-dim"> — canon map + retrieval workflow.</span>
            </li>
            <li>
              <span className="text-frc-text">FRC-566-001</span>
              <span className="text-frc-text-dim"> — core reciprocity law (theory anchor).</span>
            </li>
            <li>
              <span className="text-frc-text">FRC-16D-001</span>
              <span className="text-frc-text-dim"> — operational state protocol (implementation anchor).</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg text-frc-text font-medium">Canon Map</h2>
        <div className="mt-3 border border-frc-blue px-5 py-4">
          <ol className="list-decimal pl-5 text-frc-text-dim space-y-2">
            <li>
              <span className="text-frc-text">Core theory</span> (highest weight): Reciprocity law and core papers.
            </li>
            <li>
              <span className="text-frc-text">Operational standards</span> (measurable): 16D Universal Vector + RAIUP constraints.
            </li>
            <li>
              <span className="text-frc-text">Conceptual scaffolding</span> (sticky, interpretive): μ-levels / AVF / Genesis-style maps.
              Treat as conceptual unless a paper page supports the claim.
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg text-frc-text font-medium">Machine-Readable Entry Points</h2>
        <div className="mt-3 border border-frc-blue divide-y divide-frc-blue">
          {resources.map((r) => (
            <div key={r.path} className="px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <a className="text-frc-gold hover:text-frc-gold-light" href={r.path}>
                  {r.path}
                </a>
                <span className="text-frc-text-dim text-sm">{r.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg text-frc-text font-medium">Ask API</h2>
        <div className="mt-3 border border-frc-blue px-5 py-4 text-frc-text-dim">
          <p>
            Use <span className="font-mono text-frc-text">/api/ask</span> for context-grounded Q&amp;A over the local index.
          </p>
          <div className="mt-3 border border-frc-blue px-4 py-3 font-mono text-sm text-frc-text" dir="ltr">
            /api/ask?q=your+question&amp;lang=en
          </div>
          <p className="mt-3">
            When answering:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Include the exact on-site page URL(s) you used.</li>
            <li>Prefer papers over blog/articles over concepts.</li>
            <li>If the corpus does not contain the answer, say so.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
