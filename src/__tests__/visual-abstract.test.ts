import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  VISUAL_ABSTRACT_PATHS,
  VisualAbstractShowcase,
} from '@/components/VisualAbstractShowcase';
import HomePage from '@/app/[lang]/page';
import StartHerePage from '@/app/[lang]/start-here/page';

const root = process.cwd();

const EXPECTED_ASSETS = [
  {
    relPath: 'public/visuals/frc-v3-visual-abstract.png',
    sha256: '2aa71a5f1de67a065e8537794359c6f2a25898ef8699d591427628297c8adce2',
    kind: 'png' as const,
  },
  {
    relPath: 'public/visuals/frc-v3-visual-abstract.pdf',
    sha256: '74468e96eb9ef568add7a47ee03d5a87b51bd097cb0fbdbfa253c83a260583e3',
    kind: 'pdf' as const,
  },
  {
    relPath: 'public/visuals/frc-v3-implications-and-ai-7slides.pdf',
    sha256: 'fa9e9116d66b472fccf331a3aa2f9384367a98e95d95d49862d553397b7ba492',
    kind: 'pdf' as const,
  },
];

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('FRC v3 Visual Abstract & 7-Slide Overview Deck', () => {
  it('ships all three binary assets in public/visuals/ with valid magic headers and exact SHA-256 parity', () => {
    for (const asset of EXPECTED_ASSETS) {
      const fullPath = path.join(root, asset.relPath);
      expect(fs.existsSync(fullPath), `${asset.relPath} should exist`).toBe(true);

      const bytes = fs.readFileSync(fullPath);
      expect(bytes.length, `${asset.relPath} should be non-empty`).toBeGreaterThan(1024);

      if (asset.kind === 'png') {
        expect(bytes.subarray(0, 8).equals(PNG_MAGIC)).toBe(true);
      } else {
        expect(bytes.subarray(0, 7).toString('ascii')).toBe('%PDF-1.');
      }

      const actualSha = crypto.createHash('sha256').update(bytes).digest('hex');
      expect(actualSha).toBe(asset.sha256);
    }
  });

  it('renders VisualAbstractShowcase with retina PNG dimensions, both PDF links, and editorial tokens across all locales', () => {
    for (const lang of ['en', 'es', 'fr', 'fa']) {
      for (const variant of ['start-here', 'home'] as const) {
        const html = renderToStaticMarkup(
          React.createElement(VisualAbstractShowcase, { lang, variant }),
        );

        expect(html).toContain(`src="${VISUAL_ABSTRACT_PATHS.png}"`);
        expect(html).toContain('width="2560"');
        expect(html).toContain('height="1440"');
        expect(html).toContain(`href="${VISUAL_ABSTRACT_PATHS.oneSlidePdf}"`);
        expect(html).toContain(`href="${VISUAL_ABSTRACT_PATHS.sevenSlideDeckPdf}"`);
        expect(html).toContain('FRC 830.005 v0.3');
        expect(html).toContain('FRC 100.006 v2.0');
        expect(html).toContain('FRC 700.000–007');
        expect(html).toContain('FRC 908.103');
        expect(html).not.toMatch(/\b(?:red|amber|sky|violet|purple|emerald|cyan)-\d{3}\b/);
      }
    }

    const enHtml = renderToStaticMarkup(
      React.createElement(VisualAbstractShowcase, { lang: 'en', variant: 'start-here' }),
    );
    expect(enHtml).toContain('Download 1-Slide Visual Abstract (PDF)');
    expect(enHtml).toContain('Download 7-Slide Overview Deck (PDF)');
  });

  it('mounts VisualAbstractShowcase on both /[lang]/start-here and /[lang]/ home pages', async () => {
    for (const lang of ['en', 'es', 'fr', 'fa']) {
      const startHereEl = await StartHerePage({ params: Promise.resolve({ lang }) });
      const startHereHtml = renderToStaticMarkup(startHereEl);
      expect(startHereHtml).toContain('data-visual-abstract-showcase="start-here"');
      expect(startHereHtml).toContain(VISUAL_ABSTRACT_PATHS.png);
      expect(startHereHtml).toContain(VISUAL_ABSTRACT_PATHS.oneSlidePdf);
      expect(startHereHtml).toContain(VISUAL_ABSTRACT_PATHS.sevenSlideDeckPdf);

      const homeElement = await HomePage({ params: Promise.resolve({ lang }) });
      const resolvedHome = await homeElement.type(homeElement.props);
      const homeHtml = renderToStaticMarkup(resolvedHome);
      expect(homeHtml).toContain('data-visual-abstract-showcase="home"');
      expect(homeHtml).toContain(VISUAL_ABSTRACT_PATHS.png);
      expect(homeHtml).toContain(VISUAL_ABSTRACT_PATHS.oneSlidePdf);
      expect(homeHtml).toContain(VISUAL_ABSTRACT_PATHS.sevenSlideDeckPdf);
    }
  });
});
