import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ArticlesIndex } from '@/components/pages/ArticlesIndex';
import { ArticlesSidebar } from '@/components/ArticlesSidebar';

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
  const basePath = `/${lang}`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <ArticlesSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
      <ArticlesSidebar lang={lang} basePath={basePath} view="kasra" />
      <div className="flex-1 min-w-0">
        <ArticlesIndex lang={lang} basePath={basePath} view="kasra" includePapers={false} embedded />
      </div>
    </main>
  );
}
