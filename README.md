# Fractal Resonance Coherence — Web Platform

**A research vault for the FRC framework, built AI-first and human-readable.**

```
fractalresonance.com
```

## Quick Start

```bash
# Clone
git clone https://github.com/servathadi/fractalresonance.git
cd fractalresonance
git checkout v2-foundation

# Install
npm install

# Dev
npm run dev        # localhost:3000

# Build
npm run build      # Static export for Cloudflare Pages
```

## Architecture

```
content/              ← Drop markdown here (Obsidian-compatible)
├── inbox/            ← New content intake (agent processes this)
├── en/papers/        ← English papers
├── fa/papers/        ← Farsi papers
└── {lang}/...        ← Any language

src/                  ← Next.js 15 + React 19
├── app/              ← Pages and routes
├── components/       ← Shared UI (FRC brand)
└── lib/              ← Parsers, utilities

public/               ← Static assets
├── infographics/     ← NotebookLM slides (PNG)
├── images/           ← Diagrams, figures
└── brand/            ← Logo, sigil, banner

docs/                 ← Project documentation
.github/              ← Issues, workflows, templates
```

## Content Pipeline

```
1. Drop .md file into content/inbox/
2. Agent processes: parse frontmatter, validate, tag
3. Agent translates to configured languages (Gemini 3 Flash)
4. Reasoning check (Grok/Claude) for equation accuracy
5. File moves to content/{lang}/{type}/
6. Next build generates static pages
7. Cloudflare Pages deploys globally
```

## Design

- FRC Brand: Void (#0B1020), Blue (#1F3A5F), Gold (#C9A227)
- Obsidian-like reading experience
- `[[wikilinks]]` between papers
- Backlinks and graph connections
- Images inline with content
- AI-first: `/llms.txt`, `/api/*`

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind 4, FRC brand system |
| Content | Markdown + YAML frontmatter |
| Translation | Gemini 3 Flash (free tier) |
| Verification | Grok 4.1 reasoning |
| Hosting | Cloudflare Pages (CDN) |
| Source | GitHub (`servathadi/fractalresonance`) |
| Auth | Supabase (role-based access) |

## Links

- Production: https://fractalresonance.com
- Issues: https://github.com/servathadi/fractalresonance/issues
- Brand Guide: [docs/BRAND.md](docs/BRAND.md)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

**Author:** Hadi Servat
**License:** BSL 1.1
