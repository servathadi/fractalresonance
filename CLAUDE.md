# FRC v2 — AI Agent Instructions

## Project Identity

**Fractal Resonance Coherence (FRC)** — A deterministic framework for quantum mechanics and consciousness.
**Author:** Hadi Servat
**Site:** https://fractalresonance.com
**Repo:** github.com/servathadi/fractalresonance (branch: main)
**Deploy:** Push to main → Cloudflare Pages auto-deploys

## Your Role

You are working on the FRC research platform. This is a content-heavy site that presents scientific papers, books, and interactive formula pages. Your job is to maintain and extend it while respecting the strict brand and content guidelines.

## Critical Rules

### Design (NEVER BREAK THESE)

1. **ONLY use FRC brand colors (via CSS variables, theme-adaptive):**
   - Dark: Void `#0B1020`, Text `#E6E8EC`, Blue `#1F3A5F`, Gold `#C9A227`
   - Light: Void `#FAFBFC`, Text `#1A1D23`, Blue `#CBD5E1`, Gold `#96780A`
   - Always use `var(--color-frc-*)` or Tailwind `text-frc-*` / `bg-frc-*` classes
   - NEVER hardcode hex colors in components

2. **FORBIDDEN colors:** Purple, red, green, magenta, rainbow, neon, pastels

3. **FORBIDDEN effects:** Glow, bloom, color gradients, painterly textures, border-radius

4. **Typography:** Inter (body), JetBrains Mono (code/math). Sans-serif only.

5. **Theme system:** `next-themes` with `@custom-variant dark`. Default: dark. Toggle in header.

6. **Reading experience:** Clean, minimal, content-focused. Reading mode available on paper pages.

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
content/              ← Content (markdown with YAML frontmatter)
├── en/papers/        ← English papers (FRC-100-*, FRC-566-*)
├── en/concepts/      ← Concept pages (coherence, etc.)
├── fa/papers/        ← Farsi papers
└── {lang}/{type}/    ← Organized by language and type

sources/              ← Raw source material (not deployed)
├── slides/           ← Presentation PDFs + extracted images
└── README.md         ← Pipeline documentation

src/                  ← Application code (Next.js 15 + React 19)
├── app/              ← Pages, routes, layout, sitemap
├── components/       ← UI components (see below)
└── lib/              ← Content loaders, markdown renderer, schema generators

public/               ← Static assets (deployed to CDN)
├── brand/            ← Logo (SVG, JPG), banner
├── media/slides/     ← Presentation slide thumbnails + diagrams
├── infographics/     ← NotebookLM slides
└── llms.txt          ← LLM discovery file

docs/                 ← Project documentation
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `ThemeProvider.tsx` | Wraps app with next-themes (dark/light/system) |
| `ThemeToggle.tsx` | Sun/moon icon button in header micro-bar |
| `ReadingMode.tsx` | Floating toggle — hides chrome, centers content |
| `TextSharePopover.tsx` | Selection-based share (copy/tweet/link) |
| `VideoSeries.tsx` | 7-episode grid with slide thumbnails |
| `Header.tsx` | Navigation + ORCID + theme toggle |
| `Footer.tsx` | Links (Zenodo, ORCID, ResearchGate, Academia, GitHub, llms.txt) |
| `Sidebar.tsx` | Paper tree navigation (hidden in reading mode) |
| `TableOfContents.tsx` | Auto-generated ToC with scroll tracking |
| `SchemaScript.tsx` | JSON-LD structured data injection |

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
