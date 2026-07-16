# FRC Repository Profile and README Design

**Date:** 2026-07-15  
**Repository:** `servathadi/fractalresonance`  
**Direction:** A — Research-first portal

## Goal

Make the public GitHub repository a clear entrance to Fractal Resonance Coherence while retaining the practical information needed to operate the website. The page should feel intentional and credible, explain what the repository contains, and avoid presenting open hypotheses as established physics.

## Repository profile

- **Description:** “Open research corpus and web platform for Fractal Resonance Coherence (FRC): coherence, reciprocity, scale-aware dynamics, papers, models, and falsifiable tests.”
- **Homepage:** `https://fractalresonance.com`
- **Topics:** `fractal-resonance`, `coherence`, `open-systems`, `nonlinear-dynamics`, `mathematical-physics`, `research`, `nextjs`, `cloudflare-pages`

## README structure

1. Existing `public/brand/banner.jpg` as a full-width header. Do not generate a replacement; the existing artwork is consistent with the public site and keeps the change focused.
2. Project name and a one-sentence description in plain language.
3. Compact badges for website, Zenodo community, license, and publication posture.
4. A short “What FRC is” section that distinguishes the research program from the website implementation and states that claims carry explicit epistemic and publication labels.
5. A “Start here” section linking to FRC 100.000, the papers catalog, the FRC 830 reciprocity-mathematics set, and the Zenodo community.
6. A compact six-item FRC 830 table with paper titles and direct website/PDF links. The README remains a portal to the corpus rather than reproducing paper abstracts.
7. A concise “Research posture” callout: mathematical results, operational models, conjectures, and empirical tests are not interchangeable; readers should follow the labels on each paper.
8. Technical sections below the research introduction: quick start, key capabilities, content layout, validation commands, stack, deployment caution, and links.

## Content rules

- Use calm academic language and minimal decoration.
- Keep the README substantially shorter and easier to scan than the current version.
- Do not claim independent peer review, physical validation, or consensus acceptance.
- Do not describe `k*` as a fixed fitted constant. If mentioned, call it the scale-invariant Boltzmann bridge.
- Link to canonical public pages rather than duplicating mutable scientific explanations.
- Preserve the CC BY-NC-ND 4.0 license statement.

## Operational safety

- Keep a short warning that the repository is the live source for `fractalresonance.com`.
- State that deployment branch configuration must be checked before upload because the Cloudflare production branch has drifted historically.
- Do not repeat stale claims that GitHub Actions deployment is currently healthy; the stored Cloudflare token requires repair.
- Keep detailed operational history in project documentation rather than in the public-facing introduction.

## Verification

- Confirm every local README link resolves to a tracked file or expected site URL.
- Run `npm run validate` and the existing routing/CSS tests.
- Run `npm run build` to ensure the existing banner and referenced paper assets are present in the static export.
- Inspect the rendered GitHub Markdown structure for heading order, table legibility, and image sizing.
- Verify the GitHub description, homepage, and topics after publishing.

## Out of scope

- Changes to scientific manuscripts, paper metadata, or evidence status.
- A new logo or generated brand artwork.
- Website UI changes.
- Repairing the Cloudflare GitHub Actions secret.
