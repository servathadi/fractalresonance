import type { PrimarySourceRef } from '@/lib/content';

const HEADINGS: Record<string, { title: string; subtitle: string }> = {
  en: {
    title: 'Primary sources',
    subtitle: 'External literature and canonical corpus records referenced by this field note.',
  },
  es: {
    title: 'Fuentes principales',
    subtitle: 'Literatura externa y registros del corpus referenciados por esta nota de campo.',
  },
  fr: {
    title: 'Sources principales',
    subtitle: 'Littérature externe et références du corpus citées dans cette note de terrain.',
  },
  fa: {
    title: 'منابع اصلی',
    subtitle: 'ادبیات پژوهشی بیرونی و رکوردهای پیکره که در این یادداشت به آن‌ها استناد شده است.',
  },
};

const ASCII_CONTROL_RX = /[\u0000-\u001f\u007f]/;

function resolveSafeHref(source: PrimarySourceRef): string | null {
  if (source.url) {
    // Reject any ASCII control characters (e.g. \t, \n, \r) before validating path/protocol.
    if (ASCII_CONTROL_RX.test(source.url)) return null;
    const trimmed = source.url.trim();
    // Allow explicit http(s) URLs or strict root-relative paths (rejecting protocol-relative `//` and `/\`).
    if (/^https?:\/\//i.test(trimmed) || /^\/(?![/\\])/.test(trimmed)) {
      return trimmed;
    }
  }
  if (source.doi) {
    if (ASCII_CONTROL_RX.test(source.doi)) return null;
    const cleanDoi = source.doi.replace(/^https?:\/\/doi\.org\//i, '').replace(/^doi:/i, '').trim();
    if (cleanDoi && !/\s/.test(cleanDoi)) return `https://doi.org/${cleanDoi}`;
  }
  if (source.arxiv) {
    if (ASCII_CONTROL_RX.test(source.arxiv)) return null;
    const cleanArxiv = source.arxiv.replace(/^arxiv:/i, '').trim();
    if (cleanArxiv && !/\s/.test(cleanArxiv)) return `https://arxiv.org/abs/${cleanArxiv}`;
  }
  return null;
}

export function PrimarySourcesBlock({
  sources,
  lang = 'en',
}: {
  sources: PrimarySourceRef[];
  lang?: string;
}) {
  if (!sources || sources.length === 0) return null;
  const copy = HEADINGS[lang] || HEADINGS.en;

  return (
    <section
      aria-labelledby="primary-sources-heading"
      data-primary-sources="true"
      className="mt-12 pt-8 border-t border-frc-blue"
    >
      <h2 id="primary-sources-heading" className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-1.5">
        {copy.title}
      </h2>
      <p className="text-sm text-frc-steel mb-6">{copy.subtitle}</p>

      <ol className="divide-y divide-frc-blue/60 border-y border-frc-blue">
        {sources.map((source, idx) => {
          const href = resolveSafeHref(source);
          const isExternal = Boolean(href && /^https?:\/\//i.test(href));
          const cleanDoi = source.doi?.replace(/^https?:\/\/doi\.org\//i, '').replace(/^doi:/i, '').trim();
          const cleanArxiv = source.arxiv?.replace(/^arxiv:/i, '').trim();

          return (
            <li key={`${source.title}-${idx}`} className="py-4 flex items-start gap-4">
              <span className="font-mono text-sm text-frc-gold tabular-nums shrink-0 w-6">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-base text-frc-text leading-snug">
                  {href ? (
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="hover:text-frc-gold transition-colors underline decoration-frc-blue underline-offset-4 hover:decoration-frc-gold"
                    >
                      {source.title}
                    </a>
                  ) : (
                    <span>{source.title}</span>
                  )}
                </div>

                {(source.authors || source.venue || source.year) && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-frc-text-dim mt-1">
                    {source.authors && <span>{source.authors}</span>}
                    {source.authors && (source.venue || source.year) && <span aria-hidden="true">·</span>}
                    {source.venue && <span>{source.venue}</span>}
                    {source.venue && source.year && <span aria-hidden="true">·</span>}
                    {source.year && <span className="font-mono text-[0.8125rem] tabular-nums">{source.year}</span>}
                  </div>
                )}

                {source.note && (
                  <p className="text-sm text-frc-steel leading-relaxed mt-1.5 max-w-[65ch]">
                    {source.note}
                  </p>
                )}

                {(cleanDoi || cleanArxiv) && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-mono text-[0.8125rem]">
                    {cleanDoi && (
                      <a
                        href={`https://doi.org/${cleanDoi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frc-gold hover:underline"
                      >
                        DOI:{cleanDoi}
                      </a>
                    )}
                    {cleanArxiv && (
                      <a
                        href={`https://arxiv.org/abs/${cleanArxiv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-frc-steel hover:text-frc-gold hover:underline"
                      >
                        arXiv:{cleanArxiv}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
