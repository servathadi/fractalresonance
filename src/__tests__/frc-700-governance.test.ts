import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getGovernanceArchiveNote } from '../lib/content-governance';
import { getPapers, isCurrentReadingContent } from '../lib/content';

const root = process.cwd();

function readPaper(id: string): string {
  return fs.readFileSync(path.join(root, 'content', 'en', 'papers', `${id}.md`), 'utf8');
}

describe('FRC 700 current-series governance', () => {
  it('keeps FRC 700.777 addressable but removes it from the current reading path', () => {
    const papers = getPapers('en');
    const origin = papers.find((paper) => paper.frontmatter.id === 'FRC-700-777');

    expect(origin).toBeDefined();
    expect(origin?.frontmatter.canonStatus).toBe('archive');
    expect(origin?.frontmatter.epistemicStatus).toBe('archive');
    expect(isCurrentReadingContent('paper', origin!.frontmatter)).toBe(false);
    expect(getGovernanceArchiveNote('paper', 'FRC-700-777')).toContain('FRC 700.000 through FRC 700.007');
  });

  it('publishes FRC 700.000 through FRC 700.007 as the active bounded framework series', () => {
    const papers = getPapers('en');

    for (let index = 0; index <= 7; index += 1) {
      const id = `FRC-700-${String(index).padStart(3, '0')}`;
      const paper = papers.find((candidate) => candidate.frontmatter.id === id);

      expect(paper, `${id} should exist`).toBeDefined();
      expect(paper?.frontmatter.status).toBe('published');
      expect(paper?.frontmatter.canonStatus).toBe('framework');
      expect(isCurrentReadingContent('paper', paper!.frontmatter)).toBe(true);
    }
  });

  it('shows an explicit successor notice on the historical origin page', () => {
    const origin = readPaper('FRC-700-777');

    expect(origin).toContain('Superseded origin note');
    expect(origin).toContain('[[FRC-700-000]]');
    expect(origin).toContain('[[FRC-700-007]]');
    expect(origin).toContain('does not establish a new physical law');
  });
});
