/**
 * Metadata utilities for consistent Open Graph and Twitter Card generation
 */

import type { Metadata } from 'next';

const SITE_URL = 'https://fractalresonance.com';
const SITE_NAME = 'Fractal Resonance Coherence';
const OG_IMAGE_WIDTH = 1024;
const OG_IMAGE_HEIGHT = 572;

export interface BaseMetaInput {
  title: string;
  description: string;
  url: string;
  lang: string;
  image?: string;
  noindex?: boolean;
}

export interface ArticleMetaInput extends BaseMetaInput {
  type: 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  section?: string;
}

export interface BookMetaInput extends BaseMetaInput {
  type: 'book';
  author?: string;
  isbn?: string;
  releaseDate?: string;
  tags?: string[];
}

export interface ProfileMetaInput extends BaseMetaInput {
  type: 'profile';
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface WebsiteMetaInput extends BaseMetaInput {
  type: 'website';
}

export type MetaInput = ArticleMetaInput | BookMetaInput | ProfileMetaInput | WebsiteMetaInput;

/**
 * Generates complete metadata for a page including OG and Twitter cards
 */
export function generatePageMetadata(
  input: MetaInput,
  alternates?: Record<string, string>
): Metadata {
  const { title, description, url, lang, image, noindex } = input;
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const fullImageUrl = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
    : undefined;

  const base: Metadata = {
    title,
    description,
    alternates: {
      canonical: fullUrl,
      ...(alternates && { languages: alternates }),
    },
    ...(noindex && { robots: { index: false, follow: true } }),
    twitter: {
      card: fullImageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(fullImageUrl && { images: [fullImageUrl] }),
      site: '@fractalresonance',
    },
  };

  switch (input.type) {
    case 'article':
      return {
        ...base,
        authors: input.author ? [{ name: input.author }] : undefined,
        keywords: input.tags,
        openGraph: {
          type: 'article',
          title,
          description,
          url: fullUrl,
          siteName: SITE_NAME,
          locale: lang === 'fa' ? 'fa_IR' : lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : 'en_US',
          ...(fullImageUrl && { images: [{
            url: fullImageUrl,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: title,
          }] }),
          publishedTime: input.publishedTime,
          modifiedTime: input.modifiedTime,
          authors: input.author ? [input.author] : undefined,
          tags: input.tags,
          section: input.section,
        },
      };

    case 'book':
      return {
        ...base,
        authors: input.author ? [{ name: input.author }] : undefined,
        keywords: input.tags,
        openGraph: {
          type: 'book',
          title,
          description,
          url: fullUrl,
          siteName: SITE_NAME,
          locale: lang === 'fa' ? 'fa_IR' : lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : 'en_US',
          ...(fullImageUrl && { images: [{
            url: fullImageUrl,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: title,
          }] }),
          authors: input.author ? [input.author] : undefined,
          isbn: input.isbn,
          releaseDate: input.releaseDate,
          tags: input.tags,
        },
      };

    case 'profile':
      return {
        ...base,
        openGraph: {
          type: 'profile',
          title,
          description,
          url: fullUrl,
          siteName: SITE_NAME,
          locale: lang === 'fa' ? 'fa_IR' : lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : 'en_US',
          ...(fullImageUrl && { images: [{
            url: fullImageUrl,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: title,
          }] }),
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.username,
        },
      };

    case 'website':
    default:
      return {
        ...base,
        openGraph: {
          type: 'website',
          title,
          description,
          url: fullUrl,
          siteName: SITE_NAME,
          locale: lang === 'fa' ? 'fa_IR' : lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : 'en_US',
          ...(fullImageUrl && { images: [{
            url: fullImageUrl,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: title,
          }] }),
        },
      };
  }
}

/**
 * Generates citation and Dublin Core metadata for academic content
 */
export function generateCitationMetadata(params: {
  title: string;
  author: string;
  date?: string;
  doi?: string;
  id?: string;
  lang: string;
  url: string;
}): Record<string, string> {
  const { title, author, date, doi, id, lang, url } = params;

  return {
    // Google Scholar meta tags
    'citation_title': title,
    'citation_author': author,
    ...(date && { 'citation_publication_date': date }),
    'citation_journal_title': 'Fractal Resonance Coherence',
    ...(doi && { 'citation_doi': doi }),
    'citation_abstract_html_url': url,
    'citation_language': lang,
    ...(id && { 'citation_technical_report_number': id }),
    // Dublin Core for additional discoverability
    'DC.title': title,
    'DC.creator': author,
    ...(date && { 'DC.date': date }),
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.language': lang,
    ...(doi && { 'DC.identifier': `doi:${doi}` }),
  };
}
