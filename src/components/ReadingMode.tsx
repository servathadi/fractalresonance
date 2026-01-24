'use client';

import { useState, useEffect, useCallback } from 'react';

export function ReadingMode() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggle = useCallback(() => {
    const next = !active;
    setActive(next);
    document.documentElement.classList.toggle('reading-mode', next);
  }, [active]);

  // Escape key exits reading mode
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) {
        setActive(false);
        document.documentElement.classList.remove('reading-mode');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center border transition-all ${
        active
          ? 'bg-frc-gold border-frc-gold text-frc-void'
          : 'bg-frc-void border-frc-blue text-frc-text-dim hover:text-frc-gold hover:border-frc-gold'
      }`}
      aria-label={active ? 'Exit reading mode' : 'Enter reading mode'}
      title={active ? 'Exit reading mode (Esc)' : 'Enter reading mode'}
    >
      {active ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )}
    </button>
  );
}
