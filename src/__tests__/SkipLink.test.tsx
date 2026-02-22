import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SkipLink } from '@/components/SkipLink';
import { usePathname } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock dictionaries to avoid dependency on real file
vi.mock('@/lib/dictionaries', () => ({
  getDictionary: vi.fn((lang: string) => {
    if (lang === 'fa') return { accessibility: { skipToContent: 'پرش به محتوا' } };
    if (lang === 'es') return { accessibility: { skipToContent: 'Saltar al contenido' } };
    return { accessibility: { skipToContent: 'Skip to content' } };
  }),
}));

// Mock site utils
vi.mock('@/lib/site', () => ({
  getLangFromPathname: (pathname: string) => {
    const parts = pathname.split('/');
    return parts[1] || 'en';
  },
}));

describe('SkipLink', () => {
  const mockUsePathname = usePathname as any;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders "Skip to content" for English path', () => {
    mockUsePathname.mockReturnValue('/en/some-page');
    render(<SkipLink />);

    const link = screen.getByRole('link');
    expect(link).toBeDefined();
    expect(link.textContent).toBe('Skip to content');
    expect(link.getAttribute('href')).toBe('#main-content');
    // We check if it is initially hidden (translate-y-[-150%]) but visible on focus (focus:translate-y-0)
    // Testing CSS classes is enough here
    expect(link.className).toContain('-translate-y-[150%]');
    expect(link.className).toContain('focus:translate-y-0');
  });

  it('renders "پرش به محتوا" for Farsi path', () => {
    mockUsePathname.mockReturnValue('/fa/some-page');
    render(<SkipLink />);

    const link = screen.getByRole('link');
    expect(link.textContent).toBe('پرش به محتوا');
    expect(link.className).toContain('right-4');
  });

  it('renders "Saltar al contenido" for Spanish path', () => {
    mockUsePathname.mockReturnValue('/es/some-page');
    render(<SkipLink />);

    const link = screen.getByRole('link');
    expect(link.textContent).toBe('Saltar al contenido');
    expect(link.className).toContain('left-4');
  });
});
