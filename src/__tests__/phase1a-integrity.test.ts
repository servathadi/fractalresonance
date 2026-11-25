import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getBook, getContentEpistemicStatus, isCurrentReadingContent } from '@/lib/content';
import { getFalsificationLedger } from '@/lib/falsifications';
import { checkFalsificationLedger, VALID_DISPOSITIONS } from '../../scripts/generate-falsification-ledger.mjs';

const root = process.cwd();

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

  it('keeps public/falsification-ledger.json synchronized with valid typed dispositions and verified corpus entries', () => {
    const check = checkFalsificationLedger(root);
    expect(check.errors).toEqual([]);
    expect(check.ok).toBe(true);

    const ledger = getFalsificationLedger();
    expect(ledger.entries.length).toBeGreaterThanOrEqual(10);

    const dispositionSet = new Set(VALID_DISPOSITIONS);
    for (const entry of ledger.entries) {
      expect(dispositionSet.has(entry.disposition)).toBe(true);
    }

    const ids = new Set(ledger.entries.map((e) => e.id));
    expect(ids.has('FL-100-002-001-GATE4')).toBe(true);
    expect(ids.has('FL-100-005-ERASURE')).toBe(true);
    expect(ids.has('FL-100-007-RHODRIFT')).toBe(true);
    expect(ids.has('FL-787-787-RIJKE-P3')).toBe(true);
    expect(ids.has('FL-830-005-OBSTRUCTION')).toBe(true);
    expect(ids.has('FL-622-108-ROTATION')).toBe(true);

    const entry622 = ledger.entries.find((e) => e.id === 'FL-622-108-ROTATION');
    expect(entry622?.disposition).toBe('CONTRADICTED');
    expect(entry622?.metrics.frc_beta).toBe(-0.1577);
  });

  it('removes stray Finder duplicate files from src/', () => {
    expect(fs.existsSync(path.join(root, 'src/app/[lang]/oracle/page 2.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'src/components/OracleChat 2.tsx'))).toBe(false);
  });
});
