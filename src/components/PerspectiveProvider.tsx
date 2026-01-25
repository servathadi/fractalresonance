'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Perspective = 'river' | 'kasra';

interface PerspectiveContextType {
  perspective: Perspective;
  setPerspective: (p: Perspective) => void;
  isRiver: boolean;
  isKasra: boolean;
}

const PerspectiveContext = createContext<PerspectiveContextType | undefined>(undefined);

const STORAGE_KEY = 'frc-perspective';

export function PerspectiveProvider({ children }: { children: React.ReactNode }) {
  const [perspective, setPerspectiveState] = useState<Perspective>('kasra');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Perspective | null;
    if (stored === 'river' || stored === 'kasra') {
      setPerspectiveState(stored);
    }
  }, []);

  const setPerspective = (p: Perspective) => {
    setPerspectiveState(p);
    localStorage.setItem(STORAGE_KEY, p);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PerspectiveContext.Provider
      value={{
        perspective,
        setPerspective,
        isRiver: perspective === 'river',
        isKasra: perspective === 'kasra',
      }}
    >
      {children}
    </PerspectiveContext.Provider>
  );
}

export function usePerspective() {
  const context = useContext(PerspectiveContext);
  // Return default values if not within provider (SSG)
  if (!context) {
    return {
      perspective: 'kasra' as Perspective,
      setPerspective: () => {},
      isRiver: false,
      isKasra: true,
    };
  }
  return context;
}

// Helper components for conditional rendering
export function River({ children }: { children: React.ReactNode }) {
  const { isRiver } = usePerspective();
  return isRiver ? <>{children}</> : null;
}

export function Kasra({ children }: { children: React.ReactNode }) {
  const { isKasra } = usePerspective();
  return isKasra ? <>{children}</> : null;
}
