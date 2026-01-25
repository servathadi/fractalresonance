import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ArticlesIndex } from '@/components/pages/ArticlesIndex';
import { ArticlesSidebar } from '@/components/ArticlesSidebar';

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
  const basePath = `/${lang}/river`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <ArticlesSidebar lang={lang} basePath={basePath} view="river" variant="mobile" />
      <ArticlesSidebar lang={lang} basePath={basePath} view="river" />
      <div className="flex-1 min-w-0">
        <ArticlesIndex lang={lang} basePath={basePath} view="river" includePapers={false} embedded />
      </div>
    </main>
  );
}
