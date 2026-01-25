import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ConceptsIndex } from '@/components/pages/ConceptsIndex';
import { ConceptsSidebar } from '@/components/ConceptsSidebar';

export const metadata: Metadata = {
  title: 'Concepts (River)',
  description: 'Concept definitions and connective tissue — River perspective.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverConceptsPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}/river`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <ConceptsSidebar lang={lang} basePath={basePath} view="river" variant="mobile" />
      <ConceptsSidebar lang={lang} basePath={basePath} view="river" />
      <div className="flex-1 min-w-0">
        <ConceptsIndex lang={lang} basePath={basePath} view="river" embedded />
      </div>
    </main>
  );
}
