import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getBook, getContentEpistemicStatus, getTopic, isCurrentReadingContent } from '@/lib/content';
import { getFalsificationLedger } from '@/lib/falsifications';
import { checkFalsificationLedger, VALID_DISPOSITIONS } from '../../scripts/generate-falsification-ledger.mjs';
import { checkActiveTextForStaleClaims, validateGovernance } from '../../scripts/validate-governance.mjs';

const root = process.cwd();

function makeTempRepoCopy(mutate?: (tmpRoot: string) => void): string {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frc-gov-test-'));
  fs.cpSync(path.join(root, 'content'), path.join(tmpRoot, 'content'), { recursive: true });
  fs.mkdirSync(path.join(tmpRoot, 'public'), { recursive: true });
  fs.symlinkSync(path.join(root, 'public', 'paper-pdfs'), path.join(tmpRoot, 'public', 'paper-pdfs'));
  for (const file of [
    'catalog.json',
    'llms.txt',
    'agent.md',
    'agent.json',
    'falsification-ledger.json',
    'search-index.json',
    'search-index-en.json',
    'search-index-es.json',
    'search-index-fr.json',
    'search-index-fa.json',
  ]) {
    fs.copyFileSync(path.join(root, 'public', file), path.join(tmpRoot, 'public', file));
  }
  fs.mkdirSync(path.join(tmpRoot, 'src', 'lib'), { recursive: true });
  fs.copyFileSync(path.join(root, 'src', 'lib', 'schema.ts'), path.join(tmpRoot, 'src', 'lib', 'schema.ts'));
  if (mutate) mutate(tmpRoot);
  return tmpRoot;
}

describe('Phase 1A site integrity, books archive, and falsification ledger', () => {
  it('marks 2025 books (ecr-textbook, the-resonance-code) as archived and noindex across all languages while keeping chapters intact', () => {
    for (const lang of ['en', 'es', 'fr', 'fa']) {
      for (const bookId of ['ecr-textbook', 'the-resonance-code']) {
        const book = getBook(lang, bookId);
        expect(book, `${lang}/${bookId} should remain addressable`).not.toBeNull();
        expect(book!.frontmatter.status).toBe('archived');
        expect(book!.frontmatter.epistemicStatus).toBe('archive');
        expect(book!.frontmatter.noindex).toBe(true);
        expect(getContentEpistemicStatus('book', book!.frontmatter)).toBe('archive');
        expect(isCurrentReadingContent('book', book!.frontmatter)).toBe(false);
      }
    }

    for (const currentId of ['the-open-system', 'the-mind-in-the-coupling']) {
      const book = getBook('en', currentId);
      expect(book, `en/${currentId} should be published`).not.toBeNull();
      expect(book!.frontmatter.status).toBe('published');
      expect(isCurrentReadingContent('book', book!.frontmatter)).toBe(true);
    }
  });

  it('keeps public/falsification-ledger.json synchronized with 10 publicly auditable entries and accurate pinned source versions', () => {
    const check = checkFalsificationLedger(root);
    expect(check.errors).toEqual([]);
    expect(check.ok).toBe(true);

    const ledger = getFalsificationLedger();
    expect(ledger.entries).toHaveLength(10);

    const dispositionSet = new Set(VALID_DISPOSITIONS);
    for (const entry of ledger.entries) {
      expect(dispositionSet.has(entry.disposition)).toBe(true);
      expect(entry.urls.length, `${entry.id} must link to at least one public on-site document`).toBeGreaterThan(0);
    }

    const ids = new Set(ledger.entries.map((e) => e.id));
    expect(ids.has('FL-100-002-001-GATE4')).toBe(true);
    expect(ids.has('FL-100-005-ERASURE')).toBe(true);
    expect(ids.has('FL-100-007-RHODRIFT')).toBe(true);
    expect(ids.has('FL-787-787-RIJKE-P3')).toBe(true);
    expect(ids.has('FL-830-005-OBSTRUCTION')).toBe(true);
    // Unproven private-repo external audit must not be published without public artifacts/DOI
    expect(ids.has('FL-622-108-ROTATION')).toBe(false);

    // Pinned source versions for FL-DEMOTED-BORN match actual repository documents
    const bornEntry = ledger.entries.find((e) => e.id === 'FL-DEMOTED-BORN');
    expect(bornEntry?.sourceIds).toEqual(['FRC-100-000', 'FRC-100-100', 'FRC-100-003', 'FRC-100-007']);
    expect(bornEntry?.sourceVersions).toEqual(['v1.2', 'v1.0', 'v3.3', 'v3.3']);
  });

  it('removes internal persona metadata (voice: kasra / lens: river) from what-is-frc across all locales', () => {
    for (const lang of ['en', 'es', 'fr', 'fa']) {
      const topic = getTopic(lang, 'what-is-frc');
      expect(topic, `${lang}/topics/what-is-frc should exist`).not.toBeNull();
      expect(topic!.frontmatter.voice).toBeUndefined();
      const lenses = (topic!.frontmatter.answers || []).map((a) => String(a.lens || '').toLowerCase());
      expect(lenses).not.toContain('river');
      expect(lenses).not.toContain('kasra');
    }
  });

  it('removes stray Finder duplicate files from src/', () => {
    expect(fs.existsSync(path.join(root, 'src/app/[lang]/oracle/page 2.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'src/components/OracleChat 2.tsx'))).toBe(false);
  });

  it('enforces governance:check inside npm run validate and CI workflow', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts.validate).toContain('scripts/validate-governance.mjs');

    const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'deploy.yml'), 'utf8');
    expect(workflow).toContain('npm run validate');
    expect(workflow).toContain('npm run test:run');
  });
});

describe('Active-content stale-claim governance regressions', () => {
  it('passes validateGovernance on the repository with zero errors', () => {
    const res = validateGovernance(root);
    expect(res.errors).toEqual([]);
    expect(res.ok).toBe(true);
  });

  it('catches unhedged retired claims across clauses: Born rule, FRC 821, LaTeX D \\approx 1.90, 16D, and mixed retired+active sentences', () => {
    // Mixed retired + active sentence MUST fail (clause-scoped negation: semicolon, year-period, contrastive clauses)
    const mixedIssues = checkActiveTextForStaleClaims(
      'The retired hypothesis is obsolete; 16D is now established physical canon.',
      'content/en/topics/test.md',
    );
    expect(mixedIssues.length).toBeGreaterThan(0);

    expect(
      checkActiveTextForStaleClaims(
        'The earlier hypothesis was retired in 2025. 16D is now established physical canon.',
        'content/en/topics/test.md',
      ).length,
    ).toBeGreaterThan(0);

    expect(
      checkActiveTextForStaleClaims(
        'The earlier 16D framework was retired, but 16D is now established physical canon.',
        'content/en/topics/test.md',
      ).length,
    ).toBeGreaterThan(0);

    // LaTeX D \approx 1.90 / D\approx 1.90 / D \simeq 1.90 MUST fail
    expect(
      checkActiveTextForStaleClaims('Eigenfunctions exhibit $D \\approx 1.90$ in the stadium.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('Measured fractal dimension $D\\approx 1.90$.', 'content/es/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('Fractal dimension $D \\simeq 1.90$ confirms the potential.', 'content/fr/concepts/test.md').length,
    ).toBeGreaterThan(0);

    // Unhedged Born-rule derivation (present, past, perfect, passive) / deviation claims MUST fail across locales
    expect(
      checkActiveTextForStaleClaims('FRC derives the Born rule from phase-locking dynamics.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('FRC has derived the Born rule from phase-locking dynamics.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('The Born rule has been derived by FRC.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('FRC derived the Born rule and the Born rule was derived from coherence.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('FRC predicts a fixed deviation of 10^{-4} to 10^{-3}.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('FRC deriva la regla de Born directamente.', 'content/es/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('FRC dérive la règle de Born.', 'content/fr/concepts/test.md').length,
    ).toBeGreaterThan(0);

    // Unhedged FRC 821 / 821 canonical claims MUST fail
    expect(
      checkActiveTextForStaleClaims('FRC 821 provides the canonical cognitive architecture.', 'content/en/concepts/test.md').length,
    ).toBeGreaterThan(0);
    expect(
      checkActiveTextForStaleClaims('The 821 series defines the active symbolic framework.', 'content/en/topics/test.md').length,
    ).toBeGreaterThan(0);

    // Unhedged retired 2025 program name MUST fail
    expect(
      checkActiveTextForStaleClaims('Welcome to Fractal Resonance Cognition (FRC).', 'content/en/topics/test.md').length,
    ).toBeGreaterThan(0);
  });

  it('allows explicit negated/historical mentions in the same clause across locales', () => {
    const allowedLines = [
      'The retired 2025 name Fractal Resonance Cognition is not the current program name.',
      'The stadium value $D \\approx 1.90$ is demoted and not universal.',
      'The 16D and FRC 821 branches are archived development history, not current core.',
      'The Born rule is not derived by FRC, and FRC has no fixed 10^{-4} to 10^{-3} deviation range.',
      'FRC has not derived the Born rule.',
      'The Born rule has not been derived by FRC.',
      'FRC no ha derivado la regla de Born y las ramas 16D y FRC 821 están archivadas.',
      'FRC ne revendique pas la dérivation de la règle de Born et les branches 16D et FRC 821 sont archivées.',
      'شاخه‌های 16D و FRC 821 بایگانی شده‌اند و FRC مدعی استخراج قاعده بورن نیست.',
    ];
    for (const line of allowedLines) {
      expect(checkActiveTextForStaleClaims(line, 'content/en/topics/test.md'), `Should allow: ${line}`).toEqual([]);
    }
  });

  it('exits with code 1 from CLI on year-period, contrastive, and completed/passive Born repros, and exits 0 on negated controls', () => {
    const failingCases: Array<{ label: string; line: string; expectedErr: string }> = [
      {
        label: 'year-period split 16D',
        line: 'The earlier hypothesis was retired in 2025. 16D is now established physical canon.',
        expectedErr: 'unhedged 16D canonical claim',
      },
      {
        label: 'contrastive but-clause 16D',
        line: 'The earlier 16D framework was retired, but 16D is now established physical canon.',
        expectedErr: 'unhedged 16D canonical claim',
      },
      {
        label: 'present-perfect Born derivation',
        line: 'FRC has derived the Born rule from phase-locking dynamics.',
        expectedErr: 'unhedged Born-rule derivation',
      },
      {
        label: 'passive-perfect Born derivation',
        line: 'The Born rule has been derived by FRC.',
        expectedErr: 'unhedged Born-rule derivation',
      },
    ];

    for (const tc of failingCases) {
      const failingRoot = makeTempRepoCopy((tmpRoot) => {
        const target = path.join(tmpRoot, 'content', 'en', 'topics', 'what-is-frc.md');
        fs.appendFileSync(target, `\n${tc.line}\n`);
      });
      try {
        const run = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-governance.mjs'), `--root=${failingRoot}`], {
          encoding: 'utf8',
        });
        expect(run.status, `${tc.label} must exit 1`).toBe(1);
        expect(run.stderr, `${tc.label} stderr`).toContain(tc.expectedErr);
      } finally {
        fs.rmSync(failingRoot, { recursive: true, force: true });
      }
    }

    const passingRoot = makeTempRepoCopy((tmpRoot) => {
      const target = path.join(tmpRoot, 'content', 'en', 'topics', 'what-is-frc.md');
      fs.appendFileSync(
        target,
        '\nThe retired 2025 name Fractal Resonance Cognition is not the current program name.\nFRC has not derived the Born rule. The Born rule has not been derived by FRC.\n',
      );
    });

    try {
      const passRun = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-governance.mjs'), `--root=${passingRoot}`], {
        encoding: 'utf8',
      });
      expect(passRun.status).toBe(0);
    } finally {
      fs.rmSync(passingRoot, { recursive: true, force: true });
    }
  });
});
