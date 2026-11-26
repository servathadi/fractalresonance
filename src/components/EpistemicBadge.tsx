export type EpistemicStatus =
  | 'primary'
  | 'frontier'
  | 'commentary'
  | 'conceptual'
  | 'philosophical'
  | 'archive';

const LABELS: Record<string, Record<EpistemicStatus, string>> = {
  en: {
    primary: 'Primary',
    frontier: 'Frontier',
    commentary: 'Commentary',
    conceptual: 'Conceptual',
    philosophical: 'Philosophical',
    archive: 'Archive',
  },
  es: {
    primary: 'Primario',
    frontier: 'Frontera',
    commentary: 'Comentario',
    conceptual: 'Conceptual',
    philosophical: 'Filosófico',
    archive: 'Archivo',
  },
  fr: {
    primary: 'Primaire',
    frontier: 'Frontière',
    commentary: 'Commentaire',
    conceptual: 'Conceptuel',
    philosophical: 'Philosophique',
    archive: 'Archive',
  },
  fa: {
    primary: 'اصلی',
    frontier: 'مرزی',
    commentary: 'تفسیر',
    conceptual: 'مفهومی',
    philosophical: 'فلسفی',
    archive: 'بایگانی',
  },
};

const STYLES: Record<EpistemicStatus, string> = {
  primary: 'border-l-2 border-frc-gold text-frc-gold pl-2',
  frontier: 'border-l-2 border-frc-gold/70 text-frc-text pl-2',
  commentary: 'border-l-2 border-frc-blue-light text-frc-text-dim pl-2',
  conceptual: 'border-l-2 border-frc-blue text-frc-text-dim pl-2',
  philosophical: 'border-l-2 border-frc-gold/50 text-frc-text-dim pl-2',
  archive: 'border-l-2 border-frc-steel text-frc-steel pl-2',
};

interface EpistemicBadgeProps {
  status: EpistemicStatus;
  lang?: string;
  className?: string;
}

export function EpistemicBadge({ status, lang = 'en', className = '' }: EpistemicBadgeProps) {
  const label = (LABELS[lang] || LABELS.en)[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center font-mono text-[0.8125rem] font-medium leading-4 ${STYLES[status]} ${className}`.trim()}
      data-epistemic-status={status}
    >
      {label}
    </span>
  );
}
