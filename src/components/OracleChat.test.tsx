import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EpistemicBadge } from './EpistemicBadge';
import { OracleChat } from './OracleChat';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('OracleChat epistemic search', () => {
  it('preserves localized epistemic labels', () => {
    const { rerender } = render(<EpistemicBadge status="philosophical" lang="es" />);
    expect(screen.getByText('Filosófico')).toBeInTheDocument();

    rerender(<EpistemicBadge status="archive" lang="fa" />);
    expect(screen.getByText('بایگانی')).toBeInTheDocument();
  });

  it('ranks a matching primary paper above matching commentary and labels both results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [
          {
            id: 'commentary-result',
            type: 'articles',
            title: 'Lambda field commentary',
            url: '/en/articles/commentary-result',
            epistemicStatus: 'commentary',
            retrievalPriority: 60,
          },
          {
            id: 'FRC-100-007',
            type: 'papers',
            title: 'Current primary source',
            content: 'Operational definition of the Lambda field',
            url: '/en/papers/FRC-100-007',
            epistemicStatus: 'primary',
            retrievalPriority: 100,
          },
        ],
      }),
    }));

    render(<OracleChat lang="en" />);
    fireEvent.change(screen.getByPlaceholderText('Paper code, formula, result, or topic'), {
      target: { value: 'Lambda field' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
        '/en/papers/FRC-100-007',
        '/en/articles/commentary-result',
      ]);
    });
    expect(screen.getByText('Primary')).toHaveAttribute('data-epistemic-status', 'primary');
    expect(screen.getByText('Commentary')).toHaveAttribute('data-epistemic-status', 'commentary');
    expect(screen.getByText('Paper')).toBeInTheDocument();
    expect(screen.getByText('Article')).toBeInTheDocument();
  });
});
