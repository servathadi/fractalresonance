import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { BlogIndex } from '@/components/pages/BlogIndex';
import { BlogSidebar } from '@/components/BlogSidebar';

export const metadata: Metadata = {
  title: 'Blog (River)',
  description: 'Down-to-earth notes — River perspective.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverBlogPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}/river`;

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <BlogSidebar lang={lang} basePath={basePath} view="river" variant="mobile" />
      <BlogSidebar lang={lang} basePath={basePath} view="river" />
      <div className="flex-1 min-w-0">
        <BlogIndex lang={lang} basePath={basePath} view="river" embedded />
      </div>
    </main>
  );
}

