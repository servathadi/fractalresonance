import React from 'react';
import type { ResearchMapData } from '../lib/research-map';

interface CopyBlock {
  sectionTitle: string;
  sectionSubtitle: string;
  statusLegendTitle: string;
  exactLabel: string;
  exactDesc: string;
  frameworkLabel: string;
  frameworkDesc: string;
  modelLabel: string;
  modelDesc: string;
  conjectureLabel: string;
  conjectureDesc: string;
  canonicalHeading: string;
  reciprocityHeading: string;
  reciprocityIntro: string;
  zenodoConcept: string;
  zenodoVersion: string;
  readPaper: string;
  pdfLabel: string;
  thresholdHeading: string;
  thresholdIntro: string;
  historicalContextLabel: string;
  empiricalHeading: string;
  empiricalIntro: string;
  boundariesHeading: string;
  boundaries: string[];
}

const COPY: Record<string, CopyBlock> = {
  en: {
    sectionTitle: 'Current research map',
    sectionSubtitle: 'Active FRC series and scoped empirical programs with status boundaries visible before entering a paper.',
    statusLegendTitle: 'Scientific status distinctions',
    exactLabel: 'Exact mathematics',
    exactDesc: 'Proved identities, typed morphisms, and scoped lift obstructions under stated hypotheses (e.g., FRC 566.030, FRC 830.001–830.005; symbolic/numerical audit complete for 830.005 v0.3, human peer review pending).',
    frameworkLabel: 'Framework / methodology',
    frameworkDesc: 'Scope conventions, terminology charters, and μ-register discipline that organize claims without adding physical laws (FRC 700.000–700.007, FRC 830.000).',
    modelLabel: 'Model-specific results',
    modelDesc: 'Numerical, simulation, and narrow-audit findings valid only inside their declared model and normalization, including retained negative results.',
    conjectureLabel: 'Conjectures & empirical gates',
    conjectureDesc: 'Unestablished physical extensions and explicit falsification, platform, and no-signaling gates (including closed negative gates such as dense Gate 4 in FRC 100.002.001).',
    canonicalHeading: 'Canonical reciprocity statement',
    reciprocityHeading: 'Reciprocity Mathematics (FRC 830.000–830.005)',
    reciprocityIntro: 'Terminology charter, affine one-form classification, typed operational morphisms, and exact one-parameter/qubit lift obstructions. FRC 830.005 v0.3 (live on alphaXiv) excludes every affine/CPTP qubit channel on any nonempty open coherent subset of the Bloch ball (sharp on 1D circles); empty-interior, projective-instrument, and higher-dimensional gates remain open, and no Born or Majid-style self-duality is established.',
    zenodoConcept: 'Shared Zenodo Concept DOI',
    zenodoVersion: 'v0.1 Bundle DOI',
    readPaper: 'Web page',
    pdfLabel: 'PDF',
    thresholdHeading: 'Threshold Papers (FRC 700.000–700.007)',
    thresholdIntro: 'Active framework series governing evidence classes, selective interfaces, recursive boundaries, and register discipline (preprints, independent review pending). Adds no new physical law, proved universal μ hierarchy, or cross-register causation.',
    historicalContextLabel: 'Superseded historical origin context (not current 700-series framework):',
    empiricalHeading: 'Scoped empirical & model-specific programs',
    empiricalIntro: 'Active numerical and operational protocols with retained negative results and explicit promotion gates.',
    boundariesHeading: 'Explicit non-claims',
    boundaries: [
      'The Born rule is not derived by FRC; current work contains conditional proposals with open dynamics, Born-weight, and no-signaling gates.',
      'There is no fixed universal Born-deviation range; any deviation claim belongs to a declared model and protocol.',
      'The μ-register topology is a scope and navigation convention, not a proved universal hierarchy or cross-register causal mechanism.',
      'Exact FRC 830 ledger results and obstructions do not establish physical, categorical, or Majid-style self-duality.',
    ],
  },
  es: {
    sectionTitle: 'Mapa de investigación actual',
    sectionSubtitle: 'Series activas de FRC y programas empíricos acotados con etiquetas de estado visibles antes de entrar en cada artículo. Los enlaces a series aún no traducidas abren la edición canónica en inglés.',
    statusLegendTitle: 'Distinciones de estado científico',
    exactLabel: 'Matemática exacta',
    exactDesc: 'Identidades demostradas, morfismos tipados y obstrucciones de elevación acotadas bajo hipótesis declaradas (FRC 566.030, FRC 830.001–830.005; revisión independiente pendiente).',
    frameworkLabel: 'Marco / metodología',
    frameworkDesc: 'Convenciones de alcance, cartas terminológicas y disciplina de registros μ sin añadir leyes físicas ni jerarquías probadas (FRC 700.000–700.007, FRC 830.000).',
    modelLabel: 'Resultados específicos de modelo',
    modelDesc: 'Hallazgos numéricos, simulaciones y auditorías acotadas a su modelo y normalización declarados, incluidos resultados negativos retenidos.',
    conjectureLabel: 'Conjeturas y puertas empíricas',
    conjectureDesc: 'Extensiones físicas no establecidas y criterios explícitos de falsación o validación en plataformas (incluida la Puerta 4 densa cerrada negativamente en FRC 100.002.001).',
    canonicalHeading: 'Declaración canónica de reciprocidad',
    reciprocityHeading: 'Matemática de la Reciprocidad (FRC 830.000–830.005)',
    reciprocityIntro: 'Carta terminológica, clasificación afín, morfismos operacionales y obstrucciones exactas de elevación. FRC 830.005 v0.3 (en alphaXiv) excluye todo canal CPTP/afín de qubit en abiertos coherentes (óptimo en círculos 1D); siguen abiertas las puertas de interior vacío, instrumentos proyectivos y d ≥ 3, sin autodualidad de Born ni de Majid.',
    zenodoConcept: 'DOI conceptual compartido en Zenodo',
    zenodoVersion: 'DOI del conjunto v0.1',
    readPaper: 'Página web',
    pdfLabel: 'PDF',
    thresholdHeading: 'Artículos de Umbral (FRC 700.000–700.007)',
    thresholdIntro: 'Serie marco activa que rige clases de evidencia, interfaces selectivas y disciplina de registros (preprints, revisión independiente pendiente). No establece una ley física ni una jerarquía μ universal probada.',
    historicalContextLabel: 'Contexto histórico sustituido (no es el marco actual de la serie 700):',
    empiricalHeading: 'Programas empíricos y específicos de modelo',
    empiricalIntro: 'Protocolos numéricos y operacionales activos con resultados negativos retenidos y puertas explícitas.',
    boundariesHeading: 'Límites explícitos (lo que FRC no afirma)',
    boundaries: [
      'FRC no ha derivado la regla de Born; existen propuestas condicionales con puertas abiertas de dinámica, pesos de Born y no señalización.',
      'No existe un rango universal fijo de desviación de la regla de Born.',
      'La topología de registros μ es una convención de alcance, no una jerarquía universal demostrada.',
      'Los resultados exactos de FRC 830 no establecen autodualidad física ni de tipo Majid.',
    ],
  },
  fr: {
    sectionTitle: 'Carte de recherche actuelle',
    sectionSubtitle: 'Séries FRC actives et programmes empiriques cadrés avec statuts visibles avant d’ouvrir un article. Les séries non encore traduites renvoient vers l’édition canonique anglaise.',
    statusLegendTitle: 'Distinctions de statut scientifique',
    exactLabel: 'Mathématiques exactes',
    exactDesc: 'Identités démontrées, morphismes typés et obstructions de relèvement sous hypothèses explicites (FRC 566.030, FRC 830.001–830.005 ; relecture indépendante en attente).',
    frameworkLabel: 'Cadre / méthodologie',
    frameworkDesc: 'Conventions de portée, chartes terminologiques et discipline des registres μ sans ajouter de loi physique (FRC 700.000–700.007, FRC 830.000).',
    modelLabel: 'Résultats propres au modèle',
    modelDesc: 'Résultats numériques, simulations et audits limités à leur modèle et normalisation déclarés, y compris les résultats négatifs retenus.',
    conjectureLabel: 'Conjectures et portes empiriques',
    conjectureDesc: 'Extensions physiques non établies et critères explicites de réfutation ou de validation (y compris la Porte 4 dense fermée négativement dans FRC 100.002.001).',
    canonicalHeading: 'Énoncé canonique de réciprocité',
    reciprocityHeading: 'Mathématiques de la Réciprocité (FRC 830.000–830.005)',
    reciprocityIntro: 'Charte terminologique, classification affine, morphismes opérationnels et obstructions exactes de relèvement. FRC 830.005 v0.3 (sur alphaXiv) exclut tout canal CPTP/affine de qubit sur tout ouvert cohérent (optimal sur des cercles 1D) ; restent ouverts les sous-ensembles d’intérieur vide, instruments projectifs et d ≥ 3, sans auto-dualité de Born ni de Majid.',
    zenodoConcept: 'DOI conceptuel partagé Zenodo',
    zenodoVersion: 'DOI du lot v0.1',
    readPaper: 'Page web',
    pdfLabel: 'PDF',
    thresholdHeading: 'Articles de Seuil (FRC 700.000–700.007)',
    thresholdIntro: 'Série-cadre active régissant classes de preuve, interfaces sélectives et discipline des registres (prépublications, relecture indépendante en attente). N’établit ni nouvelle loi physique ni hiérarchie μ universelle prouvée.',
    historicalContextLabel: 'Contexte historique remplacé (ne constitue pas le cadre actuel 700) :',
    empiricalHeading: 'Programmes empiriques et propres au modèle',
    empiricalIntro: 'Protocoles numériques et opérationnels actifs avec résultats négatifs retenus et portes de validation explicites.',
    boundariesHeading: 'Non-revendications explicites',
    boundaries: [
      'La règle de Born n’est pas dérivée par FRC ; le corpus présente des propositions conditionnelles avec portes ouvertes.',
      'Il n’existe aucune plage universelle fixe de déviation par rapport à la règle de Born.',
      'La topologie des registres μ est une convention de portée, non une hiérarchie universelle prouvée.',
      'Les résultats exacts de FRC 830 n’établissent pas d’auto-dualité physique ni de type Majid.',
    ],
  },
  fa: {
    sectionTitle: 'نقشه پژوهشی کنونی',
    sectionSubtitle: 'مجموعه‌های فعال FRC و برنامه‌های تجربی محدود با برچسب‌های وضعیت علمی پیش از ورود به هر مقاله. مجموعه‌هایی که هنوز ترجمه نشده‌اند به نسخه مرجع انگلیسی پیوند داده می‌شوند.',
    statusLegendTitle: 'تفکیک وضعیت‌های علمی',
    exactLabel: 'ریاضیات دقیق',
    exactDesc: 'همانی‌های اثبات‌شده، ریخت‌های تایپ‌شده و انسدادهای بالابری تحت فرض‌های صریح (FRC 566.030 و FRC 830.001–830.005؛ در انتظار داوری مستقل).',
    frameworkLabel: 'چارچوب / روش‌شناسی',
    frameworkDesc: 'قراردادهای دامنه، منشورهای واژگانی و انضباط ثبت‌های μ بدون افزودن قانون فیزیکی جدید (FRC 700.000–700.007 و FRC 830.000).',
    modelLabel: 'نتایج وابسته به مدل',
    modelDesc: 'یافته‌های عددی، شبیه‌سازی‌ها و ممیزی‌های محدود به مدل و نرمال‌سازی اعلام‌شده، از جمله نتایج منفی حفظ‌شده.',
    conjectureLabel: 'حدس‌ها و دروازه‌های تجربی',
    conjectureDesc: 'تعمیم‌های فیزیکی اثبات‌نشده و معیارهای صریح ابطال و آزمون بستر (از جمله دروازه ۴ متراکم بسته‌شده به‌صورت منفی در FRC 100.002.001).',
    canonicalHeading: 'بیان کانونیک تقابل',
    reciprocityHeading: 'ریاضیات تقابل (FRC 830.000–830.005)',
    reciprocityIntro: 'منشور واژگانی، رده‌بندی آفین، ریخت‌های عملیاتی و انسدادهای دقیق بالابری. نسخه FRC 830.005 v0.3 (منتشرشده در alphaXiv) هر کانال CPTP یا نگاشت آفین کیوبیتی را بر هر زیرمجموعه باز همدوس رد می‌کند (دقیق روی دایره‌های یک‌بعدی)؛ دروازه‌های زیرمجموعه‌های با درونِ تهی، ابزارهای تصویری و d ≥ 3 همچنان بازند و خوددوگانی بورن یا مجید اثبات نشده است.',
    zenodoConcept: 'DOI مفهومی مشترک Zenodo',
    zenodoVersion: 'DOI بسته نسخه v0.1',
    readPaper: 'صفحه وب',
    pdfLabel: 'PDF',
    thresholdHeading: 'مقالات آستانه (FRC 700.000–700.007)',
    thresholdIntro: 'مجموعه چارچوب فعال برای طبقه‌بندی شواهد، واسط‌های گزینشی و انضباط ثبت‌ها (پیش‌چاپ، در انتظار داوری مستقل). هیچ قانون فیزیکی جدید یا سلسله‌مراتب جهانی اثبات‌شده μ ایجاد نمی‌کند.',
    historicalContextLabel: 'زمینه تاریخی جایگزین‌شده (چارچوب کنونی سری ۷۰۰ نیست):',
    empiricalHeading: 'برنامه‌های تجربی و وابسته به مدل',
    empiricalIntro: 'پروتکل‌های عددی و عملیاتی فعال با نتایج منفی حفظ‌شده و دروازه‌های صریح.',
    boundariesHeading: 'مرزهای صریح عدم ادعا',
    boundaries: [
      'قاعده بورن در FRC اثبات یا استخراج نشده است؛ کارهای کنونی پیشنهادهای شرطی با دروازه‌های باز هستند.',
      'هیچ بازه جهانی ثابتی برای انحراف از قاعده بورن وجود ندارد.',
      'توپولوژی ثبت‌های μ صرفاً قرارداد دامنه است و سلسله‌مراتب جهانی اثبات‌شده نیست.',
      'نتایج دقیق FRC 830 خوددوگانی فیزیکی یا از نوع مجید را اثبات نمی‌کنند.',
    ],
  },
};

export function ResearchMapSection({
  data,
  lang,
}: {
  data: ResearchMapData;
  lang: string;
  sectionMarker?: string;
}) {
  const c = COPY[lang] || COPY.en;

  return (
    <section className="border-b border-frc-blue bg-frc-void-light" aria-labelledby="current-research-map">
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">
        {/* Heading */}
        <div className="max-w-3xl">
          <h2 id="current-research-map" className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-2">
            {c.sectionTitle}
          </h2>
          <p className="text-sm text-frc-text-dim leading-relaxed">
            {c.sectionSubtitle}
          </p>
        </div>

        {/* Status taxonomy legend — clean hairline columns */}
        <div className="border-y border-frc-blue py-6">
          <h3 className="text-sm font-medium text-frc-gold mb-4">
            {c.statusLegendTitle}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-s-2 border-frc-gold ps-3.5 min-w-0">
              <div className="text-sm font-medium text-frc-text mb-1">{c.exactLabel}</div>
              <p className="text-sm text-frc-text-dim leading-relaxed">{c.exactDesc}</p>
            </div>
            <div className="border-s-2 border-frc-blue-light ps-3.5 min-w-0">
              <div className="text-sm font-medium text-frc-text mb-1">{c.frameworkLabel}</div>
              <p className="text-sm text-frc-text-dim leading-relaxed">{c.frameworkDesc}</p>
            </div>
            <div className="border-s-2 border-frc-steel ps-3.5 min-w-0">
              <div className="text-sm font-medium text-frc-text mb-1">{c.modelLabel}</div>
              <p className="text-sm text-frc-text-dim leading-relaxed">{c.modelDesc}</p>
            </div>
            <div className="border-s-2 border-frc-gold/60 ps-3.5 min-w-0">
              <div className="text-sm font-medium text-frc-text mb-1">{c.conjectureLabel}</div>
              <p className="text-sm text-frc-text-dim leading-relaxed">{c.conjectureDesc}</p>
            </div>
          </div>
        </div>

        {/* 1. Canonical Reciprocity Statement (FRC 566.001) */}
        {data.canonicalReciprocity && (
          <div className="border-s-2 border-frc-gold ps-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
              <h3 className="text-sm font-medium text-frc-gold">{c.canonicalHeading}</h3>
              <span className="font-mono text-[0.8125rem] text-frc-text-dim">
                {data.canonicalReciprocity.statusBadge}
              </span>
            </div>
            <div className="font-mono text-sm text-frc-gold mb-1 tabular-nums">
              {data.canonicalReciprocity.id}{data.canonicalReciprocity.version ? ` · ${data.canonicalReciprocity.version}` : ''}
            </div>
            <a
              href={data.canonicalReciprocity.href}
              className="text-base text-frc-text hover:text-frc-gold transition-colors font-medium block mb-2"
            >
              {data.canonicalReciprocity.title}
            </a>
            <p className="text-sm text-frc-text-dim leading-relaxed max-w-[65ch] mb-3">
              {data.canonicalReciprocity.summary}
            </p>
            <div className="flex flex-wrap gap-5 text-sm">
              <a href={data.canonicalReciprocity.href} className="text-frc-gold hover:underline">
                {c.readPaper} →
              </a>
              {data.canonicalReciprocity.pdfHref && (
                <a href={data.canonicalReciprocity.pdfHref} className="text-frc-text-dim hover:text-frc-gold">
                  {c.pdfLabel}
                </a>
              )}
              {data.canonicalReciprocity.conceptDoi && (
                <a
                  href={`https://doi.org/${data.canonicalReciprocity.conceptDoi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.8125rem] text-frc-steel hover:text-frc-gold"
                >
                  Concept DOI: {data.canonicalReciprocity.conceptDoi}
                </a>
              )}
            </div>
          </div>
        )}

        {/* 2. Reciprocity Mathematics (FRC 830.000–830.005) */}
        {data.reciprocityMathematics.papers.length > 0 && (
          <div className="pt-2 border-t border-frc-blue">
            <div className="flex flex-wrap items-baseline justify-between gap-3 pt-6 mb-2">
              <h3 className="text-base font-medium text-frc-text">
                {c.reciprocityHeading}
              </h3>
              <div className="flex flex-wrap gap-4 font-mono text-[0.8125rem]">
                {data.reciprocityMathematics.sharedConceptDoi && (
                  <a
                    href={`https://doi.org/${data.reciprocityMathematics.sharedConceptDoi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-frc-gold hover:underline"
                  >
                    {c.zenodoConcept}: {data.reciprocityMathematics.sharedConceptDoi}
                  </a>
                )}
                {data.reciprocityMathematics.sharedVersionDoi && (
                  <a
                    href={`https://doi.org/${data.reciprocityMathematics.sharedVersionDoi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-frc-steel hover:text-frc-gold"
                  >
                    {c.zenodoVersion}: {data.reciprocityMathematics.sharedVersionDoi}
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm text-frc-text-dim max-w-[68ch] leading-relaxed mb-6">
              {c.reciprocityIntro}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {data.reciprocityMathematics.papers.map((paper) => (
                <article key={paper.id} className="border-t border-frc-blue/80 pt-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="font-mono text-[0.8125rem] text-frc-gold mb-1 tabular-nums">
                      {paper.id}{paper.version ? ` · ${paper.version}` : ''}
                    </div>
                    <div className="text-[0.8125rem] text-frc-steel mb-2">
                      {paper.statusBadge}
                    </div>
                    <h4 className="text-base font-medium text-frc-text leading-snug mb-2">
                      <a href={paper.href} className="hover:text-frc-gold transition-colors">
                        {paper.title}
                      </a>
                    </h4>
                    <p className="text-sm text-frc-text-dim leading-relaxed mb-3">
                      {paper.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <a href={paper.href} className="text-frc-gold hover:underline">
                      {c.readPaper} →
                    </a>
                    {paper.pdfHref && (
                      <a href={paper.pdfHref} className="text-frc-text-dim hover:text-frc-gold">
                        {c.pdfLabel}
                      </a>
                    )}
                    {paper.alphaxivUrl && /^https:\/\//i.test(paper.alphaxivUrl) && (
                      <a
                        href={paper.alphaxivUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frc-gold/90 hover:text-frc-gold hover:underline"
                      >
                        alphaXiv ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 3. Threshold Papers (FRC 700.000–700.007) + Superseded Historical Link */}
        {data.thresholdPapers.length > 0 && (
          <div className="pt-2 border-t border-frc-blue">
            <h3 className="text-base font-medium text-frc-text pt-6 mb-2">
              {c.thresholdHeading}
            </h3>
            <p className="text-sm text-frc-text-dim max-w-[68ch] leading-relaxed mb-6">
              {c.thresholdIntro}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
              {data.thresholdPapers.map((paper) => (
                <article key={paper.id} className="border-t border-frc-blue/80 pt-3.5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="font-mono text-[0.8125rem] text-frc-gold mb-1 tabular-nums">
                      {paper.id}{paper.version ? ` · ${paper.version}` : ''}
                    </div>
                    <div className="text-[0.8125rem] text-frc-steel mb-1.5">
                      {paper.statusBadge}
                    </div>
                    <h4 className="text-sm font-medium text-frc-text leading-snug mb-2">
                      <a href={paper.href} className="hover:text-frc-gold transition-colors">
                        {paper.title}
                      </a>
                    </h4>
                  </div>
                  <div className="text-sm">
                    <a href={paper.href} className="text-frc-gold hover:underline">
                      {c.readPaper} →
                    </a>
                  </div>
                </article>
              ))}
            </div>
            {data.supersededOrigin && (
              <div className="mt-6 border-s-2 border-frc-steel ps-4 py-1 text-sm text-frc-steel">
                <span>{c.historicalContextLabel} </span>
                <a href={data.supersededOrigin.href} className="text-frc-text-dim hover:text-frc-gold underline font-mono">
                  {data.supersededOrigin.id}
                </a>
                <span> ({data.supersededOrigin.note})</span>
              </div>
            )}
          </div>
        )}

        {/* 4. Scoped Empirical & Model-Specific Programs */}
        {data.empiricalPrograms.length > 0 && (
          <div className="pt-2 border-t border-frc-blue">
            <h3 className="text-base font-medium text-frc-text pt-6 mb-2">
              {c.empiricalHeading}
            </h3>
            <p className="text-sm text-frc-text-dim max-w-[68ch] leading-relaxed mb-6">
              {c.empiricalIntro}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {data.empiricalPrograms.map((paper) => (
                <article key={paper.id} className="border-t border-frc-blue/80 pt-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="font-mono text-[0.8125rem] text-frc-gold mb-1 tabular-nums">
                      {paper.id}{paper.version ? ` · ${paper.version}` : ''}
                    </div>
                    <div className="text-[0.8125rem] text-frc-steel mb-2">
                      {paper.statusBadge}
                    </div>
                    <h4 className="text-base font-medium text-frc-text leading-snug mb-2">
                      <a href={paper.href} className="hover:text-frc-gold transition-colors">
                        {paper.title}
                      </a>
                    </h4>
                    <p className="text-sm text-frc-text-dim leading-relaxed mb-3">
                      {paper.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <a href={paper.href} className="text-frc-gold hover:underline">
                      {c.readPaper} →
                    </a>
                    {paper.pdfHref && (
                      <a href={paper.pdfHref} className="text-frc-text-dim hover:text-frc-gold">
                        {c.pdfLabel}
                      </a>
                    )}
                    {paper.alphaxivUrl && /^https:\/\//i.test(paper.alphaxivUrl) && (
                      <a
                        href={paper.alphaxivUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frc-gold/90 hover:text-frc-gold hover:underline"
                      >
                        alphaXiv ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 5. Explicit Non-Claims / Claim Boundaries */}
        <div className="pt-6 border-t border-frc-blue">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h3 className="text-base font-medium text-frc-text">
              {c.boundariesHeading}
            </h3>
            <a
              href={`/${lang}/falsifications`}
              className="text-sm text-frc-gold hover:underline"
            >
              Public Falsification &amp; Negative-Gate Ledger →
            </a>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-frc-text-dim leading-relaxed">
            {c.boundaries.map((line) => (
              <li key={line} className="border-s border-frc-blue ps-3.5">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
