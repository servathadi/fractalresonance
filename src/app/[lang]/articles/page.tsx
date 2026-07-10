import type { Metadata } from 'next';
import { getLanguages, getArticles, matchesPerspectiveView } from '@/lib/content';
import { ArticlesIndex } from '@/components/pages/ArticlesIndex';
import { ArticlesSidebar } from '@/components/ArticlesSidebar';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Research articles and commentary around the Fractal Resonance Coherence corpus.',
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

  const articles = getArticles(lang).filter(a => matchesPerspectiveView(a.frontmatter.perspective, 'kasra'));
  const items: ListItemMeta[] = articles.map(a => ({
    name: a.frontmatter.title,
    url: `${basePath}/articles/${a.frontmatter.id}`,
    description: a.frontmatter.abstract,
  }));

  const collectionSchema = schemaCollectionPage(
    'FRC Articles',
    'Research articles and commentary around the Fractal Resonance Coherence corpus.',
    `https://fractalresonance.com${basePath}/articles`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="min-h-screen flex flex-col lg:flex-row">
        <ArticlesSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
        <ArticlesSidebar lang={lang} basePath={basePath} view="kasra" />
        <div className="flex-1 min-w-0">
          <ArticlesIndex lang={lang} basePath={basePath} view="kasra" includePapers={false} embedded />
        </div>
      </main>
    </>
  );
}
