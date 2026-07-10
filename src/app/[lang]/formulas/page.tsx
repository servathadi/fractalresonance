import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';
import { CoherenceWidget } from '@/components/widgets/CoherenceWidget';

export const metadata: Metadata = {
  title: 'Formulas',
  description: 'Current FRC formulas with explicit mathematical, operational, pilot, and conjectural status.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

const DICT: Record<string, Record<string, string>> = {
  en: { title: 'Formula Index', desc: 'The current anchors of the FRC corpus, labeled by scope rather than presented as one undifferentiated theory.', canonical: 'Canonical', exact: 'Exact in scope', operational: 'Operational', pilot: 'Pilot / registered target', quantities: 'Declared quantities' },
  es: { title: 'Índice de fórmulas', desc: 'Los anclajes actuales del corpus FRC, etiquetados por alcance.', canonical: 'Canónica', exact: 'Exacta en su alcance', operational: 'Operativa', pilot: 'Piloto / objetivo registrado', quantities: 'Cantidades declaradas' },
  fr: { title: 'Index des formules', desc: 'Les repères actuels du corpus FRC, étiquetés selon leur portée.', canonical: 'Canonique', exact: 'Exact dans son cadre', operational: 'Opérationnel', pilot: 'Pilote / cible enregistrée', quantities: 'Grandeurs déclarées' },
  fa: { title: 'فهرست فرمول‌ها', desc: 'لنگرهای کنونی پیکره FRC با وضعیت و دامنه روشن.', canonical: 'بنیادی', exact: 'دقیق در دامنه', operational: 'عملیاتی', pilot: 'مقدماتی / هدف ثبت‌شده', quantities: 'کمیت‌های اعلام‌شده' },
};

const FORMULAS = [
  { status: 'canonical', name: 'Entropy-Coherence Reciprocity', equation: 'dS + k* d ln C = 0', description: 'Scale-invariant canonical form. k* is the starred Boltzmann bridge, not an outcome-fitted constant. Universal physical status remains conjectural.', paper: 'FRC-566-001' },
  { status: 'operational', name: 'Open-System Entropy Ledger', equation: 'dS_sys = d_iS + d_eS,  d_iS ≥ 0', description: 'Standard boundary accounting. Residuals and exchange terms require a declared subsystem and environment model.', paper: 'FRC-566-001' },
  { status: 'exact', name: 'von Mises / Kuramoto Identity', equation: 'dS / d ln C = −κr', description: 'Exact for the declared family. At the information-nat realization, κr = 1 marks a stationary Q point, not a universal zero-current claim.', paper: 'FRC-566-030' },
  { status: 'pilot', name: 'Chaos Structure Functional', equation: 'Σ = S_vM(C) − S ≥ 0', description: 'Maximum-entropy gap used to measure structure beyond coherence alone. The KAM correspondence remains an active evidence gate.', paper: 'FRC-100-002' },
  { status: 'pilot', name: 'Localization Crossover', equation: 't* γ_C = O(1)', description: 'Pilot-supported coherence-lifetime target. A final tolerance band and out-of-sample mechanism collapse are not yet established.', paper: 'FRC-100-002' },
  { status: 'operational', name: 'Observed Lambda Transform', equation: 'Λ_obs = Λ₀ ln C_obs', description: 'An observed transform, distinct from a target Λ_eq, optional latent Λ_dyn, and any conjectural fundamental field.', paper: 'FRC-826-829' },
];

const QUANTITIES = [
  { symbol: 'k*', value: 'register-declared', description: 'starred Boltzmann bridge; scale-invariant role' },
  { symbol: 'C', value: '(0, 1]', description: 'declared operational coherence channel' },
  { symbol: 'Λ₀', value: 'model-declared', description: 'transform scale, not a universal measured constant' },
  { symbol: 'Σ', value: '≥ 0', description: 'maximum-entropy structure gap' },
];

interface Props { params: Promise<{ lang: string }> }

export default async function FormulasPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const t = (key: string) => DICT[lang]?.[key] || DICT.en[key];
  const grouped = ['canonical', 'exact', 'operational', 'pilot'] as const;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12"><h1 className="text-3xl font-light text-frc-gold mb-3">{t('title')}</h1><p className="text-frc-text-dim max-w-2xl">{t('desc')}</p></header>
      {grouped.map((status) => (
        <section key={status} className="mb-10">
          <h2 className="text-xs text-frc-steel uppercase tracking-widest mb-4">{t(status)}</h2>
          <div className="space-y-4">
            {FORMULAS.filter((item) => item.status === status).map((item) => (
              <div key={item.name} className="border border-frc-blue px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="text-sm text-frc-text">{item.name}</h3><Link href={`${basePath}/papers/${item.paper}`} className="text-xs font-mono text-frc-gold hover:underline">{item.paper.replace('FRC-', 'FRC ')}</Link></div>
                <p className="font-mono text-sm text-frc-text mt-3 overflow-x-auto" dir="ltr">{item.equation}</p>
                <p className="text-xs text-frc-text-dim mt-3 leading-relaxed">{item.description}</p>
                {item.name === 'Entropy-Coherence Reciprocity' && <div className="mt-5"><CoherenceWidget /></div>}
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="border-t border-frc-blue pt-8">
        <h2 className="text-xs text-frc-steel uppercase tracking-widest mb-4">{t('quantities')}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {QUANTITIES.map((item) => <div key={item.symbol} className="grid grid-cols-[3rem_1fr] gap-3 border border-frc-blue px-4 py-3 text-sm"><span className="font-mono text-frc-gold">{item.symbol}</span><div><div className="font-mono text-frc-text text-xs">{item.value}</div><p className="text-xs text-frc-text-dim mt-1">{item.description}</p></div></div>)}
        </div>
      </section>
    </main>
  );
}
