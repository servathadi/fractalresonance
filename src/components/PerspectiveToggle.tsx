'use client';

import { usePerspective, type Perspective } from './PerspectiveProvider';

const PERSPECTIVES: { value: Perspective; label: string; icon: string; description: string }[] = [
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
  const { perspective, setPerspective } = usePerspective();

  return (
    <div className="flex items-center gap-1 text-xs">
      {PERSPECTIVES.map((p) => (
        <button
          key={p.value}
          onClick={() => setPerspective(p.value)}
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
  const { perspective, setPerspective } = usePerspective();

  const toggle = () => {
    setPerspective(perspective === 'river' ? 'kasra' : 'river');
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
