'use client';

import { useCallback } from 'react';

interface SearchTriggerProps {
  className?: string;
}

const DICT: Record<string, string> = {
  en: 'Search',
  es: 'Buscar',
  fr: 'Rechercher',
  fa: 'جستجو',
};

export function SearchTrigger({ className = '' }: SearchTriggerProps) {
  const openSearch = useCallback(() => {
    // Dispatch a keyboard event to trigger the CommandPalette (Cmd+K)
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <button
      type="button"
      onClick={openSearch}
      className={`flex items-center gap-2 text-frc-text-dim hover:text-frc-gold transition-colors ${className}`}
      aria-label="Open search"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span className="hidden lg:inline text-xs">
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-frc-blue/20 border border-frc-blue/50 rounded">
          /
        </kbd>
      </span>
    </button>
  );
}
