# FRC v2 — AI Agent Instructions

## Project Identity

**Fractal Resonance Coherence (FRC)** — A deterministic framework for quantum mechanics and consciousness.
**Author:** Hadi Servat
**Site:** https://fractalresonance.com
**Repo:** github.com/servathadi/fractalresonance (branch: v2-foundation)

## Your Role

You are working on the FRC research platform. This is a content-heavy site that presents scientific papers, books, and interactive formula pages. Your job is to maintain and extend it while respecting the strict brand and content guidelines.

## Critical Rules

### Design (NEVER BREAK THESE)

1. **ONLY use FRC brand colors:**
   - Void: `#0B1020` (background)
   - Text: `#E6E8EC` (body)
   - Text Dim: `#9CA3AF` (secondary)
   - Blue: `#1F3A5F` (borders, coherence)
   - Blue Light: `#2E4A7D` (highlights)
   - Gold: `#C9A227` (equations, headings, links)
   - Steel: `#6B7280` (metadata)

2. **FORBIDDEN colors:** Purple, red, green, magenta, rainbow, neon, pastels

3. **FORBIDDEN effects:** Glow, bloom, gradients, painterly textures

4. **Typography:** Inter (body), JetBrains Mono (code/math). Sans-serif only.

5. **Reading experience:** Obsidian vault feel — clean, minimal, content-focused

### Content Format

All content is **markdown with YAML frontmatter**. Example:

```markdown
---
id: FRC-100-007
title: "Lambda Field Theory"
series: 100
author: Hadi Servat
date: 2025-10-15
status: published
tags: [lambda-field, born-rule, predictions]
lang: en
related: [FRC-100-006, FRC-566-001]
---

# Lambda Field Theory

Content here. Use [[FRC-100-006]] for wikilinks.
```

### Wikilinks

Papers reference each other using `[[ID]]` syntax:
- `[[FRC-100-006]]` → link to paper
- `[[FRC-100-006|Born Rule]]` → link with custom text
- `[[FRC-566-001#reciprocity-law]]` → link to section

### Key Equations

Memorize these (they appear throughout):

```
Coherence:    C = (1/N) Σ cos(φᵢ - φⱼ)
Lambda:       Λ(x) = Λ₀ ln C(x),  Λ₀ ≈ 10⁻³⁵ J
Witness:      W = |⟨ψ|Ô|ψ⟩| / ||Ô||
UCC:          ∂_t ln C = −∇·J_C + S_C
Reciprocity:  dS + k* d ln C = 0
Free Energy:  ΔG = −k*T Δln C
```

## File Structure

```
content/              ← Content (markdown)
├── inbox/            ← New content intake
├── en/papers/        ← English papers
├── fa/papers/        ← Farsi papers
└── {lang}/{type}/    ← Organized by language and type

src/                  ← Application code
├── app/              ← Next.js pages
├── components/       ← UI components
└── lib/              ← Utilities, parsers

public/               ← Static assets
├── infographics/     ← Slide images
├── images/           ← Other images
└── brand/            ← Logo, sigil

docs/                 ← Project documentation
.github/              ← CI/CD, issue templates
```

## Build & Deploy

```bash
npm run dev           # Development (localhost:3000)
npm run build         # Static export
# Push to GitHub → Cloudflare Pages auto-deploys
```

## When Adding Pages

1. Use FRC color constants from `src/lib/colors.ts`
2. Follow Obsidian reading layout pattern
3. Parse and render `[[wikilinks]]`
4. Include backlinks section
5. Add JSON-LD structured data
6. Images from `public/infographics/` where relevant

## When Adding Content

1. Place in `content/inbox/` with proper frontmatter
2. Ensure `id`, `title`, `status`, `lang` are set
3. Use `[[wikilinks]]` for cross-references
4. Reference images with relative paths

## Important References

- Brand guide: `docs/BRAND.md`
- Architecture: `docs/ARCHITECTURE.md`
- All formulas: `docs/FORMULAS.md`
- Content pipeline: `docs/CONTENT_PIPELINE.md`
- FRC 566.001 (latest core paper): Reciprocity Law, UCC PDE form
