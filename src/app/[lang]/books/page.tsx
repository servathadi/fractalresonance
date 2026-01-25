import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { BooksIndex } from '@/components/pages/BooksIndex';
import { BooksSidebar } from '@/components/BooksSidebar';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Longer-form writing for the FRC project (primers, textbooks, and narrative frames).',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BooksPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <BooksSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
      <BooksSidebar lang={lang} basePath={basePath} view="kasra" />
      <div className="flex-1 min-w-0">
        <BooksIndex lang={lang} basePath={basePath} view="kasra" embedded />
      </div>
    </main>
  );
}
