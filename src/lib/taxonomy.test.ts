import { describe, expect, it } from 'vitest';
import { getContentsByTag, getTaxonomyRouteSlugs } from '@/lib/content';
import { canonicalizeTaxon, deriveSeriesTaxon, getTaxonomyHref, getTaxonomyLabel } from '@/lib/taxonomy';

describe('Corpus taxonomy', () => {
  it('canonicalizes series aliases and case variants', () => {
    expect(canonicalizeTaxon('FRC-100')).toBe('frc-100');
    expect(canonicalizeTaxon('100 series')).toBe('frc-100');
    expect(canonicalizeTaxon('FRC 566')).toBe('frc-566');
    expect(canonicalizeTaxon('AI')).toBe('ai');
    expect(canonicalizeTaxon('UCC')).toBe('ucc');
    expect(canonicalizeTaxon('Coherencia')).toBe('coherence');
    expect(canonicalizeTaxon('همدوسی')).toBe('coherence');
  });

  it('derives series facets from paper identifiers instead of content wording', () => {
    expect(deriveSeriesTaxon('FRC-100-002')).toBe('frc-100');
    expect(deriveSeriesTaxon('FRC-566-030')).toBe('frc-566');
    expect(deriveSeriesTaxon('FRC-700-777')).toBe('frc-700');
    expect(deriveSeriesTaxon('FRC-841-004')).toBe('frc-800');
    expect(deriveSeriesTaxon('FRC-16D-001')).toBeUndefined();
  });

  it('provides stable localized labels and canonical URLs', () => {
    expect(getTaxonomyLabel('frc-100', 'en')).toBe('FRC 100 series');
    expect(getTaxonomyLabel('frc-566', 'fr')).toBe('Série FRC 566');
    expect(getTaxonomyHref('/en', 'FRC-100')).toBe('/en/tags/frc-100');
  });

  it('keeps living primary papers ahead of archived commentary in a series route', () => {
    const results = getContentsByTag('en', 'frc-100');
    expect(results.some((item) => item.content.frontmatter.id === 'FRC-100-002')).toBe(true);
    expect(results[0]?.epistemicStatus).toBe('primary');
  });

  it('includes canonical and legacy alias paths in static route generation', () => {
    const routes = getTaxonomyRouteSlugs('en');
    expect(routes).toContain('frc-100');
    expect(routes).toContain('FRC-100');
  });
});
