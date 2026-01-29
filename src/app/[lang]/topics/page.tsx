import type { Metadata } from 'next';
import { getLanguages, getTopics, matchesPerspectiveView } from '@/lib/content';
import { TopicsIndex } from '@/components/pages/TopicsIndex';
import { TopicsSidebar } from '@/components/TopicsSidebar';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Questions, summaries, and spectrum views across the Fractal Resonance Cognition corpus.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function TopicsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

  const topics = getTopics(lang).filter(t => matchesPerspectiveView(t.frontmatter.perspective, 'kasra'));
  const items: ListItemMeta[] = topics.map(t => ({
    name: t.frontmatter.title,
    url: `${basePath}/topics/${t.frontmatter.id}`,
    description: t.frontmatter.short_answer || t.frontmatter.question,
  }));

  const collectionSchema = schemaCollectionPage(
    'FRC Topics',
    'Questions, summaries, and spectrum views across the Fractal Resonance Cognition corpus.',
    `https://fractalresonance.com${basePath}/topics`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="min-h-screen flex flex-col lg:flex-row">
        <TopicsSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
        <TopicsSidebar lang={lang} basePath={basePath} view="kasra" />
        <div className="flex-1 min-w-0">
          <TopicsIndex lang={lang} basePath={basePath} view="kasra" embedded />
        </div>
      </main>
    </>
  );
}

