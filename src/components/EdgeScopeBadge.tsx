import Link from 'next/link';
import type { EdgeScopeTag } from '@/lib/content';

interface ScopeCopy {
  label: string;
  explanation: string;
}

const SCOPE_COPY: Record<string, Record<EdgeScopeTag, ScopeCopy>> = {
  en: {
    'Structural Analogy': {
      label: 'Structural Analogy',
      explanation: 'Structural correspondence across domains. Not a proved physical identity or canonical paper claim.',
    },
    'Test Idea': {
      label: 'Test Idea',
      explanation: 'Proposed empirical or numerical test protocol. Not yet an experimental result or established canon.',
    },
    'Open Question': {
      label: 'Open Question',
      explanation: 'Unresolved conceptual or mathematical question. Not a settled claim in the FRC corpus.',
    },
    'Counter-Evidence': {
      label: 'Counter-Evidence',
      explanation: 'Empirical tension, failure mode, or negative finding that constrains or challenges FRC proposals.',
    },
  },
  es: {
    'Structural Analogy': {
      label: 'Analogía estructural',
      explanation: 'Correspondencia estructural entre dominios. No es una identidad física demostrada ni un artículo canónico.',
    },
    'Test Idea': {
      label: 'Idea de prueba',
      explanation: 'Propuesta de protocolo empírico o numérico. Aún no es un resultado experimental establecido.',
    },
    'Open Question': {
      label: 'Pregunta abierta',
      explanation: 'Cuestión conceptual o matemática sin resolver. No constituye una afirmación establecida.',
    },
    'Counter-Evidence': {
      label: 'Contraevidencia',
      explanation: 'Tensión empírica, modo de fallo o hallazgo negativo que restringe las propuestas de FRC.',
    },
  },
  fr: {
    'Structural Analogy': {
      label: 'Analogie structurelle',
      explanation: 'Correspondance structurelle entre domaines. Ne constitue ni une identité physique prouvée ni un article canonique.',
    },
    'Test Idea': {
      label: 'Idée de test',
      explanation: 'Protocole empirique ou numérique proposé. Pas encore un résultat expérimental établi.',
    },
    'Open Question': {
      label: 'Question ouverte',
      explanation: 'Question conceptuelle ou mathématique non résolue. Ne constitue pas un énoncé établi.',
    },
    'Counter-Evidence': {
      label: 'Contre-preuve',
      explanation: 'Tension empirique, mode d’échec ou résultat négatif qui contraint les propositions FRC.',
    },
  },
  fa: {
    'Structural Analogy': {
      label: 'قیاس ساختاری',
      explanation: 'تناظر ساختاری میان حوزه‌ها؛ این یادداشت یک همانی فیزیکی اثبات‌شده یا مقاله کانونیک نیست.',
    },
    'Test Idea': {
      label: 'ایده آزمون',
      explanation: 'پیشنهاد پروتکل تجربی یا عددی؛ هنوز نتیجه آزمایشگاهی تثبیت‌شده نیست.',
    },
    'Open Question': {
      label: 'پرسش باز',
      explanation: 'پرسش مفهومی یا ریاضی حل‌نشده؛ بیانگر ادعای اثبات‌شده در پیکره FRC نیست.',
    },
    'Counter-Evidence': {
      label: 'شاهد نقض',
      explanation: 'تنش تجربی، حالت شکست یا یافته منفی که پیشنهادهای FRC را محدود می‌کند.',
    },
  },
};

const BANNER_META: Record<string, { prefix: string; papersLink: string }> = {
  en: { prefix: 'Field Note · Edge Dispatch', papersLink: 'Canonical papers live in /papers' },
  es: { prefix: 'Nota de campo · Edge Dispatch', papersLink: 'Los artículos canónicos están en /papers' },
  fr: { prefix: 'Note de terrain · Edge Dispatch', papersLink: 'Les articles canoniques figurent dans /papers' },
  fa: { prefix: 'یادداشت میدانی · گزارش مرزی', papersLink: 'مقالات کانونیک در بخش /papers قرار دارند' },
};

const INLINE_ACCENT: Record<EdgeScopeTag, string> = {
  'Structural Analogy': 'border-s-2 border-frc-blue-light ps-2 text-frc-text-dim',
  'Test Idea': 'border-s-2 border-frc-gold/80 ps-2 text-frc-gold',
  'Open Question': 'border-s-2 border-frc-steel ps-2 text-frc-text-dim',
  'Counter-Evidence': 'border-s-2 border-frc-gold ps-2 text-frc-gold font-medium',
};

const BANNER_ACCENT: Record<EdgeScopeTag, string> = {
  'Structural Analogy': 'border-s-2 border-frc-blue-light',
  'Test Idea': 'border-s-2 border-frc-gold/80',
  'Open Question': 'border-s-2 border-frc-steel',
  'Counter-Evidence': 'border-s-2 border-frc-gold',
};

export function EdgeScopeBadge({
  scopeTag,
  lang = 'en',
  variant = 'inline',
  basePath,
  className = '',
}: {
  scopeTag: EdgeScopeTag;
  lang?: string;
  variant?: 'inline' | 'banner';
  basePath?: string;
  className?: string;
}) {
  const langMap = Object.hasOwn(SCOPE_COPY, lang) ? SCOPE_COPY[lang] : SCOPE_COPY.en;
  if (typeof scopeTag !== 'string' || !Object.hasOwn(langMap, scopeTag)) return null;
  const copy = langMap[scopeTag];
  const meta = Object.hasOwn(BANNER_META, lang) ? BANNER_META[lang] : BANNER_META.en;

  if (variant === 'banner') {
    const papersHref = `${basePath || `/${lang}`}/papers`;
    return (
      <aside
        role="note"
        aria-label={`Epistemic scope: ${copy.label}`}
        data-edge-scope={scopeTag}
        className={`my-6 bg-frc-void-light border-y border-frc-blue ps-5 pe-5 py-4 ${BANNER_ACCENT[scopeTag]} ${className}`.trim()}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[0.8125rem] font-medium text-frc-gold">{copy.label}</span>
            <span className="text-sm text-frc-steel">{meta.prefix}</span>
          </div>
          <Link href={papersHref} className="text-sm text-frc-text-dim hover:text-frc-gold transition-colors">
            {meta.papersLink} →
          </Link>
        </div>
        <p className="text-sm text-frc-text-dim leading-relaxed max-w-[65ch]">{copy.explanation}</p>
      </aside>
    );
  }

  return (
    <span
      data-edge-scope={scopeTag}
      className={`inline-flex items-center font-mono text-[0.8125rem] leading-4 ${INLINE_ACCENT[scopeTag]} ${className}`.trim()}
    >
      {copy.label}
    </span>
  );
}
