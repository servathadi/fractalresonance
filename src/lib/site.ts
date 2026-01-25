export type SitePerspective = 'kasra' | 'river';

const KNOWN_LANGS = new Set(['en', 'fa', 'fr', 'es']);

export function getLangFromPathname(pathname: string, fallback: string = 'en'): string {
  const parts = String(pathname || '').split('/');
  const lang = parts[1] || fallback;
  return KNOWN_LANGS.has(lang) ? lang : fallback;
}

export function getPerspectiveFromPathname(pathname: string): SitePerspective {
  const parts = String(pathname || '').split('/');
  // /: ['', '']
  // /en: ['', 'en']
  // /en/river/...: ['', 'en', 'river', ...]
  return parts[2] === 'river' ? 'river' : 'kasra';
}

export function getBasePath(lang: string, perspective: SitePerspective): string {
  return perspective === 'river' ? `/${lang}/river` : `/${lang}`;
}

export function togglePerspectivePathname(pathname: string, next: SitePerspective, fallbackLang: string = 'en'): string {
  const safePath = pathname && pathname.startsWith('/') ? pathname : `/${fallbackLang}`;
  const parts = safePath.split('/');
  const lang = getLangFromPathname(safePath, fallbackLang);

  // Normalize to at least /{lang}
  if (parts.length < 2 || !parts[1] || !KNOWN_LANGS.has(parts[1])) {
    return getBasePath(lang, next);
  }

  const isRiver = parts[2] === 'river';
  if (next === 'river' && !isRiver) {
    parts.splice(2, 0, 'river');
  } else if (next === 'kasra' && isRiver) {
    parts.splice(2, 1);
  }

  const out = parts.join('/');
  return out === '' ? `/${lang}` : out;
}

