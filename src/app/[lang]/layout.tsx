import React from 'react';
import { getGlossary } from '@/lib/content';
import { CommandPalette } from '@/components/CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const glossary = getGlossary(lang);
  
  // Convert glossary to search items and prepend NotebookLM tool
  const searchItems = [
    {
      id: 'AI-ORACLE',
      title: 'Ask AI (NotebookLM)',
      excerpt: 'Chat with the Fractal Resonance Coherence vault using Google NotebookLM.',
      type: 'tool' as const,
      url: 'https://mumega.com/https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13'
    },
    ...Object.values(glossary)
  ];

  return (
    <>
      <CommandPalette items={searchItems} />
      {children}
    </>
  );
}
