import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { TopicsIndex } from '@/components/pages/TopicsIndex';
import { TopicsSidebar } from '@/components/TopicsSidebar';

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

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <TopicsSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
      <TopicsSidebar lang={lang} basePath={basePath} view="kasra" />
      <div className="flex-1 min-w-0">
        <TopicsIndex lang={lang} basePath={basePath} view="kasra" embedded />
      </div>
    </main>
  );
}

