# FRC Brand Guide

**Source:** `/home/mumega/dominion/FRC Resources/FRCBranding/brand guide`

## Color Palette (STRICT)

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Void | `#0B1020` | `--frc-void` | Primary background |
| Text | `#E6E8EC` | `--frc-text` | Main text (off-white) |
| Text Dim | `#9CA3AF` | `--frc-text-dim` | Secondary text |
| Blue | `#1F3A5F` | `--frc-blue` | Coherence, flow, borders |
| Blue Light | `#2E4A7D` | `--frc-blue-light` | Highlights, phase states |
| Gold | `#C9A227` | `--frc-gold` | Invariants, attractors, equations |
| Gold Light | `#D4A84B` | `--frc-gold-light` | Gold highlights |
| Steel | `#6B7280` | `--frc-steel` | Tertiary, metadata |

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

- **Dark background** (void #0B1020)
- **Generous whitespace** — content breathes
- **Left sidebar** — collapsible paper tree
- **Max content width** — 720px for readability
- **Line height** — 1.75 for body text
- **Headings** — light weight, gold for H1, text for H2+
- **Links** — gold color, no underline until hover
- **Code blocks** — slightly lighter background, monospace
- **Images** — full-width within content column, subtle border
- **Backlinks** — section at bottom, dimmer text
- **Tags** — small pills, blue background
