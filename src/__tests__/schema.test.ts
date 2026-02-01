import { describe, it, expect } from 'vitest';
import {
  schemaWebSite,
  schemaScholarlyArticle,
  schemaBreadcrumbList,
  schemaBook,
  schemaBlogPosting,
  schemaProfilePage,
  schemaCollectionPage,
  schemaFAQPage,
  type PaperMeta,
  type BookMeta,
  type BlogPostMeta,
  type ProfileMeta,
  type ListItemMeta,
  type FAQItem,
} from '@/lib/schema';

describe('Schema.org generators', () => {
  describe('schemaWebSite', () => {
    it('should generate valid WebSite schema', () => {
      const schema = schemaWebSite();
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Fractal Resonance Cognition');
      expect(schema.url).toBe('https://fractalresonance.com');
      expect(schema.potentialAction).toBeDefined();
      expect(schema.potentialAction['@type']).toBe('SearchAction');
    });
  });

  describe('schemaScholarlyArticle', () => {
    it('should generate valid ScholarlyArticle schema', () => {
      const paper: PaperMeta = {
        id: 'FRC-100-001',
        title: 'Test Paper',
        series: 'FRC 100',
        author: 'Test Author',
        date: '2025-01-01',
        abstract: 'Test abstract',
        tags: ['test', 'paper'],
        lang: 'en',
      };
      
      const schema = schemaScholarlyArticle(paper);
      
      expect(schema['@type']).toBe('ScholarlyArticle');
      expect(schema.headline).toBe('Test Paper');
      expect(schema.description).toBe('Test abstract');
      expect(schema.datePublished).toBe('2025-01-01');
      expect(schema.keywords).toEqual(['test', 'paper']);
    });

    it('should include video if provided', () => {
      const paper: PaperMeta = {
        id: 'FRC-100-001',
        title: 'Test Paper',
        series: 'FRC 100',
        author: 'Test Author',
        date: '2025-01-01',
        abstract: 'Test abstract',
        tags: [],
        lang: 'en',
        video: {
          url: 'https://youtube.com/watch?v=test',
          thumbnailUrl: 'https://example.com/thumb.jpg',
        },
      };
      
      const schema = schemaScholarlyArticle(paper);
      
      expect(schema.video).toBeDefined();
      expect(schema.video['@type']).toBe('VideoObject');
    });
  });

  describe('schemaBreadcrumbList', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const items = [
        { name: 'Home', url: '/' },
        { name: 'Papers', url: '/papers' },
        { name: 'Test Paper', url: '/papers/test' },
      ];
      
      const schema = schemaBreadcrumbList(items);
      
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[2].position).toBe(3);
    });
  });

  describe('schemaBook', () => {
    it('should generate valid Book schema', () => {
      const book: BookMeta = {
        id: 'test-book',
        title: 'Test Book',
        description: 'A test book',
        author: 'Test Author',
        lang: 'en',
      };
      
      const schema = schemaBook(book);
      
      expect(schema['@type']).toBe('Book');
      expect(schema.name).toBe('Test Book');
      expect(schema.description).toBe('A test book');
      expect(schema.inLanguage).toBe('en');
    });

    it('should include chapters if provided', () => {
      const book: BookMeta = {
        id: 'test-book',
        title: 'Test Book',
        description: 'A test book',
        author: 'Test Author',
        lang: 'en',
        chapters: [
          { id: 'ch1', title: 'Chapter 1', position: 1, bookId: 'test-book', lang: 'en' },
          { id: 'ch2', title: 'Chapter 2', position: 2, bookId: 'test-book', lang: 'en' },
        ],
      };
      
      const schema = schemaBook(book);
      
      expect(schema.hasPart).toHaveLength(2);
      expect(schema.hasPart[0]['@type']).toBe('Chapter');
    });
  });

  describe('schemaBlogPosting', () => {
    it('should generate valid BlogPosting schema', () => {
      const post: BlogPostMeta = {
        id: 'test-post',
        title: 'Test Blog Post',
        description: 'A test blog post',
        date: '2025-01-01',
        tags: ['blog', 'test'],
        lang: 'en',
      };
      
      const schema = schemaBlogPosting(post);
      
      expect(schema['@type']).toBe('BlogPosting');
      expect(schema.headline).toBe('Test Blog Post');
      expect(schema.datePublished).toBe('2025-01-01');
    });
  });

  describe('schemaProfilePage', () => {
    it('should generate valid ProfilePage schema', () => {
      const profile: ProfileMeta = {
        id: 'test-person',
        name: 'Test Person',
        role: 'Researcher',
        description: 'A test person',
        lang: 'en',
      };
      
      const schema = schemaProfilePage(profile);
      
      expect(schema['@type']).toBe('ProfilePage');
      expect(schema.mainEntity['@type']).toBe('Person');
      expect(schema.mainEntity.name).toBe('Test Person');
    });
  });

  describe('schemaCollectionPage', () => {
    it('should generate valid CollectionPage schema', () => {
      const items: ListItemMeta[] = [
        { name: 'Item 1', url: '/item-1' },
        { name: 'Item 2', url: '/item-2' },
      ];
      
      const schema = schemaCollectionPage(
        'Test Collection',
        'A test collection',
        'https://example.com/collection',
        items,
        'en'
      );
      
      expect(schema['@type']).toBe('CollectionPage');
      expect(schema.name).toBe('Test Collection');
      expect(schema.mainEntity['@type']).toBe('ItemList');
      expect(schema.mainEntity.numberOfItems).toBe(2);
    });
  });

  describe('schemaFAQPage', () => {
    it('should generate valid FAQPage schema', () => {
      const items: FAQItem[] = [
        { question: 'Question 1?', answer: 'Answer 1' },
        { question: 'Question 2?', answer: 'Answer 2' },
      ];
      
      const schema = schemaFAQPage(items, 'https://example.com/faq', 'FAQ');
      
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });
  });
});
