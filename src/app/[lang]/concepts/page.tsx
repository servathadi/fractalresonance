import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ConceptsIndex } from '@/components/pages/ConceptsIndex';
import { ConceptsSidebar } from '@/components/ConceptsSidebar';

export const metadata: Metadata = {
  title: 'Concepts',
  description: 'Concept definitions and connective tissue across the FRC corpus.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ConceptsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <ConceptsSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
      <ConceptsSidebar lang={lang} basePath={basePath} view="kasra" />
      <div className="flex-1 min-w-0">
        <ConceptsIndex lang={lang} basePath={basePath} view="kasra" embedded />
      </div>
    </main>
  );
}
