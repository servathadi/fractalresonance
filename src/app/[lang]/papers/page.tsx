import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { PapersIndex } from '@/components/pages/PapersIndex';

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
  return <PapersIndex lang={lang} basePath={`/${lang}`} view="kasra" />;
}
