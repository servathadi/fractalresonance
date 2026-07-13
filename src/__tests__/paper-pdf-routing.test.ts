import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('paper PDF routing', () => {
  it('keeps downloadable PDFs outside the legacy paper-page redirect namespace', () => {
    const page = fs.readFileSync(
      path.join(root, 'src/app/[lang]/papers/[id]/page.tsx'),
      'utf8'
    );

    expect(page).toContain("'public', 'paper-pdfs'");
    expect(page).toContain('href={`/paper-pdfs/${canonicalId}.pdf`}');
    expect(fs.existsSync(path.join(root, 'public/paper-pdfs/FRC-100-002.pdf'))).toBe(true);
  });

  it('redirects legacy PDF URLs before the general paper-page wildcard', () => {
    const redirects = fs
      .readFileSync(path.join(root, 'public/_redirects'), 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const pdfRedirect = redirects.indexOf('/papers/:id.pdf  /paper-pdfs/:id.pdf  301');
    const pageRedirect = redirects.indexOf('/papers/*  /en/papers/:splat  301');

    expect(pdfRedirect).toBeGreaterThanOrEqual(0);
    expect(pageRedirect).toBeGreaterThan(pdfRedirect);
  });
});
