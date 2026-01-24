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

### 1. Sidebar (always visible)
- Paper tree (collapsible by series)
- Book chapters
- Language switcher
- Search
- Graph link

### 2. Main Content (Obsidian reading experience)
- Clean typography (Inter for body, JetBrains Mono for code)
- Inline images from infographics
- `[[wikilinks]]` rendered as hover-preview links
- Code blocks for equations
- Backlinks section at bottom

### 3. AI Layer (invisible to humans, structured for agents)
- JSON-LD on every page
- `/llms.txt` with full framework summary
- `/api/*` endpoints for programmatic access
- Structured frontmatter for extraction

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

# Deploy (automatic via GitHub Actions)
git push origin v2-foundation
# → GitHub Actions → npm run build → Cloudflare Pages
```

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Static vs Dynamic | Static export | CDN-friendly, no server needed |
| CMS vs Files | Files (markdown) | Obsidian-compatible, git-versioned |
| Database | None (build-time) | Content is files, auth is Supabase |
| Hosting | Cloudflare Pages | Free, global CDN, auto-deploy |
| Styling | Tailwind 4 | FRC brand tokens, dark theme |
| Translation | Gemini 3 Flash | Free tier, good quality |
| Auth | Supabase | Already in use, role-based |
