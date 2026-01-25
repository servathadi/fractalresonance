import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ConceptsIndex } from '@/components/pages/ConceptsIndex';

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
  return <ConceptsIndex lang={lang} basePath={`/${lang}/river`} view="river" />;
}

