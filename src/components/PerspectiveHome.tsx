'use client';

import Link from 'next/link';
import { usePerspective } from './PerspectiveProvider';

export function PerspectiveHomeIntro({
  intros,
}: {
  intros?: { river?: string; kasra?: string };
}) {
  const { perspective } = usePerspective();

  if (perspective === 'river') {
    return (
      <p className="text-frc-text-dim text-sm sm:text-base leading-relaxed font-light">
        {intros?.river ||
          'River mode: meaning first. Start with the narrative arc, then use the equations as anchors.'}
      </p>
    );
  }

  return (
    <p className="text-frc-text-dim text-sm sm:text-base leading-relaxed font-light">
      {intros?.kasra ||
        'Kasra mode: equations first. Start from reciprocity, then follow UCC dynamics into falsifiable predictions.'}
    </p>
  );
}

export function PerspectiveStartHere({
  lang,
  items,
}: {
  lang: string;
  items?: {
    river?: Array<{ k: string; title: string; desc: string; href: string }>;
    kasra?: Array<{ k: string; title: string; desc: string; href: string }>;
  };
}) {
  const { perspective } = usePerspective();

  const isRiver = perspective === 'river';

  const resolved = isRiver ? items?.river : items?.kasra;
  const fallback = isRiver
    ? [
        {
          k: '01',
          title: 'Read the Overture',
          desc: 'The Architect + Oracle framing from Prime 2.',
          href: `/${lang}/books/the-resonance-code`,
        },
        {
          k: '02',
          title: 'Time as coherence flow',
          desc: 'A gentle concept page that links to the UCC.',
          href: `/${lang}/concepts/time`,
        },
        {
          k: '03',
          title: 'Then: the foundations',
          desc: 'The technical spine (reciprocity + UCC) when ready.',
          href: `/${lang}/papers/FRC-566-001`,
        },
      ]
    : [
        {
          k: '01',
          title: 'Start with reciprocity',
          desc: 'Entropy-coherence law and the UCC flow equation.',
          href: `/${lang}/papers/FRC-566-001`,
        },
        {
          k: '02',
          title: 'Scan the formulas',
          desc: 'Coherence, Lambda field, witness, and predictions.',
          href: `/${lang}/formulas`,
        },
        {
          k: '03',
          title: 'Get the big map',
          desc: 'Browse the knowledge graph and follow links.',
          href: `/${lang}/graph`,
        },
      ];
  const list = resolved && resolved.length > 0 ? resolved : fallback;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="section-marker mb-6" data-section="§00">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-lg text-frc-text font-medium tracking-wide">Start Here</h2>
          <span className="text-xs text-frc-steel uppercase tracking-wider">
            {isRiver ? 'River' : 'Kasra'} guide
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {list.map((it) => (
          <Link key={it.k} href={it.href} className="card block p-5 group">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-frc-gold shrink-0 mt-0.5 tabular-nums">
                {it.k}
              </span>
              <div className="min-w-0">
                <h3 className="text-frc-text group-hover:text-frc-gold transition-colors text-sm font-medium leading-snug">
                  {it.title}
                </h3>
                <p className="text-xs text-frc-text-dim mt-2 leading-relaxed">
                  {it.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
