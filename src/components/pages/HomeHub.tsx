import Link from 'next/link';
import { ResearchMapSection } from '@/components/ResearchMapSection';
import { VisualAbstractShowcase } from '@/components/VisualAbstractShowcase';
import { getGlossary, getHomeConfig, getPapers } from '@/lib/content';
import { getFalsificationLedger } from '@/lib/falsifications';
import { buildResearchMap } from '@/lib/research-map';
import type { PerspectiveView } from '@/lib/content';

function getBasePath(lang: string, view: PerspectiveView): string {
  return view === 'river' ? `/${lang}/river` : `/${lang}`;
}

interface HomeCopy {
  title: string;
  statement: string;
  formulaNote: string;
  startHereCta: string;
  pillarPapersTitle: string;
  pillarPapersIds: string;
  pillarPapersDesc: string;
  pillarPapersLink: string;
  pillarBooksTitle: string;
  pillarBooksDesc: string;
  pillarBooksLink: string;
  pillarLedgerTitle: string;
  pillarLedgerDesc: string;
  pillarLedgerLink: string;
  startHere: string;
  equations: string;
  allFormulas: string;
  canonical: string;
  exact: string;
  observable: string;
  criterion: string;
  currentWork: string;
  work1: string;
  work2: string;
  work3: string;
  evidence: string;
  established: string;
  establishedText: string;
  active: string;
  activeText: string;
  conjectural: string;
  conjecturalText: string;
  publications: string;
  indexed: string;
  versions: string;
  aiFiles: string;
  orcid: string;
}

const DICT: Record<string, HomeCopy> = {
  en: {
    title: 'Fractal Resonance Coherence',
    statement:
      'A status-labeled research program studying entropy-coherence reciprocity across open systems, separating exact mathematics, model-specific results, and open physical conjectures.',
    formulaNote: 'Canonical bookkeeping relation (FRC 566.001). Universal physical reciprocity remains an open conjecture.',
    startHereCta: 'Start here',
    pillarPapersTitle: 'Active papers',
    pillarPapersIds: '566.001 · 830.000–005 · 700.000–007 · 787.787 · 826.829',
    pillarPapersDesc: 'Canonical reciprocity, exact ledger mathematics, threshold framework, and scoped empirical protocols.',
    pillarPapersLink: 'Browse papers',
    pillarBooksTitle: '2026 books',
    pillarBooksDesc: 'The Open System and The Mind in the Coupling: current philosophical editions, kept separate from archived 2025 books.',
    pillarBooksLink: 'Explore books',
    pillarLedgerTitle: 'Falsification & negative-gate ledger',
    pillarLedgerDesc: 'Closed negative empirical gates, contradictions, mathematical obstructions, and demoted 2025 claims recorded publicly.',
    pillarLedgerLink: 'Inspect ledger',
    startHere: 'Canonical reading path',
    equations: 'Four anchors, four statuses',
    allFormulas: 'Formula index',
    canonical: 'Canonical relation',
    exact: 'Exact von Mises identity',
    observable: 'Chaos structure functional',
    criterion: 'Localization crossover target',
    currentWork: 'Current program',
    work1: 'FRC 830.000–830.005: FRC 830.005 v0.3 (Zenodo DOI 10.5281/zenodo.24572231; live on alphaXiv, 42/42 verification checks) excludes all open-set affine/CPTP qubit lifts (sharp on 1D circles); empty-interior, projective-instrument, and d ≥ 3 gates remain open alongside human peer review.',
    work2: 'FRC 700.000–700.007: independent review and inter-rater audit of the active threshold-framework protocol (superseding FRC 700.777).',
    work3: 'FRC 100.002 / 100.002.001 & 787.787: dense classical Gate 4 closed negatively; quantum, cross-mechanism, and held-out platform gates remain open.',
    evidence: 'Claim boundaries',
    established: 'Exact & retained negatives',
    establishedText: 'Proved ledger identities, typed morphisms, scoped lift obstructions, and explicitly retained negative results (including dense Gate 4).',
    active: 'Framework & scoped models',
    activeText: 'Threshold-framework register discipline (FRC 700.000–700.007), chaos and localization models, and operational transport protocols.',
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
    statement:
      'Un programa de investigación etiquetado por estado sobre la reciprocidad entropía-coherencia en sistemas abiertos, separando matemática exacta, resultados de modelo y conjeturas físicas.',
    formulaNote: 'Relación canónica de registro (FRC 566.001). La reciprocidad física universal sigue siendo una conjetura abierta.',
    startHereCta: 'Empezar aquí',
    pillarPapersTitle: 'Artículos activos',
    pillarPapersIds: '566.001 · 830.000–005 · 700.000–007 · 787.787 · 826.829',
    pillarPapersDesc: 'Reciprocidad canónica, matemática exacta de registros, serie marco de umbrales y protocolos empíricos acotados.',
    pillarPapersLink: 'Ver artículos',
    pillarBooksTitle: 'Libros 2026',
    pillarBooksDesc: 'The Open System y The Mind in the Coupling: ediciones filosóficas actuales, separadas de los libros archivados de 2025.',
    pillarBooksLink: 'Explorar libros',
    pillarLedgerTitle: 'Registro de falsaciones y puertas negativas',
    pillarLedgerDesc: 'Puertas empíricas cerradas negativamente, contradicciones, obstrucciones matemáticas y afirmaciones retiradas de 2025.',
    pillarLedgerLink: 'Abrir registro',
    startHere: 'Ruta de lectura canónica',
    equations: 'Cuatro anclas, cuatro estados',
    allFormulas: 'Índice de fórmulas',
    canonical: 'Relación canónica',
    exact: 'Identidad exacta de von Mises',
    observable: 'Funcional de estructura del caos',
    criterion: 'Objetivo de cruce de localización',
    currentWork: 'Programa actual',
    work1: 'FRC 830.000–830.005: FRC 830.005 v0.3 (en alphaXiv, 42/42 comprobaciones) excluye toda elevación afín/CPTP en abiertos coherentes del qubit; siguen abiertas las puertas de interior vacío, instrumentos proyectivos y d ≥ 3.',
    work2: 'FRC 700.000–700.007: revisión independiente de la serie marco de umbrales que sustituye a FRC 700.777.',
    work3: 'FRC 100.002 / 100.002.001 y 787.787: la Puerta 4 densa cerró negativamente; siguen abiertas las puertas cuánticas y de plataforma.',
    evidence: 'Límites de las afirmaciones',
    established: 'Matemática exacta y negativos',
    establishedText: 'Identidades demostradas, obstrucciones acotadas y resultados negativos retenidos (incluida la Puerta 4 densa).',
    active: 'Marco y modelos acotados',
    activeText: 'Disciplina de registros (FRC 700.000–700.007), modelos de caos y protocolos operacionales.',
    conjectural: 'Conjeturas y puertas abiertas',
    conjecturalText: 'Reciprocidad física universal, campo Lambda fundamental, derivación de Born y autodualidad física siguen sin establecerse.',
    publications: 'Acceso al corpus',
    indexed: 'registros de artículos indexados',
    versions: 'Registros versionados y DOI conceptuales cuando se declaran',
    aiFiles: 'Catálogo e interfaces para IA',
    orcid: 'Registro ORCID del autor',
  },
  fr: {
    title: 'Cohérence de Résonance Fractale',
    statement:
      'Un programme de recherche étiqueté par statut sur la réciprocité entropie-cohérence dans les systèmes ouverts, distinguant mathématiques exactes, résultats de modèle et conjectures physiques.',
    formulaNote: 'Relation comptable canonique (FRC 566.001). La réciprocité physique universelle reste une conjecture ouverte.',
    startHereCta: 'Commencer ici',
    pillarPapersTitle: 'Articles actifs',
    pillarPapersIds: '566.001 · 830.000–005 · 700.000–007 · 787.787 · 826.829',
    pillarPapersDesc: 'Réciprocité canonique, mathématiques exactes du registre, série-cadre des seuils et protocoles empiriques cadrés.',
    pillarPapersLink: 'Parcourir les articles',
    pillarBooksTitle: 'Livres 2026',
    pillarBooksDesc: 'The Open System et The Mind in the Coupling : éditions philosophiques actuelles, séparées des ouvrages archivés de 2025.',
    pillarBooksLink: 'Explorer les livres',
    pillarLedgerTitle: 'Registre des réfutations et portes négatives',
    pillarLedgerDesc: 'Portes empiriques fermées négativement, contradictions, obstructions mathématiques et thèses retirées de 2025.',
    pillarLedgerLink: 'Consulter le registre',
    startHere: 'Parcours canonique',
    equations: 'Quatre repères, quatre statuts',
    allFormulas: 'Index des formules',
    canonical: 'Relation canonique',
    exact: 'Identité exacte de von Mises',
    observable: 'Fonctionnelle de structure du chaos',
    criterion: 'Cible de transition de localisation',
    currentWork: 'Programme actuel',
    work1: 'FRC 830.000–830.005 : FRC 830.005 v0.3 (sur alphaXiv, 42/42 vérifications) exclut tout relèvement affine/CPTP sur tout ouvert cohérent du qubit ; restent ouverts l’intérieur vide, les instruments projectifs et d ≥ 3.',
    work2: 'FRC 700.000–700.007 : relecture indépendante de la série-cadre des seuils remplaçant FRC 700.777.',
    work3: 'FRC 100.002 / 100.002.001 et 787.787 : la Porte 4 dense est fermée négativement ; les portes quantiques et de plateforme restent ouvertes.',
    evidence: 'Limites des affirmations',
    established: 'Mathématiques exactes et négatifs',
    establishedText: 'Identités prouvées, obstructions cadrées et résultats négatifs retenus (dont la Porte 4 dense).',
    active: 'Cadre et modèles cadrés',
    activeText: 'Discipline des registres (FRC 700.000–700.007), modèles de chaos et protocoles opérationnels.',
    conjectural: 'Conjectures et portes ouvertes',
    conjecturalText: 'Réciprocité physique universelle, champ Lambda fondamental, règle de Born et auto-dualité physique restent non établies.',
    publications: 'Accès au corpus',
    indexed: 'articles indexés',
    versions: 'Versions et DOI conceptuels lorsqu’ils sont déclarés',
    aiFiles: 'Catalogue et points d’entrée pour IA',
    orcid: 'Fiche ORCID de l’auteur',
  },
  fa: {
    title: 'همدوسی رزونانس فراکتال',
    statement:
      'برنامه پژوهشی برچسب‌گذاری‌شده درباره تقابل آنتروپی-همدوسی در سامانه‌های باز، با تفکیک روشن میان ریاضیات دقیق، شواهد وابسته به مدل و حدس‌های فیزیکی باز.',
    formulaNote: 'رابطه حسابداری کانونیک (FRC 566.001). جهان‌شمولی فیزیکی تقابل همچنان یک حدس باز است.',
    startHereCta: 'شروع از اینجا',
    pillarPapersTitle: 'مقاله‌های فعال',
    pillarPapersIds: '566.001 · 830.000–005 · 700.000–007 · 787.787 · 826.829',
    pillarPapersDesc: 'تقابل کانونیک، ریاضیات دقیق دفتر، مجموعه چارچوب آستانه و پروتکل‌های تجربی محدود.',
    pillarPapersLink: 'مرور مقاله‌ها',
    pillarBooksTitle: 'کتاب‌های ۲۰۲۶',
    pillarBooksDesc: 'The Open System و The Mind in the Coupling: ویرایش‌های فلسفی جاری، جدا از کتاب‌های بایگانی‌شده ۲۰۲۵.',
    pillarBooksLink: 'مشاهده کتاب‌ها',
    pillarLedgerTitle: 'دفتر ابطال‌ها و دروازه‌های منفی',
    pillarLedgerDesc: 'دروازه‌های تجربی بسته‌شده به‌صورت منفی، تناقض‌ها، انسدادهای ریاضی و ادعاهای بازنشسته ۲۰۲۵.',
    pillarLedgerLink: 'بررسی دفتر ابطال‌ها',
    startHere: 'مسیر مطالعه اصلی',
    equations: 'چهار لنگر، چهار وضعیت',
    allFormulas: 'فهرست فرمول‌ها',
    canonical: 'رابطه بنیادی',
    exact: 'همانی دقیق فون‌مایزز',
    observable: 'تابع ساختار آشوب',
    criterion: 'هدف گذار موضعی‌شدن',
    currentWork: 'برنامه کنونی',
    work1: 'FRC 830.000–830.005: نسخه FRC 830.005 v0.3 (در alphaXiv، ۴۲/۴۲ آزمون تأییدشده) بالابری آفین/CPTP روی زیرمجموعه‌های باز همدوس کیوبیت را رد می‌کند؛ زیرمجموعه‌های با درونِ تهی، ابزارهای تصویری و d ≥ 3 همچنان بازند.',
    work2: 'FRC 700.000–700.007: داوری مستقل مجموعه چارچوب آستانه که جایگزین FRC 700.777 شده است.',
    work3: 'FRC 100.002 / 100.002.001 و 787.787: دروازه ۴ متراکم به‌صورت منفی بسته شد؛ دروازه‌های کوانتومی و بسترهای مستقل همچنان بازند.',
    evidence: 'مرز ادعاها',
    established: 'ریاضیات دقیق و نتایج منفی',
    establishedText: 'همانی‌های اثبات‌شده، انسدادهای محدود و نتایج منفی حفظ‌شده (از جمله دروازه ۴ متراکم).',
    active: 'چارچوب و مدل‌های محدود',
    activeText: 'انضباط ثبت‌های μ (FRC 700.000–700.007)، مدل‌های آشوب و پروتکل‌های عملیاتی.',
    conjectural: 'حدس‌ها و دروازه‌های باز',
    conjecturalText: 'جهان‌شمولی فیزیکی تقابل، میدان بنیادی لاندا، استخراج قاعده بورن و خوددوگانی فیزیکی اثبات نشده‌اند.',
    publications: 'دسترسی به پیکره',
    indexed: 'رکورد مقاله نمایه‌شده',
    versions: 'نسخه‌ها و DOI مفهومی در صورت اعلام',
    aiFiles: 'فهرست و ورودی‌های ماشین‌خوان',
    orcid: 'رکورد ORCID نویسنده',
  },
};

export async function HomeHub({ lang, view }: { lang: string; view: PerspectiveView }) {
  const basePath = getBasePath(lang, view);
  const papers = getPapers(lang);
  const glossary = getGlossary(lang, { basePath, view });
  const home = getHomeConfig(lang);
  const researchMap = buildResearchMap(lang, basePath);
  const ledger = getFalsificationLedger();
  const c = DICT[lang] || DICT.en;

  const enPaperMap = new Map(getPapers('en').map((p) => [p.frontmatter.id, p]));
  const langPaperMap = new Map(papers.map((p) => [p.frontmatter.id, p]));
  const staticTargets = new Set(['about', 'articles', 'papers', 'books', 'formulas', 'positioning', 'mu-levels', 'graph', 'privacy', 'terms', 'falsifications']);
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
      {/* Opening research portal sheet — direct into content, clean hairline discipline */}
      <section className="border-b border-frc-blue">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-frc-gold tracking-[-0.03em] leading-[1.08] mb-5">
              {c.title}
            </h1>
            <p className="text-base sm:text-lg text-frc-text leading-relaxed max-w-[65ch] mb-7">
              {c.statement}
            </p>
          </div>

          {/* Falsifiable mathematical anchor + primary CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-frc-blue py-5 mb-9">
            <Link href={resolveTarget('FRC-566-001')} className="group min-w-0">
              <div className="text-xl sm:text-2xl text-frc-gold-light group-hover:text-frc-gold transition-colors tracking-tight">
                <span className="font-mono inline-block" dir="ltr">
                  dS + k<span className="text-frc-gold">*</span> d ln C = 0
                </span>
              </div>
              <p className="text-sm text-frc-text-dim mt-1.5 leading-relaxed">
                {c.formulaNote}
              </p>
            </Link>
            <div className="shrink-0">
              <Link
                href={`${basePath}/start-here`}
                className="inline-flex items-center px-5 py-2.5 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium transition-colors"
              >
                {c.startHereCta}
              </Link>
            </div>
          </div>

          {/* 3-pillar entry — clean hairline columns, zero card-cages */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-frc-blue/70">
            <div className="pb-6 md:pb-0 md:pe-7 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-medium text-frc-text mb-1.5">
                  <Link href={`${basePath}/papers`} className="hover:text-frc-gold transition-colors">
                    {c.pillarPapersTitle}
                  </Link>
                </h2>
                <p className="text-[0.8125rem] text-frc-gold mb-2 tabular-nums">
                  <span className="font-mono inline-block" dir="ltr">{c.pillarPapersIds}</span>
                </p>
                <p className="text-sm text-frc-text-dim leading-relaxed">
                  {c.pillarPapersDesc}
                </p>
              </div>
              <Link href={`${basePath}/papers`} className="inline-block mt-4 text-sm text-frc-gold hover:underline">
                {c.pillarPapersLink} →
              </Link>
            </div>

            <div className="py-6 md:py-0 md:px-7 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-medium text-frc-text mb-1.5">
                  <Link href={`${basePath}/books`} className="hover:text-frc-gold transition-colors">
                    {c.pillarBooksTitle}
                  </Link>
                </h2>
                <p className="font-mono text-[0.8125rem] text-frc-steel mb-2">
                  The Open System · The Mind in the Coupling
                </p>
                <p className="text-sm text-frc-text-dim leading-relaxed">
                  {c.pillarBooksDesc}
                </p>
              </div>
              <Link href={`${basePath}/books`} className="inline-block mt-4 text-sm text-frc-gold hover:underline">
                {c.pillarBooksLink} →
              </Link>
            </div>

            <div className="pt-6 md:pt-0 md:ps-7 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-medium text-frc-text mb-1.5">
                  <Link href={`${basePath}/falsifications`} className="hover:text-frc-gold transition-colors">
                    {c.pillarLedgerTitle}
                  </Link>
                </h2>
                <p className="font-mono text-[0.8125rem] text-frc-steel mb-2 tabular-nums">
                  {ledger.summary.totalEntries} entries · v{ledger.version}
                </p>
                <p className="text-sm text-frc-text-dim leading-relaxed">
                  {c.pillarLedgerDesc}
                </p>
              </div>
              <Link href={`${basePath}/falsifications`} className="inline-block mt-4 text-sm text-frc-gold hover:underline">
                {c.pillarLedgerLink} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FRC v3 1-Slide Visual Abstract & 7-Slide Overview Deck */}
      <VisualAbstractShowcase lang={lang} variant="home" />

      {/* Canonical reading path */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-b border-frc-blue/60">
        <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-6">
          {c.startHere}
        </h2>
        <ol className="grid md:grid-cols-3 gap-8">
          {startHere.map((item) => (
            <li key={item.k} className="border-t border-frc-blue pt-4">
              <Link href={item.href} className="group block">
                <span className="font-mono text-sm text-frc-gold tabular-nums">{item.k}</span>
                <h3 className="text-base font-medium text-frc-text group-hover:text-frc-gold transition-colors leading-snug mt-2">
                  {item.title}
                </h3>
                <p className="text-sm text-frc-text-dim mt-2 leading-relaxed">{item.desc}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <ResearchMapSection data={researchMap} lang={lang} />

      {/* Four mathematical anchors */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-b border-frc-blue/60">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em]">{c.equations}</h2>
          <Link href={`${basePath}/formulas`} className="text-sm text-frc-gold hover:underline">
            {c.allFormulas} →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <div className="border-t border-frc-blue pt-4">
            <div className="text-sm font-medium text-frc-text mb-2">{c.canonical}</div>
            <p className="font-mono text-lg text-frc-gold-light mb-2" dir="ltr">dS + k* d ln C = 0</p>
            <p className="text-sm text-frc-text-dim">FRC 566.001 · physical universality conjectural</p>
          </div>
          <div className="border-t border-frc-blue pt-4">
            <div className="text-sm font-medium text-frc-text mb-2">{c.exact}</div>
            <p className="font-mono text-lg text-frc-gold-light mb-2" dir="ltr">dS / d ln C = −κr</p>
            <p className="text-sm text-frc-text-dim">FRC 566.030 · exact for the declared family</p>
          </div>
          <div className="border-t border-frc-blue pt-4">
            <div className="text-sm font-medium text-frc-text mb-2">{c.observable}</div>
            <p className="font-mono text-lg text-frc-gold-light mb-2" dir="ltr">Σ = S<sub>vM</sub>(C) − S ≥ 0</p>
            <p className="text-sm text-frc-text-dim">FRC 100.002 · pilot-supported observable</p>
          </div>
          <div className="border-t border-frc-blue pt-4">
            <div className="text-sm font-medium text-frc-text mb-2">{c.criterion}</div>
            <p className="font-mono text-lg text-frc-gold-light mb-2" dir="ltr">t* γ<sub>C</sub> = O(1)</p>
            <p className="text-sm text-frc-text-dim">FRC 100.002 · tolerance band still open</p>
          </div>
        </div>
      </section>

      {/* Current program & Claim boundaries */}
      <section className="bg-frc-void-light border-b border-frc-blue">
        <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1.1fr_1.9fr] gap-12">
          <div>
            <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-5">{c.currentWork}</h2>
            <ol className="space-y-4 text-sm text-frc-text-dim leading-relaxed">
              {[c.work1, c.work2, c.work3].map((text, index) => (
                <li key={text} className="flex gap-3">
                  <span className="font-mono text-sm text-frc-gold tabular-nums shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-5">{c.evidence}</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="border-t border-frc-gold pt-3">
                <h3 className="text-base font-medium text-frc-text mb-2">{c.established}</h3>
                <p className="text-sm text-frc-text-dim leading-relaxed">{c.establishedText}</p>
              </div>
              <div className="border-t border-frc-blue-light pt-3">
                <h3 className="text-base font-medium text-frc-text mb-2">{c.active}</h3>
                <p className="text-sm text-frc-text-dim leading-relaxed">{c.activeText}</p>
              </div>
              <div className="border-t border-frc-steel pt-3">
                <h3 className="text-base font-medium text-frc-text mb-2">{c.conjectural}</h3>
                <p className="text-sm text-frc-text-dim leading-relaxed">{c.conjecturalText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corpus access */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-base font-medium text-frc-text mb-4">{c.publications}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-frc-text-dim tabular-nums">
            <span>{researchMap.totalPublishedEnglishPapers} {c.indexed}</span>
            <span>{c.versions}</span>
            <Link href="/for-ai" className="text-frc-gold hover:underline">{c.aiFiles}</Link>
            <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="hover:text-frc-gold transition-colors">
              {c.orcid}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
