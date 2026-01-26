import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Join',
  description: 'Join FRC updates. Choose an onboarding lens: Architect (rigor) or Oracle (digest).',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

const DICT: Record<string, { title: string; subtitle: string; architect: string; oracle: string; archDesc: string; oracleDesc: string; note: string }> = {
  en: {
    title: 'Join updates',
    subtitle: 'Pick a lens. Same canon, different delivery.',
    architect: 'Architect',
    oracle: 'Oracle',
    archDesc: 'Rigorous: papers, benchmarks, and build notes.',
    oracleDesc: 'Digest: guided reading, synthesis, and prompts.',
    note: 'Signup is hosted on mumega.com.',
  },
  es: {
    title: 'Unirse a actualizaciones',
    subtitle: 'Elige una lente. Mismo canon, distinta entrega.',
    architect: 'Arquitecto',
    oracle: 'Oráculo',
    archDesc: 'Rigurosa: papers, benchmarks y notas de construcción.',
    oracleDesc: 'Resumen: lectura guiada, síntesis y prompts.',
    note: 'El registro se aloja en mumega.com.',
  },
  fr: {
    title: 'Rejoindre les mises à jour',
    subtitle: 'Choisissez une lentille. Même canon, livraison différente.',
    architect: 'Architecte',
    oracle: 'Oracle',
    archDesc: 'Rigoureux : papiers, benchmarks, notes de build.',
    oracleDesc: 'Digest : lecture guidée, synthèse, prompts.',
    note: 'L’inscription est hébergée sur mumega.com.',
  },
  fa: {
    title: 'عضویت در به‌روزرسانی‌ها',
    subtitle: 'یک لنز انتخاب کنید. یک کانن، دو شیوه ارائه.',
    architect: 'معمار',
    oracle: 'اوراکل',
    archDesc: 'سخت‌گیرانه: مقالات، بنچمارک‌ها و یادداشت‌های ساخت.',
    oracleDesc: 'خلاصه: مسیر مطالعه، ترکیب و پرامپت‌ها.',
    note: 'ثبت‌نام در mumega.com انجام می‌شود.',
  },
};

export default async function JoinPage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const t = DICT[lang] || DICT.en;

  const mumega = 'https://mumega.com';
  const architectHref = `${mumega}/join?product=frc&lens=architect&lang=${encodeURIComponent(lang)}`;
  const oracleHref = `${mumega}/join?product=frc&lens=oracle&lang=${encodeURIComponent(lang)}`;

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <a href={basePath} className="hover:text-frc-gold">FRC</a>
        <span className="mx-2">/</span>
        <span className="text-frc-text">{t.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{t.title}</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">{t.subtitle}</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4 mb-8">
        <a href={architectHref} className="card block p-6 group" target="_blank" rel="noopener noreferrer">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">{t.architect}</div>
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-lg font-medium mb-2">
            {t.architect} / Yang
          </h2>
          <p className="text-sm text-frc-text-dim leading-relaxed">{t.archDesc}</p>
        </a>

        <a href={oracleHref} className="card block p-6 group" target="_blank" rel="noopener noreferrer">
          <div className="text-xs uppercase tracking-widest text-frc-steel mb-2">{t.oracle}</div>
          <h2 className="text-frc-text group-hover:text-frc-gold transition-colors text-lg font-medium mb-2">
            {t.oracle} / Yin
          </h2>
          <p className="text-sm text-frc-text-dim leading-relaxed">{t.oracleDesc}</p>
        </a>
      </section>

      <p className="text-xs text-frc-steel">
        {t.note}{' '}
        <Link href={`${basePath}/start-here`} className="text-frc-gold hover:underline">
          Start here
        </Link>
        .
      </p>
    </main>
  );
}

