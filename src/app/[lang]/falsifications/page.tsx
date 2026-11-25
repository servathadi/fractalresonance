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

const DISPOSITION_STYLES: Record<FalsificationDisposition, string> = {
  CONTRADICTED: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300',
  NO_GAIN: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  UNDERPOWERED: 'border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  STRUCTURAL_OBSTRUCTION: 'border-violet-500/50 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  DEMOTED: 'border-frc-steel/50 bg-frc-steel/10 text-frc-steel',
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
    jsonDownload: 'Download JSON (/falsification-ledger.json)',
    canonRouter: 'Current Stance (FRC 100.000)',
    legendTitle: 'Disposition definitions',
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
    jsonDownload: 'Descargar JSON (/falsification-ledger.json)',
    canonRouter: 'Postura actual (FRC 100.000)',
    legendTitle: 'Definiciones de disposición',
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
    jsonDownload: 'Télécharger JSON (/falsification-ledger.json)',
    canonRouter: 'Position actuelle (FRC 100.000)',
    legendTitle: 'Définitions des statuts',
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
    jsonDownload: 'دریافت JSON (/falsification-ledger.json)',
    canonRouter: 'موضع جاری (FRC 100.000)',
    legendTitle: 'تعریف وضعیت‌ها',
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <nav className="text-sm text-frc-text-dim mb-8">
          <Link href={basePath} className="hover:text-frc-gold">FRC</Link>
          <span className="mx-2">/</span>
          <span className="text-frc-text">{t.title}</span>
        </nav>

        <header className="mb-10 border-b border-frc-blue pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-frc-gold mb-2">
            FRC Epistemic Accountability · v{ledger.version}
          </p>
          <h1 className="text-3xl font-light text-frc-gold mb-4">{t.title}</h1>
          <p className="text-frc-text-dim leading-relaxed max-w-3xl">{t.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs">
            <span className="font-mono text-frc-steel">
              {t.updatedLabel}: {ledger.updated}
            </span>
            <span className="font-mono text-frc-steel">
              {t.totalLabel}: {ledger.summary.totalEntries}
            </span>
            <a
              href="/falsification-ledger.json"
              className="border border-frc-gold/60 px-3 py-1.5 font-mono text-frc-gold hover:bg-frc-gold/10 transition-colors"
            >
              {t.jsonDownload}
            </a>
            <Link
              href="/en/papers/FRC-100-000"
              className="border border-frc-blue px-3 py-1.5 font-mono text-frc-text-dim hover:text-frc-gold hover:border-frc-gold transition-colors"
            >
              {t.canonRouter}
            </Link>
          </div>
        </header>

        {/* Summary counts by disposition */}
        <section aria-labelledby="disposition-legend-heading" className="mb-10">
          <h2 id="disposition-legend-heading" className="text-xs uppercase tracking-widest text-frc-steel mb-4">
            {t.legendTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DISPOSITION_ORDER.map((disp) => (
              <div key={disp} className="border border-frc-blue bg-frc-void-light p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-block rounded-[2px] border px-1.5 py-0.5 font-mono text-[0.65rem] uppercase ${DISPOSITION_STYLES[disp]}`}>
                    {disp}
                  </span>
                  <span className="font-mono text-sm text-frc-text">
                    {ledger.summary.byDisposition[disp] || 0}
                  </span>
                </div>
                <p className="text-[0.72rem] text-frc-text-dim leading-relaxed">
                  {ledger.dispositions[disp]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Entries */}
        <section aria-label="Falsification entries" className="space-y-5">
          {ledger.entries.map((entry) => (
            <article
              key={entry.id}
              id={entry.id}
              className="border border-frc-blue bg-frc-void-light p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-block rounded-[2px] border px-2 py-0.5 font-mono text-[0.7rem] font-medium uppercase ${DISPOSITION_STYLES[entry.disposition]}`}>
                    {entry.disposition}
                  </span>
                  <span className="font-mono text-xs text-frc-steel">{entry.id}</span>
                  <span className="text-xs text-frc-steel">· {entry.domain}</span>
                </div>
                <span className="font-mono text-xs text-frc-steel">{entry.dateRecorded}</span>
              </div>

              <h2 className="text-lg font-medium text-frc-text mb-4">{entry.title}</h2>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-frc-steel mb-1">
                    {t.claimLabel}
                  </dt>
                  <dd className="text-frc-text-dim leading-relaxed">{entry.claimTested}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-frc-steel mb-1">
                    {t.evidenceLabel}
                  </dt>
                  <dd className="text-frc-text leading-relaxed">{entry.evidenceSummary}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-frc-steel mb-1">
                    {t.scopeLabel}
                  </dt>
                  <dd className="text-frc-text-dim leading-relaxed">{entry.scopeBoundary}</dd>
                </div>
              </dl>

              {(entry.urls.length > 0 || entry.dois.length > 0 || entry.sourceIds.length > 0) && (
                <div className="mt-4 pt-4 border-t border-frc-blue/60 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-frc-steel">
                    {t.sourcesLabel}:
                  </span>
                  {entry.urls.length > 0 ? (
                    entry.urls.map((url) => (
                      <Link key={url} href={url} className="font-mono text-frc-gold hover:underline">
                        {url.split('/').pop()}
                      </Link>
                    ))
                  ) : (
                    <span className="font-mono text-frc-text-dim">{entry.sourceIds.join(', ')}</span>
                  )}
                  {entry.dois.map((doi) => (
                    <a
                      key={doi}
                      href={`https://doi.org/${doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-frc-steel hover:text-frc-gold hover:underline"
                    >
                      DOI:{doi}
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
