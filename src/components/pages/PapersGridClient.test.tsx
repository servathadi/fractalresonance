import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PapersGridClient, type PapersGridItem } from './PapersGridClient';

const item = (
  id: string,
  title: string,
  canonStatus: PapersGridItem['canonStatus'],
): PapersGridItem => ({
  id,
  title,
  canonStatus,
  href: `/en/papers/${id}`,
  tags: [],
  series: id.startsWith('FRC-100') ? '100' : '800',
});

describe('PapersGridClient', () => {
  it('defaults to current research and exposes a shareable full-library route', () => {
    render(
      <PapersGridClient
        items={[
          item('FRC-821-100', 'Development history', 'archive'),
          item('FRC-840-101', 'Open boundary', 'frontier'),
          item('FRC-100-002', 'Current foundation', 'living-core'),
        ]}
      />,
    );

    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Living core1',
      'Frontier1',
    ]);

    expect(screen.getByRole('link', { name: 'Full library' })).toHaveAttribute('href', '/en/papers?scope=all');
  });
});
