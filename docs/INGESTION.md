# Content Ingestion (Chats, Notes, Philosophy)

This repo is file-based CMS. The most reliable workflow is:

1) Drop raw material into `content/inbox/` (ignored by git)
2) Run a deterministic processor that produces clean, reviewable markdown in `content/{lang}/{type}/`
3) Edit/curate and commit only the processed outputs

## Option A: One file = one page

Paste any text into a file, then run:

```bash
# Example: ingest a chat as a draft article
npm run content:ingest -- --file /path/to/chat.txt --type article --lang en --title "On Time and Coherence" --tags time,coherence,whitehead --source "chat:gemini" --perspective river
```

This creates a draft markdown file under:

`content/inbox/<lang>/<type>/<id>.md`

Then move it into the real CMS structure:

```bash
npm run content:process-inbox
```

## Optional: AI Digestion via SOS (River/Kasra)

If you have SOS running (local or remote), `content:process-inbox` can ask SOS to rewrite inbox drafts into clean markdown with consistent frontmatter.

Environment:

- `CMS_SOS_URL` (default: `http://localhost:6060`)
- `CMS_SOS_AGENT` (default: `agent:River`)
- `CMS_SOS_MODEL` (optional, e.g. `grok-4-1-fast-reasoning`)

Usage:

```bash
CMS_SOS_URL=http://localhost:6060 CMS_SOS_AGENT=agent:River \\
  npm run content:process-inbox -- --ai sos
```

## Option B: One file = many pages (recommended)

For long chats, you can mark multiple extractable pages in a single file.

Use blocks:

```md
<!-- frc:begin type=concept id=time lang=en title="What is Time?" tags=time,entropy,UCC status=draft source="chat:claude" -->
# What is Time?

Your curated content goes here.
<!-- frc:end -->

<!-- frc:begin type=article id=note-2026-01-25-process-jung lang=en title="Process + Jung: Two Lenses" tags=process-philosophy,jung,interpretation status=draft perspective=river source="chat:gpt" -->
# Process + Jung: Two Lenses

Your curated content goes here.
<!-- frc:end -->
```

Then:

```bash
npm run content:ingest -- --file /path/to/mega-chat.md
npm run content:process-inbox
```

## How We Handle “Opinionated” Philosophy Content

Use the CMS types intentionally:

- `concepts`: definitions (Whitehead, Jung, Mulla Sadra, Suhrawardi, etc.)
- `articles`: essays / bridges / commentary / debate
- `papers`: formal FRC research docs

Use tags to encode lenses rememberable by the system:

- `process-philosophy`, `whitehead`
- `jung`, `archetypes`
- `mulla-sadra`, `sohravardi` (add concept pages for each)

If content is interpretive/speculative, keep it as an `article` with `status: draft` until you want to promote it.

## Digest Metadata (Optional)

Any page can include:

```yaml
tldr: "One-sentence summary."
key_points: ["...", "..."]
prerequisites: ["coherence", "UCC", "process-philosophy"]
read_time: "8 min"
```

These show up as a “Digest” block above the body on the site.

## Perspective Metadata (River vs Kasra)

Pages can be tagged for a specific perspective:

```yaml
perspective: river   # or kasra, or both
```

This is optional. If omitted, content is treated as `kasra` by default.

## River Digest Template (Standard)

To create a standard River digest skeleton:

```bash
npm run content:new-river -- --lang en --title "My Digest Title" --tags river,digest,meta --source "chat:gemini"
```

It writes to `content/inbox/<lang>/articles/` by default. Then:

```bash
npm run content:process-inbox
```

## Topic Template (Q&A + Spectrum)

To create a new Topics page draft:

```bash
npm run content:new-topic -- --lang en --title "What is coherence?" --question "What is coherence in FRC?" --perspective river --tags coherence,frc --short_answer "..."
```

Then run `content:process-inbox` (optionally with `--ai sos`).

## Media Hygiene (Remote Images -> Local)

If a markdown file references remote images (e.g. `https://.../image.png`), you can pull them into the repo and rewrite the markdown to stable local paths under `public/media/...`.

```bash
# Sync remote images for all content (skips content/inbox by default)
npm run content:sync-media

# Limit to one language
npm run content:sync-media -- --lang en

# Include inbox drafts too
npm run content:sync-media -- --include-inbox

# Dry-run (prints a summary, no files written)
npm run content:sync-media -- --dry-run
```

By default, `content:sync-media` also considers frontmatter image URLs (e.g. `video.thumbnailUrl`).
To disable that:

```bash
npm run content:sync-media -- --frontmatter=false
```
