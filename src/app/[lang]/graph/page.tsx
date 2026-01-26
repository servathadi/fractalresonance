import { getLanguages, getGraphData } from '@/lib/content';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neural Navigation',
  description: 'Interactive knowledge graph of the FRC framework.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

const DICT: Record<string, { title: string; desc: string }> = {
  en: { title: 'Neural Navigation', desc: 'Explore the connections between FRC papers and concepts. Nodes are sized by connectivity.' },
  fa: { title: 'ناوبری عصبی', desc: 'کاوش در ارتباطات بین مقالات و مفاهیم FRC. اندازه گره‌ها بر اساس اتصال تعیین می‌شود.' },
  es: { title: 'Navegación Neuronal', desc: 'Explore las conexiones entre artículos y conceptos de FRC. Los nodos se dimensionan por conectividad.' },
  fr: { title: 'Navigation Neurale', desc: 'Explorez les connexions entre les articles et les concepts FRC. Les nœuds sont dimensionnés par connectivité.' },
};

export default async function GraphPage({ params }: Props) {
  const { lang } = await params;
  const graphData = getGraphData(lang, 'kasra');
  const t = DICT[lang] || DICT['en'];

  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
        <header className="mb-8">
          <h1 className="text-3xl font-light text-frc-gold mb-2">{t.title}</h1>
          <p className="text-frc-text-dim">
            {t.desc}
          </p>
        </header>
        
        <div className="flex-1 min-h-[600px]">
          <KnowledgeGraph data={graphData} lang={lang} />
        </div>
      </div>
    </main>
  );
}
