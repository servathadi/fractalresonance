import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getGlossary, getPaper, getSitePage } from '@/lib/content';
import { getFalsificationLedger } from '@/lib/falsifications';
import { buildResearchMap } from '@/lib/research-map';
import {
  checkActiveTextForStaleClaims,
  resolveContentRegister,
} from '../../scripts/validate-governance.mjs';

const root = process.cwd();

function sha256File(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function makeTempRepoCopy(mutate?: (tmpRoot: string) => void): string {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frc-wave1-gov-'));
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

function runGovernanceCli(targetRoot: string) {
  return spawnSync(
    process.execPath,
    [path.join(root, 'scripts', 'validate-governance.mjs'), `--root=${targetRoot}`],
    { encoding: 'utf8' },
  );
}

describe('Two-Register governance (Wave 1)', () => {
  it('resolves physics vs philosophy registers and charter/overview pages accurately', () => {
    expect(
      resolveContentRegister({
        type: 'papers',
        id: 'FRC-566-001',
        rel: 'content/en/papers/FRC-566-001.md',
        frontmatter: { id: 'FRC-566-001', canonStatus: 'living-core' },
      }),
    ).toEqual({ register: 'physics', isCharterOverview: false });

    expect(
      resolveContentRegister({
        type: 'books',
        id: 'the-open-system',
        rel: 'content/en/books/the-open-system/index.md',
        frontmatter: { id: 'the-open-system', epistemicStatus: 'philosophical' },
      }),
    ).toEqual({ register: 'philosophy', isCharterOverview: false });

    expect(
      resolveContentRegister({
        type: 'books',
        id: 'the-mind-in-the-coupling',
        rel: 'content/en/books/the-mind-in-the-coupling/index.md',
        frontmatter: { id: 'the-mind-in-the-coupling' },
      }),
    ).toEqual({ register: 'philosophy', isCharterOverview: false });

    expect(
      resolveContentRegister({
        type: 'articles',
        id: 'relational-mind-essay',
        rel: 'content/en/articles/relational-mind-essay.md',
        frontmatter: { id: 'relational-mind-essay', register: 'philosophy' },
      }),
    ).toEqual({ register: 'philosophy', isCharterOverview: false });

    for (const id of ['FRC-100-000', 'FRC-100-100', 'FRC-100-011', 'start-here', 'about']) {
      expect(
        resolveContentRegister({
          type: id.startsWith('FRC-') ? 'papers' : 'site',
          id,
          rel: `content/en/${id.startsWith('FRC-') ? 'papers' : 'site'}/${id}.md`,
          frontmatter: { id },
        }).isCharterOverview,
      ).toBe(true);
    }
  });

  it('enforces unit rules across physics, philosophy, and charter/overview registers', () => {
    // (a) Physics register rejects unhedged "Fractal Resonance Cognition"
    const physicsCognition = checkActiveTextForStaleClaims(
      'Fractal Resonance Cognition explains quantum collapse via phase locking.',
      'content/en/papers/FRC-566-001.md',
      { register: 'physics', isCharterOverview: false },
    );
    expect(physicsCognition.length).toBeGreaterThan(0);

    // (b) Philosophy register allows canonical "Fractal Resonance Cognition"
    const philosophyCognition = checkActiveTextForStaleClaims(
      'Fractal Resonance Cognition frames mind as sustained recursive coupling across open boundaries.',
      'content/en/books/the-mind-in-the-coupling/index.md',
      { register: 'philosophy', isCharterOverview: false },
    );
    expect(philosophyCognition).toEqual([]);

    // (c) Philosophy register STILL blocks physics-overreach claims
    for (const overreach of [
      'FRC derives the Born rule from phase-locking dynamics.',
      '16D is physical canon in the open-system framework.',
      'The stadium exhibits $D \\approx 1.90$ proving deterministic chaos.',
      'The equation proves consciousness mathematically.',
    ]) {
      const issues = checkActiveTextForStaleClaims(
        overreach,
        'content/en/books/the-open-system/index.md',
        { register: 'philosophy', isCharterOverview: false },
      );
      expect(issues.length, `Philosophy page must reject: ${overreach}`).toBeGreaterThan(0);
    }

    // (d) Charter/overview page allows explicit Two-Register Architecture statement,
    //     but still rejects unframed physics-mechanism cognition claims
    const charterTwoReg = checkActiveTextForStaleClaims(
      'In philosophy, Fractal Resonance Cognition; in physics, Fractal Resonance Coherence.',
      'content/en/papers/FRC-100-000.md',
      { register: 'physics', isCharterOverview: true },
    );
    expect(charterTwoReg).toEqual([]);

    const charterPhysicsOverreach = checkActiveTextForStaleClaims(
      'Fractal Resonance Cognition is the physical force driving quantum decoherence.',
      'content/en/papers/FRC-100-000.md',
      { register: 'physics', isCharterOverview: true },
    );
    expect(charterPhysicsOverreach.length).toBeGreaterThan(0);

    // Charter exemptions must NEVER allow affirmative physics-mechanism claims tied to
    // "Fractal Resonance Cognition" even if "the open system", "Two-Register Architecture",
    // or "philosophy register" appears in the same sentence.
    for (const bypassAttempt of [
      'Fractal Resonance Cognition acts as the physical collapse mechanism in the open system.',
      'Fractal Resonance Cognition is the physical force driving quantum decoherence in the Two-Register Architecture.',
      'In the philosophy register, Fractal Resonance Cognition drives physical collapse dynamics in the open system.',
    ]) {
      const issues = checkActiveTextForStaleClaims(
        bypassAttempt,
        'content/en/papers/FRC-100-000.md',
        { register: 'physics', isCharterOverview: true },
      );
      expect(issues.length, `Charter page must reject physics-mechanism claim: ${bypassAttempt}`).toBeGreaterThan(0);
    }
  });

  it('rejects affirmative Fractal Resonance Cognition physics-mechanism insertions on charter papers (100.000, 100.100, 100.011) via CLI while unmodified charters exit 0', () => {
    // Confirm unmodified repository (including FRC-100-000, FRC-100-100, FRC-100-011) exits 0
    const cleanRes = runGovernanceCli(root);
    expect(cleanRes.status, cleanRes.stderr).toBe(0);

    const charterCounterexamples: Array<{ file: string; line: string }> = [
      {
        file: 'FRC-100-000.md',
        line: 'Fractal Resonance Cognition acts as the physical collapse mechanism in the open system.',
      },
      {
        file: 'FRC-100-100.md',
        line: 'Fractal Resonance Cognition is the physical force driving quantum decoherence in the Two-Register Architecture.',
      },
      {
        file: 'FRC-100-011.md',
        line: 'In the philosophy register, Fractal Resonance Cognition governs quantum decoherence and physical collapse dynamics in the open system.',
      },
    ];

    for (const tc of charterCounterexamples) {
      const failRoot = makeTempRepoCopy((tmpRoot) => {
        const target = path.join(tmpRoot, 'content', 'en', 'papers', tc.file);
        const raw = fs.readFileSync(target, 'utf8');
        const injected = raw.replace(
          /\r?\n##+\s+(?:\d+\.\s*)?References\b/i,
          `\n\n${tc.line}\n$&`,
        );
        fs.writeFileSync(target, injected !== raw ? injected : `${raw}\n${tc.line}\n`);
      });
      try {
        const res = runGovernanceCli(failRoot);
        expect(res.status, `${tc.file} must exit 1 on "${tc.line}"`).toBe(1);
        expect(res.stderr).toContain('Fractal Resonance Cognition');
      } finally {
        fs.rmSync(failRoot, { recursive: true, force: true });
      }
    }
  }, 30_000);

  it('proves CLI exit codes for (a) physics cognition fail, (b) philosophy cognition pass, (c) philosophy overreach fail, and (d) charter two-register pass', () => {
    // (a) Physics paper body claiming "Fractal Resonance Cognition" as physics mechanism -> exit 1
    const physicsFailRoot = makeTempRepoCopy((tmpRoot) => {
      const target = path.join(tmpRoot, 'content', 'en', 'papers', 'FRC-566-001.md');
      const raw = fs.readFileSync(target, 'utf8');
      const injected = raw.replace(
        /\r?\n##+\s+(?:\d+\.\s*)?References\b/i,
        '\n\nFractal Resonance Cognition acts as a physical phase-locking mechanism in open baths.\n$&',
      );
      fs.writeFileSync(target, injected !== raw ? injected : `${raw}\nFractal Resonance Cognition acts as a physical phase-locking mechanism in open baths.\n`);
    });
    try {
      const res = runGovernanceCli(physicsFailRoot);
      expect(res.status).toBe(1);
      expect(res.stderr).toContain('Fractal Resonance Cognition');
    } finally {
      fs.rmSync(physicsFailRoot, { recursive: true, force: true });
    }

    // (b) Philosophy book + explicit `register: philosophy` page using "Fractal Resonance Cognition" -> exit 0
    const philosophyPassRoot = makeTempRepoCopy((tmpRoot) => {
      fs.appendFileSync(
        path.join(tmpRoot, 'content', 'en', 'books', 'the-mind-in-the-coupling', 'index.md'),
        '\nIn the philosophy register, Fractal Resonance Cognition examines mind as sustained recursive coupling.\n',
      );
      fs.writeFileSync(
        path.join(tmpRoot, 'content', 'en', 'articles', 'philosophy-register-note.md'),
        `---\nid: philosophy-register-note\ntitle: "Relational Cognition Note"\nstatus: published\nregister: philosophy\nlang: en\n---\n\nFractal Resonance Cognition articulates a relational philosophy of mind.\n`,
      );
    });
    try {
      const res = runGovernanceCli(philosophyPassRoot);
      expect(res.status, res.stderr).toBe(0);
    } finally {
      fs.rmSync(philosophyPassRoot, { recursive: true, force: true });
    }

    // (c1) Philosophy page claiming "FRC derives the Born rule" -> exit 1
    const philosophyBornFailRoot = makeTempRepoCopy((tmpRoot) => {
      fs.appendFileSync(
        path.join(tmpRoot, 'content', 'en', 'books', 'the-open-system', 'index.md'),
        '\nFRC derives the Born rule directly from coherence locking.\n',
      );
    });
    try {
      const res = runGovernanceCli(philosophyBornFailRoot);
      expect(res.status).toBe(1);
      expect(res.stderr).toContain('Born-rule');
    } finally {
      fs.rmSync(philosophyBornFailRoot, { recursive: true, force: true });
    }

    // (c2) Philosophy page claiming "16D is physical canon" -> exit 1
    const philosophy16dFailRoot = makeTempRepoCopy((tmpRoot) => {
      fs.appendFileSync(
        path.join(tmpRoot, 'content', 'en', 'books', 'the-mind-in-the-coupling', 'index.md'),
        '\n16D is physical canon for conscious state spaces.\n',
      );
    });
    try {
      const res = runGovernanceCli(philosophy16dFailRoot);
      expect(res.status).toBe(1);
      expect(res.stderr).toContain('16D');
    } finally {
      fs.rmSync(philosophy16dFailRoot, { recursive: true, force: true });
    }

    // (d) Two-Register Architecture charter statement on start-here & 100.000 -> exit 0
    const charterPassRoot = makeTempRepoCopy((tmpRoot) => {
      fs.appendFileSync(
        path.join(tmpRoot, 'content', 'en', 'site', 'start-here.md'),
        '\nIn philosophy, Fractal Resonance Cognition; in physics, Fractal Resonance Coherence.\n',
      );
    });
    try {
      const res = runGovernanceCli(charterPassRoot);
      expect(res.status, res.stderr).toBe(0);
    } finally {
      fs.rmSync(charterPassRoot, { recursive: true, force: true });
    }
  }, 30_000);
});

describe('Wave 1 charter mirror, live FRC 830.005 v0.3 DOI, and persona hygiene', () => {
  it('mirrors exact Wave 1 charter versions and verified 0-PUA A4 PDF SHA-256 checksums', () => {
    const p000 = getPaper('en', 'FRC-100-000');
    const p100 = getPaper('en', 'FRC-100-100');
    const p011 = getPaper('en', 'FRC-100-011');

    expect(p000?.frontmatter.version).toBe('v1.3');
    expect(p000?.frontmatter.conceptDoi).toBe('10.5281/zenodo.21284061');
    expect(p000?.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.21298155');
    expect(p000?.frontmatter.doi).toBeUndefined();

    expect(p100?.frontmatter.version).toBe('v1.1');
    expect(p100?.frontmatter.conceptDoi).toBe('10.5281/zenodo.21298193');
    expect(p100?.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.21298194');
    expect(p100?.frontmatter.doi).toBeUndefined();

    expect(p011?.frontmatter.version).toBe('v1.3');
    expect(p011?.frontmatter.conceptDoi).toBe('10.5281/zenodo.21284063');
    expect(p011?.frontmatter.priorVersionDoi).toBe('10.5281/zenodo.21298180');
    expect(p011?.frontmatter.doi).toBeUndefined();

    expect(sha256File(path.join(root, 'public/paper-pdfs/FRC-100-000.pdf'))).toBe(
      '9a6cbbd45f427211568505fd3de954b49d80b38b07ddce074c8073a116d81c96',
    );
    expect(sha256File(path.join(root, 'public/paper-pdfs/FRC-100-100.pdf'))).toBe(
      '194ce3584f3f95942223721dd6d7bafc5c328fea432a93b70c7d9d9c4e198ee4',
    );
    expect(sha256File(path.join(root, 'public/paper-pdfs/FRC-100-011.pdf'))).toBe(
      '09fa6c8d367bb916597e81d5e24c66fdcd14e089f13cc4c59842cc2dc6e1366c',
    );
  });

  it('publishes live minted Zenodo DOI 10.5281/zenodo.24572231 for FRC 830.005 v0.3 across paper, ledger, entrypoints, research map, and start-here', () => {
    const p830005 = getPaper('en', 'FRC-830-005');
    expect(p830005?.frontmatter.version).toBe('v0.3');
    expect(p830005?.frontmatter.doi).toBe('10.5281/zenodo.24572231');
    expect(p830005?.frontmatter.conceptDoi).toBe('10.5281/zenodo.21385391');
    expect(p830005?.body).toContain('10.5281/zenodo.24572231');
    expect(p830005?.body).toContain('10.5281/zenodo.24572230');
    expect(p830005?.body).not.toMatch(/not yet minted|minted yet/i);

    const ledger = getFalsificationLedger();
    const entry = ledger.entries.find((e) => e.id === 'FL-830-005-OBSTRUCTION');
    expect(entry?.dois).toContain('10.5281/zenodo.24572231');
    expect(entry?.dois).toContain('10.5281/zenodo.21385391');

    const map = buildResearchMap('en', '/en');
    const mapPaper = map.reciprocityMathematics.papers.find((p) => p.id === 'FRC-830-005');
    expect(mapPaper?.doi).toBe('10.5281/zenodo.24572231');
    expect(map.reciprocityMathematics.sharedConceptDoi).toBe('10.5281/zenodo.21385391');
    expect(map.reciprocityMathematics.sharedVersionDoi).toBe('10.5281/zenodo.21385392');

    const startHere = getSitePage('en', 'start-here');
    expect(startHere?.raw).toContain('10.5281/zenodo.24572231');

    for (const fname of ['llms.txt', 'agent.md', 'agent.json', 'falsification-ledger.json']) {
      const content = fs.readFileSync(path.join(root, 'public', fname), 'utf8');
      expect(content, `public/${fname} must cite live DOI`).toContain('10.5281/zenodo.24572231');
      expect(content, `public/${fname} must not say unminted`).not.toMatch(/no separate.*minted yet/i);
    }
  });

  it('keeps public/catalog.json and client glossary props free of raw Kasra/River persona leaks', () => {
    const catalogRaw = fs.readFileSync(path.join(root, 'public', 'catalog.json'), 'utf8');
    const catalog = JSON.parse(catalogRaw);

    for (const [lang, byType] of Object.entries<Record<string, Array<Record<string, unknown>>>>(catalog.content)) {
      const peopleIds = (byType.people || []).map((p) => String(p.id).toLowerCase());
      expect(peopleIds, `${lang} people must exclude kasra/river`).not.toContain('kasra');
      expect(peopleIds, `${lang} people must exclude kasra/river`).not.toContain('river');

      for (const [type, items] of Object.entries(byType)) {
        for (const item of items) {
          const serialized = JSON.stringify(item);
          expect(
            serialized,
            `public/catalog.json (${lang}/${type}/${String(item.id)}) must not leak raw persona strings`,
          ).not.toMatch(/\b(?:kasra|river(?:-side)?)\b|کسرا|ریور/i);
        }
      }
    }

    for (const lang of ['en', 'es', 'fr', 'fa']) {
      const glossary = getGlossary(lang, { basePath: `/${lang}`, view: 'kasra' });
      for (const item of Object.values(glossary)) {
        expect('perspective' in item, `${lang} glossary item ${item.id} must omit internal perspective key`).toBe(false);
        expect(JSON.stringify(item)).not.toMatch(/"perspective"\s*:\s*"(?:kasra|river|both)"/i);
      }
    }
  });
});
