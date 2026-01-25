import { getLanguages } from '@/lib/content';
import { HomeHub } from '@/components/pages/HomeHub';

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverHomePage({ params }: Props) {
  const { lang } = await params;
  return <HomeHub lang={lang} view="river" />;
}

