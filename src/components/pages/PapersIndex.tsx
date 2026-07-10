import Link from 'next/link';
import { Suspense } from 'react';
import {
  getPaperCanonStatus,
  getPapers,
  isPaperCatalogEntry,
  isRevisionPendingPaper,
  matchesPerspectiveView,
  sortPapersForLibrary,
  type PerspectiveView,
} from '@/lib/content';
import { PapersGridClient, type PapersGridItem } from '@/components/pages/PapersGridClient';
import { TaxonomyLink } from '@/components/TaxonomyLink';

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'Papers',
    desc: 'Published research in the living Fractal Resonance Coherence program. Versioned records are available on',
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
  const papers = sortPapersForLibrary(
    getPapers(lang).filter(
      (paper) => isPaperCatalogEntry(paper.frontmatter)
        && matchesPerspectiveView(paper.frontmatter.perspective, view),
    ),
  );
  const t = DICT[lang] || DICT['en'];

  const items: PapersGridItem[] = papers.map((paper) => {
    const fm = paper.frontmatter;
    const id = fm.id;
    const series: PapersGridItem['series'] =
      id?.startsWith('FRC-100') ? '100'
      : id?.startsWith('FRC-566') ? '566'
      : id?.startsWith('FRC-700') ? '700'
      : id?.startsWith('FRC-8') ? '800'
      : 'other';

    return {
      id,
      title: fm.title,
      abstract: fm.abstract,
      date: fm.date,
      href: `${basePath}/papers/${id}`,
      tags: Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === 'string') : [],
      series,
      doi: fm.doi,
      conceptDoi: fm.conceptDoi,
      canonStatus: getPaperCanonStatus(fm),
      revisionPending: isRevisionPendingPaper(id) || fm.publicationState?.toLowerCase() === 'revision pending',
      muLevel: fm.muLevel,
      tier: fm.tier as PapersGridItem['tier'],
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
        <div className="flex flex-wrap gap-2 mt-5">
          <TaxonomyLink taxon="frc-100" basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
          <TaxonomyLink taxon="frc-566" basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
          <TaxonomyLink taxon="frc-700" basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
          <TaxonomyLink taxon="frc-800" basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
        </div>
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

      {papers.length > 0 && (
        <Suspense fallback={<div className="min-h-48" aria-busy="true" />}>
          <PapersGridClient items={items} lang={lang} />
        </Suspense>
      )}

      {showZenodoCatalog && (
        <section className="mt-16 border-t border-frc-blue pt-8">
          <h2 className="text-lg text-frc-text font-medium mb-4">{t.catalogTitle}</h2>
          <p className="text-frc-text-dim text-sm mb-6">
            {t.catalogDesc}
          </p>
          <div className="space-y-3">
            {papers.map((paper) => {
              const { id, title, conceptDoi, doi } = paper.frontmatter;
              const resolvedDoi = conceptDoi || doi;
              if (!resolvedDoi) return null;
              return (
                <div key={id} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-frc-gold shrink-0">{id.replace('FRC-', '')}</span>
                  <div className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <Link href={`${basePath}/papers/${id}`} className="text-frc-text hover:text-frc-gold transition-colors">
                      {title || id}
                    </Link>
                    <a
                      href={`https://doi.org/${resolvedDoi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-frc-steel hover:text-frc-gold transition-colors font-mono break-all"
                    >
                      {conceptDoi ? 'Concept DOI' : 'DOI'}
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
