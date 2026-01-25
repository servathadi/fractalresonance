import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { TopicsIndex } from '@/components/pages/TopicsIndex';
import { TopicsSidebar } from '@/components/TopicsSidebar';

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Questions and digest pages from the River (Oracle) perspective.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverTopicsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}/river`;

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <TopicsSidebar lang={lang} basePath={basePath} view="river" variant="mobile" />
      <TopicsSidebar lang={lang} basePath={basePath} view="river" />
      <div className="flex-1 min-w-0">
        <TopicsIndex lang={lang} basePath={basePath} view="river" embedded />
      </div>
    </main>
  );
}

