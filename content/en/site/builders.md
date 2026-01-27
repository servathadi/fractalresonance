---
id: builders
title: "Builders"
description: "Builder notes for FRC: architecture, corpus contract, and reproducible paths into the canon."
contract:
  - "Canon lives in Papers/Topics with stable IDs (e.g., FRC-840-001)."
  - "Interpretation is an opt-in lens (Oracle) that must cite canon IDs and never overwrite definitions."
  - "Modes are UI-level (formal/interpretation/both); URLs remain canonical for citation."
  - "Every claim should map to a falsifiable statement or a clearly labeled hypothesis."
implementation_notes:
  - "Public site: static export, designed for discoverability and citation."
  - "Runtime (SDK / agents / memory) belongs on Mumega/SOS; this site is the public reference layer."
  - "If you’re building tooling, treat IDs as primary keys and keep a strict write boundary for canon."
---

# Design Philosophy

FRC is designed as a corpus with stable IDs, tight definitions, and a clear separation between canon and interpretation. This design ensures that tools and agents can operate within the framework without corrupting the reference layer.

## Local Workflow

Source lives on GitHub. For issues/PRs, treat content IDs as immutable and keep changes minimal and reproducible.

```bash
git clone https://github.com/servathadi/fractalresonance
cd frc
npm i
npm run dev
npm run build
```

**Tip:** Run `npm run content:audit` before committing content edits.
