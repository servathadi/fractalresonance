/**
 * Tier Badge — displays paper maturity status (foundational/applied/speculative)
 */

export type Tier = 'foundational' | 'applied' | 'speculative';

const TIER_CONFIG: Record<Tier, { label: string; className: string; title: string }> = {
  foundational: {
    label: 'Foundational',
    className: 'bg-frc-gold/10 text-frc-gold border-frc-gold/30',
    title: 'Core theoretical foundation of the FRC framework',
  },
  applied: {
    label: 'Applied',
    className: 'bg-frc-blue/20 text-frc-text border-frc-blue',
    title: 'Applications and extensions of FRC theory',
  },
  speculative: {
    label: 'Speculative',
    className: 'bg-frc-steel/10 text-frc-steel border-frc-steel/30',
    title: 'Exploratory ideas and hypotheses under development',
  },
};

const TIER_CONFIG_I18N: Record<string, Record<Tier, { label: string; title: string }>> = {
  en: {
    foundational: { label: 'Foundational', title: 'Core theoretical foundation of the FRC framework' },
    applied: { label: 'Applied', title: 'Applications and extensions of FRC theory' },
    speculative: { label: 'Speculative', title: 'Exploratory ideas and hypotheses under development' },
  },
  fa: {
    foundational: { label: 'بنیادین', title: 'پایه نظری اصلی چارچوب FRC' },
    applied: { label: 'کاربردی', title: 'کاربردها و توسعه‌های نظریه FRC' },
    speculative: { label: 'اکتشافی', title: 'ایده‌ها و فرضیه‌های در حال توسعه' },
  },
  es: {
    foundational: { label: 'Fundamental', title: 'Base teórica central del marco FRC' },
    applied: { label: 'Aplicada', title: 'Aplicaciones y extensiones de la teoría FRC' },
    speculative: { label: 'Especulativa', title: 'Ideas exploratorias e hipótesis en desarrollo' },
  },
  fr: {
    foundational: { label: 'Fondamental', title: 'Base théorique centrale du cadre FRC' },
    applied: { label: 'Appliqué', title: 'Applications et extensions de la théorie FRC' },
    speculative: { label: 'Spéculatif', title: 'Idées exploratoires et hypothèses en développement' },
  },
};

interface TierBadgeProps {
  tier: Tier;
  lang?: string;
  size?: 'sm' | 'md';
}

export function TierBadge({ tier, lang = 'en', size = 'sm' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  const i18n = TIER_CONFIG_I18N[lang]?.[tier] || TIER_CONFIG_I18N['en'][tier];

  const sizeClasses = size === 'sm'
    ? 'text-[0.6rem] px-1.5 py-0.5'
    : 'text-xs px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider border ${config.className} ${sizeClasses}`}
      title={i18n.title}
    >
      {i18n.label}
    </span>
  );
}

/** Get tier from frontmatter, with fallback based on series */
export function inferTier(
  explicitTier?: Tier | string,
  paperId?: string
): Tier {
  if (explicitTier === 'foundational' || explicitTier === 'applied' || explicitTier === 'speculative') {
    return explicitTier;
  }

  // Infer from paper series if not explicitly set
  if (paperId) {
    if (paperId.startsWith('FRC-100') || paperId.startsWith('FRC-566') || paperId.startsWith('FRC-16D')) {
      return 'foundational';
    }
    if (paperId.startsWith('FRC-8')) {
      return 'applied';
    }
  }

  return 'speculative';
}
