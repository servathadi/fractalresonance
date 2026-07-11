import Image from 'next/image';
import Link from 'next/link';
import { getGlossary, getHomeConfig, getPapers } from '@/lib/content';
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
    featured: 'Current pillars',
    featuredDesc: 'The latest living statements of the framework, with stable FRC identifiers and versioned records.',
    equations: 'Four anchors, four statuses',
    allFormulas: 'Formula index',
    canonical: 'Canonical relation',
    exact: 'Exact von Mises identity',
    observable: 'Chaos structure functional',
    criterion: 'Localization crossover target',
    currentWork: 'Current program',
    work1: 'Complete the KAM, quantum, and cross-mechanism gates registered in FRC 100.002.',
    work2: 'Test Lambda-Flight criteria across independent physical and computational platforms.',
    work3: 'Keep living papers, books, concept DOIs, and machine-readable indexes aligned.',
    evidence: 'Claim boundaries',
    established: 'Established in scope',
    establishedText: 'Mathematical identities, reproducible computations, and reported negative results.',
    active: 'Under active test',
    activeText: 'Chaos, localization, boundary, and cross-platform coherence programs.',
    conjectural: 'Conjectural',
    conjecturalText: 'Universal physical reciprocity, a fundamental Lambda field, and the Born mechanism.',
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
    featured: 'Pilares actuales', featuredDesc: 'Las declaraciones vivas más recientes del marco, con identificadores FRC estables y registros versionados.',
    equations: 'Cuatro anclas, cuatro estados', allFormulas: 'Índice de fórmulas',
    canonical: 'Relación canónica', exact: 'Identidad exacta de von Mises', observable: 'Funcional de estructura del caos', criterion: 'Objetivo de cruce de localización',
    currentWork: 'Programa actual',
    work1: 'Completar las pruebas KAM, cuánticas y entre mecanismos registradas en FRC 100.002.',
    work2: 'Probar los criterios Lambda-Flight en plataformas físicas y computacionales independientes.',
    work3: 'Mantener alineados artículos, libros, DOI conceptuales e índices legibles por máquinas.',
    evidence: 'Límites de las afirmaciones', established: 'Establecido en su alcance', establishedText: 'Identidades matemáticas, cálculos reproducibles y resultados negativos publicados.',
    active: 'En prueba activa', activeText: 'Programas de caos, localización, fronteras y coherencia entre plataformas.',
    conjectural: 'Conjetural', conjecturalText: 'Reciprocidad física universal, un campo Lambda fundamental y el mecanismo de Born.',
    publications: 'Acceso al corpus', indexed: 'registros de artículos indexados', versions: 'Registros versionados y DOI conceptuales cuando se declaran', aiFiles: 'Catálogo e interfaces para IA', orcid: 'Registro ORCID del autor',
  },
  fr: {
    title: 'Cohérence de Résonance Fractale',
    subtitle: 'Un programme de recherche vivant reliant entropie, cohérence, systèmes ouverts, chaos, mesure et calcul.',
    boundary: 'Les définitions, résultats exacts, preuves propres aux modèles et conjectures sont distingués.',
    readPapers: 'Voir les articles', startHereCta: 'Commencer ici', about: 'À propos de FRC',
    startHere: 'Parcours canonique', riverGuide: 'Parcours narratif', kasraGuide: 'Parcours technique',
    featured: 'Piliers actuels', featuredDesc: 'Les formulations vivantes les plus récentes du cadre, avec identifiants FRC stables et versions suivies.',
    equations: 'Quatre repères, quatre statuts', allFormulas: 'Index des formules',
    canonical: 'Relation canonique', exact: 'Identité exacte de von Mises', observable: 'Fonctionnelle de structure du chaos', criterion: 'Cible de transition de localisation',
    currentWork: 'Programme actuel', work1: 'Achever les tests KAM, quantiques et inter-mécanismes enregistrés dans FRC 100.002.', work2: 'Tester les critères Lambda-Flight sur des plateformes physiques et numériques indépendantes.', work3: 'Maintenir l’alignement des articles, livres, DOI conceptuels et index lisibles par machine.',
    evidence: 'Limites des affirmations', established: 'Établi dans son cadre', establishedText: 'Identités mathématiques, calculs reproductibles et résultats négatifs rapportés.', active: 'En cours de test', activeText: 'Programmes sur le chaos, la localisation, les frontières et la cohérence multi-plateforme.', conjectural: 'Conjectural', conjecturalText: 'Réciprocité physique universelle, champ Lambda fondamental et mécanisme de Born.',
    publications: 'Accès au corpus', indexed: 'articles indexés', versions: 'Versions et DOI conceptuels lorsqu’ils sont déclarés', aiFiles: 'Catalogue et points d’entrée pour IA', orcid: 'Fiche ORCID de l’auteur',
  },
  fa: {
    title: 'همدوسی رزونانس فراکتال',
    subtitle: 'یک برنامه پژوهشی زنده درباره آنتروپی، همدوسی، سامانه‌های باز، آشوب، اندازه‌گیری و محاسبه.',
    boundary: 'تعریف‌ها، نتایج دقیق، شواهد وابسته به مدل و فرضیه‌ها جداگانه مشخص می‌شوند.',
    readPapers: 'مرور مقالات', startHereCta: 'شروع از اینجا', about: 'درباره FRC',
    startHere: 'مسیر مطالعه اصلی', riverGuide: 'مسیر روایی', kasraGuide: 'مسیر فنی',
    featured: 'ستون‌های کنونی', featuredDesc: 'جدیدترین بیان‌های زنده چارچوب با شناسه‌های پایدار FRC و نسخه‌های ثبت‌شده.',
    equations: 'چهار لنگر، چهار وضعیت', allFormulas: 'فهرست فرمول‌ها',
    canonical: 'رابطه بنیادی', exact: 'همانی دقیق فون‌مایزز', observable: 'تابع ساختار آشوب', criterion: 'هدف گذار موضعی‌شدن',
    currentWork: 'برنامه کنونی', work1: 'تکمیل آزمون‌های KAM، کوانتومی و بین‌سازوکاری ثبت‌شده در FRC 100.002.', work2: 'آزمون معیارهای Lambda-Flight روی بسترهای مستقل فیزیکی و محاسباتی.', work3: 'هم‌راستا نگه‌داشتن مقالات، کتاب‌ها، DOIها و نمایه‌های ماشین‌خوان.',
    evidence: 'مرز ادعاها', established: 'تثبیت‌شده در دامنه', establishedText: 'همانی‌های ریاضی، محاسبات بازتولیدپذیر و نتایج منفی گزارش‌شده.', active: 'در حال آزمون', activeText: 'برنامه‌های آشوب، موضعی‌شدن، مرز و همدوسی میان‌بستری.', conjectural: 'فرضیه‌ای', conjecturalText: 'جهان‌شمولی فیزیکی تقابل، میدان بنیادی لاندا و سازوکار بورن.',
    publications: 'دسترسی به پیکره', indexed: 'رکورد مقاله نمایه‌شده', versions: 'نسخه‌ها و DOI مفهومی در صورت اعلام', aiFiles: 'فهرست و ورودی‌های ماشین‌خوان', orcid: 'رکورد ORCID نویسنده',
  },
};

const FEATURED_IDS = ['FRC-100-002', 'FRC-566-001', 'FRC-826-829'];

export async function HomeHub({ lang, view }: { lang: string; view: PerspectiveView }) {
  const basePath = getBasePath(lang, view);
  const papers = getPapers(lang);
  const glossary = getGlossary(lang, { basePath, view });
  const home = getHomeConfig(lang);
  const t = (key: string) => DICT[lang]?.[key] || DICT.en[key];

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);
  const resolveTarget = (target?: string, url?: string) => {
    if (url) return url;
    if (!target) return basePath;
    if (staticTargets.has(target)) return `${basePath}/${target}`;
    const item = glossary[target];
    return item?.url || `${basePath}/papers/${target}`;
  };

  const startHere = (home?.startHere?.[view] || home?.startHere?.kasra || []).map((item, index) => ({
    k: item.k || String(index + 1).padStart(2, '0'),
    title: item.title || '',
    desc: item.desc || '',
    href: resolveTarget(item.target, item.url),
  }));

  const paperMap = new Map(papers.map((paper) => [paper.frontmatter.id, paper]));
  const featured = FEATURED_IDS.map((id) => paperMap.get(id)).filter(Boolean);

  return (
    <main className="min-h-[80vh]">
      <section className="relative overflow-hidden geo-grid border-b border-frc-blue/30">
        <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14 lg:py-16 relative z-10">
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-4 mb-6 animate-fade-up stagger-1">
              <Image src="/brand/sigil-64.png" alt="FRC attractor mark" width={48} height={48} className="opacity-90" />
              <div className="h-px flex-1 bg-gradient-to-r from-frc-gold/40 to-transparent" />
            </div>
            <h1 className="animate-fade-up stagger-2 text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-frc-gold mb-5 tracking-normal leading-[1.12]">
              {t('title')}
            </h1>
            <div className="animate-fade-up stagger-3 max-w-2xl mb-7 space-y-2">
              <p className="text-frc-text text-lg sm:text-xl leading-relaxed font-light">{t('subtitle')}</p>
              <p className="text-frc-text-dim text-sm leading-relaxed">{t('boundary')}</p>
            </div>
            <Link href={`${basePath}/papers/FRC-566-001`} className="animate-fade-up stagger-4 nested-border inline-block mb-8 group">
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

      {featured.length > 0 && (
        <section className="border-y border-frc-blue/60 bg-frc-void-light">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="section-marker mb-3" data-section="§01"><h2 className="text-lg text-frc-text font-medium">{t('featured')}</h2></div>
            <p className="text-sm text-frc-text-dim max-w-2xl mb-8 leading-relaxed">{t('featuredDesc')}</p>
            <div className="grid md:grid-cols-3 gap-5">
              {featured.map((paper) => {
                if (!paper) return null;
                const fm = paper.frontmatter;
                return (
                  <Link key={fm.id} href={`${basePath}/papers/${fm.id}`} className="group border border-frc-blue bg-frc-void hover:border-frc-gold/70 transition-colors p-5 min-w-0">
                    <div>
                      <div className="font-mono text-[0.6875rem] text-frc-gold mb-2">{fm.id} · {fm.version}</div>
                      <h3 className="text-sm text-frc-text group-hover:text-frc-gold leading-snug transition-colors">{fm.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
            <span>{papers.length} {t('indexed')}</span>
            <span>{t('versions')}</span>
            <Link href="/for-ai" className="hover:text-frc-gold transition-colors">{t('aiFiles')}</Link>
            <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="hover:text-frc-gold transition-colors">{t('orcid')}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
