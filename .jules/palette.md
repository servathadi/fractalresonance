## 2024-05-18 - Build script artifacts
**Learning:** Running `pnpm build` generates public assets like `search-index-*.json` and `catalog.json` which get tracked by git.
**Action:** When performing local builds to verify changes, ensure that build artifacts are reset using `git checkout HEAD -- <files>` before submitting to avoid polluting the PR with large lockfiles or generated JSON assets.
