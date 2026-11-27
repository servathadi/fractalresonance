import React from 'react';

export interface VisualAbstractShowcaseProps {
  lang?: string;
  variant?: 'start-here' | 'home';
}

interface VisualAbstractCopy {
  eyebrow: string;
  heading: string;
  subtitle: string;
  openPdfAria: string;
  alt: string;
  captionLead: string;
  captionBody: string;
  downloadOneSlide: string;
  downloadSevenSlides: string;
  formatNote: string;
}

const COPY: Record<string, VisualAbstractCopy> = {
  en: {
    eyebrow: 'FRC v3 · Visual Overview',
    heading: 'One-Page Visual Abstract & Overview Deck',
    subtitle:
      'A single-page map of what FRC v3 proposes, which results survive hostile audit, and what the register architecture implies for AI systems.',
    openPdfAria: 'Open the FRC v3 1-Slide Visual Abstract as a vector PDF in a new tab',
    alt: 'FRC v3 one-page visual abstract organized into three columns: Column 1 (What We Suggest) outlines the Two-Register Architecture separating the testable Physics Register (dS + k* d ln C = 0) from the interpretive Philosophy Register with a one-way evidence firewall; Column 2 (What Survives Hostile Audit) summarizes audited flagship papers FRC 830.005 v0.3 and FRC 100.006 / 100.006.002 v2.0 alongside the 10-gate Public Falsification Ledger; Column 3 (Implications for AI) covers operational registers FRC 700.000–007, cross-model mapping FRC 908.103, and multi-model adversarial audit stability.',
    captionLead: 'Figure: FRC v3 Visual Abstract.',
    captionBody:
      'Summarizes the Two-Register Architecture, audited mathematical flagships (FRC 830.005 v0.3, FRC 100.006 v2.0), the public Falsification Ledger, and AI implications (FRC 700.000–007, FRC 908.103). Click the slide to inspect the vector PDF.',
    downloadOneSlide: 'Download 1-Slide Visual Abstract (PDF)',
    downloadSevenSlides: 'Download 7-Slide Overview Deck (PDF)',
    formatNote: 'Vector PDF · Print & screen ready',
  },
  es: {
    eyebrow: 'FRC v3 · Resumen Visual',
    heading: 'Resumen Visual de una Página y Presentación General',
    subtitle:
      'Un mapa en una sola página de lo que propone FRC v3, qué resultados sobreviven a la auditoría adversaria y qué implica la arquitectura de registros para los sistemas de IA.',
    openPdfAria: 'Abrir el resumen visual de 1 diapositiva de FRC v3 en PDF vectorial en una nueva pestaña',
    alt: 'Resumen visual de una página de FRC v3 organizado en tres columnas: Columna 1 (Arquitectura de Dos Registros con cortafuegos de evidencia unidireccional entre el registro físico dS + k* d ln C = 0 y el registro filosófico); Columna 2 (artículos auditados FRC 830.005 v0.3 y FRC 100.006 v2.0 junto al Registro Público de Falsaciones de 10 puertas); Columna 3 (implicaciones para la IA: registros operacionales FRC 700.000–007, mapeo entre modelos FRC 908.103 y auditoría multimodelo).',
    captionLead: 'Figura: Resumen Visual de FRC v3.',
    captionBody:
      'Resume la Arquitectura de Dos Registros, los artículos matemáticos auditados (FRC 830.005 v0.3, FRC 100.006 v2.0), el Registro Público de Falsaciones y las implicaciones para la IA (FRC 700.000–007, FRC 908.103). Haga clic en la imagen para abrir el PDF vectorial.',
    downloadOneSlide: 'Descargar Resumen Visual (1 diapositiva, PDF)',
    downloadSevenSlides: 'Descargar Presentación General (7 diapositivas, PDF)',
    formatNote: 'PDF vectorial · En inglés',
  },
  fr: {
    eyebrow: 'FRC v3 · Synthèse Visuelle',
    heading: 'Résumé Visuel en Une Page et Présentation Générale',
    subtitle:
      'Une vue d’ensemble en une page de ce que propose FRC v3, des résultats qui résistent à l’audit contradictoire et des implications pour les systèmes d’IA.',
    openPdfAria: 'Ouvrir le résumé visuel 1 diapositive de FRC v3 au format PDF vectoriel dans un nouvel onglet',
    alt: 'Résumé visuel en une page de FRC v3 organisé en trois colonnes : Colonne 1 (Architecture à Deux Registres avec cloison d’évidence unidirectionnelle entre le registre physique dS + k* d ln C = 0 et le registre philosophique) ; Colonne 2 (articles audités FRC 830.005 v0.3 et FRC 100.006 v2.0 ainsi que le Registre Public des Réfutations à 10 portes) ; Colonne 3 (implications pour l’IA : registres opérationnels FRC 700.000–007, correspondance inter-modèles FRC 908.103 et stabilité d’audit multi-modèles).',
    captionLead: 'Figure : Résumé Visuel FRC v3.',
    captionBody:
      'Présente l’Architecture à Deux Registres, les articles mathématiques audités (FRC 830.005 v0.3, FRC 100.006 v2.0), le Registre Public des Réfutations et les implications pour l’IA (FRC 700.000–007, FRC 908.103). Cliquez sur la diapositive pour ouvrir le PDF vectoriel.',
    downloadOneSlide: 'Télécharger le Résumé Visuel (1 diapositive, PDF)',
    downloadSevenSlides: 'Télécharger la Présentation Générale (7 diapositives, PDF)',
    formatNote: 'PDF vectoriel · En anglais',
  },
  fa: {
    eyebrow: 'FRC v3 · نمای تصویری',
    heading: 'چکیده تصویری تک‌صفحه‌ای و مجموعه اسلاید معرفی',
    subtitle:
      'نقشه‌ای یک‌صفحه‌ای از آنچه FRC v3 پیشنهاد می‌دهد، نتایجی که از ممیزی سخت‌گیرانه عبور می‌کنند، و پیامدهای معماری ثبت‌ها برای سامانه‌های هوش مصنوعی.',
    openPdfAria: 'باز کردن نسخه PDF برداری چکیده تصویری تک‌اسلایدی FRC v3 در برگه جدید',
    alt: 'چکیده تصویری تک‌صفحه‌ای FRC v3 در سه ستون: ستون ۱ معماری دو-ثبتی با تفکیک ثبت فیزیک (dS + k* d ln C = 0) از ثبت فلسفه و دیوار آتش شواهد یک‌طرفه؛ ستون ۲ مقالات شاخص ممیزی‌شده FRC 830.005 v0.3 و FRC 100.006 v2.0 در کنار دفتر عمومی ابطال‌ها با ۱۰ دروازه؛ ستون ۳ پیامدها برای هوش مصنوعی شامل ثبت‌های عملیاتی FRC 700.000–007، نگاشت میان‌مدلی FRC 908.103 و پایداری ممیزی چندمدلی.',
    captionLead: 'شکل: چکیده تصویری FRC v3.',
    captionBody:
      'خلاصه معماری دو-ثبتی، مقالات شاخص ریاضی ممیزی‌شده (FRC 830.005 v0.3 و FRC 100.006 v2.0)، دفتر عمومی ابطال‌ها و پیامدهای هوش مصنوعی (FRC 700.000–007 و FRC 908.103). برای مشاهده نسخه PDF برداری روی تصویر کلیک کنید.',
    downloadOneSlide: 'دانلود چکیده تصویری تک‌اسلایدی (PDF)',
    downloadSevenSlides: 'دانلود مجموعه اسلاید ۷صفحه‌ای معرفی (PDF)',
    formatNote: 'PDF برداری · به زبان انگلیسی',
  },
};

export const VISUAL_ABSTRACT_PATHS = {
  png: '/visuals/frc-v3-visual-abstract.png',
  oneSlidePdf: '/visuals/frc-v3-visual-abstract.pdf',
  sevenSlideDeckPdf: '/visuals/frc-v3-implications-and-ai-7slides.pdf',
} as const;

export function VisualAbstractShowcase({
  lang = 'en',
  variant = 'start-here',
}: VisualAbstractShowcaseProps) {
  const c = COPY[lang] || COPY.en;
  const isHome = variant === 'home';

  const content = (
    <div data-visual-abstract-showcase={variant}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-frc-gold mb-2" dir="ltr">
            {c.eyebrow}
          </p>
          <h2
            className={
              isHome
                ? 'text-xl sm:text-2xl font-medium text-frc-text tracking-[-0.015em]'
                : 'text-xl sm:text-2xl font-light text-frc-gold tracking-[-0.02em]'
            }
          >
            {c.heading}
          </h2>
          <p className="text-sm text-frc-text-dim leading-relaxed mt-2 max-w-[68ch]">
            {c.subtitle}
          </p>
        </div>
        <p className="font-mono text-xs text-frc-steel shrink-0">{c.formatNote}</p>
      </div>

      <figure className="m-0">
        <a
          href={VISUAL_ABSTRACT_PATHS.oneSlidePdf}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={c.openPdfAria}
          className="group block overflow-hidden rounded-sm border border-frc-blue bg-frc-void transition-colors hover:border-frc-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frc-gold"
        >
          <img
            src={VISUAL_ABSTRACT_PATHS.png}
            alt={c.alt}
            width={2560}
            height={1440}
            loading={isHome ? 'lazy' : 'eager'}
            decoding="async"
            className="block w-full h-auto aspect-[16/9] object-contain transition-opacity duration-200 group-hover:opacity-95"
          />
        </a>

        <figcaption className="mt-4 flex flex-col lg:flex-row lg:items-start justify-between gap-5 border-t border-frc-blue/60 pt-4">
          <p className="text-sm text-frc-text-dim leading-relaxed max-w-[68ch]">
            <span className="font-medium text-frc-text">{c.captionLead}</span>{' '}
            {c.captionBody}
          </p>

          <div className="flex flex-wrap items-center gap-3 shrink-0 text-sm">
            <a
              href={VISUAL_ABSTRACT_PATHS.oneSlidePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-frc-gold text-frc-gold hover:bg-frc-gold hover:text-frc-void font-medium transition-colors"
            >
              {c.downloadOneSlide}
            </a>
            <a
              href={VISUAL_ABSTRACT_PATHS.sevenSlideDeckPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-frc-blue text-frc-text hover:border-frc-gold hover:text-frc-gold transition-colors"
            >
              {c.downloadSevenSlides}
            </a>
          </div>
        </figcaption>
      </figure>
    </div>
  );

  if (isHome) {
    return (
      <section
        aria-label={c.heading}
        className="border-b border-frc-blue/60 bg-frc-void-light/50"
      >
        <div className="max-w-6xl mx-auto px-6 py-12">{content}</div>
      </section>
    );
  }

  return (
    <section
      aria-label={c.heading}
      className="mb-12 pb-10 border-b border-frc-blue"
    >
      {content}
    </section>
  );
}
