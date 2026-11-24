import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  isValidDoi,
  validateTranslations,
} from '../../scripts/validate-translations.mjs';
import { getPaper, isCurrentReadingContent } from '../lib/content';

const root = process.cwd();

function makeIsolatedRepoCopy(): string {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frc-tr-parity-'));
  fs.cpSync(path.join(root, 'content'), path.join(tmpRoot, 'content'), { recursive: true });
  fs.mkdirSync(path.join(tmpRoot, 'public'), { recursive: true });
  for (const fname of [
    'catalog.json',
    'search-index.json',
    'search-index-en.json',
    'search-index-es.json',
    'search-index-fa.json',
    'search-index-fr.json',
  ]) {
    const src = path.join(root, 'public', fname);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(tmpRoot, 'public', fname));
    }
  }
  return tmpRoot;
}

describe('Cross-language translation parity and DOI hygiene (#311)', () => {
  it('passes validateTranslations on the repository with zero errors', () => {
    const result = validateTranslations(root);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.stats.translatedPapersChecked).toBeGreaterThanOrEqual(30);
  });

  it('rejects PLACEHOLDER and malformed Zenodo DOIs', () => {
    expect(isValidDoi('10.5281/zenodo.PLACEHOLDER')).toBe(false);
    expect(isValidDoi('10.5281/zenodo.TBD')).toBe(false);
    expect(isValidDoi('10.5281/zenodo.000000')).toBe(false);
    expect(isValidDoi('10.5281/zenodo.21328428')).toBe(true);
    expect(isValidDoi(null)).toBe(true);
  });

  it('fails validation when a placeholder DOI is introduced in a translated paper', () => {
    const tmpRoot = makeIsolatedRepoCopy();
    try {
      const target = path.join(tmpRoot, 'content', 'es', 'papers', 'FRC-841-004.md');
      const raw = fs.readFileSync(target, 'utf8');
      fs.writeFileSync(target, raw.replace(/^id: FRC-841-004$/m, 'id: FRC-841-004\ndoi: "10.5281/zenodo.PLACEHOLDER"'));

      const result = validateTranslations(tmpRoot);
      expect(result.ok).toBe(false);
      expect(result.errors.some((e) => /PLACEHOLDER/i.test(e))).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('fails validation when a translated paper has a publicationState or DOI mismatch with English', () => {
    const tmpRoot = makeIsolatedRepoCopy();
    try {
      // Mismatch 1: revision-pending paper changed to preprint
      const revTarget = path.join(tmpRoot, 'content', 'fr', 'papers', 'FRC-100-006.md');
      const revRaw = fs.readFileSync(revTarget, 'utf8');
      fs.writeFileSync(revTarget, revRaw.replace(/publicationState:\s*['"]?revision pending['"]?/, 'publicationState: preprint'));

      // Mismatch 2: stale 2025 DOI on FRC-100-002
      const doiTarget = path.join(tmpRoot, 'content', 'fa', 'papers', 'FRC-100-002.md');
      const doiRaw = fs.readFileSync(doiTarget, 'utf8');
      fs.writeFileSync(doiTarget, doiRaw.replace('10.5281/zenodo.21328428', '10.5281/zenodo.15079278'));

      const result = validateTranslations(tmpRoot);
      expect(result.ok).toBe(false);
      expect(result.errors.some((e) => e.includes('FRC-100-006.md') && e.includes('publicationState'))).toBe(true);
      expect(result.errors.some((e) => e.includes('FRC-100-002.md') && e.includes('"doi"'))).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('enforces FRC 700.000-700.007 and FRC 830.000-830.005 label parity if translated', () => {
    const tmpRoot = makeIsolatedRepoCopy();
    try {
      // Simulate a translated FRC-830-005 with wrong epistemicStatus and missing statusLabel
      const fake830 = `---
id: FRC-830-005
title: "FRC 830.005 (ES)"
date: "2026-07-15"
version: "v0.2"
conceptDoi: "10.5281/zenodo.21385391"
doi: "10.5281/zenodo.21385392"
status: published
publicationState: preprint
canonStatus: frontier
epistemicStatus: primary
muLevel: mu4
tier: foundational
translationStatus: ai-translated
lang: es
---
# FRC 830.005
`;
      fs.writeFileSync(path.join(tmpRoot, 'content', 'es', 'papers', 'FRC-830-005.md'), fake830);

      const result = validateTranslations(tmpRoot);
      expect(result.ok).toBe(false);
      expect(result.errors.some((e) => e.includes('FRC-830-005.md') && e.includes('epistemicStatus'))).toBe(true);
      expect(result.errors.some((e) => e.includes('FRC-830-005.md') && e.includes('statusLabel'))).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('treats both revision-pending and archived papers as non-current (noindex) in every language', () => {
    for (const lang of ['en', 'es', 'fa', 'fr']) {
      const rev = getPaper(lang, 'FRC-100-006');
      expect(rev, `${lang}/FRC-100-006 should exist`).not.toBeNull();
      expect(rev!.frontmatter.publicationState).toBe('revision pending');
      expect(isCurrentReadingContent('paper', rev!.frontmatter)).toBe(false);
    }

    const archived777 = getPaper('en', 'FRC-700-777');
    expect(archived777).not.toBeNull();
    expect(isCurrentReadingContent('paper', archived777!.frontmatter)).toBe(false);

    // Verify translated current papers parse cleanly via src/lib/content.ts
    for (const lang of ['es', 'fa', 'fr']) {
      const p002 = getPaper(lang, 'FRC-100-002');
      expect(p002?.frontmatter.version).toBe('v2.6');
      expect(p002?.frontmatter.doi).toBe('10.5281/zenodo.21328428');
      expect(p002?.frontmatter.conceptDoi).toBe('10.5281/zenodo.15079277');
      expect(p002?.frontmatter.publicationState).toBe('preprint');
      expect(p002?.frontmatter.translationStatus).toBe('lags-canonical-english');
    }
  });

  it('rejects revision-pending or archived papers leaked into per-language search indexes', () => {
    const tmpRoot = makeIsolatedRepoCopy();
    try {
      const esIdxPath = path.join(tmpRoot, 'public', 'search-index-es.json');
      const esIdx = JSON.parse(fs.readFileSync(esIdxPath, 'utf8'));
      esIdx.documents.push({
        id: 'FRC-100-006',
        type: 'papers',
        lang: 'es',
        title: 'Leaked revision-pending paper',
      });
      fs.writeFileSync(esIdxPath, JSON.stringify(esIdx));

      const result = validateTranslations(tmpRoot);
      expect(result.ok).toBe(false);
      expect(
        result.errors.some((e) => e.includes('public/search-index-es.json') && e.includes('FRC-100-006')),
      ).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });
});
