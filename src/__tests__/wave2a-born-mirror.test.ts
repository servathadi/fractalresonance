import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPaper, isCurrentReadingContent } from '@/lib/content';
import { generateCitationMetadata } from '@/lib/metadata';
import { checkActiveTextForStaleClaims, splitIntoClauses } from '../../scripts/validate-governance.mjs';

const root = process.cwd();

function sha256File(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

describe('Wave 2a mirror: FRC 100.006 v2.0 & FRC 100.006.002 v2.0', () => {
  it('mirrors exact v2.0 frontmatter, prior v1 DOI distinction (no premature citation_doi), and verified PDF SHA-256s', () => {
    const p006 = getPaper('en', 'FRC-100-006');
    const p006002 = getPaper('en', 'FRC-100-006-002');

    expect(p006).not.toBeNull();
    expect(p006!.frontmatter.title).toBe(
      'Born-Rule Equilibrium, Coherence Landscapes, and the Admissibility Gates for Resonant Relaxation',
    );
    expect(p006!.frontmatter.version).toBe('v2.0');
    expect(p006!.frontmatter.date).toBe('2026-11-27');
    expect(p006!.frontmatter.publicationState).toBe('preprint');
    expect(p006!.frontmatter.canonStatus).toBe('living-core');
    expect(p006!.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.17438360');
    expect(p006!.frontmatter.doi).toBeUndefined();
    expect(isCurrentReadingContent('paper', p006!.frontmatter)).toBe(true);

    const cite006 = generateCitationMetadata({
      title: p006!.frontmatter.title,
      author: p006!.frontmatter.author || 'Hadi Servat',
      date: p006!.frontmatter.date,
      doi: p006!.frontmatter.doi,
      id: p006!.frontmatter.id,
      lang: 'en',
      url: 'https://fractalresonance.com/en/papers/FRC-100-006',
    });
    expect(cite006.citation_doi).toBeUndefined();

    expect(p006002).not.toBeNull();
    expect(p006002!.frontmatter.title).toBe(
      'Finite-Time, Non-Ergodic, and Non-Stationary Diagnostic Bounds on Resonant Equilibrium',
    );
    expect(p006002!.frontmatter.version).toBe('v2.0');
    expect(p006002!.frontmatter.date).toBe('2026-11-27');
    expect(p006002!.frontmatter.publicationState).toBe('preprint');
    expect(p006002!.frontmatter.canonStatus).toBe('living-core');
    expect(p006002!.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.17526499');
    expect(p006002!.frontmatter.doi).toBeUndefined();
    expect(isCurrentReadingContent('paper', p006002!.frontmatter)).toBe(true);

    const cite006002 = generateCitationMetadata({
      title: p006002!.frontmatter.title,
      author: p006002!.frontmatter.author || 'Hadi Servat',
      date: p006002!.frontmatter.date,
      doi: p006002!.frontmatter.doi,
      id: p006002!.frontmatter.id,
      lang: 'en',
      url: 'https://fractalresonance.com/en/papers/FRC-100-006-002',
    });
    expect(cite006002.citation_doi).toBeUndefined();

    expect(sha256File(path.join(root, 'public/paper-pdfs/FRC-100-006.pdf'))).toBe(
      '0f463b40483cb3b8137985bc71197f0bd886ca382ecf56bcf8d49b303383ebdd',
    );
    expect(sha256File(path.join(root, 'public/paper-pdfs/FRC-100-006-002.pdf'))).toBe(
      'c282145abc754100aa263893aa51b0433d662c9e023dfbb1efd332b1a5a8e4d3',
    );
  });

  it('registers both v2.0 papers in catalog, AI entrypoints, and English search index without PLACEHOLDER or persona leaks', () => {
    const agentJson = JSON.parse(fs.readFileSync(path.join(root, 'public/agent.json'), 'utf8'));
    const primaryById = new Map<string, Record<string, unknown>>(
      agentJson.primary_route.map((p: Record<string, unknown>) => [String(p.id), p]),
    );

    const a006 = primaryById.get('FRC-100-006');
    const a006002 = primaryById.get('FRC-100-006-002');
    expect(a006?.version).toBe('v2.0');
    expect(a006?.doi).toBeUndefined();
    expect(a006?.prior_version_doi).toBe('10.5281/zenodo.17438360');
    expect(a006?.pdf_url).toBe('/paper-pdfs/FRC-100-006.pdf');

    expect(a006002?.version).toBe('v2.0');
    expect(a006002?.doi).toBeUndefined();
    expect(a006002?.prior_version_doi).toBe('10.5281/zenodo.17526499');
    expect(a006002?.pdf_url).toBe('/paper-pdfs/FRC-100-006-002.pdf');

    expect(agentJson.canon.revision_pending).not.toContain('FRC-100-006');
    expect(agentJson.canon.revision_pending).not.toContain('FRC-100-006-002');

    const enSearch = JSON.parse(fs.readFileSync(path.join(root, 'public/search-index-en.json'), 'utf8'));
    const searchIds = new Set(enSearch.documents.map((d: { id: string }) => d.id));
    expect(searchIds.has('FRC-100-006')).toBe(true);
    expect(searchIds.has('FRC-100-006-002')).toBe(true);
  });

  it('preserves LaTeX math pipes in splitIntoClauses while still blocking unhedged deviation claims', () => {
    const clauses = splitIntoClauses(
      'Version v2.0 formally retires the underived $|\\delta(x)| \\in [10^{-4}, 10^{-3}]$ heuristic.',
    );
    expect(clauses).toHaveLength(1);
    expect(
      checkActiveTextForStaleClaims(
        'Version v2.0 formally retires the underived $|\\delta(x)| \\in [10^{-4}, 10^{-3}]$ heuristic.',
        'content/en/papers/FRC-100-006.md',
      ),
    ).toEqual([]);

    const unhedged = checkActiveTextForStaleClaims(
      'We predict resonant-driving deviations $|\\delta(x)| \\in [10^{-4}, 10^{-3}]$ in all cavities.',
      'content/en/papers/FRC-100-006.md',
    );
    expect(unhedged.length).toBeGreaterThan(0);

    // Mixed-assertion regressions: unrelated "uncalibrated"/"retire"/"underived" words MUST NOT
    // exempt affirmative Born-rule, 16D, or unhedged deviation-window claims.
    const mixedAssertions = [
      'The apparatus is uncalibrated and FRC derives the Born rule.',
      'We retire the old apparatus and FRC derives the Born rule.',
      'The readout is uncalibrated and 16D is physical canon.',
      'The apparatus is uncalibrated and $|\\delta(x)| \\in [10^{-4}, 10^{-3}]$.',
      'We retire the old apparatus and $|\\delta(x)| \\in [10^{-4}, 10^{-3}]$.',
      'We retire the apparatus and predict 10^-4 to 10^-3 deviations.',
      'The apparatus is uncalibrated and we predict 10^-4 to 10^-3 deviations with this heuristic.',
      'We retire the apparatus and 10^-4 to 10^-3 deviations occur.',
    ];
    for (const sentence of mixedAssertions) {
      expect(
        checkActiveTextForStaleClaims(sentence, 'content/en/papers/FRC-566-001.md').length,
        `expected governance failure for: ${sentence}`,
      ).toBeGreaterThan(0);
    }
  });
});
