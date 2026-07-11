'use client';

/**
 * Skip link for keyboard users to bypass navigation
 * Appears on focus, links to main content area
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-frc-gold focus:text-frc-void focus:font-medium focus:outline-none focus:ring-2 focus:ring-frc-gold-light"
    >
      Skip to main content
    </a>
  );
}
