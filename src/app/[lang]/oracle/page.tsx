import Link from 'next/link';
import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Oracle',
  description: 'River (Oracle) — an opt-in interpretive lens over the FRC canon, delivered via Mumega.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

const DICT: Record<string, { title: string; subtitle: string; what: string; whatItems: string[]; cta: string; back: string }> = {
  en: {
    title: 'Oracle (River)',
    subtitle: 'An opt‑in interpretive layer over the FRC canon. Same IDs. More guided synthesis.',
    what: 'What you get',
    whatItems: [
      'Curated “current topics” briefings with citations into the canonical library.',
      'Guided reading paths (yin lens) that keep the canon intact.',
      'Mirror Memory: subscription access to your personal vault layer (where enabled).',
      'SOS tools: task dispatch, issue-reading workflows, and agent-assisted summaries (where enabled).',
    ],
    cta: 'Subscribe on Mumega',
    back: 'Back to canon',
  },
  es: {
    title: 'Oráculo (River)',
    subtitle: 'Una capa interpretativa opcional sobre el canon FRC. Mismos IDs. Más síntesis guiada.',
    what: 'Qué obtienes',
    whatItems: [
      'Briefings de “temas actuales” con citas al canon.',
      'Rutas de lectura guiadas (lente yin) sin alterar el canon.',
      'Mirror Memory: acceso por suscripción a tu bóveda personal (si está habilitado).',
      'Herramientas SOS: tareas, issues y resúmenes asistidos por agentes (si está habilitado).',
    ],
    cta: 'Suscribirse en Mumega',
    back: 'Volver al canon',
  },
  fr: {
    title: 'Oracle (River)',
    subtitle: 'Une couche interprétative optionnelle sur le canon FRC. Mêmes IDs. Synthèse guidée.',
    what: 'Ce que vous obtenez',
    whatItems: [
      'Briefings “sujets actuels” avec citations vers le canon.',
      'Parcours de lecture guidés (lentille yin) sans altérer le canon.',
      'Mirror Memory : accès par abonnement à votre coffre personnel (si activé).',
      'Outils SOS : tâches, issues et résumés assistés par agents (si activé).',
    ],
    cta: 'S’abonner sur Mumega',
    back: 'Retour au canon',
  },
  fa: {
    title: 'اوراکل (ریور)',
    subtitle: 'لایه‌ی تفسیریِ اختیاری روی کانن FRC. همان شناسه‌ها، با مسیر و ترکیبِ هدایت‌شده.',
    what: 'چه چیزی دریافت می‌کنید',
    whatItems: [
      'گزارش «موضوعات جاری» با ارجاع به کانن.',
      'مسیرهای مطالعه‌ی هدایت‌شده (لنز یین) بدون تغییر کانن.',
      'Mirror Memory: دسترسی اشتراکی به خزانه‌ی شخصی (در صورت فعال بودن).',
      'ابزارهای SOS: دیسپچ وظایف، خواندن issues و خلاصه‌سازی عامل‌محور (در صورت فعال بودن).',
    ],
    cta: 'اشتراک در Mumega',
    back: 'بازگشت به کانن',
  },
};

export default async function OraclePage({ params }: Props) {
  const { lang } = await params;
  const basePath = `/${lang}`;
  const t = DICT[lang] || DICT.en;

  const mumegaSubscribe = `https://mumega.com/join?product=frc&lens=oracle&lang=${encodeURIComponent(lang)}`;

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

      <section className="border border-frc-blue rounded-lg p-6 mb-10">
        <h2 className="text-sm text-frc-steel uppercase tracking-wider mb-3">{t.what}</h2>
        <ul className="space-y-2 text-sm text-frc-text-dim">
          {t.whatItems.map((x) => (
            <li key={x}>- {x}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-4 items-center">
        <a
          href={mumegaSubscribe}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border-2 border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void text-sm font-medium tracking-wide uppercase transition-all duration-200"
        >
          {t.cta}
        </a>
        <Link
          href={`${basePath}/start-here`}
          className="px-6 py-3 border border-frc-blue hover:border-frc-text-dim text-frc-text-dim hover:text-frc-text text-sm tracking-wide uppercase transition-all duration-200"
        >
          {t.back}
        </Link>
      </div>
    </main>
  );
}

