import type { Metadata } from 'next';
import { getLanguages, getBlogPosts, matchesPerspectiveView } from '@/lib/content';
import { BlogIndex } from '@/components/pages/BlogIndex';
import { BlogSidebar } from '@/components/BlogSidebar';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Down-to-earth notes and field reports from the Fractal Resonance Cognition project.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

  const posts = getBlogPosts(lang).filter(p => matchesPerspectiveView(p.frontmatter.perspective, 'kasra'));
  const items: ListItemMeta[] = posts.map(p => ({
    name: p.frontmatter.title,
    url: `${basePath}/blog/${p.frontmatter.id}`,
    description: p.frontmatter.abstract,
  }));

  const collectionSchema = schemaCollectionPage(
    'FRC Blog',
    'Down-to-earth notes and field reports from the Fractal Resonance Cognition project.',
    `https://fractalresonance.com${basePath}/blog`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="min-h-screen flex flex-col lg:flex-row">
        <BlogSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
        <BlogSidebar lang={lang} basePath={basePath} view="kasra" />
        <div className="flex-1 min-w-0">
          <BlogIndex lang={lang} basePath={basePath} view="kasra" embedded />
        </div>
      </main>
    </>
  );
}

