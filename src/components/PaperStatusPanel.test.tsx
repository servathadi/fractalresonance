import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PaperStatusPanel } from './PaperStatusPanel';

describe('PaperStatusPanel', () => {
  it('shows the paper-owned statement, evidence scope, open boundary, and lineage', () => {
    render(
      <PaperStatusPanel
        lang="en"
        canonStatus="living-core"
        frontmatter={{
          id: 'FRC-100-002',
          title: 'Coherence in Chaos',
          version: 'v2.5',
          supersedes: 'FRC 100.002 v2.4',
          publicationState: 'preprint',
          tldr: 'Pilot results included; open gates retained.',
        }}
      />,
    );

    expect(screen.getByText('Pilot results included; open gates retained.')).toBeInTheDocument();
    expect(screen.getByText('Pilot-supported program')).toBeInTheDocument();
    expect(screen.getByText(/KAM correspondence/)).toBeInTheDocument();
    expect(screen.getByText('Supersedes: FRC 100.002 v2.4')).toBeInTheDocument();
  });
});
