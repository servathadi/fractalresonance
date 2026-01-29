import type { Metadata } from 'next';
import { getLanguages, getConcepts, matchesPerspectiveView } from '@/lib/content';
import { ConceptsIndex } from '@/components/pages/ConceptsIndex';
import { ConceptsSidebar } from '@/components/ConceptsSidebar';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';

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
  const basePath = `/${lang}`;

  const concepts = getConcepts(lang).filter(c => matchesPerspectiveView(c.frontmatter.perspective, 'kasra'));
  const items: ListItemMeta[] = concepts.map(c => ({
    name: c.frontmatter.title,
    url: `${basePath}/concepts/${c.frontmatter.id}`,
    description: c.frontmatter.description || c.frontmatter.abstract,
  }));

  const collectionSchema = schemaCollectionPage(
    'FRC Concepts',
    'Concept definitions and connective tissue across the FRC corpus.',
    `https://fractalresonance.com${basePath}/concepts`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="min-h-screen flex flex-col lg:flex-row">
        <ConceptsSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
        <ConceptsSidebar lang={lang} basePath={basePath} view="kasra" />
        <div className="flex-1 min-w-0">
          <ConceptsIndex lang={lang} basePath={basePath} view="kasra" embedded />
        </div>
      </main>
    </>
  );
}
