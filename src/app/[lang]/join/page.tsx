import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';
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

      <section className="border border-frc-blue rounded-lg overflow-hidden bg-frc-void/20 mb-8">
        <div className="p-4 border-b border-frc-blue/60">
          <div className="text-xs uppercase tracking-widest text-frc-steel">
            Join
          </div>
          <div className="text-sm text-frc-text-dim mt-1">
            Subscribe for updates (hosted on LeadConnector).
          </div>
        </div>

        <div className="p-4">
          <div style={{ width: '100%', height: 598 }}>
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/okS6Dgg5RmtkDr9Oddm1"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: 3 }}
              id="inline-okS6Dgg5RmtkDr9Oddm1"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Form 0"
              data-height="598"
              data-layout-iframe-id="inline-okS6Dgg5RmtkDr9Oddm1"
              data-form-id="okS6Dgg5RmtkDr9Oddm1"
              title="Form 0"
            />
          </div>

          <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
        </div>
      </section>

      <p className="text-xs text-frc-steel">
        <Link href={`${basePath}/start-here`} className="text-frc-gold hover:underline">
          Start here
        </Link>
        .
      </p>
    </main>
  );
}
