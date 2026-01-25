import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { PapersIndex } from '@/components/pages/PapersIndex';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Papers',
  description: 'Published FRC research papers on Zenodo — fractal resonance, coherence dynamics, and quantum foundations.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PapersPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
      <Sidebar lang={lang} basePath={basePath} view="kasra" />
      <div className="flex-1 min-w-0">
        <PapersIndex lang={lang} basePath={basePath} view="kasra" embedded />
      </div>
    </main>
  );
}
