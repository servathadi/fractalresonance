import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ArticlesIndex } from '@/components/pages/ArticlesIndex';

export const metadata: Metadata = {
  title: 'Articles (River)',
  description: 'Research articles and publications — River perspective.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverArticlesPage({ params }: Props) {
  const { lang } = await params;
  return <ArticlesIndex lang={lang} basePath={`/${lang}/river`} view="river" includePapers={false} />;
}
