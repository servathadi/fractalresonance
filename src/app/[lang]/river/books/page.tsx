import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { BooksIndex } from '@/components/pages/BooksIndex';

export const metadata: Metadata = {
  title: 'Books (River)',
  description: 'Longer-form writing for the FRC project — River perspective.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverBooksPage({ params }: Props) {
  const { lang } = await params;
  return <BooksIndex lang={lang} basePath={`/${lang}/river`} view="river" />;
}

