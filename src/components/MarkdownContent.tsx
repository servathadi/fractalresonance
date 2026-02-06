'use client';

/**
 * MarkdownContent — Client component for rendering sanitized markdown HTML
 * with interactive tooltips for wikilinks and formulas.
 */

import React, { useEffect, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { createPortal } from 'react-dom';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import { matchFormula, type FormulaInfo } from '@/lib/formulas';

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

export const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    // Note: h1 is intentionally excluded - pages render h1 from frontmatter title
    // Markdown h1s are transformed to h2 to avoid duplicate h1 (SEO issue)
    'h2', 'h3', 'h4', 'h5', 'h6',
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
    img: ['src', 'alt', 'width', 'height', 'class', 'loading', 'decoding'],
    h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
    code: ['class'],
    pre: ['class'],
    div: ['class'],
    span: ['class'],
    td: ['align'],
    th: ['align'],
  },
  allowedClasses: {
    a: ['wikilink'],
    div: ['*'],
    span: ['*'],
    code: ['*'],
    pre: ['*'],
  },
  // Transform h1 → h2 to prevent duplicate h1 tags (SEO best practice)
  transformTags: {
    'h1': 'h2',
    'a': (tagName, attribs) => {
      if (attribs.target && attribs.target.toLowerCase() === '_blank') {
        const currentRel = attribs.rel ? attribs.rel.split(' ') : [];
        const required = ['noopener', 'noreferrer'];
        const newRel = Array.from(new Set([...currentRel, ...required])).join(' ');
        return {
          tagName: 'a',
          attribs: {
            ...attribs,
            rel: newRel,
          },
        };
      }
      return {
        tagName: 'a',
        attribs,
      };
    },
  },
};

export function MarkdownContent({ html, glossary }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  
  // Tooltip state - use timeout to avoid interference with clicks
  const [tooltipData, setTooltipData] = useState<{
    id: string;
    rect: DOMRect;
  } | null>(null);

  // Formula tooltip state
  const [formulaTooltip, setFormulaTooltip] = useState<{
    formula: FormulaInfo;
    rect: DOMRect;
  } | null>(null);

  useEffect(() => {
    // Sanitize on mount/change to avoid hydration mismatch if we used dangerouslySetInnerHTML directly with SSR
    // But since this is a client component receiving HTML string, we can just sanitize and set.
    setSanitizedHtml(sanitizeHtml(html, SANITIZE_OPTIONS));
  }, [html]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Math: render $...$ and $$...$$ using KaTeX auto-render.
    // Content is local markdown, so we can keep options permissive.
    try {
      renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
        strict: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      });

      // After KaTeX renders, find formulas and make them interactive
      const katexElements = container.querySelectorAll('.katex');
      katexElements.forEach((el) => {
        const textContent = el.textContent || '';
        const formulaInfo = matchFormula(textContent);
        if (formulaInfo) {
          // Mark this element as having a known formula
          el.setAttribute('data-formula-id', formulaInfo.id);
          (el as HTMLElement).style.cursor = 'help';
        }
      });
    } catch {
      // If KaTeX fails, fall back to showing raw text.
    }
  }, [sanitizedHtml]);

  // Formula hover handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleFormulaEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const katexEl = target.closest('.katex[data-formula-id]') as HTMLElement | null;
      if (katexEl) {
        const textContent = katexEl.textContent || '';
        const formulaInfo = matchFormula(textContent);
        if (formulaInfo) {
          if (hoverTimeout) clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            setFormulaTooltip({
              formula: formulaInfo,
              rect: katexEl.getBoundingClientRect(),
            });
          }, 300);
        }
      }
    };

    const handleFormulaLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const katexEl = target.closest('.katex[data-formula-id]');
      if (katexEl) {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setFormulaTooltip(null);
      }
    };

    container.addEventListener('mouseover', handleFormulaEnter);
    container.addEventListener('mouseout', handleFormulaLeave);

    return () => {
      container.removeEventListener('mouseover', handleFormulaEnter);
      container.removeEventListener('mouseout', handleFormulaLeave);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [sanitizedHtml]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !glossary) return;

    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.classList.contains('wikilink')) {
        const id = target.getAttribute('data-wikilink-id');
        if (id && glossary[id]) {
          // Small delay to avoid flickering and interference with clicks
          if (hoverTimeout) clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            setTooltipData({
              id,
              rect: target.getBoundingClientRect(),
            });
          }, 200);
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.classList.contains('wikilink')) {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setTooltipData(null);
      }
    };

    // We need to attach listeners to the *container* and use delegation,
    // because the HTML is injected via innerHTML and React doesn't know about those nodes.
    container.addEventListener('mouseover', handleMouseEnter); // mouseover bubbles
    container.addEventListener('mouseout', handleMouseLeave);  // mouseout bubbles

    return () => {
      container.removeEventListener('mouseover', handleMouseEnter);
      container.removeEventListener('mouseout', handleMouseLeave);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [glossary, sanitizedHtml]);

  return (
    <>
      <div 
        ref={containerRef}
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
      {tooltipData && glossary && glossary[tooltipData.id] && (
        <Tooltip
          item={glossary[tooltipData.id]}
          rect={tooltipData.rect}
        />
      )}
      {formulaTooltip && (
        <FormulaTooltip
          formula={formulaTooltip.formula}
          rect={formulaTooltip.rect}
        />
      )}
    </>
  );
}

function Tooltip({ item, rect }: { item: GlossaryItem; rect: DOMRect }) {
  return createPortal(
    <div
      className="fixed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: rect.top - 8,
        left: rect.left + (rect.width/2),
        transform: 'translate(-50%, -100%)',
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
      <div
        className="absolute w-3 h-3 bg-frc-void border-r border-b border-frc-gold/30 rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"
      ></div>
    </div>,
    document.body
  );
}

function FormulaTooltip({ formula, rect }: { formula: FormulaInfo; rect: DOMRect }) {
  return createPortal(
    <div
      className="fixed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: rect.top - 8,
        left: rect.left + (rect.width/2),
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-frc-void border border-frc-blue/50 shadow-2xl p-4 rounded-md max-w-sm w-72 backdrop-blur-md bg-opacity-95 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest font-mono text-frc-blue">
            formula
          </span>
          <span className="text-[10px] text-frc-steel font-mono">{formula.paper}</span>
        </div>
        <h4 className="text-frc-gold font-medium text-sm mb-2 leading-snug">{formula.name}</h4>
        <p className="text-frc-text-dim text-xs leading-relaxed">
          {formula.description}
        </p>
      </div>
      <div
        className="absolute w-3 h-3 bg-frc-void border-r border-b border-frc-blue/50 rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"
      ></div>
    </div>,
    document.body
  );
}
