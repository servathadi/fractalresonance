'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getBasePath, getLangFromPathname, getPerspectiveFromPathname } from '@/lib/site';

interface SearchItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'paper' | 'concept' | 'book' | 'article' | 'blog' | 'tool';
  url: string;
}

interface CommandPaletteProps {
  items: SearchItem[];
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (url: string) => {
    // Preserve River/Kasra context when navigating internal routes.
    const lang = getLangFromPathname(pathname, 'en');
    const perspective = getPerspectiveFromPathname(pathname);
    const basePath = getBasePath(lang, perspective);

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (url.startsWith(`/${lang}/`)) {
      const tail = url.slice(`/${lang}`.length);
      router.push(`${basePath}${tail}`);
      return;
    }

    router.push(url);
  };

  // Toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!query) return items.slice(0, 5); // Show top 5 recent/default
    const lowerQ = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowerQ) || 
      item.id.toLowerCase().includes(lowerQ)
    ).slice(0, 8); // Limit to 8
  }, [items, query]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Navigation Logic
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].url);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router, pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-frc-void/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-frc-void border border-frc-gold/30 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-frc-blue/30 px-4 py-3">
          <svg className="w-5 h-5 text-frc-steel mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search papers, concepts, books, blog..."
              className="flex-1 bg-transparent border-none outline-none text-frc-text placeholder-frc-text-dim text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-frc-steel border border-frc-blue/50 rounded bg-frc-blue/10">
            ESC
          </kbd>
        </div>

        <div className="py-2 max-h-[60vh] overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-frc-text-dim text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <ul className="text-sm">
              {filteredItems.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => {
                    navigate(item.url);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between group transition-colors ${
                    index === selectedIndex ? 'bg-frc-blue/20 border-l-2 border-frc-gold' : 'border-l-2 border-transparent'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] uppercase tracking-widest font-mono ${
                         item.type === 'concept' ? 'text-frc-blue' : 'text-frc-gold'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`font-medium ${index === selectedIndex ? 'text-frc-text' : 'text-frc-text-dim group-hover:text-frc-text'}`}>
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-frc-steel font-mono truncate max-w-[300px]">
                      {item.id} • {item.excerpt ? item.excerpt.slice(0, 50) + '...' : ''}
                    </div>
                  </div>
                  {index === selectedIndex && (
                     <svg className="w-4 h-4 text-frc-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-frc-blue/5 px-4 py-2 border-t border-frc-blue/30 flex justify-between items-center text-[10px] text-frc-steel">
           <span>
             <strong className="text-frc-text-dim">FRC</strong> Knowledge Base
           </span>
           <div className="flex gap-3">
             <span>Select <kbd className="font-sans">↵</kbd></span>
             <span>Navigate <kbd className="font-sans">↑↓</kbd></span>
           </div>
        </div>
      </div>
    </div>
  );
}
