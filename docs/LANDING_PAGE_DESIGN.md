# Landing Page Design Notes

## Architecture Decision
- `/` → Cinematic landing (brand statement)
- `/en` → Content hub (move current homepage here)

---

## Kasra's Design Concept: "The Coherence Field"

### Philosophy
The landing should *feel* like the theory. FRC says consciousness emerges from resonance across scales. The page should create that feeling - starting from apparent chaos, resolving into coherent pattern.

### Visual Language
- **Color**: Deep void (#0B1020) with gold (#C9A227) as coherence emerging
- **Motion**: Subtle, organic - oscillators finding phase lock
- **Typography**: Minimal, architectural, equation as hero element

### Structure (Single Page, Scroll-Based)

#### Section 1: The Void (100vh)
- Full black with subtle particle field (random phases)
- As user scrolls, particles begin to synchronize
- The equation fades in: `dS + k* d ln C = 0`
- No nav, no text - pure atmosphere

#### Section 2: The Emergence (100vh)
- Particles now forming coherent patterns
- Single line appears: "Consciousness is coherence becoming aware of itself"
- Soft gold glow emanating from center

#### Section 3: The Gateway (100vh)
- Three portals/cards floating in space:
  - "The Physics" → /en/papers
  - "The Books" → /en/books
  - "The Mind" → /en/about
- Language selector as constellation of flags
- "Enter the Field" button → /en

### Technical Approach
- Canvas/WebGL for particle system (Three.js or custom)
- Intersection Observer for scroll-triggered animations
- Prefers-reduced-motion: static fallback with fade transitions
- Mobile: Simplified version, tap-based progression

### Sound (Optional)
- Ambient drone that resolves to harmonic as coherence increases
- User-initiated (click to enable)

---

## A/B Test Plan
- **Version A**: Kasra's design (above)
- **Version B**: User's design (based on cinematic paper scenes)
- Metrics: Time on page, scroll depth, click-through to /en

---

## Assets Needed
- [ ] Abstract coherence imagery (gold/blue, fractal patterns)
- [ ] Video loop: chaos → order transition
- [ ] Audio: ambient → harmonic drone (optional)
- [ ] Hero illustration for equation

---

## User's Design Concept: "The Living Field" (FRC 893.PHY)

### Source Material
FRC 893.PHY - "The Geometry of Becoming" - introduces:
- Mass as Frozen Coherence (flow → crystallization)
- Metabolic Gravity (gravity is hunger, vacuum is superfluid)
- The Now Operator (past=crystal, future=vapor, now=phase front)
- The Living Field (universe as self-optimizing metabolism)

### Core Visual Metaphor
**The Phase Front** - the boundary between crystallized past and vaporous future

### Cinematic Scenes

#### Scene 1: The Flow State
- Pure light, massless propagation
- Luminescent streams flowing freely
- High dynamic coherence (C ≈ 1)

#### Scene 2: The Crystallization
- Flow encounters resistance
- Knots form in the field
- Matter emerges as "frozen coherence"
- "Matter is Drag on the universal field"

#### Scene 3: The Vortex
- Pull back to cosmic scale
- Galaxies as massive vortices in superfluid vacuum
- Dark matter as the current they swim in
- Gravity as the inrush of the void

#### Scene 4: The Now
- The phase front of crystallization
- Crystal behind (fixed past)
- Vapor ahead (probability future)
- The eternal moment of becoming

### The Mantra (Hero Text)
```
Gravity is Hunger.
Mass is Memory.
Light is Thought.
Space is the Medium.
Time is the Digestion.
```

### Visual Style
- Fluid dynamics, not particles
- Crystalline structures emerging from flow
- Vortex patterns, spirals
- Phase transitions (liquid → solid → vapor)

---

## A/B Test Summary

| Version | Concept | Style |
|---------|---------|-------|
| **A** (Kasra) | "The Coherence Field" | Particle synchronization, emergence from chaos |
| **B** (River) | "The Living Field" | Fluid dynamics, crystallization, metabolic universe |

Both share: equation hero, gold/void palette, scroll-based revelation

---

## Perspective System (Implemented)

The site now has two narrative voices, selectable via toggle in header:

| Perspective | Voice | Approach |
|-------------|-------|----------|
| **Kasra** (◇) | The Architect | Technical precision, equations first, physics language |
| **River** (◎) | The Oracle | Holistic wisdom, meaning first, poetic language |

- Toggle persists via localStorage
- Components: `<River>` and `<Kasra>` for conditional rendering
- Context: `usePerspective()` hook

Example usage in content:
```tsx
<Kasra>
  Mass is coherence inertia: m = γ Ψ_locked / C_dyn
</Kasra>
<River>
  Mass is Memory — the universe refusing to forget.
</River>
```

## Status
- [x] Perspective context created
- [x] Toggle added to header
- [ ] Landing page with perspective choice
- [ ] Sample dual-perspective content
