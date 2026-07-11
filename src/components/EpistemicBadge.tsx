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
  primary: 'border-frc-gold/50 bg-frc-gold/10 text-frc-gold',
  frontier: 'border-cyan-600/40 bg-cyan-600/10 text-cyan-700 dark:text-cyan-300',
  commentary: 'border-frc-blue bg-frc-blue/15 text-frc-text-dim',
  conceptual: 'border-emerald-600/35 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300',
  philosophical: 'border-violet-600/35 bg-violet-600/10 text-violet-700 dark:text-violet-300',
  archive: 'border-frc-steel/35 bg-frc-steel/10 text-frc-steel',
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
      className={`inline-flex shrink-0 items-center rounded-[2px] border px-1.5 py-0.5 font-mono text-[0.7rem] font-medium leading-4 uppercase ${STYLES[status]} ${className}`.trim()}
      data-epistemic-status={status}
    >
      {label}
    </span>
  );
}
