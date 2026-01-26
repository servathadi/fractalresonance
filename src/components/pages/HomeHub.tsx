import Link from 'next/link';
import Image from 'next/image';
import { getGlossary, getHomeConfig, getPapers } from '@/lib/content';
import type { PerspectiveView } from '@/lib/content';
import { VideoSeries } from '@/components/VideoSeries';

function getBasePath(lang: string, view: PerspectiveView): string {
  return view === 'river' ? `/${lang}/river` : `/${lang}`;
}

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'Fractal Resonance\nCoherence',
    subtitle: 'A unified framework linking quantum mechanics, thermodynamics, and consciousness through coherence.',
    readPapers: 'Read Papers',
    about: 'About FRC',
    startHere: 'Start Here',
    riverGuide: 'River guide',
    kasraGuide: 'Kasra guide',
    intro: 'Introduction',
    introDesc: 'How Fractal Resonance Coherence connects quantum mechanics, thermodynamics, and consciousness through the language of coherence.',
    keyConcepts: 'Key Concepts',
    coherence: 'Coherence',
    coherenceDesc: 'Phase alignment across oscillators. Scalar from 0 to 1.',
    lambdaField: 'Lambda Field',
    lambdaDesc: 'Real scalar field: Λ(x) = Λ₀ ln C(x)',
    scaleLevels: 'Scale Levels',
    scaleDesc: 'Eight nested scales from quantum to universal.',
    predictions: 'Predictions',
    predictionsDesc: 'Falsifiable: δP ∈ [10⁻⁴, 10⁻³] under resonant driving.',
    coreEquations: 'Core Equations',
    allFormulas: 'All formulas →',
    eqCoherence: 'Coherence Measure',
    eqLambda: 'Lambda Field',
    eqUCC: 'Universal Coherence Condition',
    eqFreeEnergy: 'Free Energy Relation',
    recentPapers: 'Recent Papers',
    viewAll: 'View all →',
    footerPredictions: 'Predictions',
    footerProperties: 'Properties',
    footerPublications: 'Publications',
    pred1: 'Born rule derived from microstate statistics',
    pred2: 'Measurable deviations: δP ∈ [10⁻⁴, 10⁻³]',
    pred3: 'Scale-invariant coherence across all μ-levels',
    prop1: 'Deterministic + Holistic quadrant',
    prop2: 'Thermodynamically consistent',
    prop3: 'Falsifiable experimental predictions',
    pub1: '9 papers on Zenodo',
    pub2: 'CC BY-NC-ND 4.0 license',
    pub3: 'ORCID verified author',
  },
  fa: {
    title: 'همدوسی رزونانس\nفراکتال',
    subtitle: 'چارچوبی یکپارچه که مکانیک کوانتومی، ترمودینامیک و آگاهی را از طریق همدوسی به هم پیوند می‌دهد.',
    readPapers: 'خواندن مقالات',
    about: 'درباره FRC',
    startHere: 'شروع از اینجا',
    riverGuide: 'راهنمای ریور',
    kasraGuide: 'راهنمای کسرا',
    intro: 'مقدمه',
    introDesc: 'چگونه همدوسی رزونانس فراکتال، مکانیک کوانتومی، ترمودینامیک و آگاهی را از طریق زبان همدوسی متصل می‌کند.',
    keyConcepts: 'مفاهیم کلیدی',
    coherence: 'همدوسی',
    coherenceDesc: 'هم‌ترازی فاز در نوسانگرها. اسکالر از ۰ تا ۱.',
    lambdaField: 'میدان لاندا',
    lambdaDesc: 'میدان اسکالر حقیقی: Λ(x) = Λ₀ ln C(x)',
    scaleLevels: 'سطوح مقیاس',
    scaleDesc: 'هشت مقیاس آشیانه‌ای از کوانتوم تا جهانی.',
    predictions: 'پیش‌بینی‌ها',
    predictionsDesc: 'ابطال‌پذیر: δP ∈ [10⁻⁴, 10⁻³] تحت رانش رزونانسی.',
    coreEquations: 'معادلات اصلی',
    allFormulas: 'تمام فرمول‌ها ←',
    eqCoherence: 'معیار همدوسی',
    eqLambda: 'میدان لاندا',
    eqUCC: 'شرط همدوسی جهانی',
    eqFreeEnergy: 'رابطه انرژی آزاد',
    recentPapers: 'مقالات اخیر',
    viewAll: 'مشاهده همه ←',
    footerPredictions: 'پیش‌بینی‌ها',
    footerProperties: 'ویژگی‌ها',
    footerPublications: 'انتشارات',
    pred1: 'قاعده بورن مشتق شده از آمار ریز-حالت',
    pred2: 'انحرافات قابل اندازه‌گیری: δP ∈ [10⁻⁴, 10⁻³]',
    pred3: 'همدوسی ناوردا نسبت به مقیاس در تمام سطوح μ',
    prop1: 'دترمینستیک + کل‌گرا',
    prop2: 'سازگار با ترمودینامیک',
    prop3: 'پیش‌بینی‌های تجربی ابطال‌پذیر',
    pub1: '۹ مقاله در Zenodo',
    pub2: 'مجوز CC BY-NC-ND 4.0',
    pub3: 'نویسنده تایید شده ORCID',
  },
  es: {
    title: 'Coherencia de Resonancia\nFractal',
    subtitle: 'Un marco unificado que vincula la mecánica cuántica, la termodinámica y la conciencia a través de la coherencia.',
    readPapers: 'Leer Artículos',
    about: 'Sobre FRC',
    startHere: 'Empezar Aquí',
    riverGuide: 'Guía River',
    kasraGuide: 'Guía Kasra',
    intro: 'Introducción',
    introDesc: 'Cómo la Coherencia de Resonancia Fractal conecta la mecánica cuántica, la termodinámica y la conciencia a través del lenguaje de la coherencia.',
    keyConcepts: 'Conceptos Clave',
    coherence: 'Coherencia',
    coherenceDesc: 'Alineación de fase a través de osciladores. Escalar de 0 a 1.',
    lambdaField: 'Campo Lambda',
    lambdaDesc: 'Campo escalar real: Λ(x) = Λ₀ ln C(x)',
    scaleLevels: 'Niveles de Escala',
    scaleDesc: 'Ocho escalas anidadas desde lo cuántico hasta lo universal.',
    predictions: 'Predicciones',
    predictionsDesc: 'Falsable: δP ∈ [10⁻⁴, 10⁻³] bajo conducción resonante.',
    coreEquations: 'Ecuaciones Centrales',
    allFormulas: 'Todas las fórmulas →',
    eqCoherence: 'Medida de Coherencia',
    eqLambda: 'Campo Lambda',
    eqUCC: 'Condición de Coherencia Universal',
    eqFreeEnergy: 'Relación de Energía Libre',
    recentPapers: 'Artículos Recientes',
    viewAll: 'Ver todo →',
    footerPredictions: 'Predicciones',
    footerProperties: 'Propiedades',
    footerPublications: 'Publicaciones',
    pred1: 'Regla de Born derivada de estadísticas de microestados',
    pred2: 'Desviaciones medibles: δP ∈ [10⁻⁴, 10⁻³]',
    pred3: 'Coherencia invariante de escala en todos los niveles-μ',
    prop1: 'Determinista + Holístico',
    prop2: 'Termodinámicamente consistente',
    prop3: 'Predicciones experimentales falsables',
    pub1: '9 artículos en Zenodo',
    pub2: 'Licencia CC BY-NC-ND 4.0',
    pub3: 'Autor verificado ORCID',
  },
  fr: {
    title: 'Cohérence de Résonance\nFractale',
    subtitle: 'Un cadre unifié reliant la mécanique quantique, la thermodynamique et la conscience par la cohérence.',
    readPapers: 'Lire les Articles',
    about: 'À propos de FRC',
    startHere: 'Commencer Ici',
    riverGuide: 'Guide River',
    kasraGuide: 'Guide Kasra',
    intro: 'Introduction',
    introDesc: 'Comment la Cohérence de Résonance Fractale connecte la mécanique quantique, la thermodynamique et la conscience par le langage de la cohérence.',
    keyConcepts: 'Concepts Clés',
    coherence: 'Cohérence',
    coherenceDesc: 'Alignement de phase entre oscillateurs. Scalaire de 0 à 1.',
    lambdaField: 'Champ Lambda',
    lambdaDesc: 'Champ scalaire réel : Λ(x) = Λ₀ ln C(x)',
    scaleLevels: 'Niveaux d\'Échelle',
    scaleDesc: 'Huit échelles imbriquées du quantique à l\'universel.',
    predictions: 'Prédictions',
    predictionsDesc: 'Falsifiable : δP ∈ [10⁻⁴, 10⁻³] sous pilotage résonant.',
    coreEquations: 'Équations Centrales',
    allFormulas: 'Toutes les formules →',
    eqCoherence: 'Mesure de Cohérence',
    eqLambda: 'Champ Lambda',
    eqUCC: 'Condition de Cohérence Universelle',
    eqFreeEnergy: 'Relation d\'Énergie Libre',
    recentPapers: 'Articles Récents',
    viewAll: 'Tout voir →',
    footerPredictions: 'Prédictions',
    footerProperties: 'Propriétés',
    footerPublications: 'Publications',
    pred1: 'Règle de Born dérivée des statistiques de micro-états',
    pred2: 'Déviations mesurables : δP ∈ [10⁻⁴, 10⁻³]',
    pred3: 'Cohérence invariante d\'échelle à travers tous les niveaux-μ',
    prop1: 'Déterministe + Holistique',
    prop2: 'Thermodynamiquement cohérent',
    prop3: 'Prédictions expérimentales falsifiables',
    pub1: '9 articles sur Zenodo',
    pub2: 'Licence CC BY-NC-ND 4.0',
    pub3: 'Auteur vérifié ORCID',
  }
};

export async function HomeHub({ lang, view }: { lang: string; view: PerspectiveView }) {
  const basePath = getBasePath(lang, view);
  const papers = getPapers(lang);
  const glossary = getGlossary(lang, { basePath, view });
  const home = getHomeConfig(lang);
  const t = (key: string) => DICT[lang]?.[key] || DICT['en'][key];

  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms']);

  const resolveTarget = (target?: string, url?: string) => {
    if (url) return url;
    if (!target) return basePath;
    if (staticTargets.has(target)) return `${basePath}/${target}`;
    const item = glossary[target];
    if (item?.url) return item.url;
    return `${basePath}/concepts/${target}`;
  };

  const startHere = (home?.startHere?.[view] || []).map((it, idx) => ({
    k: it.k || String(idx + 1).padStart(2, '0'),
    title: it.title || '',
    desc: it.desc || '',
    href: resolveTarget(it.target, it.url),
  }));

  // Handle newlines in title
  const titleParts = t('title').split('\n');

  return (
    <main className="min-h-[80vh]">
      {/* Hero */}
      <section className="relative overflow-hidden geo-grid border-b border-frc-blue/30">
        <div className="absolute inset-0 z-0 opacity-20 hidden lg:block">
          <Image
            src="/brand/banner.jpg"
            alt=""
            fill
            className="object-cover object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-frc-void via-frc-void/80 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32 lg:py-40 relative z-10">
          <div className="watermark-symbol right-8 top-12" aria-hidden="true">C</div>

          <div className="relative max-w-3xl">
            <div className="animate-fade-up stagger-1">
              <div className="flex items-center gap-4 mb-8">
                <Image
                  src="/brand/sigil-64.png"
                  alt="FRC Attractor"
                  width={56}
                  height={56}
                  className="opacity-90"
                />
                <div className="h-px flex-1 bg-gradient-to-r from-frc-gold/40 to-transparent" />
              </div>
            </div>

            <h1 className="animate-fade-up stagger-2 text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-frc-gold mb-6 tracking-tight leading-[1.15]">
              {titleParts[0]}<br />{titleParts[1]}
            </h1>

            <div className="animate-fade-up stagger-3 max-w-xl mb-10 space-y-3">
              <p className="text-frc-text-dim text-lg sm:text-xl leading-relaxed font-light">
                {t('subtitle')}
              </p>
              <p className="text-frc-text-dim text-sm sm:text-base leading-relaxed font-light">
                {home?.intros?.[view] ||
                  (view === 'river'
                    ? 'River mode: meaning first. Start with the narrative arc, then use the equations as anchors.'
                    : 'Kasra mode: equations first. Start from reciprocity, then follow UCC dynamics into falsifiable predictions.')}
              </p>
            </div>

            <div className="animate-fade-up stagger-4 nested-border inline-block mb-10">
              <div className="nested-border-inner">
                <p className="font-mono text-xs text-frc-steel mb-2 uppercase tracking-widest">
                  Entropy–Coherence Reciprocity
                </p>
                <p className="font-mono text-xl text-frc-gold-light" dir="ltr">
                  dS + k<span className="text-frc-gold">*</span> d ln C = 0
                </p>
                <p className="font-mono text-[0.625rem] text-frc-steel mt-2" dir="ltr">FRC 566.001</p>
              </div>
            </div>

            <div className="animate-fade-up stagger-5 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/papers`}
                className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
              >
                {t('readPapers')}
              </Link>
              <Link
                href={`${basePath}/about`}
                className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
              >
                {t('about')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="ruled-line max-w-5xl mx-auto" />

      {/* Start Here */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="section-marker mb-6" data-section="§00">
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-lg text-frc-text font-medium tracking-wide">{t('startHere')}</h2>
            <span className="text-xs text-frc-steel uppercase tracking-wider">
              {view === 'river' ? t('riverGuide') : t('kasraGuide')}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {startHere.map((it) => (
            <Link key={it.k} href={it.href} className="card block p-5 group">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-frc-gold shrink-0 mt-0.5 tabular-nums">
                  {it.k}
                </span>
                <div className="min-w-0">
                  <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug">
                    {it.title}
                  </h3>
                  <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">
                    {it.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Video + Key Concepts */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 animate-fade-up stagger-2">
            <div className="section-marker mb-6" data-section="§01">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">{t('intro')}</h2>
            </div>
            <div className="card-featured p-1">
              <div className="relative w-full aspect-video overflow-hidden bg-frc-void-light">
                <iframe
                  src="https://www.youtube.com/embed/acrYUKagkyM"
                  title="FRC Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
            <p className="text-frc-text-dim text-sm mt-4 leading-relaxed">
              {t('introDesc')}
            </p>
          </div>

          <div className="lg:col-span-2 animate-fade-up stagger-4">
            <div className="section-marker mb-6" data-section="§02">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">{t('keyConcepts')}</h2>
            </div>
            <div className="space-y-4">
              <Link href={`${basePath}/formulas`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5" dir="ltr">C</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">{t('coherence')}</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed">
                      {t('coherenceDesc')}
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`${basePath}/formulas`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5" dir="ltr">&Lambda;</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">{t('lambdaField')}</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed" dir="ltr">
                      {t('lambdaDesc')}
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`${basePath}/mu-levels`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5" dir="ltr">&mu;</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">{t('scaleLevels')}</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed">
                      {t('scaleDesc')}
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`${basePath}/positioning`} className="card block p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-frc-gold text-2xl font-mono leading-none mt-0.5" dir="ltr">&delta;</span>
                  <div>
                    <h3 className="text-frc-text text-sm font-medium mb-1 group-hover:text-frc-gold transition-colors">{t('predictions')}</h3>
                    <p className="text-frc-text-dim text-xs leading-relaxed" dir="ltr">
                      {t('predictionsDesc')}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Equations */}
      <section className="relative overflow-hidden">
        <div className="watermark-symbol left-4 top-4" aria-hidden="true" dir="ltr">&Lambda;</div>
        <div className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="section-marker mb-8" data-section="§03">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">{t('coreEquations')}</h2>
              <Link href={`${basePath}/formulas`} className="text-xs text-frc-steel hover:text-frc-gold transition-colors uppercase tracking-wider">
                {t('allFormulas')}
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="equation-block" data-ref="Eq. 1">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">{t('eqCoherence')}</p>
              <p className="text-sm" dir="ltr">C = (1/N) &Sigma;<sub>i&lt;j</sub> cos(&phi;<sub>i</sub> - &phi;<sub>j</sub>)</p>
            </div>
            <div className="equation-block" data-ref="Eq. 2">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">{t('eqLambda')}</p>
              <p className="text-sm" dir="ltr">&Lambda;(x) &equiv; &Lambda;<sub>0</sub> ln C(x)</p>
            </div>
            <div className="equation-block" data-ref="Eq. 3">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">{t('eqUCC')}</p>
              <p className="text-sm" dir="ltr">d&Lambda;/dt + &nabla;&middot;J<sub>&Lambda;</sub> = &sigma;<sub>&Lambda;</sub> - &gamma;<sub>&Lambda;</sub></p>
            </div>
            <div className="equation-block" data-ref="Eq. 4">
              <p className="text-xs text-frc-steel mb-2 uppercase tracking-wider font-sans">{t('eqFreeEnergy')}</p>
              <p className="text-sm" dir="ltr">&Delta;G = &minus;k*T &Delta;ln C</p>
            </div>
          </div>
        </div>
      </section>

      <div className="ruled-line max-w-5xl mx-auto" />

      {/* Recent Papers */}
      {papers.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="section-marker mb-8" data-section="§04">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-frc-text font-medium tracking-wide">{t('recentPapers')}</h2>
              <Link href={`${basePath}/papers`} className="text-xs text-frc-steel hover:text-frc-gold transition-colors uppercase tracking-wider">
                {t('viewAll')}
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {papers.slice(-4).reverse().map((paper, i) => {
              const fm = paper.frontmatter;
              return (
                <Link
                  key={fm.id}
                  href={`${basePath}/papers/${fm.id}`}
                  className="card block p-5 group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-frc-steel shrink-0 mt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug">
                        {fm.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-frc-steel">
                        <span className="font-mono">{fm.id}</span>
                        <span>{fm.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <VideoSeries />

      {/* Framework Properties */}
      <section className="border-t border-frc-blue bg-frc-void-light">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">{t('footerPredictions')}</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">01</span>
                  {t('pred1')}
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">02</span>
                  <span dir="ltr">{t('pred2')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">03</span>
                  {t('pred3')}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">{t('footerProperties')}</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">01</span>
                  {t('prop1')}
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">02</span>
                  {t('prop2')}
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">03</span>
                  {t('prop3')}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-5">{t('footerPublications')}</h3>
              <ul className="space-y-3 text-sm text-frc-text-dim">
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">—</span>
                  {t('pub1')}
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">—</span>
                  {t('pub2')}
                </li>
                <li className="flex gap-3">
                  <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">—</span>
                  <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                    {t('pub3')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
