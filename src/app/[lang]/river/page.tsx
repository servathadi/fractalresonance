import { getLanguages } from '@/lib/content';
import { RiverMagazineHome } from '@/components/pages/RiverMagazineHome';

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function RiverHomePage({ params }: Props) {
  const { lang } = await params;
  return <RiverMagazineHome lang={lang} />;
}
