import Link from 'next/link';

export interface DigestLink {
  id: string;
  title: string;
  href: string;
}

export function ContentDigest({
  tldr,
  keyPoints,
  prerequisites,
  readTime,
}: {
  tldr?: string;
  keyPoints?: string[];
  prerequisites?: DigestLink[];
  readTime?: string;
}) {
  const hasKeyPoints = Boolean(keyPoints && keyPoints.length > 0);
  const hasPrereqs = Boolean(prerequisites && prerequisites.length > 0);
  const hasTldr = Boolean(tldr && tldr.trim());
  const hasAnything = hasTldr || hasKeyPoints || hasPrereqs;

  if (!hasAnything) return null;

  return (
    <section className="card p-6 mb-8">
      <div className="flex items-center justify-between gap-6 mb-4">
        <h2 className="text-xs text-frc-steel uppercase tracking-widest">Digest</h2>
        {readTime && (
          <span className="text-[0.625rem] text-frc-steel font-mono uppercase tracking-wider">
            {readTime}
          </span>
        )}
      </div>

      {hasTldr && (
        <p className="text-sm text-frc-text leading-relaxed">
          <span className="text-frc-gold font-mono text-[0.6875rem] uppercase tracking-widest mr-2">
            TLDR
          </span>
          <span className="text-frc-text-dim">{tldr}</span>
        </p>
      )}

      {hasKeyPoints && (
        <div className="mt-5">
          <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-3">
            Key Points
          </h3>
          <ul className="space-y-2 text-sm text-frc-text-dim">
            {keyPoints!.map((p, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPrereqs && (
        <div className="mt-5">
          <h3 className="text-[0.6875rem] text-frc-gold font-mono uppercase tracking-widest mb-3">
            Prerequisites
          </h3>
          <div className="flex flex-wrap gap-2">
            {prerequisites!.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="tag hover:text-frc-gold hover:border-frc-gold transition-colors"
                title={p.id}
              >
                {p.title || p.id}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
