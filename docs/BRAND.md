# FRC Brand Guide

**Source:** `/home/mumega/dominion/FRC Resources/FRCBranding/brand guide`

## Color Palette

Colors are defined as CSS custom properties and swap between themes.

### Dark Theme (brand default)

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Void | `#0B1020` | `--frc-void` | Primary background |
| Void Light | `#0E1428` | `--frc-void-light` | Alt sections background |
| Text | `#E6E8EC` | `--frc-text` | Main text (off-white) |
| Text Dim | `#9CA3AF` | `--frc-text-dim` | Secondary text |
| Blue | `#1F3A5F` | `--frc-blue` | Coherence, flow, borders |
| Blue Light | `#2E4A7D` | `--frc-blue-light` | Highlights, phase states |
| Gold | `#C9A227` | `--frc-gold` | Invariants, attractors, equations |
| Gold Light | `#D4A84B` | `--frc-gold-light` | Gold highlights |
| Steel | `#6B7280` | `--frc-steel` | Tertiary, metadata |

### Light Theme

| Name | Hex | CSS Variable | Notes |
|------|-----|--------------|-------|
| Void | `#FAFBFC` | `--frc-void` | Near-white background |
| Void Light | `#F0F2F5` | `--frc-void-light` | Alt sections |
| Text | `#1A1D23` | `--frc-text` | Dark text |
| Text Dim | `#5A6170` | `--frc-text-dim` | Secondary text |
| Blue | `#CBD5E1` | `--frc-blue` | Light borders |
| Blue Light | `#94A3B8` | `--frc-blue-light` | Hover borders |
| Gold | `#96780A` | `--frc-gold` | Darker gold (WCAG AA on white) |
| Gold Light | `#A8871E` | `--frc-gold-light` | Lighter gold accent |
| Steel | `#64748B` | `--frc-steel` | Labels/metadata |

### Theme Implementation

```css
/* globals.css */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-frc-void: var(--frc-void);
  /* ... all colors reference CSS variables */
}

:root { /* light values */ }
.dark { /* dark values */ }
```

Switching is handled by `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`.

## Semantic Color Mapping

| Color | Meaning |
|-------|---------|
| Gold | Invariant, equilibrium, attractor, equation |
| Blue | Coherence, flow, propagation, phase |
| Void (dark bg) | Vacuum, null state, background |
| White text | Measurement, record, content |

## FORBIDDEN

- Red / crimson
- Green
- Purple / magenta
- Rainbow / neon
- Pastels
- Warm earth tones
- Glow / bloom effects
- Painterly textures
- Gradients (subtle opacity allowed, no color gradients)

## Typography

| Role | Font | Weight |
|------|------|--------|
| Body | Inter | 400 (regular), 300 (light) |
| Code/Math | JetBrains Mono | 400 |
| Headings | Inter | 300 (light), 200 (thin) |
| Alt body | IBM Plex Sans | 400 |

## Design Rules

1. **Abstract / diagrammatic only** — no people, animals, landscapes
2. **Symmetry preferred** — radial, axial, lattice patterns
3. **Allowed shapes** — toroids, spirals, waves, grids, phase diagrams
4. **Clean vector lines** — consistent stroke width
5. **Solid fills only** — no gradients within shapes
6. **Sans-serif only** — never use serif fonts
7. **Minimal animation** — Canvas API for math visualizations, no Three.js

## Logo Assets

| File | Location | Usage |
|------|----------|-------|
| `frc-sigil.png` | `public/brand/` | Logo mark (spiral) |
| `frc-banner.png` | `public/brand/` | Full banner |
| `frc-logo.jpg` | `public/brand/` | Nav/small use |

## TypeScript Constants

```typescript
export const FRC = {
  void: '#0B1020',
  text: '#E6E8EC',
  textDim: '#9CA3AF',
  blue: '#1F3A5F',
  blueLight: '#2E4A7D',
  gold: '#C9A227',
  goldLight: '#D4A84B',
  steel: '#6B7280',
} as const;
```

## Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        frc: {
          void: '#0B1020',
          text: '#E6E8EC',
          'text-dim': '#9CA3AF',
          blue: '#1F3A5F',
          'blue-light': '#2E4A7D',
          gold: '#C9A227',
          'gold-light': '#D4A84B',
          steel: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

## Reading Experience Design

The site should feel like reading from someone's Obsidian vault:

- **Dark/Light background** — theme-adaptive via CSS variables
- **Generous whitespace** — content breathes
- **Left sidebar** — collapsible paper tree (hidden in reading mode)
- **Max content width** — 720px for readability (680px in reading mode)
- **Line height** — 1.8 for body text (1.9 in reading mode)
- **Headings** — light weight, gold for H1, text for H2+
- **Links** — gold color, no underline until hover
- **Code blocks** — slightly lighter background, monospace, gold left border
- **Images** — full-width within content column, subtle border
- **Backlinks** — section at bottom, dimmer text
- **Tags** — small pills, blue border, mono font
- **Reading mode** — floating toggle hides all chrome for focused reading
- **Text share** — select text to get copy/tweet/link share popover

## Interactive Features

| Feature | Component | Location |
|---------|-----------|----------|
| Theme toggle | `ThemeToggle.tsx` | Header micro-bar |
| Reading mode | `ReadingMode.tsx` | Paper pages (bottom-right) |
| Text share | `TextSharePopover.tsx` | Global (all pages) |
| Video series | `VideoSeries.tsx` | Homepage |
| Table of contents | `TableOfContents.tsx` | Paper pages (right rail) |
| Sidebar | `Sidebar.tsx` | Paper pages (left rail) |
