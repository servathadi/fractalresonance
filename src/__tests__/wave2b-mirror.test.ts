import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPaper, isCurrentReadingContent } from '@/lib/content';
import { generateCitationMetadata } from '@/lib/metadata';
import {
  checkActiveTextForStaleClaims,
  resolveContentRegister,
} from '../../scripts/validate-governance.mjs';

const root = process.cwd();

function sha256File(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

describe('Wave 2B mirror: FRC 100.001 v2.0, FRC 100.004 v2.0 & FRC 100.010 v2.0', () => {
  const EXPECTED = [
    {
      id: 'FRC-100-001',
      title: 'Fractal Resonance Coherence: A Framework for Complex Systems Analysis',
      priorVersionDoi: '10.5281/zenodo.15073056',
      register: 'physics',
      isCharterOverview: true,
      pdfSha256: '246d3442bd752788526b33b0af29f0bb0e909e050a8e319255907f32a1e33567',
    },
    {
      id: 'FRC-100-004',
      title: 'Quantum Foundations in the FRC Framework: Open-System Dynamics, Obstructions, and Admissibility Gates',
      priorVersionDoi: '10.5281/zenodo.17438174',
      register: 'physics',
      isCharterOverview: false,
      pdfSha256: 'ce6f6142ede8029e741c600267bde65519d507e67672a41e825dc43a5fe9904f',
    },
    {
      id: 'FRC-100-010',
      title: 'Foundational Questions in Fractal Resonance: The Two Registers of Coherence and Cognition',
      priorVersionDoi: '10.5281/zenodo.17982555',
      register: 'philosophy',
      isCharterOverview: false,
      pdfSha256: 'd4938c7cdbbb1063e7969876e60cfd0a834ec20e2dce4e623ba25db7da3b9037',
    },
  ] as const;

  it('mirrors exact v2.0 frontmatters, prior v1 DOI distinction (zero premature citation_doi), register governance, and verified PDF SHA-256s', () => {
    for (const item of EXPECTED) {
      const paper = getPaper('en', item.id);
      expect(paper, `${item.id} should exist`).not.toBeNull();
      expect(paper!.frontmatter.title).toBe(item.title);
      expect(paper!.frontmatter.version).toBe('v2.0');
      expect(paper!.frontmatter.date).toBe('2026-11-27');
      expect(paper!.frontmatter.publicationState).toBe('preprint');
      expect(paper!.frontmatter.canonStatus).toBe('living-core');
      expect(paper!.frontmatter.priorVersionDoi).toBe(item.priorVersionDoi);
      expect(paper!.frontmatter.doi).toBeUndefined();
      expect(paper!.frontmatter.register).toBe(item.register);
      expect(isCurrentReadingContent('paper', paper!.frontmatter)).toBe(true);

      const resolved = resolveContentRegister({
        type: 'papers',
        id: item.id,
        rel: `content/en/papers/${item.id}.md`,
        frontmatter: paper!.frontmatter,
      });
      expect(resolved).toEqual({
        register: item.register,
        isCharterOverview: item.isCharterOverview,
      });

      const cite = generateCitationMetadata({
        title: paper!.frontmatter.title,
        author: paper!.frontmatter.author || 'Hadi Servat',
        date: paper!.frontmatter.date,
        doi: paper!.frontmatter.doi,
        id: paper!.frontmatter.id,
        lang: 'en',
        url: `https://fractalresonance.com/en/papers/${item.id}`,
      });
      expect(cite.citation_doi).toBeUndefined();

      expect(sha256File(path.join(root, 'public', 'paper-pdfs', `${item.id}.pdf`))).toBe(item.pdfSha256);
    }

    // Verify explicit philosophy register parity on translated FRC-100-010 pages
    for (const lang of ['es', 'fa', 'fr']) {
      const tr010 = getPaper(lang, 'FRC-100-010');
      expect(tr010?.frontmatter.register).toBe('philosophy');
      expect(tr010?.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.17982555');
      expect(tr010?.frontmatter.doi).toBeUndefined();
    }
  });

  it('registers all three v2.0 papers in catalog, AI entrypoints, and English search index and promotes all FRC 100.00x out of revision pending', () => {
    const agentJson = JSON.parse(fs.readFileSync(path.join(root, 'public/agent.json'), 'utf8'));
    const primaryById = new Map<string, Record<string, unknown>>(
      agentJson.primary_route.map((p: Record<string, unknown>) => [String(p.id), p]),
    );

    const enSearch = JSON.parse(fs.readFileSync(path.join(root, 'public/search-index-en.json'), 'utf8'));
    const searchIds = new Set(enSearch.documents.map((d: { id: string }) => d.id));

    for (const item of EXPECTED) {
      const entry = primaryById.get(item.id);
      expect(entry, `${item.id} must be in primary_route`).toBeDefined();
      expect(entry?.version).toBe('v2.0');
      expect(entry?.doi).toBeUndefined();
      expect(entry?.prior_version_doi).toBe(item.priorVersionDoi);
      expect(entry?.pdf_url).toBe(`/paper-pdfs/${item.id}.pdf`);
      expect(agentJson.canon.revision_pending).not.toContain(item.id);
      expect(searchIds.has(item.id)).toBe(true);
    }

    // Zero FRC-100-* papers remain in revision_pending
    expect(agentJson.canon.revision_pending.some((id: string) => id.startsWith('FRC-100-'))).toBe(false);
  });

  it('keeps FRC-100-001 charter strict against affirmative Cognition physics-mechanism claims', () => {
    const charterInfo = resolveContentRegister({
      type: 'papers',
      id: 'FRC-100-001',
      rel: 'content/en/papers/FRC-100-001.md',
      frontmatter: { id: 'FRC-100-001', register: 'physics' },
    });
    expect(charterInfo).toEqual({ register: 'physics', isCharterOverview: true });

    const bypasses = [
      'Fractal Resonance Cognition acts as the physical collapse mechanism in complex systems.',
      'In the philosophy register, Fractal Resonance Cognition drives quantum decoherence.',
      '| `[philosophy-register]` | Fractal Resonance Cognition | Governs quantum collapse |',
    ];
    for (const sample of bypasses) {
      const issues = checkActiveTextForStaleClaims(sample, 'content/en/papers/FRC-100-001.md', charterInfo);
      expect(issues.length, `FRC-100-001 must reject: ${sample}`).toBeGreaterThan(0);
    }
  });

  it('allows retired claims in CONTRADICTED bullets while still rejecting equation-proves-consciousness and Cognition physics claims', () => {
    const physicsInfo = { register: 'physics', isCharterOverview: false };

    const validBullet =
      '- **`CONTRADICTED`:** `FRC 100.005 v2.3` erasure floor; and the 2025 v1 universal stadium $D \\approx 1.90$ claim.';
    expect(checkActiveTextForStaleClaims(validBullet, 'content/en/papers/FRC-100-001.md', physicsInfo)).toEqual([]);

    const consciousnessBypass =
      '- **`CONTRADICTED`:** `FRC 100.005 v2.3` erasure floor; the physics equation proves consciousness mathematically.';
    expect(
      checkActiveTextForStaleClaims(consciousnessBypass, 'content/en/papers/FRC-100-001.md', physicsInfo).length,
    ).toBeGreaterThan(0);

    const cognitionPhysicsBypass =
      '- **`CONTRADICTED`:** `FRC 100.005 v2.3` erasure floor; Fractal Resonance Cognition drives quantum collapse.';
    expect(
      checkActiveTextForStaleClaims(cognitionPhysicsBypass, 'content/en/papers/FRC-100-001.md', physicsInfo).length,
    ).toBeGreaterThan(0);
  });

  it('allows Fractal Resonance Cognition on FRC-100-010 (register: philosophy) while still blocking Born-rule derivation and 16D physical canon', () => {
    const philInfo = resolveContentRegister({
      type: 'papers',
      id: 'FRC-100-010',
      rel: 'content/en/papers/FRC-100-010.md',
      frontmatter: { id: 'FRC-100-010', register: 'philosophy' },
    });
    expect(philInfo).toEqual({ register: 'philosophy', isCharterOverview: false });

    expect(
      checkActiveTextForStaleClaims(
        'Fractal Resonance Cognition defends an open-system relational philosophy of mind.',
        'content/en/papers/FRC-100-010.md',
        philInfo,
      ),
    ).toEqual([]);

    for (const overreach of [
      'FRC derives the Born rule directly from recursive coupling.',
      '16D is physical canon across coupled cognitive basins.',
      'The equation proves consciousness mathematically.',
    ]) {
      const issues = checkActiveTextForStaleClaims(overreach, 'content/en/papers/FRC-100-010.md', philInfo);
      expect(issues.length, `FRC-100-010 must reject overreach: ${overreach}`).toBeGreaterThan(0);
    }
  });
});
