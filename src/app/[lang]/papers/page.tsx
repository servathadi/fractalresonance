import type { Metadata } from 'next';
import { getLanguages, getPapers, matchesPerspectiveView } from '@/lib/content';
import { PapersIndex } from '@/components/pages/PapersIndex';
import { Sidebar } from '@/components/Sidebar';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Papers',
  description: 'Published FRC research papers on Zenodo — fractal resonance, coherence dynamics, and quantum foundations.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PapersPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

  // Build collection items for schema
  const papers = getPapers(lang).filter(p => matchesPerspectiveView(p.frontmatter.perspective, 'kasra'));
  const items: ListItemMeta[] = papers.map(p => ({
    name: p.frontmatter.title,
    url: `${basePath}/papers/${p.frontmatter.id}`,
    description: p.frontmatter.abstract,
  }));

  const collectionSchema = schemaCollectionPage(
    'FRC Research Papers',
    'Published FRC research papers on Zenodo — fractal resonance, coherence dynamics, and quantum foundations.',
    `https://fractalresonance.com${basePath}/papers`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="min-h-screen flex flex-col lg:flex-row">
        <Sidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
        <Sidebar lang={lang} basePath={basePath} view="kasra" />
        <div className="flex-1 min-w-0">
          <PapersIndex lang={lang} basePath={basePath} view="kasra" embedded />
        </div>
      </main>
    </>
  );
}
