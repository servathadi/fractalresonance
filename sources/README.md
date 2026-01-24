# FRC Content Pipeline

## How It Works

```
sources/          →  processing  →  content/ + public/  →  website
(raw, local)         (you + AI)     (git-tracked)          (Cloudflare)
```

**You drop raw materials in `sources/`.** Then tell the AI what to do with them.
The AI processes them into web-ready content and assets.

---

## Folder Structure

### sources/ (LOCAL ONLY — not in git)

| Folder | What to put here | Example |
|--------|-----------------|---------|
| `slides/` | PDF/PPTX presentations, slide decks | `Chaos_Has_Structure.pdf` |
| `images/` | Raw photos, screenshots, hi-res diagrams | `whiteboard_photo.jpg` |
| `papers/` | Raw paper PDFs from Zenodo downloads | `FRC-100-007.pdf` |
| `videos/` | Video files or a `links.txt` with YouTube URLs | `intro_talk.mp4` |
| `notes/` | Draft text, research notes, bullet points | `born_rule_draft.txt` |
| `infographics/` | Canva exports, poster designs, charts | `mu_levels_chart.png` |

### content/ (IN GIT — markdown for the site)

| Folder | Purpose |
|--------|---------|
| `content/en/papers/` | Paper markdown (full text, parsed from PDFs) |
| `content/en/blog/` | Blog posts / article markdown |
| `content/en/concepts/` | Concept definition pages |
| `content/fa/` | Persian translations (future) |

### public/ (IN GIT — web-optimized assets)

| Folder | Purpose | Max size |
|--------|---------|----------|
| `public/brand/` | Logo, banner, favicon | — |
| `public/images/articles/` | Images used in articles/papers | < 200KB each |
| `public/images/diagrams/` | Technical diagrams, equation renders | < 150KB each |
| `public/slides/` | Key slide exports as images (JPG/PNG) | < 300KB each |
| `public/og/` | Social media / Open Graph cards | 1200x630px |

---

## The Routine

### When you have new material:

1. **Drop files** into the appropriate `sources/` subfolder
2. **Tell the AI** what you want done:

```
"Process the slides in sources/slides/ — extract key diagrams
 and create article summaries"

"Turn sources/notes/born_rule.txt into a blog post"

"Create OG images for the papers page"

"Add the new paper PDF to the site"
```

### What the AI does:

| Source type | Processing | Output |
|-------------|-----------|--------|
| **Slides (PDF)** | Extract key frames → optimize as JPG → write summary | `public/slides/`, `content/en/blog/` |
| **Images** | Resize, optimize, proper naming | `public/images/` |
| **Papers (PDF)** | Parse text → create markdown with frontmatter | `content/en/papers/` |
| **Videos** | Extract YouTube ID → embed in articles | `content/en/blog/` |
| **Notes** | Structure into proper markdown article | `content/en/blog/` |
| **Infographics** | Optimize, create web versions | `public/images/diagrams/` |

---

## Naming Conventions

### Files
- Lowercase, hyphens not spaces: `chaos-has-structure.pdf`
- Include FRC ID when relevant: `frc-100-007-diagram-1.jpg`
- Date prefix for blog: `2025-01-24-born-rule-emergent.md`

### Frontmatter (markdown files)
```yaml
---
id: FRC-100-007
title: "Paper Title Here"
date: 2025-01-24
doi: 10.5281/zenodo.XXXXXXX
abstract: "One-paragraph summary"
tags: [coherence, quantum, born-rule]
series: 100
---
```

---

## Current Slide Inventory

| File | Topic | Status |
|------|-------|--------|
| `Chaos_Has_Structure.pdf` | Chaos → structure via FRC | Raw |
| `Fractal_Resonance_Cognition.pdf` | Cognition framework | Raw |
| `Fractal_Resonance_Quantum_Theory.pdf` | Core quantum theory | Raw |
| `Hunting_the_Glitch.pdf` | Born rule deviations | Raw |
| `The_190_Signature.pdf` | 190 experimental signature | Raw |
| `The_Illusion_of_Chance.pdf` | Determinism argument | Raw |
| `Unmasking_Quantum_Randomness.pdf` | Randomness critique | Raw |

To process: `"Extract key slides from sources/slides/ and create article posts"`

---

## Image Optimization Rules

- **Articles**: Max 1200px wide, JPG quality 80, < 200KB
- **Diagrams**: PNG for precision, SVG preferred, < 150KB
- **OG Cards**: Exactly 1200x630px, JPG quality 85
- **Slides**: Max 1920px wide, JPG quality 75, < 300KB
- **Brand**: SVG when possible, lossless otherwise

---

## Strategic Content Calendar

### Priority 1: Foundation
- [ ] Process all 7 slide decks → extract 2-3 hero images each
- [ ] Create OG card for homepage
- [ ] Add slide images to relevant paper pages

### Priority 2: Articles
- [ ] Turn each slide deck into a blog article with key visuals
- [ ] Create "Chaos Has Structure" article (most accessible topic)
- [ ] Create "Hunting the Glitch" article (experimental predictions)

### Priority 3: Social/Distribution
- [ ] Generate OG cards for each paper
- [ ] Create shareable equation images
- [ ] Create μ-level infographic for social sharing

---

## Quick Commands

```bash
# See what's in sources
ls -la sources/slides/
ls -la sources/images/

# Check what's published
ls public/images/articles/
ls public/slides/

# Check content
ls content/en/papers/
ls content/en/blog/
```
