'use client';

import { useFrcMode, type FrcMode } from '@/components/ModeProvider';

const MODES: Array<{ id: FrcMode; label: string; hint: string }> = [
  { id: 'formal', label: 'Formal', hint: 'Equations first. Canonical.' },
  { id: 'both', label: 'Both', hint: 'Formal + interpretation.' },
  { id: 'interpretation', label: 'Interpretation', hint: 'Meaning first. Digest layer.' },
];

export function ModeToggleCompact() {
  const { mode, setMode } = useFrcMode();

  return (
    <div className="flex items-center gap-1 border border-frc-blue/70 rounded px-1 py-0.5">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => setMode(m.id)}
          className={`px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${
            mode === m.id
              ? 'bg-frc-gold text-frc-void'
              : 'text-frc-steel hover:text-frc-gold'
          }`}
          title={m.hint}
          aria-pressed={mode === m.id}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export function ModeSwitchButton({
  to,
  label,
  className = '',
}: {
  to: FrcMode;
  label: string;
  className?: string;
}) {
  const { setMode } = useFrcMode();
  return (
    <button type="button" onClick={() => setMode(to)} className={className}>
      {label}
    </button>
  );
}

