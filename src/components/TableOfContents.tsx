'use client';

import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  minBreakpoint?: 'xl' | '2xl';
  title?: string;
}

export function TableOfContents({ items, minBreakpoint = '2xl', title = 'On this page' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const breakpointClass = minBreakpoint === 'xl' ? 'hidden xl:block' : 'hidden 2xl:block';

  return (
    <nav data-toc className={`${breakpointClass} w-56 shrink-0`}>
      <div className="sticky top-6 py-6">
        <h4 className="text-xs uppercase tracking-wider text-frc-steel mb-3">{title}</h4>
        <ul className="space-y-1 text-xs">
          {items.map(item => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}>
              <a
                href={`#${item.id}`}
                className={`block py-0.5 transition-colors ${
                  activeId === item.id
                    ? 'text-frc-gold'
                    : 'text-frc-text-dim hover:text-frc-text'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
