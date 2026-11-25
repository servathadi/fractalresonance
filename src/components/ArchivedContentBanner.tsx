import Link from 'next/link';

interface ArchivedContentBannerProps {
  lang: string;
  note: string;
}

const COPY: Record<string, { eyebrow: string; seeCurrent: string; ledger: string }> = {
  en: {
    eyebrow: 'Historical Archive · Superseded (noindex)',
    seeCurrent: 'Current 2026 canon:',
    ledger: 'Falsification Ledger',
  },
  es: {
    eyebrow: 'Archivo histórico · Sustituido (noindex)',
    seeCurrent: 'Canon actual 2026:',
    ledger: 'Registro de falsaciones',
  },
  fr: {
    eyebrow: 'Archive historique · Remplacé (noindex)',
    seeCurrent: 'Canon actuel 2026 :',
    ledger: 'Registre des réfutations',
  },
  fa: {
    eyebrow: 'بایگانی تاریخی · منسوخ (noindex)',
    seeCurrent: 'کانون جاری ۲۰۲۶:',
    ledger: 'دفتر ابطال‌ها',
  },
};

export function ArchivedContentBanner({ lang, note }: ArchivedContentBannerProps) {
  const t = COPY[lang] || COPY.en;

  return (
    <aside
      role="note"
      aria-label="Archived historical content notice"
      data-archived-content-banner="true"
      className="my-5 border border-frc-gold/60 bg-frc-void-light p-4 text-sm"
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-widest text-frc-gold mb-1.5">
        {t.eyebrow}
      </p>
      <p className="text-frc-text-dim leading-relaxed mb-3">{note}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-frc-steel uppercase tracking-wider">{t.seeCurrent}</span>
        <Link href="/en/papers/FRC-100-000" className="text-frc-gold hover:underline font-mono">
          FRC 100.000
        </Link>
        <Link href="/en/papers/FRC-100-100" className="text-frc-gold hover:underline font-mono">
          FRC 100.100
        </Link>
        <Link href="/en/papers/FRC-100-002" className="text-frc-gold hover:underline font-mono">
          FRC 100.002
        </Link>
        <Link href={`/${lang}/falsifications`} className="text-frc-gold hover:underline">
          {t.ledger}
        </Link>
      </div>
    </aside>
  );
}
