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
    <section className="border-y border-frc-blue py-6 mb-8">
      <div className="flex items-baseline justify-between gap-6 mb-4">
        <h2 className="text-sm font-medium text-frc-text">Summary</h2>
        {readTime && (
          <span className="text-[0.8125rem] text-frc-steel font-mono tabular-nums">
            {readTime}
          </span>
        )}
      </div>

      {hasTldr && (
        <p className="text-sm text-frc-text-dim leading-relaxed max-w-[65ch]">
          <span className="text-frc-gold font-medium me-2">Overview:</span>
          <span>{tldr}</span>
        </p>
      )}

      {hasKeyPoints && (
        <div className="mt-5">
          <h3 className="text-sm font-medium text-frc-text mb-2.5">
            Key points
          </h3>
          <ul className="space-y-2 text-sm text-frc-text-dim max-w-[65ch]">
            {keyPoints!.map((p, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-[0.8125rem] tabular-nums mt-0.5">
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
          <h3 className="text-sm font-medium text-frc-text mb-2.5">
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
