'use client';

import React from 'react';
import { getDictionary } from '@/lib/dictionaries';

interface TranslationBadgeProps {
  lang: string;
}

export function TranslationBadge({ lang }: TranslationBadgeProps) {
  if (lang === 'en') return null;

  const dict = getDictionary(lang);

  return (
    <div className="bg-frc-blue/10 border-b border-frc-blue/30 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <svg 
          className="w-4 h-4 text-frc-gold mt-0.5 shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-frc-text-dim font-medium">
          {dict.footer.disclaimer}
        </p>
      </div>
    </div>
  );
}
