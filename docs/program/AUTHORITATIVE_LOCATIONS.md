# Authoritative Locations

The FRC workspace has several useful copies of the same material. They have
different jobs. Confusing them creates silent version drift.

| Location | Authority | Purpose | Editing rule |
|---|---|---|---|
| private `servathadi/frc-program` | Program status and routing | Upstream current carrier, DOI lineage, status, next gate | Update first when status or version changes. |
| `registry/papers.json` | Public status projection | Website-visible mirror of the private registry | Synchronize from the private source; do not make an unrecorded local divergence. |
| `content/en/papers/` | Current English website manuscript | Public reading source and search-index input | Edit only through a versioned paper revision. |
| `../output/publish/<paper>-<version>/` | Immutable local release evidence | Submitted manuscript, PDF, code, data, checksums | Never overwrite a published release. Create a new version directory. |
| `../START-HERE-Papers/` | Model-facing export | Curated current corpus and reading map | Regenerate/synchronize after registry and release updates. |
| `public/papers/` and `public/media/` | Website delivery assets | PDFs and figures served by the site | Copy from a verified release only. |
| `public/catalog.json`, `public/search-index*.json`, `out/` | Generated | Discovery and deployed static build | Do not edit manually; regenerate with `npm run build`. |
| `../ZENODO_PUBLISH_REPORT_*.md` and release manifests | Publication evidence | Returned records, DOIs, verified file sets | Append a new report for every batch. |
| `../Bishno/` | Working reference | Agent handoffs, drafts, review material | Never publish directly from here. Promote a reviewed copy into a release directory. |
| `../papers/`, root PDFs, `../June 2026/` | Historical/source evidence | Legacy corpus and exploratory material | Retain and classify; do not treat as current evidence by default. |
| `../tmp/` | Ephemeral reproduction evidence | Reruns, PDFs, API snapshots, temporary QA | May be cleaned only after its permanent report/release evidence exists. |

## Canonical flow

```text
research draft / handoff
        -> reviewed manuscript + code/data
        -> output/publish/<id>-<version>/
        -> Zenodo version or new concept
        -> registry/papers.json
        -> content/en/papers + public PDF/media
        -> START-HERE-Papers
        -> npm run build (catalog, search, static site)
```

The order matters: the registry names the current carrier; the release package
proves what was published; the website and Start-Here are downstream views.

## Status vocabulary

- `current`: current carrier for a living program line.
- `frontier`: active but not established; use only with its stated gates.
- `framework-note`: convention or philosophical/formal scope, not physical evidence.
- `revision-pending`: retains an identifier but cannot be used as current evidence.
- `archive`: historical context only.

Evidence levels are independent of those statuses. For example, a `current`
paper can be an exact mathematical result, a scoped model-specific result, an
orientation document, or a conditional model.
