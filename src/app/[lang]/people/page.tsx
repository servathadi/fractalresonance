import type { Metadata } from 'next';
import { getLanguages, getPeople, matchesPerspectiveView } from '@/lib/content';
import { PeopleIndex } from '@/components/pages/PeopleIndex';
import { PeopleSidebar } from '@/components/PeopleSidebar';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Voices',
  description: 'Site personas and contributors for the Fractal Resonance Cognition corpus.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PeoplePage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;

  const people = getPeople(lang).filter(p => matchesPerspectiveView(p.frontmatter.perspective, 'kasra'));
  const items: ListItemMeta[] = people.map(p => ({
    name: p.frontmatter.title,
    url: `${basePath}/people/${p.frontmatter.id}`,
    description: p.frontmatter.tagline || p.frontmatter.role,
  }));

  const collectionSchema = schemaCollectionPage(
    'FRC Voices',
    'Site personas and contributors for the Fractal Resonance Cognition corpus.',
    `https://fractalresonance.com${basePath}/people`,
    items,
    lang
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="min-h-screen flex flex-col lg:flex-row">
        <PeopleSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
        <PeopleSidebar lang={lang} basePath={basePath} view="kasra" />
        <div className="flex-1 min-w-0">
          <PeopleIndex lang={lang} basePath={basePath} view="kasra" embedded />
        </div>
      </main>
    </>
  );
}

