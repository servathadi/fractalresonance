import Link from 'next/link';
import { getPapers, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { PapersGridClient, type PapersGridItem } from '@/components/pages/PapersGridClient';

// Paper DOIs for Zenodo links
const PAPER_DOIS: Record<string, string> = {
  'FRC-100-001': '10.5281/zenodo.15073056',
  'FRC-100-002': '10.5281/zenodo.15079278',
  'FRC-100-003': '10.5281/zenodo.15079820',
  'FRC-100-004': '10.5281/zenodo.17438174',
  'FRC-100-005': '10.5281/zenodo.17438231',
  'FRC-100-006': '10.5281/zenodo.17438360',
  'FRC-100-007': '10.5281/zenodo.17968952',
  'FRC-100-010': '10.5281/zenodo.17982555',
  'FRC-566-001': '10.5281/zenodo.17437759',
};

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'Papers',
    desc: 'Published research on the Fractal Resonance Cognition framework. All papers are available on',
    zenodoLink: 'Zenodo',
    underLicense: 'under CC BY-NC-ND 4.0.',
    noPapers: 'No papers are published in this perspective yet.',
    switchView: 'For the full technical library, switch to Kasra.',
    catalogTitle: 'Full Catalog (Zenodo)',
    catalogDesc: 'All published papers with DOI links. Papers marked with a link icon have full text on this site.',
  },
  fa: {
    title: 'مقاله‌ها',
    desc: 'تحقیقات منتشر شده در مورد چارچوب همدوسی رزونانس فراکتال. تمام مقالات در',
    zenodoLink: 'Zenodo',
    underLicense: 'تحت مجوز CC BY-NC-ND 4.0 موجود هستند.',
    noPapers: 'هنوز مقاله‌ای در این دیدگاه منتشر نشده است.',
    switchView: 'برای کتابخانه فنی کامل، به حالت کسرا بروید.',
    catalogTitle: 'کاتالوگ کامل (Zenodo)',
    catalogDesc: 'تمام مقالات منتشر شده با پیوندهای DOI. مقالاتی که با نماد پیوند مشخص شده‌اند، دارای متن کامل در این سایت هستند.',
  },
  es: {
    title: 'Artículos',
    desc: 'Investigación publicada sobre el marco de Coherencia de Resonancia Fractal. Todos los artículos están disponibles en',
    zenodoLink: 'Zenodo',
    underLicense: 'bajo CC BY-NC-ND 4.0.',
    noPapers: 'Aún no hay artículos publicados en esta perspectiva.',
    switchView: 'Para la biblioteca técnica completa, cambie a Kasra.',
    catalogTitle: 'Catálogo Completo (Zenodo)',
    catalogDesc: 'Todos los artículos publicados con enlaces DOI. Los artículos marcados con un icono de enlace tienen texto completo en este sitio.',
  },
  fr: {
    title: 'Papiers',
    desc: 'Recherche publiée sur le cadre de la Cohérence de Résonance Fractale. Tous les articles sont disponibles sur',
    zenodoLink: 'Zenodo',
    underLicense: 'sous CC BY-NC-ND 4.0.',
    noPapers: 'Aucun article publié dans cette perspective pour l\'instant.',
    switchView: 'Pour la bibliothèque technique complète, passez à Kasra.',
    catalogTitle: 'Catalogue Complet (Zenodo)',
    catalogDesc: 'Tous les articles publiés avec des liens DOI. Les articles marqués d\'une icône de lien ont un texte intégral sur ce site.',
  },
};

export function PapersIndex({
  lang,
  basePath,
  view,
  showZenodoCatalog = true,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  showZenodoCatalog?: boolean;
  embedded?: boolean;
}) {
  const papers = getPapers(lang).filter((p) => matchesPerspectiveView(p.frontmatter.perspective, view));
  const t = DICT[lang] || DICT['en'];

  const items: PapersGridItem[] = papers.map((paper) => {
    const fm = paper.frontmatter;
    const id = fm.id;
    const doi = PAPER_DOIS[id];
    const series: PapersGridItem['series'] =
      id?.startsWith('FRC-100') ? '100'
      : id?.startsWith('FRC-566') ? '566'
      : id?.startsWith('FRC-8') ? '800'
      : 'other';

    return {
      id,
      title: fm.title,
      abstract: fm.abstract,
      date: fm.date,
      href: `${basePath}/papers/${id}`,
      tags: fm.tags || [],
      series,
      doiSuffix: doi ? doi.split('/').pop() : undefined,
    };
  });

  const content = (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{t.title}</h1>
        <p className="text-frc-text-dim">
          {t.desc}{' '}
          <a href="https://zenodo.org" target="_blank" rel="noopener noreferrer" className="text-frc-gold hover:underline">
            {t.zenodoLink}
          </a>{' '}
          {t.underLicense}
        </p>
      </header>

      {papers.length === 0 && (
        <section className="mb-12 border border-frc-blue rounded-lg p-6">
          <p className="text-frc-text-dim text-sm">
            {t.noPapers}
          </p>
          <p className="text-frc-steel text-xs mt-2">
            {t.switchView}
          </p>
        </section>
      )}

      {papers.length > 0 && <PapersGridClient items={items} lang={lang} />}

      {showZenodoCatalog && (
        <section className="mt-16 border-t border-frc-blue pt-8">
          <h2 className="text-lg text-frc-text font-medium mb-4">{t.catalogTitle}</h2>
          <p className="text-frc-text-dim text-sm mb-6">
            {t.catalogDesc}
          </p>
          <div className="space-y-3">
            {Object.entries(PAPER_DOIS).map(([id, doi]) => {
              const hasFull = papers.some(p => p.frontmatter.id === id);
              return (
                <div key={id} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-frc-gold shrink-0">{id.replace('FRC-', '')}</span>
                  <div className="flex-1 flex items-center gap-2">
                    {hasFull ? (
                      <Link href={`${basePath}/papers/${id}`} className="text-frc-text hover:text-frc-gold transition-colors">
                        {papers.find(p => p.frontmatter.id === id)?.frontmatter.title || id}
                      </Link>
                    ) : (
                      <span className="text-frc-text-dim">
                        {id}
                      </span>
                    )}
                    <a
                      href={`https://zenodo.org/doi/${doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-frc-steel hover:text-frc-gold transition-colors font-mono shrink-0"
                    >
                      DOI
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
