# Content Pipeline

## Overview

Content flows through a pipeline from raw intake to published pages on Cloudflare.

```
Source → Inbox → Process → Translate → Verify → Publish → CDN
```

## Step 1: Intake

Drop any markdown file into `content/inbox/`. Supported:

| Source | Format | Notes |
|--------|--------|-------|
| Papers | `.md` with frontmatter | YAML frontmatter required |
| Book chapters | `.md` | Part of a book series |
| Transcripts | `.md` | From YouTube/podcast |
| NotebookLM exports | `.md` + images | Slides as PNGs |

### Frontmatter Schema

```yaml
---
id: FRC-100-007              # Unique ID (required)
title: "Paper Title"          # Display title (required)
series: 100                   # Series number
author: Hadi Servat           # Author name
date: 2025-10-15             # Publication date
status: draft|published       # Visibility
tags: [tag1, tag2]           # Categorization
lang: en                      # ISO 639-1 language code
translations: [fa, zh]       # Available translations
related: [FRC-100-006]       # Explicit relationships
type: paper|book|guide|episode  # Content type
images: [/infographics/x.png]  # Associated images
---
```

## Step 2: Process

The processing agent (SOS fork or CLI script):

1. **Validate** — Check frontmatter completeness
2. **Parse wikilinks** — Extract `[[FRC-100-006]]` references
3. **Build graph** — Update relationship index
4. **Generate metadata** — Auto-tag, summarize, extract equations
5. **Associate images** — Match infographic PNGs to content
6. **Move** — From `inbox/` to `content/{lang}/{type}/`

### Wikilink Format

```markdown
See [[FRC-100-006]] for the Born rule derivation.
The [[Coherence|coherence equation]] governs...
[[FRC-566-001#reciprocity-law|Reciprocity Law]]
```

Parsed as:
- `[[ID]]` → link to paper by ID
- `[[ID|display text]]` → link with custom text
- `[[ID#section|text]]` → link to section

## Step 3: Translate

Batch translation using Gemini 3 Flash (free tier: 1500 req/day):

```
content/en/papers/FRC-100-007.md
    ↓ Gemini 3 Flash
content/fa/papers/FRC-100-007.md
content/zh/papers/FRC-100-007.md
content/ar/papers/FRC-100-007.md
...
```

### Translation Rules

1. **Preserve equations** — Never translate math notation
2. **Preserve frontmatter** — Only translate `title`, `tags`
3. **Preserve wikilinks** — Keep `[[FRC-100-007]]` as-is
4. **Preserve code blocks** — Keep equation blocks verbatim
5. **Add `translated_by: gemini-3-flash`** to frontmatter
6. **Add `translation_date:`** timestamp

### Language Priority

1. English (en) — primary, always available
2. Farsi (fa) — author's native language
3. Chinese (zh) — large research community
4. Arabic (ar) — regional priority
5. Spanish (es) — global reach
6. Others as resources allow

## Step 4: Verify

Reasoning model (Grok/Claude) checks:

1. **Equation accuracy** — Do translated equations match originals?
2. **Concept consistency** — Are FRC terms used correctly?
3. **Link validity** — Do all wikilinks resolve?
4. **Completeness** — Is frontmatter complete?

If verification fails, content stays in `inbox/` with error notes.

## Step 5: Build

`npm run build` generates static pages:

1. Read all `content/{lang}/**/*.md` files
2. Parse frontmatter and markdown body
3. Resolve `[[wikilinks]]` to internal URLs
4. Generate backlinks index
5. Render pages with Obsidian-style layout
6. Generate `/api/*` JSON endpoints
7. Generate `/llms.txt`
8. Output static HTML/CSS/JS

## Step 6: Deploy

GitHub push triggers Cloudflare Pages build:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [v2-foundation, main]
```

## Directory After Processing

```
content/
├── inbox/                    ← Raw intake (temporary)
├── en/
│   ├── papers/
│   │   ├── FRC-100-001.md
│   │   ├── FRC-100-007.md
│   │   ├── FRC-566-001.md
│   │   └── ...
│   ├── books/
│   │   ├── book-1/
│   │   │   ├── chapter-01.md
│   │   │   └── chapter-02.md
│   │   └── ...
│   ├── guides/
│   │   └── introduction.md
│   └── episodes/
│       ├── ep1-ghost-in-machine.md
│       └── ...
├── fa/
│   ├── papers/
│   │   ├── FRC-100-001.md   ← Translated
│   │   └── ...
│   └── ...
└── _index.json               ← Auto-generated: graph, backlinks
```

## Agent Configuration

For SOS agent fork, configure in `.env`:

```bash
GEMINI_API_KEY=...            # For translation
GROK_API_KEY=...              # For verification (optional)
TRANSLATE_LANGS=fa,zh,ar,es   # Target languages
BATCH_SIZE=10                 # Papers per run
VERIFY_EQUATIONS=true         # Enable equation checking
```

## Manual Processing

Without the agent, you can process manually:

```bash
# Move file from inbox to correct location
mv content/inbox/my-paper.md content/en/papers/FRC-XXX-YYY.md

# Rebuild
npm run build

# Preview
npm run dev
```
