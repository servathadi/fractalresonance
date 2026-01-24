/**
 * FRC Brand Colors
 *
 * These match the CSS custom properties in globals.css.
 * Use Tailwind classes (text-frc-gold, bg-frc-void, etc.) in components.
 * Use these constants only for programmatic color access (charts, canvas, etc.)
 */

export const FRC_COLORS = {
  void: '#0B1020',
  text: '#E6E8EC',
  textDim: '#9CA3AF',
  blue: '#1F3A5F',
  blueLight: '#2E4A7D',
  gold: '#C9A227',
  goldLight: '#D4A84B',
  steel: '#6B7280',
} as const;

/** Semantic color meanings in FRC context */
export const FRC_SEMANTICS = {
  invariant: FRC_COLORS.gold,      // Equations, constants, laws
  coherence: FRC_COLORS.blue,      // Fields, structures, connections
  background: FRC_COLORS.void,     // The void — canvas
  emphasis: FRC_COLORS.goldLight,  // Highlights, active states
  muted: FRC_COLORS.textDim,      // Secondary text, metadata
} as const;

export type FRCColor = keyof typeof FRC_COLORS;
