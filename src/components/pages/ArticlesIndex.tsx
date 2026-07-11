import Link from 'next/link';
import { Suspense } from 'react';
import { estimateReadTime, getArticles, getPapers, isCurrentReadingContent, matchesPerspectiveView, type ParsedContent, type PerspectiveView } from '@/lib/content';
import { ArticlesGridClient, type ArticlesGridItem } from '@/components/pages/ArticlesGridClient';

const ARTICLE_EXTRAS: Record<string, { categoryKey: string; readTime?: string }> = {
  'FRC-566-001': { categoryKey: 'foundation' },
  'FRC-100-001': { categoryKey: 'coreTheory' },
};

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'Articles',
    desc: 'Commentary and research notes around the Fractal Resonance Coherence corpus. Primary scientific claims belong to the numbered papers.',
    featured: 'Featured',
    latest: 'Latest',
    read: 'Read →',
    zenodoTitle: 'Complete catalog on Zenodo',
    zenodoDesc: '9 papers published with DOI under CC BY-NC-ND 4.0',
    viewZenodo: 'View on Zenodo →',
    foundation: 'Foundation',
    coreTheory: 'Core Theory',
    research: 'Research',
    readLabel: 'read',
  },
  fa: {
    title: 'مقالات',
    desc: 'انتشارات پژوهشی که چارچوب همدوسی رزونانس فراکتال را کاوش می‌کنند. هر مقاله مؤلفه‌ای از نظریه یکپارچه را ارائه می‌دهد که مکانیک کوانتومی، ترمودینامیک و آگاهی را به هم متصل می‌کند.',
    featured: 'ویژه',
    videoTitle: 'مقدمه‌ای بر همدوسی رزونانس فراکتال',
    videoDesc: 'یک مقدمه ویدئویی جامع که مفاهیم اصلی تقابل آنتروپی-همدوسی، میدان لاندا و معماری آگاهی چند-مقیاسی را پوشش می‌دهد.',
    videoLabel: 'ویدئو',
    overview: 'نمای کلی',
    latest: 'جدیدترین',
    read: 'خواندن ←',
    zenodoTitle: 'کاتالوگ کامل در Zenodo',
    zenodoDesc: '۹ مقاله منتشر شده با DOI تحت مجوز CC BY-NC-ND 4.0',
    viewZenodo: 'مشاهده در Zenodo ←',
    foundation: 'بنیاد',
    coreTheory: 'نظریه اصلی',
    research: 'پژوهش',
    readLabel: 'مطالعه',
  },
  es: {
    title: 'Artículos',
    desc: 'Publicaciones de investigación que exploran el marco de Coherencia de Resonancia Fractal. Cada artículo presenta un componente de la teoría unificada que conecta la mecánica cuántica, la termodinámica y la conciencia.',
    featured: 'Destacado',
    videoTitle: 'Introducción a la Coherencia de Resonancia Fractal',
    videoDesc: 'Una introducción completa en video que cubre los conceptos centrales de reciprocidad entropía-coherencia, el campo Lambda y la arquitectura de conciencia a múltiples escalas.',
    videoLabel: 'VIDEO',
    overview: 'Descripción general',
    latest: 'Último',
    read: 'Leer →',
    zenodoTitle: 'Catálogo completo en Zenodo',
    zenodoDesc: '9 artículos publicados con DOI bajo CC BY-NC-ND 4.0',
    viewZenodo: 'Ver en Zenodo →',
    foundation: 'Fundación',
    coreTheory: 'Teoría Central',
    research: 'Investigación',
    readLabel: 'de lectura',
  },
  fr: {
    title: 'Articles',
    desc: 'Publications de recherche explorant le cadre de la Cohérence de Résonance Fractale. Chaque article présente une composante de la théorie unifiée reliant la mécanique quantique, la thermodynamique et la conscience.',
    featured: 'En vedette',
    videoTitle: 'Introduction à la Cohérence de Résonance Fractale',
    videoDesc: 'Une introduction vidéo complète couvrant les concepts fondamentaux de la réciprocité entropie-cohérence, le champ Lambda et l\'architecture de la conscience à plusieurs échelles.',
    videoLabel: 'VIDÉO',
    overview: 'Vue d\'ensemble',
    latest: 'Dernier',
    read: 'Lire →',
    zenodoTitle: 'Catalogue complet sur Zenodo',
    zenodoDesc: '9 articles publiés avec DOI sous CC BY-NC-ND 4.0',
    viewZenodo: 'Voir sur Zenodo →',
    foundation: 'Fondation',
    coreTheory: 'Théorie Centrale',
    research: 'Recherche',
    readLabel: 'de lecture',
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
  const t = DICT[lang] || DICT['en'];
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
      tags: Array.isArray(fm.tags) ? fm.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      readTime: extras.readTime,
      ordinal: i + 2, // +1 for 1-based, +1 because 01 is "Latest"
    };
  });

  const content = (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-light text-frc-gold tracking-tight">{t.title}</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
        </div>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          {t.desc}
        </p>
      </header>

      {/* Current paper route */}
      <section className="mb-16 border-y border-frc-blue py-7">
        <div className="section-marker mb-6" data-section="§01">
          <span className="font-mono text-[0.625rem] text-frc-gold uppercase tracking-widest">{t.featured}</span>
        </div>
        <div className="max-w-3xl">
          <h2 className="text-xl text-frc-text font-medium mb-3 leading-snug">Current paper-led program</h2>
          <p className="text-frc-text-dim text-sm leading-relaxed">
            The numbered papers carry the current technical claims. Start with the version-aware reading map before using commentary or archived media.
          </p>
          <Link href={`${basePath}/papers/FRC-100-000`} className="inline-block mt-4 text-sm text-frc-gold hover:underline">Read FRC 100.000 &rarr;</Link>
        </div>
      </section>

      {/* Latest */}
      {featured && (
        <section className="mb-16">
          <div className="section-marker mb-6" data-section="§02">
            <span className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest">{t.latest}</span>
          </div>

          {(() => {
            const fm = featured.frontmatter;
            const isPaper = paperIds.has(fm.id);
            const extras = extrasFor(featured);
            return (
              <Link href={getHref(basePath, isPaper, fm.id)} className="card-featured block p-8 group">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="tag">{extras.category}</span>
                      <span className="text-xs text-frc-steel">{extras.readTime} {t.readLabel}</span>
                    </div>
                    <h3 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium mb-3 leading-snug">
                      {fm.title}
                    </h3>
                    {fm.abstract && (
                      <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                        {fm.abstract}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <span className="font-mono text-xs text-frc-steel">{fm.id}</span>
                    <span className="text-xs text-frc-steel mt-1">{fm.date}</span>
                    <span className="text-sm text-frc-gold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.read}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })()}
        </section>
      )}

      <Suspense fallback={<div className="min-h-48" aria-busy="true" />}>
        <ArticlesGridClient items={gridItems} lang={lang} />
      </Suspense>

      {/* Zenodo CTA */}
      <div className="ruled-line" />
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-frc-text text-sm font-medium mb-1">{t.zenodoTitle}</p>
          <p className="text-frc-text-dim text-xs">{t.zenodoDesc}</p>
        </div>
        <a
          href="https://zenodo.org/communities/frc"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-frc-blue hover:border-frc-gold text-frc-text-dim hover:text-frc-gold text-xs uppercase tracking-wider transition-all"
        >
          {t.viewZenodo}
        </a>
      </section>
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
