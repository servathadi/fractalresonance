import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getGovernanceArchiveNote } from '../lib/content-governance';

const root = process.cwd();

function readPaper(id: string): string {
  return fs.readFileSync(path.join(root, 'content', 'en', 'papers', `${id}.md`), 'utf8');
}

describe('FRC 700 current-series governance', () => {
  it('keeps FRC 700.777 addressable but marks it outside the current reading path', () => {
    const origin = readPaper('FRC-700-777');

    expect(origin).toContain('publicationState: archived');
    expect(origin).toContain('canonStatus: archive');
    expect(origin).toContain('epistemicStatus: archive');
    expect(getGovernanceArchiveNote('paper', 'FRC-700-777')).toContain('FRC 700.000 through FRC 700.007');
  });

  it('publishes FRC 700.000 through FRC 700.007 as the active bounded framework series', () => {
    for (let index = 0; index <= 7; index += 1) {
      const id = `FRC-700-${String(index).padStart(3, '0')}`;
      const paper = readPaper(id);

      expect(paper, `${id} should be published`).toContain('status: published');
      expect(paper, `${id} should be a framework paper`).toContain('canonStatus: framework');
      expect(paper, `${id} should remain a preprint`).toContain('publicationState: preprint');
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
