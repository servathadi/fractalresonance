'use client';

import { ModeSwitchButton } from '@/components/ModeToggle';

export function InterpretationGate({
  title = 'Interpretation-only content',
  description = 'This page is part of the interpretation/digest layer. Switch mode to read it.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="border border-frc-gold/30 bg-frc-void-light rounded-lg p-5">
      <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">{title}</div>
      <p className="text-sm text-frc-text-dim leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-3">
        <ModeSwitchButton
          to="interpretation"
          label="Switch to Interpretation"
          className="px-4 py-2 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-xs uppercase tracking-wider transition-colors"
        />
        <ModeSwitchButton
          to="both"
          label="Show Both"
          className="px-4 py-2 border border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold text-xs uppercase tracking-wider transition-colors"
        />
      </div>
    </div>
  );
}

