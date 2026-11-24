import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  checkAiEntrypoints,
  generateEntrypoints,
} from '../../scripts/generate-ai-entrypoints.mjs';

const root = process.cwd();

function readPublic(fileName: string): string {
  return fs.readFileSync(path.join(root, 'public', fileName), 'utf8');
}

describe('AI-facing entrypoints generation and drift checks', () => {
  it('verifies public/llms.txt, public/agent.md, public/agent.json, and public/catalog.json are in sync', () => {
    const result = checkAiEntrypoints(root);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('generates byte-for-byte deterministic output across repeated invocations', () => {
    const first = generateEntrypoints(root).files;
    const second = generateEntrypoints(root).files;
    expect(second).toEqual(first);
    expect(readPublic('llms.txt')).toBe(first['public/llms.txt']);
    expect(readPublic('agent.md')).toBe(first['public/agent.md']);
    expect(readPublic('agent.json')).toBe(first['public/agent.json']);
  });

  it('matches the active paper set and versions in public/catalog.json across all three files', () => {
    const catalog = JSON.parse(readPublic('catalog.json'));
    const agentJson = JSON.parse(readPublic('agent.json'));
    const agentMd = readPublic('agent.md');
    const llmsTxt = readPublic('llms.txt');

    const activeCatalogPapers = catalog.content.en.papers.filter(
      (p: { epistemicStatus?: string; publicationState?: string }) =>
        p.epistemicStatus !== 'archive' &&
        String(p.publicationState || '').toLowerCase() !== 'revision pending',
    );

    const activeIdsFromCatalog = activeCatalogPapers.map((p: { id: string }) => p.id).sort();
    const activeIdsFromAgent = agentJson.active_papers.map((p: { id: string }) => p.id).sort();

    expect(activeIdsFromAgent).toEqual(activeIdsFromCatalog);

    const agentVersionById = new Map(
      agentJson.active_papers.map((p: { id: string; version: string | null }) => [p.id, p.version]),
    );

    for (const paper of activeCatalogPapers) {
      expect(agentVersionById.get(paper.id)).toBe(paper.version || null);
      expect(agentMd).toContain(paper.id);
      expect(llmsTxt).toContain(paper.id);
      if (paper.version) {
        expect(agentMd).toContain(paper.version);
        expect(llmsTxt).toContain(paper.version);
      }
    }
  });

  it('presents FRC 700.000-700.007 as the active threshold-framework route and FRC 700.777 as superseded historical/origin material', () => {
    const agentJson = JSON.parse(readPublic('agent.json'));
    const agentMd = readPublic('agent.md');
    const llmsTxt = readPublic('llms.txt');

    const thresholdIds = agentJson.threshold_route.map((p: { id: string }) => p.id);
    expect(thresholdIds).toEqual([
      'FRC-700-000',
      'FRC-700-001',
      'FRC-700-002',
      'FRC-700-003',
      'FRC-700-004',
      'FRC-700-005',
      'FRC-700-006',
      'FRC-700-007',
    ]);

    const activeRouteIds = new Set([
      ...agentJson.primary_route.map((p: { id: string }) => p.id),
      ...agentJson.frontier_route.map((p: { id: string }) => p.id),
      ...thresholdIds,
      ...agentJson.reciprocity_mathematics_route.map((p: { id: string }) => p.id),
    ]);
    expect(activeRouteIds.has('FRC-700-777')).toBe(false);

    expect(agentJson.superseded_origin_material).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'FRC-700-777',
          publication_state: 'archived',
          canon_status: 'archive',
          epistemic_status: 'archive',
          superseded_by: 'FRC-700-000 through FRC-700-007',
        }),
      ]),
    );

    expect(llmsTxt).toContain('Superseded historical / origin material');
    expect(llmsTxt).toContain('FRC-700-777 (v1.0, archived): superseded by FRC-700-000 through FRC-700-007');
    expect(agentMd).toContain('Superseded origin note');
    expect(agentMd).toContain('superseded by `FRC-700-000 through FRC-700-007`');
  });

  it('includes FRC 830.000-830.005 with accurate no-promotion language and preserves all six epistemic distinctions', () => {
    const agentJson = JSON.parse(readPublic('agent.json'));
    const agentMd = readPublic('agent.md');
    const llmsTxt = readPublic('llms.txt');

    expect(agentJson.reciprocity_mathematics_route.map((p: { id: string; version: string }) => [p.id, p.version])).toEqual([
      ['FRC-830-000', 'v0.1'],
      ['FRC-830-001', 'v0.1'],
      ['FRC-830-002', 'v0.1'],
      ['FRC-830-003', 'v0.1'],
      ['FRC-830-004', 'v0.1'],
      ['FRC-830-005', 'v0.2'],
    ]);
    expect(agentJson.canon.reciprocity_mathematics.no_promotion).toBe(true);

    for (const text of [llmsTxt, agentMd]) {
      expect(text).toContain('Majid-style self-duality');
      expect(text).toContain('CPTP');
      expect(text.toLowerCase()).toContain('exact mathematics');
      expect(text.toLowerCase()).toContain('operational models');
      expect(text.toLowerCase()).toContain('framework interpretation');
      expect(text.toLowerCase()).toContain('model-specific findings');
      expect(text.toLowerCase()).toContain('conjectures');
      expect(text.toLowerCase()).toContain('empirical gates');
    }

    expect(Object.keys(agentJson.epistemic_distinctions)).toEqual([
      'exact_mathematics',
      'operational_models',
      'framework_interpretation',
      'model_specific_findings',
      'conjectures',
      'empirical_gates',
    ]);
  });

  it('fails drift check when an AI entrypoint or catalog.json is perturbed', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frc-ai-drift-'));
    try {
      fs.symlinkSync(path.join(root, 'content'), path.join(tmpRoot, 'content'));
      fs.mkdirSync(path.join(tmpRoot, 'public'), { recursive: true });
      fs.symlinkSync(path.join(root, 'public', 'paper-pdfs'), path.join(tmpRoot, 'public', 'paper-pdfs'));
      for (const file of ['catalog.json', 'llms.txt', 'agent.md', 'agent.json']) {
        fs.copyFileSync(path.join(root, 'public', file), path.join(tmpRoot, 'public', file));
      }

      expect(checkAiEntrypoints(tmpRoot).ok).toBe(true);

      // Perturb public/llms.txt
      const llmsPath = path.join(tmpRoot, 'public', 'llms.txt');
      fs.appendFileSync(llmsPath, '\n# manual drift\n');
      const driftResult = checkAiEntrypoints(tmpRoot);
      expect(driftResult.ok).toBe(false);
      expect(driftResult.errors.some((e) => e.includes('public/llms.txt'))).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });
});
