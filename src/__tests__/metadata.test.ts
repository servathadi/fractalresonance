import { describe, it, expect } from 'vitest';
import { generatePageMetadata, generateCitationMetadata } from '@/lib/metadata';

describe('Metadata utilities', () => {
  describe('generatePageMetadata', () => {
    it('should generate article metadata with OG and Twitter cards', () => {
      const result = generatePageMetadata({
        type: 'article',
        title: 'Test Article',
        description: 'A test article description',
        url: '/en/papers/test-001',
        lang: 'en',
        publishedTime: '2025-01-01',
        author: 'H. Servat',
        tags: ['test', 'article'],
        section: 'Research Papers',
      });

      expect(result.title).toBe('Test Article');
      expect(result.description).toBe('A test article description');
      expect((result.openGraph as { type?: string } | undefined)?.type).toBe('article');
      expect((result.twitter as { card?: string } | undefined)?.card).toBe('summary');
      expect(result.twitter?.images).toBeUndefined();
    });

    it('should generate book metadata', () => {
      const result = generatePageMetadata({
        type: 'book',
        title: 'Test Book',
        description: 'A test book description',
        url: '/en/books/test-book',
        lang: 'en',
        author: 'H. Servat',
      });

      expect((result.openGraph as { type?: string } | undefined)?.type).toBe('book');
    });

    it('should generate profile metadata', () => {
      const result = generatePageMetadata({
        type: 'profile',
        title: 'Test Person',
        description: 'A test person description',
        url: '/en/people/test-person',
        lang: 'en',
        firstName: 'Test',
        lastName: 'Person',
      });

      expect((result.openGraph as { type?: string } | undefined)?.type).toBe('profile');
    });

    it('should use correct locale for different languages', () => {
      const resultEn = generatePageMetadata({
        type: 'website',
        title: 'Test',
        description: 'Test',
        url: '/en',
        lang: 'en',
      });
      expect(resultEn.openGraph?.locale).toBe('en_US');

      const resultFa = generatePageMetadata({
        type: 'website',
        title: 'Test',
        description: 'Test',
        url: '/fa',
        lang: 'fa',
      });
      expect(resultFa.openGraph?.locale).toBe('fa_IR');

      const resultEs = generatePageMetadata({
        type: 'website',
        title: 'Test',
        description: 'Test',
        url: '/es',
        lang: 'es',
      });
      expect(resultEs.openGraph?.locale).toBe('es_ES');
    });

    it('should handle noindex flag', () => {
      const result = generatePageMetadata({
        type: 'article',
        title: 'Test',
        description: 'Test',
        url: '/en/test',
        lang: 'en',
        noindex: true,
      });

      expect(result.robots).toEqual({ index: false, follow: true });
    });

    it('should include alternates when provided', () => {
      const alternates = { 'en': '/en/test', 'es': '/es/test' };
      const result = generatePageMetadata({
        type: 'article',
        title: 'Test',
        description: 'Test',
        url: '/en/test',
        lang: 'en',
      }, alternates);

      expect(result.alternates?.languages).toEqual(alternates);
    });
  });

  describe('generateCitationMetadata', () => {
    it('should generate citation and Dublin Core metadata', () => {
      const result = generateCitationMetadata({
        title: 'Test Paper',
        author: 'H. Servat',
        date: '2025-01-01',
        doi: '10.1234/test',
        id: 'FRC-100-001',
        lang: 'en',
        url: 'https://fractalresonance.com/en/papers/FRC-100-001',
      });

      expect(result['citation_title']).toBe('Test Paper');
      expect(result['citation_author']).toBe('H. Servat');
      expect(result['citation_publication_date']).toBe('2025-01-01');
      expect(result['citation_doi']).toBe('10.1234/test');
      expect(result['DC.title']).toBe('Test Paper');
      expect(result['DC.creator']).toBe('H. Servat');
    });

    it('should handle optional fields', () => {
      const result = generateCitationMetadata({
        title: 'Test Paper',
        author: 'H. Servat',
        lang: 'en',
        url: 'https://fractalresonance.com/en/papers/test',
      });

      expect(result['citation_title']).toBe('Test Paper');
      expect(result['citation_publication_date']).toBeUndefined();
      expect(result['citation_doi']).toBeUndefined();
    });
  });
});
