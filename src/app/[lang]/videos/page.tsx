import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Explainer Videos',
  description: 'Status-labeled FRC concept and paper explainer video program, linked to its source papers and evidence scope.',
};

const VIDEOS = [
  { id: 'FRC-CV-001', type: 'Concept', title: 'How to Read the FRC Corpus', status: 'Orientation', state: 'Generating', sources: ['FRC-100-000', 'FRC-100-100'] },
  { id: 'FRC-CV-002', type: 'Concept', title: 'Entropy-Coherence Reciprocity: Canonical Relation and Exact Scope', status: 'Canonical statement plus model-specific exact result', state: 'Generating', sources: ['FRC-566-001', 'FRC-566-030'] },
  { id: 'FRC-CV-003', type: 'Concept', title: 'Coherence in Chaos: What the Standard-Map Program Tests', status: 'Model-specific program with partial result and open gates', state: 'Generating', sources: ['FRC-100-002', 'FRC-100-002-001'] },
  { id: 'FRC-CV-004', type: 'Concept', title: 'Collapse as Open-System Phase-Locking', status: 'Candidate mechanism; core gates remain open', state: 'Generating', sources: ['FRC-100-003', 'FRC-100-007'] },
  { id: 'FRC-CV-005', type: 'Concept', title: 'Thermodynamic Boundary Tests', status: 'Model-specific negative result', state: 'Generating', sources: ['FRC-100-005', 'FRC-566-001'] },
  { id: 'FRC-CV-006', type: 'Concept', title: 'Operational Lambda Vocabulary', status: 'Operational framework; no fundamental field established', state: 'Generating', sources: ['FRC-787-787', 'FRC-100-008'] },
  { id: 'FRC-CV-007', type: 'Concept', title: 'Mu Registers and Declared Scope', status: 'Framework vocabulary', state: 'Generating', sources: ['FRC-700-777', 'FRC-100-100'] },
  { id: 'FRC-CV-008', type: 'Concept', title: 'AI Architecture Frontier', status: 'Frontier engineering material; not established physics', state: 'Generating', sources: ['FRC-840-101', 'FRC-841-004'] },
  { id: 'FRC-PV-001', type: 'Paper', title: 'FRC 100.002.001: Geometry Predicts the Structure Functional', status: 'Model-specific computational result', state: 'Generating', sources: ['FRC-100-002-001'] },
  { id: 'FRC-PV-002', type: 'Paper', title: 'FRC 566.030: The Exact von Mises Calculation', status: 'Exact result within a declared model family', state: 'Generating', sources: ['FRC-566-030'] },
  { id: 'FRC-PV-003', type: 'Paper', title: 'FRC 100.005: The Locking Boundary Experiment', status: 'Model-specific negative result', state: 'Generating', sources: ['FRC-100-005'] },
  { id: 'FRC-PV-004', type: 'Paper', title: 'FRC 100.007: Lambda Drift Audit', status: 'Audit with tested failures; not a universal no-go theorem', state: 'Generating', sources: ['FRC-100-007'] },
  { id: 'FRC-PV-005', type: 'Paper', title: 'FRC 787.787: Operational Flight Criteria', status: 'Frontier operational framework', state: 'Generating', sources: ['FRC-787-787'] },
  { id: 'FRC-PV-006', type: 'Paper', title: 'FRC 826.829: The Empirical Bridge', status: 'Frontier bridge program', state: 'Generating', sources: ['FRC-826-829'] },
];

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props { params: Promise<{ lang: string }> }

export default async function VideosPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const conceptVideos = VIDEOS.filter((video) => video.type === 'Concept');
  const paperVideos = VIDEOS.filter((video) => video.type === 'Paper');

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-frc-steel mb-3">FRC explanatory program</p>
        <h1 className="text-3xl font-light text-frc-gold mb-4">Status-Labeled Explainers</h1>
        <p className="text-frc-text-dim leading-relaxed">Each explainer is linked to its source papers and preserves their declared evidence status. “Generating” means the status-locked production brief has been submitted; it is not yet a published video or additional evidence.</p>
      </header>

      <VideoSection title="Concept Explainers" videos={conceptVideos} basePath={basePath} />
      <VideoSection title="Paper Explainers" videos={paperVideos} basePath={basePath} />

      <section className="border-t border-frc-blue pt-7 text-sm text-frc-text-dim max-w-3xl">
        <p>Read the numbered papers for derivations, data, and current scope. Explainers are navigational aids and will be versioned when published.</p>
      </section>
    </main>
  );
}

function VideoSection({ title, videos, basePath }: { title: string; videos: typeof VIDEOS; basePath: string }) {
  return (
    <section className="mb-12">
      <h2 className="text-xs uppercase tracking-widest text-frc-steel border-b border-frc-blue pb-3 mb-4">{title}</h2>
      <div className="grid gap-4">
        {videos.map((video) => (
          <article key={video.id} className="border border-frc-blue bg-frc-void-light px-5 py-4">
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[0.7rem] font-mono uppercase">
              <span className="text-frc-gold">{video.id}</span>
              <span className="text-frc-steel">{video.type}</span>
              <span className="border border-frc-blue px-2 py-0.5 text-frc-text-dim">{video.state}</span>
            </div>
            <h3 className="text-lg text-frc-text">{video.title}</h3>
            <p className="text-sm text-frc-text-dim mt-2">{video.status}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4 text-xs font-mono">
              {video.sources.map((source) => <Link key={source} href={`${basePath}/papers/${source}`} className="text-frc-gold hover:underline">{source.replace('FRC-', 'FRC ')}</Link>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
