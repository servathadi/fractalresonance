# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Content Sources                        │
│  Books (.md)  Papers (.md)  Infographics (.png)         │
│  Videos (YouTube IDs)  NotebookLM slides                │
└────────────────────────┬────────────────────────────────┘
                         │ Drop into content/inbox/
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Processing Agent                         │
│  1. Parse markdown + frontmatter                         │
│  2. Extract [[wikilinks]] → build graph                  │
│  3. Translate (Gemini 3 Flash)                           │
│  4. Verify equations (Grok reasoning)                    │
│  5. Generate metadata (tags, related, backlinks)         │
│  6. Move to content/{lang}/{type}/                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Build (Next.js)                         │
│  - Read content/{lang}/**/*.md                           │
│  - Parse frontmatter + markdown body                     │
│  - Resolve [[wikilinks]] to internal paths               │
│  - Generate backlinks index                              │
│  - Render Obsidian-style pages                           │
│  - Generate /api/* JSON endpoints                        │
│  - Generate /llms.txt                                    │
│  - Static export → Cloudflare Pages                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Cloudflare Pages (CDN)                     │
│  - Global edge delivery                                  │
│  - fractalresonance.com                                  │
│  - Auto-deploy from GitHub push                          │
│  - DDoS protection, SSL                                  │
└─────────────────────────────────────────────────────────┘
```

## Content Model

### File Format (Obsidian-compatible)

```markdown
---
id: FRC-100-007
title: "Quantitative Predictions for Born Rule Deviations"
series: 100
author: Hadi Servat
date: 2025-10-15
status: published
tags: [born-rule, lambda-field, predictions]
lang: en
translations: [fa, zh]
related: [FRC-100-006, FRC-566-001]
---

# Lambda Field Theory

The core equation is [[Coherence|C = (1/N) Σ cos(φᵢ - φⱼ)]].

This builds on [[FRC-100-006]] which derived the Born rule...

## Derivation

Λ(x) ≡ Λ₀ ln C(x)

Where Λ₀ ≈ 10⁻³⁵ J is the calibration constant.
```

### Content Types

| Type | Location | Description |
|------|----------|-------------|
| Papers | `content/{lang}/papers/` | Research papers (FRC xxx.xxx) |
| Books | `content/{lang}/books/` | Book chapters |
| Guides | `content/{lang}/guides/` | Introductory guides |
| Episodes | `content/{lang}/episodes/` | Video + slides pages |
| Formulas | `content/{lang}/formulas/` | Interactive formula pages |

### Language Structure

```
content/
├── en/           # English (primary)
├── fa/           # Farsi (فارسی)
├── zh/           # Chinese (中文)
├── ar/           # Arabic (العربية)
├── es/           # Spanish
├── fr/           # French
├── de/           # German
└── ...           # Any ISO 639-1 code
```

## Routing

```
/{lang}/                          → Homepage (language-specific)
/{lang}/papers                    → Paper listing
/{lang}/papers/{id}               → Individual paper (Obsidian-style)
/{lang}/books/{id}/{chapter}      → Book chapter
/{lang}/formulas/{id}             → Interactive formula
/{lang}/episodes/{id}             → Video + slides
/{lang}/graph                     → Knowledge graph visualization
/api/concepts                     → JSON: Core concepts
/api/papers                       → JSON: All papers
/api/graph                        → JSON: Knowledge graph
/llms.txt                         → LLM discovery file
```

## UI Layers

### 1. Header
- Top micro-bar: site identifier, ORCID link, theme toggle (sun/moon)
- Main nav: Logo + navigation links (About, Articles, Papers, Formulas, Positioning, mu-Levels)

### 2. Sidebar (paper pages, hidden in reading mode)
- Paper tree (collapsible by series: 100, 566)
- Concept pages
- Active page highlighting

### 3. Main Content
- Clean typography (Inter for body, JetBrains Mono for code)
- Inline images from slides/infographics
- `[[wikilinks]]` rendered as navigable links
- Equation blocks with gold left border
- Backlinks section at bottom
- Table of Contents on right rail (scroll-tracked)

### 4. Interactive Features
- **Reading mode** — floating book icon (bottom-right), hides all chrome
- **Text share** — select 5+ chars → Copy/Tweet/Link popover appears
- **Theme toggle** — dark/light with smooth CSS transition
- **Video series** — episode grid with slide thumbnails on homepage

### 5. SEO/AI Layer (invisible to humans)
- JSON-LD structured data (ScholarlyArticle, Person, Dataset, WebSite)
- Google Scholar citation_* meta tags on paper pages
- Dublin Core meta tags on paper pages
- Dynamic sitemap.xml with correct lastmod dates
- `/llms.txt` with full framework summary
- ORCID, ResearchGate, Academia.edu sameAs links in schema

## Access Control

| Tier | Access | Auth |
|------|--------|------|
| Public | Summaries, equations, positioning, for-ai | None |
| Reader | Full papers, books, episodes | Free signup |
| Premium | Bulk download, API access, training data | Paid |
| AI Training | Structured bulk export, high-rate API | License |

Auth via Supabase (same as mumega-web).

## Translation Pipeline

```
Source (en) → Gemini 3 Flash → Draft ({lang}) → Verify → Publish
```

- Gemini 3 Flash: 1500 free requests/day
- Batch process: translate N papers per day
- Reasoning check: verify equation notation preserved
- Human review: optional for high-priority papers

## Build & Deploy

```bash
# Local development
npm run dev

# Production build (static export)
npm run build

# Deploy (push to main → Cloudflare Pages auto-deploys)
git push origin main
```

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Static vs Dynamic | Static export | CDN-friendly, no server needed |
| CMS vs Files | Files (markdown) | Obsidian-compatible, git-versioned |
| Database | None (build-time) | Content is files, no runtime DB |
| Hosting | Cloudflare Pages | Free, global CDN, auto-deploy from main |
| Styling | Tailwind CSS 4 | `@theme inline` with CSS custom properties |
| Theming | next-themes | SSR-safe, localStorage persistence, system detection |
| SEO | Dynamic sitemap + Scholar meta + JSON-LD | Academic discoverability |
| Typography | Inter + JetBrains Mono | Via Google Fonts, preconnect |
| Images | next/image | Auto-optimization, responsive sizes |
