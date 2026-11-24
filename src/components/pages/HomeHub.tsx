import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { ResearchMapSection } from '@/components/ResearchMapSection';
import { getGlossary, getHomeConfig, getPapers } from '@/lib/content';
import { buildResearchMap } from '@/lib/research-map';
import type { PerspectiveView } from '@/lib/content';

function getBasePath(lang: string, view: PerspectiveView): string {
  return view === 'river' ? `/${lang}/river` : `/${lang}`;
}

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'Fractal Resonance Coherence',
    subtitle: 'A living research program connecting entropy, coherence, open-system physics, chaos, measurement, and computation.',
    boundary: 'Definitions, exact results, model-specific evidence, and conjectures are labeled separately.',
    readPapers: 'Browse papers',
    startHereCta: 'Start here',
    about: 'About FRC',
    startHere: 'Canonical reading path',
    riverGuide: 'Narrative route',
    kasraGuide: 'Technical route',
    featured: 'Current research',
    featuredDesc: 'The latest living statements of the framework, with stable FRC identifiers and versioned records.',
    equations: 'Four anchors, four statuses',
    allFormulas: 'Formula index',
    canonical: 'Canonical relation',
    exact: 'Exact von Mises identity',
    observable: 'Chaos structure functional',
    criterion: 'Localization crossover target',
    currentWork: 'Current program',
    work1: 'FRC 830.000–830.005: independent proof review of exact ledger classification and lift obstructions; general nonunital CPTP lift remains open.',
    work2: 'FRC 700.000–700.007: independent review and inter-rater audit of the active threshold-framework protocol (superseding FRC 700.777).',
    work3: 'FRC 100.002 / 100.002.001 & 787.787: dense classical Gate 4 closed negatively; quantum, cross-mechanism, and held-out platform gates remain open.',
    evidence: 'Claim boundaries',
    established: 'Exact & retained negatives',
    establishedText: 'Proved ledger identities, typed morphisms, scoped lift obstructions, and explicitly retained negative results (including dense Gate 4).',
    active: 'Framework & scoped models',
    activeText: 'Threshold-framework register discipline (FRC 700.000–700.007), chaos/localization models, and operational transport protocols.',
    conjectural: 'Conjectures & open gates',
    conjecturalText: 'Universal physical reciprocity, a fundamental Lambda field, Born-rule emergence, and physical or Majid-style self-duality remain unestablished.',
    publications: 'Corpus access',
    indexed: 'indexed paper records',
    versions: 'Versioned records and concept DOIs where declared',
    aiFiles: 'Machine-readable catalog and AI entrypoints',
    orcid: 'ORCID author record',
  },
  es: {
    title: 'Coherencia de Resonancia Fractal',
    subtitle: 'Un programa de investigación vivo que conecta entropía, coherencia, sistemas abiertos, caos, medición y computación.',
    boundary: 'Las definiciones, resultados exactos, evidencias de modelos y conjeturas se etiquetan por separado.',
    readPapers: 'Ver artículos', startHereCta: 'Empezar aquí', about: 'Sobre FRC',
    startHere: 'Ruta de lectura canónica', riverGuide: 'Ruta narrativa', kasraGuide: 'Ruta técnica',
    featured: 'Investigación actual', featuredDesc: 'Las declaraciones vivas más recientes del marco, con identificadores FRC estables y registros versionados.',
    equations: 'Cuatro anclas, cuatro estados', allFormulas: 'Índice de fórmulas',
    canonical: 'Relación canónica', exact: 'Identidad exacta de von Mises', observable: 'Funcional de estructura del caos', criterion: 'Objetivo de cruce de localización',
    currentWork: 'Programa actual',
    work1: 'FRC 830.000–830.005: revisión independiente de la clasificación afín y obstrucciones de elevación; la elevación CPTP general sigue abierta.',
    work2: 'FRC 700.000–700.007: revisión independiente de la serie marco de umbrales que sustituye a FRC 700.777.',
    work3: 'FRC 100.002 / 100.002.001 y 787.787: la Puerta 4 densa cerró negativamente; siguen abiertas las puertas cuánticas y de plataforma.',
    evidence: 'Límites de las afirmaciones', established: 'Matemática exacta y negativos', establishedText: 'Identidades demostradas, obstrucciones acotadas y resultados negativos retenidos (incluida la Puerta 4 densa).',
    active: 'Marco y modelos acotados', activeText: 'Disciplina de registros (FRC 700.000–700.007), modelos de caos y protocolos operacionales.',
    conjectural: 'Conjeturas y puertas abiertas', conjecturalText: 'Reciprocidad física universal, campo Lambda fundamental, derivación de Born y autodualidad física siguen sin establecerse.',
    publications: 'Acceso al corpus', indexed: 'registros de artículos indexados', versions: 'Registros versionados y DOI conceptuales cuando se declaran', aiFiles: 'Catálogo e interfaces para IA', orcid: 'Registro ORCID del autor',
  },
  fr: {
    title: 'Cohérence de Résonance Fractale',
    subtitle: 'Un programme de recherche vivant reliant entropie, cohérence, systèmes ouverts, chaos, mesure et calcul.',
    boundary: 'Les définitions, résultats exacts, preuves propres aux modèles et conjectures sont distingués.',
    readPapers: 'Voir les articles', startHereCta: 'Commencer ici', about: 'À propos de FRC',
    startHere: 'Parcours canonique', riverGuide: 'Parcours narratif', kasraGuide: 'Parcours technique',
    featured: 'Recherche actuelle', featuredDesc: 'Les formulations vivantes les plus récentes du cadre, avec identifiants FRC stables et versions suivies.',
    equations: 'Quatre repères, quatre statuts', allFormulas: 'Index des formules',
    canonical: 'Relation canonique', exact: 'Identité exacte de von Mises', observable: 'Fonctionnelle de structure du chaos', criterion: 'Cible de transition de localisation',
    currentWork: 'Programme actuel', work1: 'FRC 830.000–830.005 : relecture indépendante de la classification affine et des obstructions de relèvement ; le relèvement CPTP général reste ouvert.', work2: 'FRC 700.000–700.007 : relecture indépendante de la série-cadre des seuils remplaçant FRC 700.777.', work3: 'FRC 100.002 / 100.002.001 et 787.787 : la Porte 4 dense est fermée négativement ; les portes quantiques et de plateforme restent ouvertes.',
    evidence: 'Limites des affirmations', established: 'Mathématiques exactes et négatifs', establishedText: 'Identités prouvées, obstructions cadrées et résultats négatifs retenus (dont la Porte 4 dense).', active: 'Cadre et modèles cadrés', activeText: 'Discipline des registres (FRC 700.000–700.007), modèles de chaos et protocoles opérationnels.', conjectural: 'Conjectures et portes ouvertes', conjecturalText: 'Réciprocité physique universelle, champ Lambda fondamental, règle de Born et auto-dualité physique restent non établies.',
    publications: 'Accès au corpus', indexed: 'articles indexés', versions: 'Versions et DOI conceptuels lorsqu’ils sont déclarés', aiFiles: 'Catalogue et points d’entrée pour IA', orcid: 'Fiche ORCID de l’auteur',
  },
  fa: {
    title: 'همدوسی رزونانس فراکتال',
    subtitle: 'یک برنامه پژوهشی زنده درباره آنتروپی، همدوسی، سامانه‌های باز، آشوب، اندازه‌گیری و محاسبه.',
    boundary: 'تعریف‌ها، نتایج دقیق، شواهد وابسته به مدل و فرضیه‌ها جداگانه مشخص می‌شوند.',
    readPapers: 'مرور مقالات', startHereCta: 'شروع از اینجا', about: 'درباره FRC',
    startHere: 'مسیر مطالعه اصلی', riverGuide: 'مسیر روایی', kasraGuide: 'مسیر فنی',
    featured: 'پژوهش‌های کنونی', featuredDesc: 'جدیدترین بیان‌های زنده چارچوب با شناسه‌های پایدار FRC و نسخه‌های ثبت‌شده.',
    equations: 'چهار لنگر، چهار وضعیت', allFormulas: 'فهرست فرمول‌ها',
    canonical: 'رابطه بنیادی', exact: 'همانی دقیق فون‌مایزز', observable: 'تابع ساختار آشوب', criterion: 'هدف گذار موضعی‌شدن',
    currentWork: 'برنامه کنونی', work1: 'FRC 830.000–830.005: داوری مستقل رده‌بندی آفین و انسدادهای بالابری؛ بالابری کلی CPTP همچنان باز است.', work2: 'FRC 700.000–700.007: داوری مستقل مجموعه چارچوب آستانه که جایگزین FRC 700.777 شده است.', work3: 'FRC 100.002 / 100.002.001 و 787.787: دروازه ۴ متراکم به‌صورت منفی بسته شد؛ دروازه‌های کوانتومی و بسترهای مستقل همچنان بازند.',
    evidence: 'مرز ادعاها', established: 'ریاضیات دقیق و نتایج منفی', establishedText: 'همانی‌های اثبات‌شده، انسدادهای محدود و نتایج منفی حفظ‌شده (از جمله دروازه ۴ متراکم).', active: 'چارچوب و مدل‌های محدود', activeText: 'انضباط ثبت‌های μ (FRC 700.000–700.007)، مدل‌های آشوب و پروتکل‌های عملیاتی.', conjectural: 'حدس‌ها و دروازه‌های باز', conjecturalText: 'جهان‌شمولی فیزیکی تقابل، میدان بنیادی لاندا، استخراج قاعده بورن و خوددوگانی فیزیکی اثبات نشده‌اند.',
    publications: 'دسترسی به پیکره', indexed: 'رکورد مقاله نمایه‌شده', versions: 'نسخه‌ها و DOI مفهومی در صورت اعلام', aiFiles: 'فهرست و ورودی‌های ماشین‌خوان', orcid: 'رکورد ORCID نویسنده',
  },
};

export async function HomeHub({ lang, view }: { lang: string; view: PerspectiveView }) {
  const basePath = getBasePath(lang, view);
  const papers = getPapers(lang);
  const glossary = getGlossary(lang, { basePath, view });
  const home = getHomeConfig(lang);
  const researchMap = buildResearchMap(lang, basePath);
  const t = (key: string) => DICT[lang]?.[key] || DICT.en[key];

  const enPaperMap = new Map(getPapers('en').map((p) => [p.frontmatter.id, p]));
  const langPaperMap = new Map(papers.map((p) => [p.frontmatter.id, p]));
  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const resolveTarget = (target?: string, url?: string) => {
    if (url) return url;
    if (!target) return basePath;
    if (staticTargets.has(target)) return `${basePath}/${target}`;
    if (lang !== 'en' && enPaperMap.has(target)) {
      const en = enPaperMap.get(target)!;
      const tr = langPaperMap.get(target);
      const matchesRevision =
        tr &&
        tr.frontmatter.translationStatus !== 'lags-canonical-english' &&
        (!en.frontmatter.version || tr.frontmatter.version === en.frontmatter.version) &&
        (!en.frontmatter.doi || tr.frontmatter.doi === en.frontmatter.doi);
      return matchesRevision ? `${basePath}/papers/${target}` : `/en/papers/${target}`;
    }
    const item = glossary[target];
    if (item?.url) return item.url;
    return `/en/papers/${target}`;
  };

  const startHere = (home?.startHere?.[view] || home?.startHere?.kasra || []).map((item, index) => ({
    k: item.k || String(index + 1).padStart(2, '0'),
    title: item.title || '',
    desc: item.desc || '',
    href: resolveTarget(item.target, item.url),
  }));

  return (
    <main className="min-h-[80vh]">
      <section className="relative overflow-hidden geo-grid border-b border-frc-blue/30">
        <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14 lg:py-16 relative z-10">
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-4 mb-6 animate-fade-up stagger-1">
              <BrandMark alt="FRC attractor mark" width={48} height={48} className="opacity-90" />
              <div className="h-px flex-1 bg-gradient-to-r from-frc-gold/40 to-transparent" />
            </div>
            <h1 className="animate-fade-up stagger-2 text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-frc-gold mb-5 tracking-normal leading-[1.12]">
              {t('title')}
            </h1>
            <div className="animate-fade-up stagger-3 max-w-2xl mb-7 space-y-2">
              <p className="text-frc-text text-lg sm:text-xl leading-relaxed font-light">{t('subtitle')}</p>
              <p className="text-frc-text-dim text-sm leading-relaxed">{t('boundary')}</p>
            </div>
            <Link href={resolveTarget('FRC-566-001')} className="animate-fade-up stagger-4 nested-border inline-block mb-8 group">
              <div className="nested-border-inner">
                <p className="font-mono text-[0.625rem] text-frc-steel mb-2 uppercase tracking-widest">FRC 566.001 · canonical relation</p>
                <p className="font-mono text-lg sm:text-xl text-frc-gold-light" dir="ltr">dS + k<span className="text-frc-gold">*</span> d ln C = 0</p>
                <p className="font-mono text-[0.625rem] text-frc-steel mt-2">k* is scale-invariant in form; operational registers declare its representation.</p>
              </div>
            </Link>
            <div className="animate-fade-up stagger-5 flex flex-wrap gap-3">
              <Link href={`${basePath}/start-here`} className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium uppercase transition-colors">{t('startHereCta')}</Link>
              <Link href={`${basePath}/papers`} className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm uppercase transition-colors">{t('readPapers')}</Link>
              <Link href={`${basePath}/about`} className="hidden sm:inline-flex px-6 py-3 text-frc-text-dim hover:text-frc-gold text-sm uppercase transition-colors">{t('about')}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="section-marker mb-6" data-section="§00">
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-lg text-frc-text font-medium tracking-normal">{t('startHere')}</h2>
            <span className="text-xs text-frc-steel uppercase tracking-wider">{view === 'river' ? t('riverGuide') : t('kasraGuide')}</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {startHere.map((item) => (
            <Link key={item.k} href={item.href} className="card block p-5 group min-h-36">
              <span className="font-mono text-xs text-frc-gold tabular-nums">{item.k}</span>
              <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug mt-4">{item.title}</h3>
              <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <ResearchMapSection data={researchMap} lang={lang} sectionMarker="§01" />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="section-marker mb-8" data-section="§02">
          <div className="flex items-center justify-between gap-5">
            <h2 className="text-lg text-frc-text font-medium">{t('equations')}</h2>
            <Link href={`${basePath}/formulas`} className="text-xs text-frc-steel hover:text-frc-gold uppercase tracking-wider transition-colors">{t('allFormulas')}</Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="equation-block" data-ref="canonical"><p className="text-xs text-frc-steel mb-3 uppercase tracking-wider font-sans">{t('canonical')}</p><p className="text-base" dir="ltr">dS + k* d ln C = 0</p><p className="text-[0.6875rem] text-frc-steel mt-3">FRC 566.001 · physical universality conjectural</p></div>
          <div className="equation-block" data-ref="exact"><p className="text-xs text-frc-steel mb-3 uppercase tracking-wider font-sans">{t('exact')}</p><p className="text-base" dir="ltr">dS / d ln C = −κr</p><p className="text-[0.6875rem] text-frc-steel mt-3">FRC 566.030 · exact for the declared family</p></div>
          <div className="equation-block" data-ref="observable"><p className="text-xs text-frc-steel mb-3 uppercase tracking-wider font-sans">{t('observable')}</p><p className="text-base" dir="ltr">Σ = S<sub>vM</sub>(C) − S ≥ 0</p><p className="text-[0.6875rem] text-frc-steel mt-3">FRC 100.002 · pilot-supported observable</p></div>
          <div className="equation-block" data-ref="criterion"><p className="text-xs text-frc-steel mb-3 uppercase tracking-wider font-sans">{t('criterion')}</p><p className="text-base" dir="ltr">t* γ<sub>C</sub> = O(1)</p><p className="text-[0.6875rem] text-frc-steel mt-3">FRC 100.002 · tolerance band still open</p></div>
        </div>
      </section>

      <section className="border-t border-frc-blue bg-frc-void-light">
        <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1.15fr_1.85fr] gap-12">
          <div>
            <h2 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">{t('currentWork')}</h2>
            <ol className="space-y-4 text-sm text-frc-text-dim">
              {[t('work1'), t('work2'), t('work3')].map((text, index) => <li key={text} className="flex gap-3"><span className="font-mono text-xs text-frc-gold">{String(index + 1).padStart(2, '0')}</span><span>{text}</span></li>)}
            </ol>
          </div>
          <div>
            <h2 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">{t('evidence')}</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div><h3 className="text-sm text-frc-text mb-2">{t('established')}</h3><p className="text-xs text-frc-text-dim leading-relaxed">{t('establishedText')}</p></div>
              <div><h3 className="text-sm text-frc-text mb-2">{t('active')}</h3><p className="text-xs text-frc-text-dim leading-relaxed">{t('activeText')}</p></div>
              <div><h3 className="text-sm text-frc-text mb-2">{t('conjectural')}</h3><p className="text-xs text-frc-text-dim leading-relaxed">{t('conjecturalText')}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-frc-blue">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">{t('publications')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-frc-text-dim">
            <span>{researchMap.totalPublishedEnglishPapers} {t('indexed')}</span>
            <span>{t('versions')}</span>
            <Link href="/for-ai" className="hover:text-frc-gold transition-colors">{t('aiFiles')}</Link>
            <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="hover:text-frc-gold transition-colors">{t('orcid')}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
