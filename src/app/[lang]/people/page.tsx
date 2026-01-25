import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { PeopleIndex } from '@/components/pages/PeopleIndex';
import { PeopleSidebar } from '@/components/PeopleSidebar';

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

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <PeopleSidebar lang={lang} basePath={basePath} view="kasra" variant="mobile" />
      <PeopleSidebar lang={lang} basePath={basePath} view="kasra" />
      <div className="flex-1 min-w-0">
        <PeopleIndex lang={lang} basePath={basePath} view="kasra" embedded />
      </div>
    </main>
  );
}

