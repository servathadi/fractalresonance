import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { OracleChat } from '@/components/OracleChat';

export const metadata: Metadata = {
  title: 'Corpus Search',
  description: 'Local, source-linked search over the published FRC corpus.',
};

export function generateStaticParams() { return getLanguages().map((lang) => ({ lang })); }

const DICT: Record<string, { title: string; subtitle: string; contract: string; items: string[]; back: string; machine: string }> = {
  en: { title: 'Corpus Search', subtitle: 'Search titles, FRC codes, abstracts, and indexed text.', contract: 'Search contract', items: ['Results come from the static published index.', 'Every result links to its source page.', 'The latest version under a declared concept DOI governs.', 'Absence from search is not evidence for or against a claim.'], back: 'Start here', machine: 'For AI systems' },
  es: { title: 'Búsqueda del corpus', subtitle: 'Busque títulos, códigos FRC, resúmenes y texto indexado.', contract: 'Contrato de búsqueda', items: ['Los resultados provienen del índice publicado.', 'Cada resultado enlaza su fuente.', 'Rige la última versión del DOI conceptual.', 'La ausencia no es evidencia a favor ni en contra.'], back: 'Empezar aquí', machine: 'Para sistemas de IA' },
  fr: { title: 'Recherche dans le corpus', subtitle: 'Recherchez titres, codes FRC, résumés et texte indexé.', contract: 'Contrat de recherche', items: ['Les résultats viennent de l’index publié.', 'Chaque résultat renvoie à sa source.', 'La dernière version du DOI conceptuel prévaut.', 'Une absence ne constitue pas une preuve.'], back: 'Commencer ici', machine: 'Pour les systèmes IA' },
  fa: { title: 'جستجوی پیکره', subtitle: 'جستجوی عنوان، کد FRC، چکیده و متن نمایه‌شده.', contract: 'قرارداد جستجو', items: ['نتایج از نمایه منتشرشده می‌آیند.', 'هر نتیجه به منبع پیوند دارد.', 'آخرین نسخه DOI مفهومی حاکم است.', 'نبودن در جستجو دلیل تأیید یا رد نیست.'], back: 'شروع از اینجا', machine: 'برای سامانه‌های هوش مصنوعی' },
};

interface Props { params: Promise<{ lang: string }> }

export default async function OraclePage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const t = DICT[lang] || DICT.en;
  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8"><Link href={basePath} className="hover:text-frc-gold">FRC</Link><span className="mx-2">/</span><span className="text-frc-text">{t.title}</span></nav>
      <header className="mb-8"><h1 className="text-3xl font-light text-frc-gold mb-3">{t.title}</h1><p className="text-frc-text-dim">{t.subtitle}</p></header>
      <OracleChat lang={lang} />
      <section className="border-t border-frc-blue mt-10 pt-8"><h2 className="text-xs text-frc-steel uppercase tracking-widest mb-4">{t.contract}</h2><ul className="grid sm:grid-cols-2 gap-3 text-sm text-frc-text-dim">{t.items.map((item) => <li key={item}>- {item}</li>)}</ul></section>
      <div className="flex flex-wrap gap-3 mt-10"><Link href={`${basePath}/start-here`} className="px-5 py-3 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm uppercase transition-colors">{t.back}</Link><Link href="/for-ai" className="px-5 py-3 border border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold text-sm uppercase transition-colors">{t.machine}</Link></div>
    </main>
  );
}
