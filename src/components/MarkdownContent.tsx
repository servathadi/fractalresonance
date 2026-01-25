'use client';

/**
 * MarkdownContent — Client component for rendering sanitized markdown HTML
 * with interactive tooltips for wikilinks.
 */

import React, { useEffect, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { createPortal } from 'react-dom';

interface GlossaryItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'paper' | 'concept' | 'book' | 'article' | 'blog' | 'topic' | 'person';
  url: string;
}

interface MarkdownContentProps {
  html: string;
  glossary?: Record<string, GlossaryItem>;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'pre', 'code',
    'blockquote',
    'a', 'strong', 'em', 'del',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'figure', 'figcaption',
    'div', 'span', 'sup', 'sub',
  ],
  allowedAttributes: {
    a: ['href', 'class', 'title', 'target', 'rel', 'data-wikilink-id'],
    img: ['src', 'alt', 'width', 'height', 'class'],
    h1: ['id'], h2: ['id'], h3: ['id'], h4: ['id'],
    code: ['class'],
    pre: ['class'],
    div: ['class'],
    span: ['class'],
    td: ['align'],
    th: ['align'],
  },
  allowedClasses: {
    a: ['wikilink'],
    code: ['*'],
    pre: ['*'],
  },
};

export function MarkdownContent({ html, glossary }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  
  // Tooltip state
  const [hoveredLink, setHoveredLink] = useState<{
    id: string;
    rect: DOMRect;
  } | null>(null);

  useEffect(() => {
    // Sanitize on mount/change to avoid hydration mismatch if we used dangerouslySetInnerHTML directly with SSR
    // But since this is a client component receiving HTML string, we can just sanitize and set.
    setSanitizedHtml(sanitizeHtml(html, SANITIZE_OPTIONS));
  }, [html]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !glossary) return;

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.classList.contains('wikilink')) {
        const id = target.getAttribute('data-wikilink-id');
        if (id && glossary[id]) {
          setHoveredLink({
            id,
            rect: target.getBoundingClientRect(),
          });
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.classList.contains('wikilink')) {
         setHoveredLink(null);
      }
    };

    // We need to attach listeners to the *container* and use delegation,
    // because the HTML is injected via innerHTML and React doesn't know about those nodes.
    container.addEventListener('mouseover', handleMouseEnter); // mouseover bubbles
    container.addEventListener('mouseout', handleMouseLeave);  // mouseout bubbles

    return () => {
      container.removeEventListener('mouseover', handleMouseEnter);
      container.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [glossary, sanitizedHtml]);

  return (
    <>
      <div 
        ref={containerRef}
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
      {hoveredLink && glossary && (
        <Tooltip 
          item={glossary[hoveredLink.id]} 
          rect={hoveredLink.rect} 
        />
      )}
    </>
  );
}

function Tooltip({ item, rect }: { item: GlossaryItem; rect: DOMRect }) {
  // Calculate position: centered above the link
  const top = rect.top + window.scrollY - 10; // 10px buffer
  const left = rect.left + window.scrollX + (rect.width / 2);

  return createPortal(
    <div 
      className="fixed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200"
      style={{ 
        top: rect.top - 8, // Position slightly above
        left: rect.left + (rect.width/2),
        transform: 'translate(-50%, -100%)', // Centered and above
      }}
    >
      <div className="bg-frc-void border border-frc-gold/30 shadow-2xl p-4 rounded-md max-w-sm w-80 backdrop-blur-md bg-opacity-95 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] uppercase tracking-widest font-mono ${
            item.type === 'concept' ? 'text-frc-blue' : 'text-frc-gold'
          }`}>
            {item.type}
          </span>
          <span className="text-[10px] text-frc-steel font-mono">{item.id}</span>
        </div>
        <h4 className="text-frc-text font-medium text-sm mb-2 leading-snug">{item.title}</h4>
        <p className="text-frc-text-dim text-xs leading-relaxed line-clamp-3">
          {item.excerpt}
        </p>
      </div>
      {/* Arrow */}
      <div 
        className="absolute w-3 h-3 bg-frc-void border-r border-b border-frc-gold/30 rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"
      ></div>
    </div>,
    document.body
  );
}
