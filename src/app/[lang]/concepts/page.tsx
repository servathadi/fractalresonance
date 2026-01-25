import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { ConceptsIndex } from '@/components/pages/ConceptsIndex';

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
  return <ConceptsIndex lang={lang} basePath={`/${lang}`} view="kasra" />;
}

