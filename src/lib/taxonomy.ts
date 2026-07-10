export type TaxonomyGroup = 'series' | 'foundations' | 'physics' | 'computing';

export interface TaxonomyEntry {
  slug: string;
  group: TaxonomyGroup;
  labels: Record<string, string>;
  descriptions?: Record<string, string>;
  conceptId?: string;
}

const SERIES_ALIASES: Record<string, string> = {
  '100': 'frc-100',
  '100-series': 'frc-100',
  'frc-100': 'frc-100',
  'frc 100': 'frc-100',
  '566': 'frc-566',
  '566-series': 'frc-566',
  'frc-566': 'frc-566',
  'frc 566': 'frc-566',
  '700': 'frc-700',
  '700-series': 'frc-700',
  'frc-700': 'frc-700',
  'frc 700': 'frc-700',
  '800': 'frc-800',
  '800-series': 'frc-800',
  'frc-800': 'frc-800',
  'frc 800': 'frc-800',
};

const TAG_ALIASES: Record<string, string> = {
  ai: 'ai',
  ia: 'ai',
  'هوش-مصنوعی': 'ai',
  coherence: 'coherence',
  coherencia: 'coherence',
  cohérence: 'coherence',
  همدوسی: 'coherence',
  entropia: 'entropy',
  entropía: 'entropy',
  entropie: 'entropy',
  'آنتروپی': 'entropy',
  frc: 'frc',
  kuramoto: 'kuramoto',
  'lambda-field': 'lambda-field',
  'campo-lambda': 'lambda-field',
  'champ-lambda': 'lambda-field',
  'میدان-لاندا': 'lambda-field',
  'open-systems': 'open-systems',
  reciprocity: 'reciprocity',
  ucc: 'ucc',
};

export const TAXONOMY: TaxonomyEntry[] = [
  {
    slug: 'frc-100',
    group: 'series',
    labels: { en: 'FRC 100 series', es: 'Serie FRC 100', fr: 'Série FRC 100', fa: 'سری FRC 100' },
    descriptions: {
      en: 'Living, versioned foundational papers. The latest release under each concept DOI governs.',
      es: 'Artículos fundacionales vivos y versionados. La última versión bajo cada DOI conceptual gobierna.',
      fr: 'Articles fondateurs vivants et versionnés. La dernière version sous chaque DOI conceptuel fait foi.',
      fa: 'مقاله‌های بنیادی زنده و نسخه‌دار. آخرین انتشار زیر هر DOI مفهومی ملاک است.',
    },
  },
  {
    slug: 'frc-566',
    group: 'series',
    labels: { en: 'FRC 566 series', es: 'Serie FRC 566', fr: 'Série FRC 566', fa: 'سری FRC 566' },
    descriptions: {
      en: 'Living papers on entropy-coherence reciprocity, declared realizations, and scoped mathematical or closure tests.',
      es: 'Artículos vivos sobre reciprocidad entropía-coherencia, realizaciones declaradas y pruebas matemáticas o de cierre acotadas.',
      fr: 'Articles vivants sur la réciprocité entropie-cohérence, les réalisations déclarées et les tests mathématiques ou de fermeture délimités.',
      fa: 'مقاله‌های زنده درباره تقابل آنتروپی-همدوسی، تحقق‌های اعلام‌شده، و آزمون‌های ریاضی یا بستارِ محدود.',
    },
  },
  {
    slug: 'frc-700',
    group: 'series',
    labels: { en: 'FRC 700 series', es: 'Serie FRC 700', fr: 'Série FRC 700', fa: 'سری FRC 700' },
    descriptions: {
      en: 'Philosophical and formal framework notes. They define scope and interpretation; they are not primary physical evidence.',
      es: 'Notas filosóficas y formales del marco. Definen alcance e interpretación; no son evidencia física primaria.',
      fr: 'Notes philosophiques et formelles du cadre. Elles définissent la portée et l’interprétation; elles ne constituent pas une preuve physique primaire.',
      fa: 'یادداشت‌های فلسفی و صوری چارچوب. دامنه و تفسیر را تعریف می‌کنند و شاهد فیزیکی اولیه نیستند.',
    },
  },
  {
    slug: 'frc-800',
    group: 'series',
    labels: { en: 'FRC 800 series', es: 'Serie FRC 800', fr: 'Série FRC 800', fa: 'سری FRC 800' },
    descriptions: {
      en: 'Frontier and applied work in computation, cognition, and architecture. Read each paper at its declared evidence level.',
      es: 'Trabajo de frontera y aplicado en computación, cognición y arquitectura. Lea cada artículo según su nivel de evidencia declarado.',
      fr: 'Travaux de frontière et appliqués en calcul, cognition et architecture. Lire chaque article selon son niveau de preuve déclaré.',
      fa: 'کارهای مرزی و کاربردی در محاسبات، شناخت و معماری. هر مقاله را در سطح شواهد اعلام‌شده‌اش بخوانید.',
    },
  },
  {
    slug: 'coherence',
    group: 'foundations',
    labels: { en: 'Coherence', es: 'Coherencia', fr: 'Cohérence', fa: 'همدوسی' },
    descriptions: {
      en: 'A coherence quantity is an operationally declared channel or functional. Its normalization and physical scope must be stated.',
      es: 'Una cantidad de coherencia es un canal o funcional declarado operacionalmente. Deben declararse su normalización y alcance físico.',
      fr: 'Une quantité de cohérence est un canal ou une fonctionnelle déclarée opérationnellement. Sa normalisation et sa portée physique doivent être indiquées.',
      fa: 'کمیت همدوسی یک کانال یا تابعِ عملیاتیِ اعلام‌شده است. نرمال‌سازی و دامنه فیزیکی آن باید بیان شود.',
    },
    conceptId: 'coherence',
  },
  {
    slug: 'entropy',
    group: 'foundations',
    labels: { en: 'Entropy', es: 'Entropía', fr: 'Entropie', fa: 'آنتروپی' },
    descriptions: {
      en: 'Entropy must be read through its declared channel, units, system boundary, and any represented exchange.',
      es: 'La entropía debe leerse mediante su canal declarado, unidades, frontera del sistema y cualquier intercambio representado.',
      fr: 'L’entropie doit être lue selon son canal déclaré, ses unités, la frontière du système et tout échange représenté.',
      fa: 'آنتروپی باید با کانال اعلام‌شده، واحدها، مرز سامانه و هر تبادل بازنمایی‌شده خوانده شود.',
    },
  },
  {
    slug: 'reciprocity',
    group: 'foundations',
    labels: { en: 'Reciprocity', es: 'Reciprocidad', fr: 'Réciprocité', fa: 'تقابل' },
    descriptions: {
      en: 'The canonical relation is used as operational bookkeeping; its universal physical extension remains a conjecture.',
      es: 'La relación canónica se usa como contabilidad operacional; su extensión física universal sigue siendo una conjetura.',
      fr: 'La relation canonique est utilisée comme comptabilité opérationnelle; son extension physique universelle reste une conjecture.',
      fa: 'رابطه بنیادی به‌عنوان دفترداری عملیاتی به‌کار می‌رود؛ گسترش فیزیکی جهان‌شمول آن همچنان یک فرضیه است.',
    },
  },
  {
    slug: 'lambda-field',
    group: 'physics',
    labels: { en: 'Lambda field', es: 'Campo Lambda', fr: 'Champ Lambda', fa: 'میدان لاندا' },
    descriptions: {
      en: 'Observed, target, and optional latent Lambda objects are distinct. A fundamental field is a separate conjecture.',
      es: 'Los objetos Lambda observado, objetivo y latente opcional son distintos. Un campo fundamental es una conjetura separada.',
      fr: 'Les objets Lambda observé, cible et latent facultatif sont distincts. Un champ fondamental est une conjecture séparée.',
      fa: 'لانداهای مشاهده‌شده، هدف و نهفته اختیاری متمایزند. میدان بنیادی یک فرضیه جداگانه است.',
    },
    conceptId: 'lambda-field',
  },
  {
    slug: 'open-systems',
    group: 'physics',
    labels: { en: 'Open systems', es: 'Sistemas abiertos', fr: 'Systèmes ouverts', fa: 'سامانه‌های باز' },
    descriptions: {
      en: 'Open-system claims require an explicit boundary and accounting for represented exchanges or residual uncertainty.',
      es: 'Las afirmaciones sobre sistemas abiertos requieren una frontera explícita y contabilidad de intercambios representados o incertidumbre residual.',
      fr: 'Les affirmations sur les systèmes ouverts exigent une frontière explicite et une comptabilité des échanges représentés ou de l’incertitude résiduelle.',
      fa: 'ادعاهای سامانه باز به مرز صریح و حسابداری تبادل‌های بازنمایی‌شده یا عدم‌قطعیت باقیمانده نیاز دارند.',
    },
  },
  {
    slug: 'quantum-chaos',
    group: 'physics',
    labels: { en: 'Quantum chaos', es: 'Caos cuántico', fr: 'Chaos quantique', fa: 'آشوب کوانتومی' },
    descriptions: {
      en: 'Current chaos work is scoped to declared models, observables, controls, and open gates.',
      es: 'El trabajo actual sobre caos se limita a modelos, observables, controles y puertas abiertas declarados.',
      fr: 'Les travaux actuels sur le chaos sont limités aux modèles, observables, contrôles et critères ouverts déclarés.',
      fa: 'کار کنونی درباره آشوب به مدل‌ها، مشاهده‌پذیرها، کنترل‌ها و گیت‌های بازِ اعلام‌شده محدود است.',
    },
  },
  {
    slug: 'ai',
    group: 'computing',
    labels: { en: 'AI and computation', es: 'IA y computación', fr: 'IA et calcul', fa: 'هوش مصنوعی و محاسبات' },
    descriptions: {
      en: 'Computational proposals and evaluations are separated from claims of established physical or cognitive ontology.',
      es: 'Las propuestas y evaluaciones computacionales se separan de las afirmaciones de ontología física o cognitiva establecida.',
      fr: 'Les propositions et évaluations computationnelles sont séparées des affirmations d’ontologie physique ou cognitive établie.',
      fa: 'پیشنهادها و ارزیابی‌های محاسباتی از ادعاهای هستی‌شناسی فیزیکی یا شناختیِ تثبیت‌شده جدا هستند.',
    },
  },
];

const TAXONOMY_BY_SLUG = new Map(TAXONOMY.map((entry) => [entry.slug, entry]));

export function normalizeTaxonInput(value: string | number): string {
  return String(value).trim().toLowerCase().replace(/[_\s]+/g, '-').replace(/-+/g, '-');
}

export function canonicalizeTaxon(value: string | number): string {
  const normalized = normalizeTaxonInput(value);
  const seriesAlias = SERIES_ALIASES[normalized.replace(/-/g, ' ')] || SERIES_ALIASES[normalized];
  if (seriesAlias) return seriesAlias;
  return TAG_ALIASES[normalized] || normalized;
}

export function deriveSeriesTaxon(id?: string): string | undefined {
  if (!id) return undefined;
  if (/^FRC-100(?:-|$)/i.test(id)) return 'frc-100';
  if (/^FRC-566(?:-|$)/i.test(id)) return 'frc-566';
  if (/^FRC-700(?:-|$)/i.test(id)) return 'frc-700';
  if (/^FRC-(?:8(?:[0-4][0-9]|[0-9]{2}))(?:-|$)/i.test(id)) return 'frc-800';
  return undefined;
}

export function getTaxonomyEntry(slug: string): TaxonomyEntry | undefined {
  return TAXONOMY_BY_SLUG.get(canonicalizeTaxon(slug));
}

export function getTaxonomyLabel(slug: string, lang = 'en'): string {
  const entry = getTaxonomyEntry(slug);
  return entry?.labels[lang] || entry?.labels.en || canonicalizeTaxon(slug);
}

export function getTaxonomyDescription(slug: string, lang = 'en'): string | undefined {
  const entry = getTaxonomyEntry(slug);
  return entry?.descriptions?.[lang] || entry?.descriptions?.en;
}

export function getTaxonomyGroup(slug: string): TaxonomyGroup | undefined {
  return getTaxonomyEntry(slug)?.group;
}

export function getTaxonomyAliases(): string[] {
  return [...new Set([
    ...Object.keys(SERIES_ALIASES),
    ...Object.keys(TAG_ALIASES),
  ].filter((alias) => canonicalizeTaxon(alias) !== alias))];
}

export function getTaxonomyHref(basePath: string, slug: string): string {
  return `${basePath}/tags/${encodeURIComponent(canonicalizeTaxon(slug))}`;
}
