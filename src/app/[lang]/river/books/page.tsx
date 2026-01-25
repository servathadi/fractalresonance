import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { BooksIndex } from '@/components/pages/BooksIndex';
import { BooksSidebar } from '@/components/BooksSidebar';

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
  const basePath = `/${lang}/river`;
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <BooksSidebar lang={lang} basePath={basePath} view="river" variant="mobile" />
      <BooksSidebar lang={lang} basePath={basePath} view="river" />
      <div className="flex-1 min-w-0">
        <BooksIndex lang={lang} basePath={basePath} view="river" embedded />
      </div>
    </main>
  );
}
