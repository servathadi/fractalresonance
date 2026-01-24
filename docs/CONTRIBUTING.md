# Contributing to FRC

This project is designed for **human + AI collaboration**. Whether you're a human researcher or an AI agent, follow these guidelines.

## Getting Started

```bash
# Fork the repo
gh repo fork servathadi/fractalresonance

# Clone your fork
git clone https://github.com/YOUR_USERNAME/fractalresonance.git
cd fractalresonance

# Install
npm install

# Create a branch
git checkout -b your-feature

# Run dev server
npm run dev
```

## For AI Agents

Read `CLAUDE.md` at the project root. It contains:
- Project context and FRC overview
- Brand rules (colors, typography)
- Content format specifications
- Pipeline instructions

### Key Files to Understand

1. `docs/ARCHITECTURE.md` — System design
2. `docs/BRAND.md` — Design constraints (FORBIDDEN colors!)
3. `docs/CONTENT_PIPELINE.md` — How content flows
4. `content/en/papers/` — Example paper format

## Adding Content

### New Paper

1. Create markdown file in `content/inbox/`:

```markdown
---
id: FRC-XXX-YYY
title: "Your Paper Title"
series: XXX
author: Hadi Servat
date: 2026-01-24
status: draft
tags: [tag1, tag2]
lang: en
---

# Paper Title

Your content here. Use [[FRC-100-007]] for wikilinks.
```

2. The processing agent will:
   - Validate frontmatter
   - Extract wikilinks
   - Translate if configured
   - Move to `content/en/papers/`

### New Images

Drop images into `public/infographics/` or `public/images/`. Reference them in markdown:

```markdown
![Lambda Field Slide 1](/infographics/lambda-field-01.png)
```

### New Formula Page

Formula pages are interactive React components in `src/app/{lang}/formulas/{id}/page.tsx`. Follow the pattern in existing formula pages. Use Canvas API for animations, NOT Three.js.

## Code Changes

### Design Rules

- ONLY use FRC brand colors (see `docs/BRAND.md`)
- NO purple, red, green, glow effects
- Gold = equations/invariants, Blue = coherence/flow
- Dark background (#0B1020) always
- Clean, minimal, Obsidian-like reading

### Component Guidelines

- Use `src/lib/colors.ts` for FRC color constants
- Use Tailwind with FRC custom colors (`text-frc-gold`, `bg-frc-void`)
- Canvas API for visualizations (no heavy libs)
- Server components by default, `'use client'` only when needed

### Commit Messages

```
feat: add witness formula page
fix: correct lambda field equation rendering
content: add FRC 566.001 paper
translate: add Farsi translation for FRC 100.007
docs: update architecture diagram
```

## Pull Requests

1. Create PR against `v2-foundation` branch
2. Title: clear description of change
3. Body: what changed and why
4. Screenshots: if UI change
5. All builds must pass

## Project Structure

```
/
├── content/           ← CONTENT (markdown files)
├── docs/              ← DOCUMENTATION (you are here)
├── public/            ← STATIC ASSETS (images, brand)
├── src/               ← APPLICATION CODE (Next.js)
├── .github/           ← CI/CD (workflows, templates)
├── CLAUDE.md          ← AI AGENT INSTRUCTIONS
└── README.md          ← QUICK START
```

## Questions?

- Open a GitHub Issue
- Tag with `question` label
- Check existing issues first
