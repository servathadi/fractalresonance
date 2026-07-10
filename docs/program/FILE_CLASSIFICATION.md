# File Classification and Safe Tidy-Up

This is a classification plan, not a deletion plan. The workspace contains
valuable historical records and user work in progress.

| Area | Classification | Action now | Future action |
|---|---|---|---|
| `content/`, `src/`, `public/`, `registry/`, `docs/` | Canonical website/program repository | Maintain in Git | Commit governance changes separately from unrelated content edits. |
| `../output/publish/` | Release evidence | Preserve versioned directories and release ZIPs | Add new versions only; never mutate published packages. |
| `../START-HERE-Papers/` | Curated export | Keep synchronized from current registry | Regenerate after each release batch. |
| `../Bishno/` | Working drafts and handoffs | Read-only reference for publication decisions | Add an index pointer when a handoff becomes obsolete; do not delete. |
| `../papers/` | Legacy source/archive | Preserve | Classify paper-by-paper before migration or reuse. |
| root PDFs and dated reports | Historical evidence | Preserve | Link relevant items into an archive inventory; no blind moves. |
| `../books/` | Book source and publishing work | Preserve separately from paper program | Manage through book-specific release metadata. |
| `../tmp/` | Ephemeral QA and API evidence | Retain current publish verification | Prune only files that are reproducible and already represented by a permanent report/release. |
| `.next/`, `out/`, generated catalog/search index | Generated | Rebuild as needed | Do not manually edit or use as canonical source. |

## Duplicate policy

Duplicates are expected across release, web, and Start-Here surfaces. They are
not automatically waste. A duplicate is legitimate when it is one of:

- immutable release evidence;
- website-serving copy of a verified release PDF/media asset;
- model-facing Start-Here export;
- historical publication or source evidence.

A duplicate needs review only if it is unversioned, conflicts with the registry,
or cannot be traced to one of those roles.

## No-delete rule

Before any deletion or relocation outside generated output, create an archive
inventory entry with source path, checksum, reason, replacement/current carrier,
and owner confirmation. The current governance work intentionally performs no
such destructive action.
