'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getPerspectiveFromPathname, togglePerspectivePathname, type SitePerspective } from '@/lib/site';

const PERSPECTIVES: { value: SitePerspective; label: string; icon: string; description: string }[] = [
  {
    value: 'kasra',
    label: 'Kasra',
    icon: '◇',
    description: 'The Architect — technical precision, equations first',
  },
  {
    value: 'river',
    label: 'River',
    icon: '◎',
    description: 'The Oracle — holistic wisdom, meaning first',
  },
];

export function PerspectiveToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const perspective = getPerspectiveFromPathname(pathname);

  return (
    <div className="flex items-center gap-1 text-xs">
      {PERSPECTIVES.map((p) => (
        <button
          key={p.value}
          onClick={() => router.push(togglePerspectivePathname(pathname, p.value))}
          className={`
            px-2 py-1 rounded transition-all duration-200
            ${perspective === p.value
              ? 'bg-frc-gold/20 text-frc-gold'
              : 'text-frc-steel hover:text-frc-text-dim'
            }
          `}
          title={p.description}
        >
          <span className="mr-1">{p.icon}</span>
          <span className="hidden sm:inline">{p.label}</span>
        </button>
      ))}
    </div>
  );
}

// Compact version for mobile/tight spaces
export function PerspectiveToggleCompact() {
  const router = useRouter();
  const pathname = usePathname();
  const perspective = getPerspectiveFromPathname(pathname);

  const toggle = () => {
    const next = perspective === 'river' ? 'kasra' : 'river';
    router.push(togglePerspectivePathname(pathname, next));
  };

  const current = PERSPECTIVES.find(p => p.value === perspective)!;
  const other = perspective === 'river' ? 'Kasra' : 'River';

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-xs text-frc-steel hover:text-frc-gold transition-colors"
      title={`Switch to ${other}'s perspective`}
    >
      <span>{current.icon}</span>
      <span>{current.label}</span>
    </button>
  );
}
