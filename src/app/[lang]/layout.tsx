import React from 'react';
import { getGlossary } from '@/lib/content';
import { CommandPalette } from '@/components/CommandPalette';
import { TranslationBadge } from '@/components/TranslationBadge';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const glossary = getGlossary(lang);
  const isRTL = RTL_LANGUAGES.includes(lang);

  // Convert glossary to search items and prepend NotebookLM tool
  const searchItems = [
    {
      id: 'AI-ORACLE',
      title: 'Ask AI (NotebookLM)',
      excerpt: 'Chat with the Fractal Resonance Coherence vault using Google NotebookLM.',
      type: 'tool' as const,
      url: 'https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13'
    },
    ...Object.values(glossary)
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={lang} className={isRTL ? 'font-farsi' : ''}>
      <CommandPalette items={searchItems} />
      <TranslationBadge lang={lang} />
      {children}
    </div>
  );
}
