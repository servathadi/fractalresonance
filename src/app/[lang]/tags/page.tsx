import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentsByTag, getLanguages } from '@/lib/content';
import { TAXONOMY, type TaxonomyGroup, getTaxonomyLabel } from '@/lib/taxonomy';

const DICT: Record<string, {
  title: string;
  description: string;
  series: string;
  foundations: string;
  physics: string;
  computing: string;
  items: string;
}> = {
  en: { title: 'Corpus navigation', description: 'Stable cross-corpus routes. Series are derived from paper identifiers; subject pages preserve evidence status and version context.', series: 'Series', foundations: 'Foundations', physics: 'Physics and methods', computing: 'Computing and AI', items: 'items' },
  es: { title: 'Navegación del corpus', description: 'Rutas estables entre el corpus. Las series se derivan de los identificadores de los artículos; las páginas temáticas conservan el estado de evidencia y el contexto de versión.', series: 'Series', foundations: 'Fundamentos', physics: 'Física y métodos', computing: 'Computación e IA', items: 'elementos' },
  fr: { title: 'Navigation du corpus', description: 'Routes stables dans le corpus. Les séries sont dérivées des identifiants des articles; les pages thématiques conservent le statut de preuve et le contexte de version.', series: 'Séries', foundations: 'Fondements', physics: 'Physique et méthodes', computing: 'Calcul et IA', items: 'éléments' },
  fa: { title: 'ناوبری پیکره', description: 'مسیرهای پایدار در سراسر پیکره. سری‌ها از شناسه‌های مقاله مشتق می‌شوند؛ صفحه‌های موضوعی وضعیت شواهد و زمینه نسخه را حفظ می‌کنند.', series: 'سری‌ها', foundations: 'بنیادها', physics: 'فیزیک و روش‌ها', computing: 'محاسبات و هوش مصنوعی', items: 'مورد' },
};

const GROUP_ORDER: TaxonomyGroup[] = ['series', 'foundations', 'physics', 'computing'];

export const metadata: Metadata = {
  title: 'Corpus navigation',
  description: 'Stable, evidence-aware navigation across the Fractal Resonance Coherence corpus.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default async function TagsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = DICT[lang] || DICT.en;
  const basePath = `/${lang}`;
  const entries = TAXONOMY
    .map((entry) => ({ entry, count: getContentsByTag(lang, entry.slug).length }))
    .filter(({ count }) => count > 0);

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <header className="mb-12 border-b border-frc-blue pb-8">
        <nav className="flex items-center gap-2 text-sm text-frc-text-dim mb-5" aria-label="Breadcrumb">
          <Link href={basePath} className="hover:text-frc-gold">FRC</Link>
          <span>/</span>
          <span className="text-frc-text">{t.title}</span>
        </nav>
        <h1 className="text-3xl font-light text-frc-gold mb-4">{t.title}</h1>
        <p className="max-w-3xl text-frc-text-dim leading-relaxed">{t.description}</p>
      </header>

      <div className="space-y-10">
        {GROUP_ORDER.map((group) => {
          const groupEntries = entries.filter(({ entry }) => entry.group === group);
          if (groupEntries.length === 0) return null;
          return (
            <section key={group} aria-labelledby={`taxonomy-${group}`}>
              <h2 id={`taxonomy-${group}`} className="text-xs uppercase tracking-widest text-frc-steel mb-4">{t[group]}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {groupEntries.map(({ entry, count }) => (
                  <Link key={entry.slug} href={`${basePath}/tags/${entry.slug}`} className="border border-frc-blue bg-frc-void-light px-5 py-4 hover:border-frc-gold transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-frc-text group-hover:text-frc-gold transition-colors font-medium">{getTaxonomyLabel(entry.slug, lang)}</h3>
                        {entry.descriptions?.[lang] || entry.descriptions?.en ? (
                          <p className="mt-2 text-sm text-frc-text-dim leading-relaxed line-clamp-2">{entry.descriptions?.[lang] || entry.descriptions?.en}</p>
                        ) : null}
                      </div>
                      <span className="font-mono text-[0.72rem] text-frc-steel shrink-0">{count} {t.items}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
