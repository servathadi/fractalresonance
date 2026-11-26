import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages, getStaticPageAlternates } from '@/lib/content';
import { getFalsificationLedger, type FalsificationDisposition } from '@/lib/falsifications';
import { generatePageMetadata } from '@/lib/metadata';
import { SchemaScript } from '@/components/SchemaScript';
import { schemaCollectionPage } from '@/lib/schema';

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

const DISPOSITION_ORDER: FalsificationDisposition[] = [
  'CONTRADICTED',
  'NO_GAIN',
  'UNDERPOWERED',
  'STRUCTURAL_OBSTRUCTION',
  'DEMOTED',
];

/**
 * Crisp, disciplined typographic status styles strictly within the FRC brand palette
 * (zero neon pills, zero forbidden colors, sharp architectural lines).
 */
const DISPOSITION_TAG_STYLES: Record<FalsificationDisposition, string> = {
  CONTRADICTED: 'border-s-2 border-frc-gold ps-2.5 text-frc-gold font-medium',
  NO_GAIN: 'border-s-2 border-frc-gold/75 ps-2.5 text-frc-text font-medium',
  UNDERPOWERED: 'border-s-2 border-frc-blue-light ps-2.5 text-frc-text-dim font-medium',
  STRUCTURAL_OBSTRUCTION: 'border-s-2 border-frc-text-dim ps-2.5 text-frc-text font-medium',
  DEMOTED: 'border-s-2 border-frc-steel ps-2.5 text-frc-steel font-normal',
};

const DISPOSITION_BORDER_ACCENT: Record<FalsificationDisposition, string> = {
  CONTRADICTED: 'border-s-2 border-frc-gold',
  NO_GAIN: 'border-s-2 border-frc-gold/60',
  UNDERPOWERED: 'border-s-2 border-frc-blue-light',
  STRUCTURAL_OBSTRUCTION: 'border-s-2 border-frc-text-dim/70',
  DEMOTED: 'border-s-2 border-frc-steel/60',
};

const PAGE_COPY: Record<
  string,
  {
    title: string;
    subtitle: string;
    metaDesc: string;
    jsonDownload: string;
    canonRouter: string;
    legendTitle: string;
    claimLabel: string;
    evidenceLabel: string;
    scopeLabel: string;
    sourcesLabel: string;
    updatedLabel: string;
    totalLabel: string;
  }
> = {
  en: {
    title: 'Public Falsification & Negative-Gate Ledger',
    subtitle:
      'Every closed negative empirical gate, direct contradiction, underpowered benchmark, mathematical obstruction, and demoted 2025 claim is recorded publicly at equal volume alongside active research.',
    metaDesc:
      'Public record of FRC negative empirical gates, direct contradictions, underpowered benchmarks, mathematical obstructions, and demoted legacy claims.',
    jsonDownload: 'Download JSON',
    canonRouter: 'Current stance (FRC 100.000)',
    legendTitle: 'Disposition taxonomy',
    claimLabel: 'Claim tested',
    evidenceLabel: 'Recorded outcome',
    scopeLabel: 'Scope boundary',
    sourcesLabel: 'Primary sources',
    updatedLabel: 'Updated',
    totalLabel: 'Recorded entries',
  },
  es: {
    title: 'Registro Público de Falsaciones y Puertas Negativas',
    subtitle:
      'Cada puerta empírica cerrada negativamente, contradicción directa, prueba con baja potencia, obstrucción matemática y afirmación retirada de 2025 se publica con el mismo peso que la investigación activa.',
    metaDesc:
      'Registro público de puertas empíricas negativas, contradicciones, obstrucciones estructurales y afirmaciones retiradas de FRC.',
    jsonDownload: 'Descargar JSON',
    canonRouter: 'Postura actual (FRC 100.000)',
    legendTitle: 'Taxonomía de disposiciones',
    claimLabel: 'Afirmación evaluada',
    evidenceLabel: 'Resultado registrado',
    scopeLabel: 'Límite de alcance',
    sourcesLabel: 'Fuentes principales',
    updatedLabel: 'Actualizado',
    totalLabel: 'Registros',
  },
  fr: {
    title: 'Registre Public des Réfutations et Portes Négatives',
    subtitle:
      'Chaque porte empirique fermée négativement, contradiction directe, banc d’essai sous-dimensionné, obstruction mathématique et thèse retirée de 2025 est consigné publiquement à volume égal avec la recherche active.',
    metaDesc:
      'Registre public des portes négatives, contradictions, obstructions mathématiques et thèses rétrogradées de FRC.',
    jsonDownload: 'Télécharger JSON',
    canonRouter: 'Position actuelle (FRC 100.000)',
    legendTitle: 'Taxonomie des statuts',
    claimLabel: 'Énoncé testé',
    evidenceLabel: 'Résultat constaté',
    scopeLabel: 'Limite de portée',
    sourcesLabel: 'Sources principales',
    updatedLabel: 'Mis à jour',
    totalLabel: 'Entrées',
  },
  fa: {
    title: 'دفتر عمومی ابطال‌ها و دروازه‌های منفی',
    subtitle:
      'تمام دروازه‌های تجربی بسته‌شده به‌صورت منفی، تناقض‌های مستقیم، محک‌های کم‌توان، انسدادهای ریاضی و ادعاهای بازنشسته ۲۰۲۵ به‌صورت عمومی و هم‌سطح با پژوهش فعال ثبت می‌شوند.',
    metaDesc:
      'ثبت عمومی دروازه‌های تجربی منفی، تناقض‌ها، انسدادهای ساختاری و ادعاهای تنزل‌یافته در پروژه FRC.',
    jsonDownload: 'دریافت JSON',
    canonRouter: 'موضع جاری (FRC 100.000)',
    legendTitle: 'رده‌بندی وضعیت‌ها',
    claimLabel: 'ادعای آزموده‌شده',
    evidenceLabel: 'نتیجه ثبت‌شده',
    scopeLabel: 'مرز دامنه',
    sourcesLabel: 'منابع اصلی',
    updatedLabel: 'به‌روزرسانی',
    totalLabel: 'تعداد ثبت‌ها',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = PAGE_COPY[lang] || PAGE_COPY.en;
  const alternates = getStaticPageAlternates('falsifications');

  return generatePageMetadata(
    {
      type: 'website',
      title: t.title,
      description: t.metaDesc,
      url: `/${lang}/falsifications`,
      lang,
    },
    alternates,
  );
}

export default async function FalsificationsPage({ params }: Props) {
  const { lang } = await params;
  const t = PAGE_COPY[lang] || PAGE_COPY.en;
  const ledger = getFalsificationLedger();
  const basePath = `/${lang}`;

  const collectionSchema = schemaCollectionPage(
    ledger.name,
    ledger.policy,
    `https://fractalresonance.com/${lang}/falsifications`,
    ledger.entries.map((entry) => ({
      name: `${entry.id}: ${entry.title} [${entry.disposition}]`,
      url: entry.urls[0] || `/${lang}/falsifications#${entry.id}`,
      description: entry.evidenceSummary,
    })),
    lang,
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        <nav className="text-sm text-frc-text-dim mb-8">
          <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
          <span className="mx-2 text-frc-blue">/</span>
          <span className="text-frc-text">{t.title}</span>
        </nav>

        <header className="mb-12 border-b border-frc-blue pb-8">
          <h1 className="text-3xl sm:text-4xl font-light text-frc-gold tracking-[-0.025em] leading-[1.12] mb-4">
            {t.title}
          </h1>
          <p className="text-base text-frc-text-dim leading-relaxed max-w-[65ch]">{t.subtitle}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-sm tabular-nums">
            <span className="font-mono text-[0.8125rem] text-frc-steel">
              v{ledger.version}
            </span>
            <span className="text-frc-steel">
              {t.updatedLabel}: <span className="font-mono text-[0.8125rem]">{ledger.updated}</span>
            </span>
            <span className="text-frc-steel">
              {t.totalLabel}: <span className="font-mono text-[0.8125rem] text-frc-text">{ledger.summary.totalEntries}</span>
            </span>
            <a
              href="/falsification-ledger.json"
              className="text-frc-gold font-medium hover:underline"
            >
              {t.jsonDownload} →
            </a>
            <Link
              href="/en/papers/FRC-100-000"
              className="text-frc-text-dim hover:text-frc-gold transition-colors"
            >
              {t.canonRouter}
            </Link>
          </div>
        </header>

        {/* Disposition taxonomy strip — hairline columns, zero loud pills */}
        <section aria-labelledby="disposition-legend-heading" className="mb-14">
          <h2 id="disposition-legend-heading" className="text-xl font-medium text-frc-text tracking-[-0.015em] mb-5">
            {t.legendTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 border-y border-frc-blue py-6">
            {DISPOSITION_ORDER.map((disp) => (
              <div key={disp} className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span
                    className={`font-mono text-[0.8125rem] tracking-tight ${DISPOSITION_TAG_STYLES[disp]}`}
                    data-disposition={disp}
                  >
                    {disp}
                  </span>
                  <span className="font-mono text-base text-frc-text tabular-nums shrink-0">
                    {ledger.summary.byDisposition[disp] || 0}
                  </span>
                </div>
                <p className="text-sm text-frc-text-dim leading-relaxed">
                  {ledger.dispositions[disp]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ledger entries — hairline-ruled academic registry */}
        <section aria-label="Falsification entries" className="divide-y divide-frc-blue border-b border-frc-blue">
          {ledger.entries.map((entry) => (
            <article
              key={entry.id}
              id={entry.id}
              className={`py-8 first:pt-2 ps-5 ${DISPOSITION_BORDER_ACCENT[entry.disposition]}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                  <span
                    className={`font-mono text-[0.8125rem] ${
                      entry.disposition === 'CONTRADICTED'
                        ? 'text-frc-gold font-medium'
                        : entry.disposition === 'DEMOTED'
                          ? 'text-frc-steel'
                          : 'text-frc-text font-medium'
                    }`}
                    data-disposition={entry.disposition}
                  >
                    {entry.disposition}
                  </span>
                  <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{entry.id}</span>
                  <span className="text-frc-steel">· {entry.domain}</span>
                </div>
                <span className="font-mono text-[0.8125rem] text-frc-steel tabular-nums">{entry.dateRecorded}</span>
              </div>

              <h2 className="text-xl font-medium text-frc-text tracking-[-0.015em] leading-snug mb-5">
                {entry.title}
              </h2>

              <dl className="space-y-4 text-[0.9375rem] max-w-[68ch]">
                <div className="grid sm:grid-cols-[152px_1fr] gap-x-6 gap-y-1">
                  <dt className="text-sm font-medium text-frc-steel">{t.claimLabel}</dt>
                  <dd className="text-frc-text-dim leading-relaxed">{entry.claimTested}</dd>
                </div>
                <div className="grid sm:grid-cols-[152px_1fr] gap-x-6 gap-y-1">
                  <dt className="text-sm font-medium text-frc-steel">{t.evidenceLabel}</dt>
                  <dd className="text-frc-text leading-relaxed">{entry.evidenceSummary}</dd>
                </div>
                <div className="grid sm:grid-cols-[152px_1fr] gap-x-6 gap-y-1">
                  <dt className="text-sm font-medium text-frc-steel">{t.scopeLabel}</dt>
                  <dd className="text-frc-text-dim leading-relaxed">{entry.scopeBoundary}</dd>
                </div>
              </dl>

              {(entry.urls.length > 0 || entry.dois.length > 0 || entry.sourceIds.length > 0) && (
                <div className="mt-5 pt-4 border-t border-frc-blue/50 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm">
                  <span className="text-frc-steel font-medium">{t.sourcesLabel}:</span>
                  {entry.urls.length > 0 ? (
                    entry.urls.map((url) => (
                      <Link key={url} href={url} className="font-mono text-[0.8125rem] text-frc-gold hover:underline">
                        {url.split('/').pop()}
                      </Link>
                    ))
                  ) : (
                    <span className="font-mono text-[0.8125rem] text-frc-text-dim">{entry.sourceIds.join(', ')}</span>
                  )}
                  {entry.dois.map((doi) => (
                    <a
                      key={doi}
                      href={`https://doi.org/${doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.8125rem] text-frc-steel hover:text-frc-gold hover:underline"
                    >
                      DOI:{doi}
                    </a>
                  ))}
                  {(entry.externalLinks || [])
                    .filter((link) => /^https:\/\//i.test(link.url))
                    .map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[0.8125rem] text-frc-gold hover:underline"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
