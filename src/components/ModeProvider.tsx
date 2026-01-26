'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export type FrcMode = 'formal' | 'interpretation' | 'both';

interface ModeContextType {
  mode: FrcMode;
  setMode: (m: FrcMode) => void;
  isFormal: boolean;
  isInterpretation: boolean;
  isBoth: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const STORAGE_KEY = 'frc-mode';
const LEGACY_PERSPECTIVE_KEY = 'frc-perspective';

function normalizeMode(raw: unknown): FrcMode | null {
  if (raw === 'formal' || raw === 'interpretation' || raw === 'both') return raw;
  // Legacy mapping: kasra -> formal, river -> interpretation
  if (raw === 'kasra') return 'formal';
  if (raw === 'river') return 'interpretation';
  return null;
}

function applyModeToDom(mode: FrcMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-frc-mode', mode);
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const [mode, setModeState] = useState<FrcMode>('formal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const stored = normalizeMode(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setModeState(stored);
      applyModeToDom(stored);
      return;
    }

    const legacy = normalizeMode(localStorage.getItem(LEGACY_PERSPECTIVE_KEY));
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      setModeState(legacy);
      applyModeToDom(legacy);
      return;
    }

    // If someone lands on legacy `/river/...` routes, default to interpretation mode.
    if (pathname.includes('/river/')) {
      localStorage.setItem(STORAGE_KEY, 'interpretation');
      setModeState('interpretation');
      applyModeToDom('interpretation');
      return;
    }

    applyModeToDom('formal');
  }, [pathname]);

  const setMode = (m: FrcMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
    applyModeToDom(m);
  };

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isFormal: mode === 'formal',
      isInterpretation: mode === 'interpretation',
      isBoth: mode === 'both',
    }),
    [mode]
  );

  // Prevent hydration mismatch
  if (!mounted) return <>{children}</>;

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useFrcMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    return {
      mode: 'formal' as FrcMode,
      setMode: () => {},
      isFormal: true,
      isInterpretation: false,
      isBoth: false,
    };
  }
  return ctx;
}

