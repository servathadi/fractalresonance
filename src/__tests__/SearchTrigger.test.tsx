import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchTrigger } from '../components/SearchTrigger';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';

describe('SearchTrigger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessibility attributes in English', () => {
    (usePathname as any).mockReturnValue('/en');
    render(<SearchTrigger />);

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();

    // Check for aria-label or name accessible name
    expect(button).toHaveAttribute('aria-label', 'Search (Cmd+K)');

    // Check for aria-keyshortcuts
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Meta+K');

    // Check for title
    expect(button).toHaveAttribute('title', 'Search (Cmd+K)');
  });

  it('renders with accessibility attributes in Farsi', () => {
    (usePathname as any).mockReturnValue('/fa');
    render(<SearchTrigger />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // "جستجو" is "Search" in Farsi as per DICT
    expect(button).toHaveAttribute('aria-label', 'جستجو (Cmd+K)');
    expect(button).toHaveAttribute('title', 'جستجو (Cmd+K)');
  });
});
