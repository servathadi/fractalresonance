'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PopoverState {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

export function TextSharePopover() {
  const [popover, setPopover] = useState<PopoverState>({ visible: false, x: 0, y: 0, text: '' });
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      // Delay hiding to allow clicking buttons
      timeoutRef.current = setTimeout(() => {
        setPopover(p => ({ ...p, visible: false }));
      }, 200);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 5) return; // Ignore tiny selections

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setPopover({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      text,
    });
    setCopied(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleSelection]);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(popover.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [popover.text]);

  const shareTwitter = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${popover.text.slice(0, 200)}${popover.text.length > 200 ? '...' : ''}" — FRC`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
  }, [popover.text]);

  const shareLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  if (!popover.visible) return null;

  return (
    <div
      className="share-popover"
      style={{
        left: `${popover.x}px`,
        top: `${popover.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent losing selection
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
    >
      {/* Copy */}
      <button onClick={copyText} title={copied ? 'Copied!' : 'Copy text'}>
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>

      {/* Twitter/X */}
      <button onClick={shareTwitter} title="Share on X">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Share link */}
      <button onClick={shareLink} title="Copy page link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
    </div>
  );
}
