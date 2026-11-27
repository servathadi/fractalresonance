import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPaper } from '@/lib/content';
import { generateCitationMetadata } from '@/lib/metadata';

const root = process.cwd();

const WAVE1_LIVE_DOIS = [
  {
    id: 'FRC-100-000',
    version: 'v1.3',
    doi: '10.5281/zenodo.24575211',
    conceptDoi: '10.5281/zenodo.21284061',
    priorVersionDoi: '10.5281/zenodo.21298155',
  },
  {
    id: 'FRC-100-100',
    version: 'v1.1',
    doi: '10.5281/zenodo.24575216',
    conceptDoi: '10.5281/zenodo.21298193',
    priorVersionDoi: '10.5281/zenodo.21298194',
  },
  {
    id: 'FRC-100-011',
    version: 'v1.3',
    doi: '10.5281/zenodo.24575217',
    conceptDoi: '10.5281/zenodo.21284063',
    priorVersionDoi: '10.5281/zenodo.21298180',
  },
] as const;

const FRC_700_SERIES_DOI = '10.5281/zenodo.24575404';
const FRC_700_SERIES_CONCEPT_DOI = '10.5281/zenodo.24575403';
const FRC_100_006_ALPHAXIV_URL =
  'https://www.alphaxiv.org/abs/2611.frc-100-006-born-rule-equilibrium-admissibility-gates';

const WAVE2_DEPOSIT_PENDING = [
  { id: 'FRC-100-001', priorVersionDoi: '10.5281/zenodo.15073056', locales: ['en', 'es', 'fa', 'fr'] },
  { id: 'FRC-100-004', priorVersionDoi: '10.5281/zenodo.17438174', locales: ['en', 'es', 'fa', 'fr'] },
  { id: 'FRC-100-006', priorVersionDoi: '10.5281/zenodo.17438360', locales: ['en', 'es', 'fa', 'fr'] },
  { id: 'FRC-100-006-002', priorVersionDoi: '10.5281/zenodo.17526499', locales: ['en'] },
  { id: 'FRC-100-010', priorVersionDoi: '10.5281/zenodo.17982555', locales: ['en', 'es', 'fa', 'fr'] },
] as const;

describe('Live FRC v3 Zenodo DOIs & FRC 100.006 v2.0 alphaXiv sync', () => {
  it('publishes live Wave 1 charter Zenodo DOIs and emits exact citation_doi metadata', () => {
    for (const item of WAVE1_LIVE_DOIS) {
      const paper = getPaper('en', item.id);
      expect(paper, `${item.id} should exist`).not.toBeNull();
      expect(paper!.frontmatter.version).toBe(item.version);
      expect(paper!.frontmatter.doi).toBe(item.doi);
      expect(paper!.frontmatter.conceptDoi).toBe(item.conceptDoi);
      expect(paper!.frontmatter.priorVersionDoi).toBe(item.priorVersionDoi);
      expect(paper!.body).toContain(item.doi);
      expect(paper!.body).not.toContain('PLACEHOLDER');

      const cite = generateCitationMetadata({
        title: paper!.frontmatter.title,
        author: paper!.frontmatter.author || 'Hadi Servat',
        date: paper!.frontmatter.date,
        doi: paper!.frontmatter.doi,
        id: paper!.frontmatter.id,
        lang: 'en',
        url: `https://fractalresonance.com/en/papers/${item.id}`,
      });
      expect(cite.citation_doi).toBe(item.doi);
    }

    // Preserve 1-Slide Visual Abstract embed on FRC-100-000 from PR #328
    const p000 = getPaper('en', 'FRC-100-000');
    expect(p000!.body).toContain('/visuals/frc-v3-visual-abstract.png');
    expect(p000!.body).toContain('/visuals/frc-v3-visual-abstract.pdf');
    expect(p000!.body).toContain('/visuals/frc-v3-implications-and-ai-7slides.pdf');
  });

  it('publishes the coordinated 8-paper Zenodo series DOI on FRC-700-000 through FRC-700-007', () => {
    for (let i = 0; i <= 7; i += 1) {
      const id = `FRC-700-${String(i).padStart(3, '0')}`;
      const paper = getPaper('en', id);
      expect(paper, `${id} should exist`).not.toBeNull();
      expect(paper!.frontmatter.doi).toBe(FRC_700_SERIES_DOI);
      expect(paper!.frontmatter.conceptDoi).toBe(FRC_700_SERIES_CONCEPT_DOI);
    }
  });

  it('sets live alphaXiv URL on FRC-100-006 across all 4 locales while keeping all Wave 2 Zenodo v2.0 DOIs honestly deposit pending', () => {
    for (const lang of ['en', 'es', 'fa', 'fr']) {
      const p006 = getPaper(lang, 'FRC-100-006');
      expect(p006, `${lang}/FRC-100-006 should exist`).not.toBeNull();
      expect(p006!.frontmatter.alphaxivUrl).toBe(FRC_100_006_ALPHAXIV_URL);
      expect(p006!.frontmatter.doi).toBeUndefined();
      expect(p006!.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.17438360');
    }

    const p006En = getPaper('en', 'FRC-100-006');
    expect(p006En!.body).toContain(FRC_100_006_ALPHAXIV_URL);
    expect(p006En!.body).toContain('v2.0 Zenodo deposit pending');

    for (const item of WAVE2_DEPOSIT_PENDING) {
      for (const lang of item.locales) {
        const paper = getPaper(lang, item.id);
        expect(paper, `${lang}/${item.id} should exist`).not.toBeNull();
        expect(paper!.frontmatter.version).toBe('v2.0');
        expect(paper!.frontmatter.doi, `${lang}/${item.id} must not declare a fabricated v2.0 Zenodo DOI`).toBeUndefined();
        expect(paper!.frontmatter.priorVersionDoi).toBe(item.priorVersionDoi);

        const cite = generateCitationMetadata({
          title: paper!.frontmatter.title,
          author: paper!.frontmatter.author || 'Hadi Servat',
          date: paper!.frontmatter.date,
          doi: paper!.frontmatter.doi,
          id: paper!.frontmatter.id,
          lang,
          url: `https://fractalresonance.com/${lang}/papers/${item.id}`,
        });
        expect(cite.citation_doi).toBeUndefined();
      }
    }
  });

  it('syncs all 4 live Zenodo DOIs and FRC-100-006 alphaXiv URL across discovery artifacts with zero PLACEHOLDER tokens', () => {
    const discoveryFiles = [
      'catalog.json',
      'agent.json',
      'agent.md',
      'llms.txt',
      'search-index-en.json',
    ];

    const requiredDois = [
      '10.5281/zenodo.24575211',
      '10.5281/zenodo.24575216',
      '10.5281/zenodo.24575217',
      FRC_700_SERIES_DOI,
    ];

    for (const file of discoveryFiles) {
      const content = fs.readFileSync(path.join(root, 'public', file), 'utf8');
      expect(content, `public/${file} must not contain PLACEHOLDER`).not.toMatch(/PLACEHOLDER/i);
      for (const doi of requiredDois) {
        expect(content, `public/${file} must contain live DOI ${doi}`).toContain(doi);
      }
    }

    for (const file of ['catalog.json', 'agent.json', 'agent.md', 'llms.txt']) {
      const content = fs.readFileSync(path.join(root, 'public', file), 'utf8');
      expect(content, `public/${file} must contain FRC-100-006 live alphaXiv URL`).toContain(
        FRC_100_006_ALPHAXIV_URL,
      );
    }

    const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public', 'catalog.json'), 'utf8'));
    for (const lang of ['en', 'es', 'fa', 'fr']) {
      const entry006 = (catalog.content?.[lang]?.papers || []).find(
        (p: { id: string }) => p.id === 'FRC-100-006',
      );
      expect(entry006?.alphaxivUrl).toBe(FRC_100_006_ALPHAXIV_URL);
      expect(entry006?.doi).toBeUndefined();
    }

    const agentJson = JSON.parse(fs.readFileSync(path.join(root, 'public', 'agent.json'), 'utf8'));
    expect(agentJson.start_here?.doi).toBe('10.5281/zenodo.24575211');
    expect(agentJson.canon?.threshold_framework?.concept_doi).toBe(FRC_700_SERIES_CONCEPT_DOI);
    expect(agentJson.canon?.threshold_framework?.version_doi).toBe(FRC_700_SERIES_DOI);
    const agent006 = agentJson.primary_route.find((p: { id: string }) => p.id === 'FRC-100-006');
    expect(agent006?.alphaxiv_url).toBe(FRC_100_006_ALPHAXIV_URL);
    expect(agent006?.doi).toBeUndefined();
  });
});
