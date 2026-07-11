# Publication Workflow

Use this workflow for every new FRC paper or version. It is deliberately
strict because Zenodo publications are immutable once released.

## 1. Decide the lineage

Make this decision in the private `servathadi/frc-program` repository first;
the website repository receives only the reviewed public export.

- Existing living paper: create a bumped version under its existing Zenodo
  concept DOI.
- New independent result or answer appendix: create a new concept DOI unless
  the registry explicitly defines it as the same paper line.
- Historical draft, agent handoff, or exploratory calculation: do not publish
  directly. Promote a reviewed copy into a release directory first.

## 2. Build a release package

Create `../output/publish/<FRC-ID>-<version>/` containing:

- canonical Markdown manuscript;
- rendered PDF and HTML;
- reproducible scripts, data, figures, and requirements as applicable;
- `README_RELEASE.md`;
- `CHECKSUMS.txt`;
- `release_manifest.json` with status, version, concept DOI, version DOI once
  available, and exact published files.

The package must state its evidence level, scope, controls, open gates, and
retained negative results.

## 3. Pre-publication checks

```sh
cd fractalresonance
npm run governance:check
npm run validate
npm run build
```

Also verify the PDF text, links, title, paper ID, version, file checksums, and
Zenodo metadata. For computed results, rerun the release command from a clean
environment or document why that is not feasible.

## 4. Zenodo procedure

1. Create a new version from the existing record, or a new deposition for a
   new concept.
2. Replace inherited files with the exact PDF and release ZIP.
3. Set title, version, creators, license, keywords, access level, abstract,
   and publication date.
4. Verify draft metadata, file names, and checksums before publication.
5. Publish only after the batch verifier passes.
6. Re-read the published record through the API and record returned version and
   concept DOIs in the release manifest and a dated root publish report.

## 5. Synchronize downstream views

After publication:

1. update `registry/papers.json`;
2. update `content/en/papers/` frontmatter and public PDF/media;
3. synchronize `../START-HERE-Papers/`;
4. update `public/agent.md`, `agent.json`, and `llms.txt` when routing changes;
5. run `npm run build` to regenerate catalog/search/static output;
6. append a substantive entry to `docs/program/CHANGELOG.md`.

## 6. Release rule

No version is considered current until registry, release manifest, Zenodo,
website source, and Start-Here agree. Generated files are proof of a build, not
the source of truth.
