import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ArticlesIndex } from '@/components/pages/ArticlesIndex';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Research articles and publications on Fractal Resonance Cognition — exploring consciousness, entropy, and quantum foundations.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { lang } = await params;
  return <ArticlesIndex lang={lang} basePath={`/${lang}`} view="kasra" />;
}
