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

## Status
Awaiting user's paper with cinematic scenes for Version B inspiration.
