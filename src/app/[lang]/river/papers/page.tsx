import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { PapersIndex } from '@/components/pages/PapersIndex';

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
  return <PapersIndex lang={lang} basePath={`/${lang}/river`} view="river" />;
}

