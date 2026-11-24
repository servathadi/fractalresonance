import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ResearchMapSection } from '../components/ResearchMapSection';
import { getHomeConfig, getPaper, getSitePage, parseFrontmatter } from '../lib/content';
import { buildResearchMap } from '../lib/research-map';

const root = process.cwd();

describe('Homepage and start-here current research map (#313)', () => {
  it('builds the active research map with FRC 566.001, FRC 830.000-005, FRC 700.000-007, and empirical programs while excluding FRC 700.777 from active routes', () => {
    const map = buildResearchMap('en', '/en');

    expect(map.canonicalReciprocity?.id).toBe('FRC-566-001');
    expect(map.canonicalReciprocity?.version).toBe('v2.2');

    expect(map.reciprocityMathematics.papers.map((p) => p.id)).toEqual([
      'FRC-830-000',
      'FRC-830-001',
      'FRC-830-002',
      'FRC-830-003',
      'FRC-830-004',
      'FRC-830-005',
    ]);
    expect(map.reciprocityMathematics.sharedConceptDoi).toBe('10.5281/zenodo.21385391');
    expect(map.reciprocityMathematics.sharedVersionDoi).toBe('10.5281/zenodo.21385392');
    for (const p of map.reciprocityMathematics.papers) {
      expect(p.href).toBe(`/en/papers/${p.id}`);
      expect(p.pdfHref).toBe(`/paper-pdfs/${p.id}.pdf`);
    }

    expect(map.thresholdPapers.map((p) => p.id)).toEqual([
      'FRC-700-000',
      'FRC-700-001',
      'FRC-700-002',
      'FRC-700-003',
      'FRC-700-004',
      'FRC-700-005',
      'FRC-700-006',
      'FRC-700-007',
    ]);

    expect(map.empiricalPrograms.map((p) => p.id)).toEqual([
      'FRC-100-002',
      'FRC-100-002-001',
      'FRC-787-787',
    ]);
    expect(map.empiricalPrograms.find((p) => p.id === 'FRC-100-002-001')?.isNegativeGate).toBe(true);

    const activeIds = new Set([
      map.canonicalReciprocity?.id,
      ...map.reciprocityMathematics.papers.map((p) => p.id),
      ...map.thresholdPapers.map((p) => p.id),
      ...map.empiricalPrograms.map((p) => p.id),
    ]);
    expect(activeIds.has('FRC-700-777')).toBe(false);
    expect(map.supersededOrigin?.id).toBe('FRC-700-777');
    expect(map.supersededOrigin?.href).toBe('/en/papers/FRC-700-777');
  });

  it('renders clear scientific status distinctions, direct FRC 830 web/PDF/Zenodo links, FRC 700.000-007, negative Gate 4 visibility, and explicit non-claims across all locales', () => {
    for (const lang of ['en', 'es', 'fr', 'fa']) {
      const map = buildResearchMap(lang, `/${lang}`);
      const html = renderToStaticMarkup(
        React.createElement(ResearchMapSection, { data: map, lang }),
      );

      // All 8 active FRC 700 threshold papers and all 6 FRC 830 papers present
      for (let i = 0; i <= 7; i += 1) {
        const id = `FRC-700-${String(i).padStart(3, '0')}`;
        expect(html).toContain(id);
        expect(html).toContain(`/en/papers/${id}`);
      }
      for (let i = 0; i <= 5; i += 1) {
        const id = `FRC-830-${String(i).padStart(3, '0')}`;
        expect(html).toContain(id);
        expect(html).toContain(`/en/papers/${id}`);
        expect(html).toContain(`/paper-pdfs/${id}.pdf`);
      }

      // Shared Zenodo DOIs for FRC 830
      expect(html).toContain('https://doi.org/10.5281/zenodo.21385391');
      expect(html).toContain('https://doi.org/10.5281/zenodo.21385392');

      // Canonical reciprocity + empirical programs + negative Gate 4 visibility
      expect(html).toContain('FRC-566-001');
      expect(html).toContain('FRC-100-002');
      expect(html).toContain('FRC-100-002-001');
      expect(html).toContain('FRC-787-787');
      expect(html).toContain('Gate 4');

      // FRC 700.777 appears only as superseded historical context
      expect(html).toContain('FRC-700-777');
      expect(html).toContain('Superseded');

      // Status badges visible before entering papers
      expect(html).toContain('Exact mathematics');
      expect(html).toContain('Framework / methodology');
      expect(html).toContain('Model-specific');
    }
  });

  it('keeps localized home.md configs and start-here.md aligned with active FRC 700/830 routes and free of prohibited inflated claims', () => {
    for (const lang of ['en', 'es', 'fa', 'fr']) {
      const home = getHomeConfig(lang);
      expect(home).not.toBeNull();
      const kasra = home?.startHere?.kasra || [];
      const river = home?.startHere?.river || [];
      const allTargets = [...kasra, ...river].map((i) => i.target || i.url || '');

      expect(allTargets.some((t) => t.includes('FRC-566-001'))).toBe(true);
      expect(allTargets.some((t) => t.includes('FRC-830-000'))).toBe(true);
      expect(allTargets.some((t) => t.includes('FRC-700-000'))).toBe(true);
      expect(allTargets.some((t) => t.includes('FRC-700-777'))).toBe(false);

      const raw = fs.readFileSync(path.join(root, 'content', lang, 'site', 'home.md'), 'utf8');
      expect(raw).not.toMatch(/10\^\{?-4\}?|10⁻⁴/);
      expect(raw).not.toMatch(/derives?\s+the\s+born\s+rule/i);
    }

    const startHere = getSitePage('en', 'start-here');
    expect(startHere).not.toBeNull();
    expect(startHere!.body).toContain('FRC 830.001–830.005');
    expect(startHere!.body).toContain('FRC 700.000–700.007');
    expect(startHere!.body).toContain('does not claim to have derived the Born rule');
  });

  it('falls back to canonical English URLs when a localized paper revision lags the advertised English version/DOI', () => {
    for (const lang of ['es', 'fa', 'fr']) {
      const map = buildResearchMap(lang, `/${lang}`);
      expect(map.canonicalReciprocity?.href).toBe('/en/papers/FRC-566-001');
      expect(map.empiricalPrograms.find((p) => p.id === 'FRC-100-002')?.href).toBe('/en/papers/FRC-100-002');
    }
  });

  it('preserves multi-property unindented YAML object sequences (e.g. FRC-840-LTM-001 images) alongside mapping dedent', () => {
    const parsed = parseFrontmatter(`---
id: test-doc
images:
- url: /first.png
  caption: First
- url: /second.png
  caption: Second
lang: en
---
Body`);
    expect(parsed.frontmatter.images).toEqual([
      { url: '/first.png', caption: 'First' },
      { url: '/second.png', caption: 'Second' },
    ]);
    expect(parsed.frontmatter.lang).toBe('en');

    const ltm = getPaper('en', 'FRC-840-LTM-001');
    expect(ltm?.frontmatter.images).toHaveLength(2);
    expect(ltm?.frontmatter.images?.[1]?.url).toBe('/media/en/papers/FRC-840-LTM-001/ltm_results.png');
  });
});
