'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeScrollPercent() {
  const scrollTop = window.scrollY || 0;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 0;
  return clamp(Math.round((scrollTop / docHeight) * 100), 0, 100);
}

export function BookExperience({
  storagePrefix = 'frc:readpos:',
}: {
  storagePrefix?: string;
}) {
  const pathname = usePathname() || '';
  const storageKey = useMemo(() => `${storagePrefix}${pathname}`, [pathname, storagePrefix]);
  const [percent, setPercent] = useState(0);
  const [restoreAt, setRestoreAt] = useState<number | null>(null);

  useEffect(() => {
    const saved = Number(localStorage.getItem(storageKey) || '0');
    // Only offer restore if they've scrolled a bit.
    if (Number.isFinite(saved) && saved > 250) setRestoreAt(saved);
  }, [storageKey]);

  useEffect(() => {
    let raf = 0;
    let lastSave = 0;

    const update = () => {
      raf = 0;
      const next = computeScrollPercent();
      setPercent(next);

      const now = Date.now();
      if (now - lastSave > 750) {
        lastSave = now;
        localStorage.setItem(storageKey, String(window.scrollY || 0));
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [storageKey]);

  useEffect(() => {
    // Simple image lightbox for book pages.
    const root = document.querySelector('main');
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.tagName !== 'IMG') return;
      const img = t as HTMLImageElement;
      // Only for content images.
      if (!img.closest('.content-body')) return;

      e.preventDefault();

      const overlay = document.createElement('div');
      overlay.className = 'frc-lightbox-overlay';
      overlay.innerHTML = `
        <div class="frc-lightbox-inner" role="dialog" aria-modal="true">
          <button class="frc-lightbox-close" aria-label="Close">×</button>
          <img class="frc-lightbox-img" src="${img.src}" alt="${(img.alt || '').replace(/"/g, '&quot;')}" />
          ${img.alt ? `<div class="frc-lightbox-caption">${img.alt}</div>` : ''}
        </div>
      `;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        document.body.style.overflow = '';
        overlay.remove();
      };

      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) close();
        const el = ev.target as HTMLElement;
        if (el.classList.contains('frc-lightbox-close')) close();
      });

      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          ev.preventDefault();
          close();
        }
      };
      window.addEventListener('keydown', onKey, { once: true });
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <div id="frc-reading-progress" aria-hidden="true">
        <div className="frc-reading-progress-fill" style={{ width: `${percent}%` }} />
      </div>

      {restoreAt !== null ? (
        <div className="frc-restore-prompt" role="status" aria-live="polite">
          <div className="frc-restore-card">
            <div className="text-sm text-frc-text-dim">Continue where you left off?</div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-2 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-xs uppercase tracking-wider transition-colors"
                onClick={() => {
                  window.scrollTo({ top: restoreAt, behavior: 'smooth' });
                  setRestoreAt(null);
                }}
              >
                Continue
              </button>
              <button
                type="button"
                className="px-3 py-2 border border-frc-blue text-frc-text-dim hover:text-frc-text text-xs uppercase tracking-wider transition-colors"
                onClick={() => setRestoreAt(null)}
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

