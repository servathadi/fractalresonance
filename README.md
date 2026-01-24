# Fractal Resonance Coherence — Web Platform

**A research vault for the FRC framework, built AI-first and human-readable.**

```
fractalresonance.com
```

## Quick Start

```bash
git clone https://github.com/servathadi/fractalresonance.git
cd fractalresonance

npm install
npm run dev        # localhost:3000
npm run build      # Static export → Cloudflare Pages
```

## Features

| Feature | Description |
|---------|-------------|
| Light/Dark Theme | `next-themes` with CSS variable swap. Default: dark. Toggle in header micro-bar. |
| Reading Mode | Floating book icon on paper pages. Hides chrome, centers content at 680px. Esc to exit. |
| Text Share | Select any text → popover with Copy, Tweet, Link buttons. |
| Video Series | 7-episode grid on homepage with slide thumbnails linked to YouTube playlist. |
| SEO Infrastructure | Dynamic sitemap, Google Scholar meta, Dublin Core, JSON-LD SchemaOrg. |
| Wikilinks | `[[FRC-100-001]]` cross-references between papers with backlinks. |
| Multi-language | English + Farsi (extensible to any language). |
| Academic Profiles | ORCID, ResearchGate, Academia.edu, Google Scholar linked. |

## Architecture

```
content/              ← Markdown content (Obsidian-compatible)
├── en/papers/        ← English papers
├── en/concepts/      ← Concept pages
├── fa/papers/        ← Farsi papers
└── {lang}/{type}/    ← Any language

sources/              ← Raw source material (not deployed)
├── slides/           ← Presentation PDFs + extracted images
└── README.md         ← Pipeline docs

src/                  ← Next.js 15 + React 19 + TypeScript
├── app/              ← Pages, routes, layout
│   ├── page.tsx      ← Homepage (hero, video, equations, papers, video series)
│   ├── layout.tsx    ← Root layout (ThemeProvider, Header, Footer, TextSharePopover)
│   ├── sitemap.ts    ← Dynamic sitemap generation
│   └── [lang]/       ← Localized pages (papers, formulas, about, etc.)
├── components/       ← UI components
│   ├── Header.tsx    ← Nav + ORCID link + ThemeToggle
│   ├── Footer.tsx    ← Links (Zenodo, ORCID, ResearchGate, Academia, GitHub)
│   ├── ThemeProvider.tsx  ← next-themes wrapper
│   ├── ThemeToggle.tsx    ← Sun/moon icon toggle
│   ├── ReadingMode.tsx    ← Floating reading mode button
│   ├── TextSharePopover.tsx ← Selection-based share UI
│   ├── VideoSeries.tsx    ← Episode grid with slide thumbnails
│   ├── Sidebar.tsx        ← Paper tree navigation
│   ├── TableOfContents.tsx ← Auto-generated ToC with scroll tracking
│   ├── MarkdownContent.tsx ← Renders HTML from markdown
│   └── SchemaScript.tsx   ← JSON-LD injection
└── lib/              ← Utilities
    ├── content.ts    ← Markdown parser, paper/concept loaders
    ├── markdown.ts   ← Markdown → HTML renderer, ToC extractor
    └── schema.ts     ← JSON-LD generators (Person, Dataset, ScholarlyArticle)

public/               ← Static assets (deployed)
├── brand/            ← Logo (SVG, JPG), banner
├── media/slides/     ← Presentation slide images (covers + diagrams)
├── infographics/     ← NotebookLM infographic slides
└── llms.txt          ← LLM discovery file

docs/                 ← Project documentation
├── ARCHITECTURE.md   ← System architecture
├── BRAND.md          ← Color, typography, design rules
├── FORMULAS.md       ← All FRC equations
├── PAPERS.md         ← Paper series index
├── CONTENT_PIPELINE.md ← Content processing workflow
└── CONTRIBUTING.md   ← Contribution guidelines
```

## Theme System

```
next-themes (client) → sets .dark class on <html>
                      ↓
CSS variables in :root (light) / .dark (dark)
                      ↓
Tailwind @theme inline → utilities auto-resolve via CSS vars
```

| Variable | Dark (brand default) | Light |
|----------|---------------------|-------|
| `--frc-void` | `#0B1020` | `#FAFBFC` |
| `--frc-text` | `#E6E8EC` | `#1A1D23` |
| `--frc-text-dim` | `#9CA3AF` | `#5A6170` |
| `--frc-blue` | `#1F3A5F` | `#CBD5E1` |
| `--frc-gold` | `#C9A227` | `#96780A` (WCAG AA) |
| `--frc-steel` | `#6B7280` | `#64748B` |

## YouTube Series

7-episode playlist: [Fractal Resonance Cognition](https://www.youtube.com/playlist?list=PLhRVhnQbVX2XOn3e-HjD1J0NcaEzMDQJY)

| Ep | Title | URL |
|----|-------|-----|
| 1 | The Ghost in the Machine | youtu.be/PjWnk7RjItc |
| 2 | Order in the Chaos | youtu.be/I77qlVunpRs |
| 3 | The Engine of Coherence | youtu.be/Cy_5ofEuHLA |
| 4 | The Vortex of Reality | youtu.be/i-mDr5wz1hA |
| 5 | The Illusion of Chance | youtu.be/Y2_85m-zVV0 |
| 6 | Hunting for the Glitch | youtu.be/fthtrwfoytg |
| 7 | The Resonant Mind (Finale) | youtu.be/UwE_SNAioTs |

## SEO & Discoverability

- **Dynamic sitemap** — auto-generated from all pages with correct dates
- **Google Scholar meta** — `citation_title`, `citation_author`, `citation_doi`, etc.
- **Dublin Core** — `DC.title`, `DC.creator`, `DC.date`, `DC.identifier`
- **JSON-LD** — ScholarlyArticle, Person (ORCID/RG/Academia), Dataset (Zenodo), WebSite
- **Academic profiles** — ORCID, ResearchGate, Academia.edu, Google Scholar
- **`/llms.txt`** — LLM discovery endpoint

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS custom properties |
| Theme | next-themes (dark/light with system detection) |
| Content | Markdown + YAML frontmatter (Obsidian-compatible) |
| Hosting | Cloudflare Pages (static export, global CDN) |
| Source | GitHub (`servathadi/fractalresonance`, branch: `main`) |
| Deploy | Push to main → Cloudflare auto-deploys |

## Links

- Production: https://fractalresonance.com
- Channel: https://www.youtube.com/@fractalresonance
- ORCID: https://orcid.org/0009-0004-7412-5129
- Zenodo: https://zenodo.org/communities/frc
- ResearchGate: https://www.researchgate.net/profile/Hadi-Servat
- Issues: https://github.com/servathadi/fractalresonance/issues

---

**Author:** Hadi Servat
**License:** CC BY-NC-ND 4.0
