<div align="center">
  <a href="https://fractalresonance.com">
    <img src="public/brand/banner.jpg" alt="Fractal Resonance Coherence" width="100%">
  </a>

# Fractal Resonance Coherence

**An open research corpus and web platform for coherence, reciprocity, scale-aware dynamics, and falsifiable tests.**

[![Website](https://img.shields.io/badge/website-fractalresonance.com-C9A227?style=flat-square)](https://fractalresonance.com)
[![Zenodo](https://img.shields.io/badge/Zenodo-FRC_community-1682D4?style=flat-square)](https://zenodo.org/communities/frc)
[![License](https://img.shields.io/badge/license-CC_BY--NC--ND_4.0-6B7280?style=flat-square)](#license)
[![Status](https://img.shields.io/badge/status-open_research_program-1F3A5F?style=flat-square)](#research-posture)
</div>

## What FRC is

Fractal Resonance Coherence (FRC) is an open research program investigating how coherence, entropy, coupling, and scale interact in open systems. Its papers range from exact mathematical results and operational models to conjectures and empirical test programs.

This repository is the public source for [fractalresonance.com](https://fractalresonance.com). It contains the research corpus, publication assets, machine-readable catalogs, and the Next.js application that presents them.

> FRC is a developing framework, not an established physical theory. Each paper carries explicit publication, epistemic, and canon-status labels so mathematical results, model-dependent findings, conjectures, and open tests are not read as interchangeable claims.

## Start here

| Route | Purpose |
|---|---|
| [FRC 100.000 — Canonical stance and reading map](https://fractalresonance.com/en/papers/FRC-100-000) | Version-aware entrance to the framework |
| [Paper catalog](https://fractalresonance.com/en/papers) | Browse the public corpus and status labels |
| [FRC 830 — Reciprocity Mathematics](https://fractalresonance.com/en/papers/FRC-830-000) | Exact coordinate results, lift obstructions, and scoped no-go results |
| [Zenodo community](https://zenodo.org/communities/frc) | Deposited releases and DOI records |
| [For AI](https://fractalresonance.com/for-ai) | Machine-readable orientation and retrieval routes |

## FRC 830 — Reciprocity Mathematics

The six-paper 830 set asks what additional structure would be required to promote FRC’s normalized entropy–coherence ledger from bookkeeping into a genuine duality. It proves exact coordinate-level results, types operational morphisms, derives lift obstructions, and states clearly where physical promotion remains open.

| Paper | Focus | Read |
|---|---|---|
| **830.000** — What Would Make FRC Reciprocity a Duality? | Terminology lock and promotion gates | [Web](https://fractalresonance.com/en/papers/FRC-830-000) · [PDF](https://fractalresonance.com/paper-pdfs/FRC-830-000.pdf) |
| **830.001** — The Reciprocity One-Form | Affine classification and domain rigidity | [Web](https://fractalresonance.com/en/papers/FRC-830-001) · [PDF](https://fractalresonance.com/paper-pdfs/FRC-830-001.pdf) |
| **830.002** — Operational Registers and Morphisms | Typed registers and reciprocity-preserving arrows | [Web](https://fractalresonance.com/en/papers/FRC-830-002) · [PDF](https://fractalresonance.com/paper-pdfs/FRC-830-002.pdf) |
| **830.003** — Exact Phase-Family Test | Von Mises lift obstruction | [Web](https://fractalresonance.com/en/papers/FRC-830-003) · [PDF](https://fractalresonance.com/paper-pdfs/FRC-830-003.pdf) |
| **830.004** — Dimension Threshold | One-parameter and qubit lift obstructions | [Web](https://fractalresonance.com/en/papers/FRC-830-004) · [PDF](https://fractalresonance.com/paper-pdfs/FRC-830-004.pdf) |
| **830.005** — FRC and Quantum Born Reciprocity | Present-structure obstruction to Majid-style self-duality | [Web](https://fractalresonance.com/en/papers/FRC-830-005) · [PDF](https://fractalresonance.com/paper-pdfs/FRC-830-005.pdf) |

Shared release: [Zenodo concept DOI 10.5281/zenodo.21385391](https://doi.org/10.5281/zenodo.21385391).

## Research posture

The corpus separates four kinds of work:

- **Exact mathematics** — proofs and classifications within declared assumptions.
- **Operational models** — register-specific constructions and simulations.
- **Physical conjectures** — proposed interpretations that still require independent tests.
- **Empirical gates** — experiments or datasets capable of supporting, narrowing, or falsifying a claim.

Current papers are preprints or research candidates unless their individual records state otherwise. Follow the labels and version information on each paper rather than inferring status from the FRC name.

## Repository map

| Path | Responsibility |
|---|---|
| `content/{lang}/` | Markdown papers, books, articles, concepts, and topics |
| `public/paper-pdfs/` | Public PDF carriers linked from paper pages |
| `public/media/` | Covers, figures, and release images |
| `registry/` | Public paper registry and DOI projection |
| `src/app/` | Next.js routes and static-page generation |
| `src/components/` | Reading, navigation, search, and status interfaces |
| `scripts/` | Catalog generation, content validation, and governance checks |
| `docs/` | Architecture, content, brand, and operating documentation |

## Development

```bash
git clone https://github.com/servathadi/fractalresonance.git
cd fractalresonance
npm install
npm run dev
```

The local application runs at `http://localhost:3000`.

Before proposing a change:

```bash
npm run validate
npm run governance:check
npm run test:run
npm run build
```

The repository currently has known Vitest configuration debt around `@/` path aliases and React test setup. Content validation, targeted routing tests, and the production build remain required gates; do not describe the full suite as green until that harness is repaired.

## Platform

| Layer | Technology |
|---|---|
| Application | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 and CSS custom properties |
| Content | Markdown and YAML frontmatter |
| Discovery | Sitemap, Google Scholar metadata, Dublin Core, JSON-LD, `llms.txt` |
| Hosting | Cloudflare Pages static export |
| Archival | Zenodo DOI releases |

## Deployment safety

This is the live source repository for `fractalresonance.com`. Work on a feature branch, run the gates above, deploy a Cloudflare preview, and obtain human visual approval before updating production.

The Cloudflare project’s production-branch setting has drifted historically, so verify it before any manual upload. The GitHub Actions deployment token also requires repair as of July 2026; do not assume a successful push implies a successful Cloudflare deployment.

## Links

- [Website](https://fractalresonance.com)
- [Papers](https://fractalresonance.com/en/papers)
- [Zenodo](https://zenodo.org/communities/frc)
- [YouTube](https://www.youtube.com/@fractalresonance)
- [ORCID](https://orcid.org/0009-0004-7412-5129)
- [Issues](https://github.com/servathadi/fractalresonance/issues)

## License

Research texts and repository content are released under **CC BY-NC-ND 4.0** unless a specific file states otherwise.

**Author:** Hadi Servat
