import { getLanguages, getGraphData } from '@/lib/content';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neural Navigation (River)',
  description: 'Interactive knowledge graph of the FRC framework.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverGraphPage({ params }: Props) {
  const { lang } = await params;
  const graphData = getGraphData(lang, 'river');

  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
        <header className="mb-8">
          <h1 className="text-3xl font-light text-frc-gold mb-2">Neural Navigation</h1>
          <p className="text-frc-text-dim">
            River view includes the full corpus (Kasra + River). Nodes are sized by connectivity.
          </p>
        </header>

        <div className="flex-1 min-h-[600px]">
          <KnowledgeGraph data={graphData} lang={lang} />
        </div>
      </div>
    </main>
  );
}
