import Link from 'next/link';
import { Suspense } from 'react';
import {
  estimateReadTime,
  getArticles,
  getPapers,
  isCurrentReadingContent,
  matchesPerspectiveView,
  normalizeEdgeScopeTag,
  normalizePrimarySources,
  type ParsedContent,
  type PerspectiveView,
} from '@/lib/content';
import { ArticlesGridClient, type ArticlesGridItem } from '@/components/pages/ArticlesGridClient';
import { EdgeScopeBadge } from '@/components/EdgeScopeBadge';

const ARTICLE_EXTRAS: Record<string, { categoryKey: string; readTime?: string }> = {
  'FRC-566-001': { categoryKey: 'foundation' },
  'FRC-100-001': { categoryKey: 'coreTheory' },
};

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'Articles & Edge Dispatches',
    desc: 'Commentary, literature dispatches, and research notes around the Fractal Resonance Coherence corpus. Primary scientific claims and closed negative gates belong to the numbered papers and the Falsification Ledger.',
    canonHeading: 'Canonical technical claims live in /papers',
    canonDesc: 'Articles and Edge Dispatches carry explicit scope tags (Structural Analogy, Test Idea, Open Question, Counter-Evidence) and primary sources, and never supersede the numbered papers.',
    canonLink: 'Open version router (FRC 100.000)',
    ledgerLink: 'Falsification ledger',
    latest: 'Latest dispatch',
    read: 'Read',
    zenodoTitle: 'Complete paper catalog on Zenodo',
    zenodoDesc: 'Versioned preprints published with DOI under CC BY-NC-ND 4.0',
    viewZenodo: 'View on Zenodo',
    foundation: 'Foundation',
    coreTheory: 'Core theory',
    research: 'Commentary',
    readLabel: 'read',
    noArticles: 'No active commentary articles yet. Weekly FRC Edge Dispatches will appear here and in Field Notes.',
  },
  fa: {
    title: 'مقالات و گزارش‌های مرزی',
    desc: 'یادداشت‌ها، مرور ادبیات و تفسیرها پیرامون پیکره همدوسی رزونانس فراکتال. ادعاهای علمی اصلی در مقالات شماره‌گذاری‌شده و دفتر ابطال‌ها قرار دارند.',
    canonHeading: 'ادعاهای فنی اصلی در بخش مقالات قرار دارند',
    canonDesc: 'مقالات و گزارش‌های مرزی با برچسب دامنه صریح و منابع اصلی منتشر می‌شوند و جایگزین مقالات کانونیک نیستند.',
    canonLink: 'مطالعه نقشه نسخه‌ها (FRC 100.000)',
    ledgerLink: 'دفتر ابطال‌ها',
    latest: 'جدیدترین گزارش',
    read: 'مطالعه',
    zenodoTitle: 'کاتالوگ کامل مقالات در Zenodo',
    zenodoDesc: 'پیش‌چاپ‌های نسخه‌دار با DOI تحت مجوز CC BY-NC-ND 4.0',
    viewZenodo: 'مشاهده در Zenodo',
    foundation: 'بنیاد',
    coreTheory: 'نظریه اصلی',
    research: 'تفسیر',
    readLabel: 'مطالعه',
    noArticles: 'هنوز مقاله تفسیری فعالی منتشر نشده است.',
  },
  es: {
    title: 'Artículos y Edge Dispatches',
    desc: 'Comentarios, despachos de literatura y notas de investigación en torno al corpus FRC. Las afirmaciones científicas primarias pertenecen a los artículos numerados y al Registro de Falsaciones.',
    canonHeading: 'Las afirmaciones técnicas canónicas viven en /papers',
    canonDesc: 'Los artículos y despachos declaran su etiqueta de alcance y fuentes primarias, sin sustituir a los artículos numerados.',
    canonLink: 'Abrir mapa de versiones (FRC 100.000)',
    ledgerLink: 'Registro de falsaciones',
    latest: 'Última entrada',
    read: 'Leer',
    zenodoTitle: 'Catálogo completo en Zenodo',
    zenodoDesc: 'Preprints versionados con DOI bajo CC BY-NC-ND 4.0',
    viewZenodo: 'Ver en Zenodo',
    foundation: 'Fundación',
    coreTheory: 'Teoría central',
    research: 'Comentario',
    readLabel: 'de lectura',
    noArticles: 'Aún no hay artículos activos.',
  },
  fr: {
    title: 'Articles et Edge Dispatches',
    desc: 'Commentaires, dépêches bibliographiques et notes de recherche autour du corpus FRC. Les énoncés scientifiques primaires appartiennent aux articles numérotés et au Registre des Réfutations.',
    canonHeading: 'Les énoncés techniques canoniques figurent dans /papers',
    canonDesc: 'Les articles et dépêches portent une étiquette de portée explicite et leurs sources primaires, sans jamais remplacer les articles numérotés.',
    canonLink: 'Ouvrir le routeur de versions (FRC 100.000)',
    ledgerLink: 'Registre des réfutations',
    latest: 'Dernière publication',
    read: 'Lire',
    zenodoTitle: 'Catalogue complet sur Zenodo',
    zenodoDesc: 'Prépublications versionnées avec DOI sous CC BY-NC-ND 4.0',
    viewZenodo: 'Voir sur Zenodo',
    foundation: 'Fondation',
    coreTheory: 'Théorie centrale',
    research: 'Commentaire',
    readLabel: 'de lecture',
    noArticles: 'Aucun article actif pour le moment.',
  },
};

function getHref(basePath: string, isPaper: boolean, id: string): string {
  return `${basePath}/${isPaper ? 'papers' : 'articles'}/${id}`;
}

export function ArticlesIndex({
  lang,
  basePath,
  view,
  includePapers = true,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  includePapers?: boolean;
  embedded?: boolean;
}) {
  const t = DICT[lang] || DICT.en;
  const papers = includePapers
    ? getPapers(lang).filter((p) => isCurrentReadingContent('paper', p.frontmatter) && matchesPerspectiveView(p.frontmatter.perspective, view))
    : [];
  const articles = getArticles(lang).filter((a) => isCurrentReadingContent('article', a.frontmatter) && matchesPerspectiveView(a.frontmatter.perspective, view));
  const paperIds = new Set(papers.map((p) => p.frontmatter.id));

  const allContent = [...articles, ...papers].sort((a, b) => {
    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });

  const featured = allContent[0];
  const rest = allContent.slice(1);

  function extrasFor(item: ParsedContent) {
    const fm = item.frontmatter;
    const id = fm.id;
    const known = ARTICLE_EXTRAS[id];
    const categoryKey = known?.categoryKey || 'research';
    const category = t[categoryKey];
    const readTime = known?.readTime || fm.read_time || estimateReadTime(item.body);
    return { category, readTime };
  }

  const gridItems: ArticlesGridItem[] = rest.map((item, i) => {
    const fm = item.frontmatter;
    const isPaper = paperIds.has(fm.id);
    const extras = extrasFor(item);
    return {
      id: fm.id,
      title: fm.title,
      abstract: fm.abstract,
      date: fm.date,
      href: getHref(basePath, isPaper, fm.id),
      category: extras.category,
      scopeTag: normalizeEdgeScopeTag(fm.scopeTag),
      primarySourcesCount: normalizePrimarySources(fm.primarySources).length,
      tags: Array.isArray(fm.tags) ? fm.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      readTime: extras.readTime,
      ordinal: i + 2,
    };
  });

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
      <header className="mb-12 border-b border-frc-blue pb-8">
        <h1 className="text-3xl sm:text-4xl font-light text-frc-gold tracking-[-0.025em] leading-[1.12] mb-4">
          {t.title}
        </h1>
        <p className="text-base text-frc-text-dim max-w-[65ch] leading-relaxed">
          {t.desc}
        </p>
      </header>

      {/* Boundary note separating commentary from canonical /papers */}
      <section className="mb-12 border-s-2 border-frc-gold ps-5 py-1">
        <h2 className="text-base font-medium text-frc-text mb-1.5">{t.canonHeading}</h2>
        <p className="text-sm text-frc-text-dim leading-relaxed max-w-[65ch] mb-3">
          {t.canonDesc}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href={`${basePath}/papers/FRC-100-000`} className="text-frc-gold hover:underline">
            {t.canonLink} →
          </Link>
          <Link href={`${basePath}/falsifications`} className="text-frc-text-dim hover:text-frc-gold transition-colors">
            {t.ledgerLink} →
          </Link>
        </div>
      </section>

      {!featured ? (
        <div className="border-t border-frc-blue pt-6 text-sm text-frc-text-dim">
          {t.noArticles}
        </div>
      ) : (
        <>
          <section className="mb-12 border-t border-frc-blue pt-8">
            <h2 className="text-sm font-medium text-frc-steel mb-4">{t.latest}</h2>
            {(() => {
              const fm = featured.frontmatter;
              const isPaper = paperIds.has(fm.id);
              const extras = extrasFor(featured);
              const scopeTag = normalizeEdgeScopeTag(fm.scopeTag);
              const sourcesCount = normalizePrimarySources(fm.primarySources).length;
              return (
                <article className="border-s-2 border-frc-gold ps-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-frc-steel mb-2">
                    {scopeTag && <EdgeScopeBadge scopeTag={scopeTag} lang={lang} />}
                    <span>{extras.category}</span>
                    <span className="font-mono text-[0.8125rem] tabular-nums">{extras.readTime}</span>
                    {fm.date && <span className="font-mono text-[0.8125rem] tabular-nums">{fm.date}</span>}
                    {sourcesCount > 0 && (
                      <span className="font-mono text-[0.8125rem] tabular-nums">
                        {sourcesCount} primary {sourcesCount === 1 ? 'source' : 'sources'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-medium text-frc-text leading-snug mb-2">
                    <Link href={getHref(basePath, isPaper, fm.id)} className="hover:text-frc-gold transition-colors">
                      {fm.title}
                    </Link>
                  </h3>
                  {fm.abstract && (
                    <p className="text-[0.9375rem] text-frc-text-dim leading-relaxed max-w-[65ch] mb-3">
                      {fm.abstract}
                    </p>
                  )}
                  <Link href={getHref(basePath, isPaper, fm.id)} className="text-sm text-frc-gold hover:underline">
                    {t.read} →
                  </Link>
                </article>
              );
            })()}
          </section>

          {gridItems.length > 0 && (
            <Suspense fallback={<div className="min-h-48" aria-busy="true" />}>
              <ArticlesGridClient items={gridItems} lang={lang} />
            </Suspense>
          )}
        </>
      )}

      {/* Zenodo archive reference */}
      <section className="mt-14 pt-8 border-t border-frc-blue flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-base text-frc-text font-medium mb-1">{t.zenodoTitle}</p>
          <p className="text-sm text-frc-text-dim">{t.zenodoDesc}</p>
        </div>
        <a
          href="https://zenodo.org/communities/frc"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 border border-frc-blue hover:border-frc-gold text-frc-text-dim hover:text-frc-gold text-sm transition-colors"
        >
          {t.viewZenodo} →
        </a>
      </section>
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
