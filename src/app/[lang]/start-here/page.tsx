import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getSitePage, getGlossary, getPapers } from '@/lib/content';
import { buildResearchMap } from '@/lib/research-map';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ResearchMapSection } from '@/components/ResearchMapSection';
import { VisualAbstractShowcase } from '@/components/VisualAbstractShowcase';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'start-here');

  return {
    title: page?.frontmatter.title || 'Start Here',
    description: page?.frontmatter.description || 'A rigorous onboarding path into FRC.',
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

const labels: Record<
  string,
  { building: string; continue: string; continueText: string; papers: string; books: string; falsifications: string; machine: string }
> = {
  en: {
    building: 'Current work',
    continue: 'Continue into the corpus',
    continueText: 'Open the full paper index, the 2026 philosophical books, the public falsification ledger, or the machine-readable canon.',
    papers: 'Paper library',
    books: '2026 books',
    falsifications: 'Falsification ledger',
    machine: 'For AI systems',
  },
  es: {
    building: 'Trabajo actual',
    continue: 'Continuar en el corpus',
    continueText: 'Explore la biblioteca de artículos, los libros de 2026, el registro público de falsaciones o la entrada legible por máquinas.',
    papers: 'Biblioteca',
    books: 'Libros 2026',
    falsifications: 'Registro de falsaciones',
    machine: 'Para sistemas de IA',
  },
  fr: {
    building: 'Travail actuel',
    continue: 'Poursuivre dans le corpus',
    continueText: 'Parcourez la bibliothèque d’articles, les ouvrages 2026, le registre public des réfutations ou le point d’entrée IA.',
    papers: 'Bibliothèque',
    books: 'Livres 2026',
    falsifications: 'Registre des réfutations',
    machine: 'Pour les systèmes IA',
  },
  fa: {
    building: 'کار کنونی',
    continue: 'ادامه در پیکره',
    continueText: 'کتابخانه مقالات، کتاب‌های ۲۰۲۶، دفتر عمومی ابطال‌ها یا ورودی ماشین‌خوان را باز کنید.',
    papers: 'کتابخانه مقالات',
    books: 'کتاب‌های ۲۰۲۶',
    falsifications: 'دفتر ابطال‌ها',
    machine: 'برای سامانه‌های هوش مصنوعی',
  },
};

export default async function StartHerePage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'start-here');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const glossary = getGlossary(lang, { basePath, view: 'kasra' });
  const enById = new Map(getPapers('en').map((p) => [p.frontmatter.id, p]));
  const langById = new Map(getPapers(lang).map((p) => [p.frontmatter.id, p]));
  const researchMap = buildResearchMap(lang, basePath);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);

  const fm = page.frontmatter as any;
  const path = fm.onboarding_path || [];
  const buildingNow = fm.building_now || [];
  const t = labels[lang] || labels.en;

  const paperHref = (id: string) => {
    if (lang === 'en') return `${basePath}/papers/${id}`;
    const en = enById.get(id);
    const tr = langById.get(id);
    if (
      en &&
      tr &&
      tr.frontmatter.translationStatus !== 'lags-canonical-english' &&
      (!en.frontmatter.version || tr.frontmatter.version === en.frontmatter.version) &&
      (!en.frontmatter.doi || tr.frontmatter.doi === en.frontmatter.doi)
    ) {
      return `${basePath}/papers/${id}`;
    }
    return `/en/papers/${id}`;
  };

  return (
    <main className="min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <nav className="text-sm text-frc-text-dim mb-8">
          <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
          <span className="mx-2 text-frc-blue">/</span>
          <span className="text-frc-text">{fm.title}</span>
        </nav>

        <header className="mb-12 border-b border-frc-blue pb-8">
          <h1 className="text-3xl sm:text-4xl font-light text-frc-gold tracking-[-0.025em] leading-[1.12] mb-4">
            {fm.title}
          </h1>
          <p className="text-base text-frc-text-dim max-w-[65ch] leading-relaxed">
            {fm.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-sm">
            <Link href={`${basePath}/papers`} className="text-frc-gold hover:underline">
              {t.papers} →
            </Link>
            <Link href={`${basePath}/books`} className="text-frc-text-dim hover:text-frc-gold transition-colors">
              {t.books} →
            </Link>
            <Link href={`${basePath}/falsifications`} className="text-frc-text-dim hover:text-frc-gold transition-colors">
              {t.falsifications} →
            </Link>
          </div>
        </header>

        <VisualAbstractShowcase lang={lang} variant="start-here" />

        {path.length > 0 && (
          <section className="mb-12">
            <ol className="grid sm:grid-cols-3 gap-8">
              {path.map((it: any) => (
                <li key={it.id} className="border-t border-frc-blue pt-4">
                  <Link href={paperHref(it.id)} className="group block">
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <span className="font-mono text-sm text-frc-gold tabular-nums">{it.k}</span>
                      <span className="font-mono text-[0.8125rem] text-frc-steel">{it.id}</span>
                    </div>
                    <h2 className="text-base font-medium text-frc-text group-hover:text-frc-gold transition-colors leading-snug mb-2">
                      {it.title}
                    </h2>
                    <p className="text-sm text-frc-text-dim leading-relaxed">{it.desc}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {buildingNow.length > 0 && (
          <section className="border-y border-frc-blue py-7 mb-12">
            <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-4">{t.building}</h2>
            <ul className="space-y-3 text-sm text-frc-text-dim leading-relaxed max-w-[68ch]">
              {buildingNow.map((step: string, i: number) => (
                <li key={i} className="border-s border-frc-gold/70 ps-3.5">{step}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="content-body mb-6">
          <MarkdownContent html={bodyHtml} glossary={glossary} />
        </div>
      </div>

      <ResearchMapSection data={researchMap} lang={lang} />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-base font-medium text-frc-text mb-1.5">{t.continue}</h2>
          <p className="text-sm text-frc-text-dim leading-relaxed">{t.continueText}</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <Link href={`${basePath}/papers`} className="px-5 py-2.5 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void font-medium transition-colors">
            {t.papers}
          </Link>
          <Link href={`${basePath}/falsifications`} className="text-frc-text-dim hover:text-frc-gold transition-colors">
            {t.falsifications} →
          </Link>
          <Link href="/for-ai" className="text-frc-text-dim hover:text-frc-gold transition-colors">
            {t.machine} →
          </Link>
        </div>
      </div>
    </main>
  );
}
