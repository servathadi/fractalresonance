import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { PapersIndex } from '@/components/pages/PapersIndex';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Papers (River)',
  description: 'Published FRC research papers — River perspective.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverPapersPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}/river`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar lang={lang} basePath={basePath} view="river" variant="mobile" />
      <Sidebar lang={lang} basePath={basePath} view="river" />
      <div className="flex-1 min-w-0">
        <PapersIndex lang={lang} basePath={basePath} view="river" showZenodoCatalog={false} embedded />
      </div>
    </main>
  );
}
