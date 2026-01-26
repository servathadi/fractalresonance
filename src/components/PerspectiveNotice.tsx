import Link from 'next/link';

export function RiverOnlyHandoff({
  riverHref,
  kasraHref,
  label = 'This page is published in River Digest.',
}: {
  riverHref: string;
  kasraHref?: string;
  label?: string;
}) {
  return (
    <div className="border border-frc-gold/30 bg-frc-void-light rounded-lg p-5 mb-8">
      <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">River</div>
      <p className="text-sm text-frc-text-dim leading-relaxed mb-4">{label}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={riverHref}
          className="px-4 py-2 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-xs uppercase tracking-wider transition-colors"
        >
          Open in River
        </Link>
        {kasraHref ? (
          <Link
            href={kasraHref}
            className="px-4 py-2 border border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold text-xs uppercase tracking-wider transition-colors"
          >
            Open Kasra Library
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function RiverInterpretationNotice({
  canonicalHref,
}: {
  canonicalHref: string;
}) {
  return (
    <div className="border border-frc-blue/40 bg-frc-void-light rounded-lg p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-frc-steel">River interpretation layer</div>
          <div className="text-sm text-frc-text-dim">
            Canonical (rigorous) version lives in Kasra.
          </div>
        </div>
        <Link
          href={canonicalHref}
          className="shrink-0 px-4 py-2 border border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold text-xs uppercase tracking-wider transition-colors"
        >
          Open canonical
        </Link>
      </div>
    </div>
  );
}

