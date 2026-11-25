import Link from 'next/link';

interface ArchivedBookBannerProps {
  lang: string;
  bookId: string;
  statusNote?: string;
}

const BANNER_COPY: Record<
  string,
  {
    eyebrow: string;
    heading: string;
    body: string;
    currentBooksLabel: string;
    openSystem: string;
    mindCoupling: string;
    papersLabel: string;
  }
> = {
  en: {
    eyebrow: 'Superseded 2025 Edition · Historical Archive (noindex)',
    heading: 'This 2025 book has been superseded and is retained for historical provenance only.',
    body: 'It reflects an earlier stage of the FRC project (including superseded formulations) and does not state the current 2026 canon. Read the current 2026 books and status-labeled papers instead:',
    currentBooksLabel: 'Current 2026 books:',
    openSystem: 'The Open System (2026)',
    mindCoupling: 'The Mind in the Coupling (2026)',
    papersLabel: 'Current technical canon:',
  },
  es: {
    eyebrow: 'Edición de 2025 sustituida · Archivo histórico (noindex)',
    heading: 'Este libro de 2025 ha sido sustituido y se conserva solo como registro histórico.',
    body: 'Refleja una etapa anterior del proyecto FRC y no representa el canon vigente de 2026. Consulte los libros actuales de 2026 (edición canónica en inglés) y los artículos técnicos vigentes:',
    currentBooksLabel: 'Libros actuales de 2026:',
    openSystem: 'The Open System (2026, EN)',
    mindCoupling: 'The Mind in the Coupling (2026, EN)',
    papersLabel: 'Canon técnico vigente:',
  },
  fr: {
    eyebrow: 'Édition 2025 remplacée · Archive historique (noindex)',
    heading: 'Cet ouvrage de 2025 est remplacé et conservé uniquement pour la traçabilité historique.',
    body: 'Il reflète une formulation antérieure du projet FRC et ne constitue pas le canon actuel de 2026. Consultez plutôt les ouvrages actuels de 2026 (édition canonique anglaise) et les articles techniques actifs :',
    currentBooksLabel: 'Ouvrages actuels de 2026 :',
    openSystem: 'The Open System (2026, EN)',
    mindCoupling: 'The Mind in the Coupling (2026, EN)',
    papersLabel: 'Canon technique actuel :',
  },
  fa: {
    eyebrow: 'نسخه منسوخ ۲۰۲۵ · بایگانی تاریخی (noindex)',
    heading: 'این کتاب سال ۲۰۲۵ منسوخ شده و صرفاً برای ثبت پیشینه تاریخی نگهداری می‌شود.',
    body: 'متن زیر بازتاب مرحله‌ای پیشین از پروژه FRC است و بیانگر کانون جاری ۲۰۲۶ نیست. برای مطالعه نسخه جاری، به کتاب‌های ۲۰۲۶ (نسخه اصلی انگلیسی) و مقاله‌های برچسب‌گذاری‌شده مراجعه کنید:',
    currentBooksLabel: 'کتاب‌های جاری ۲۰۲۶:',
    openSystem: 'The Open System (۲۰۲۶، انگلیسی)',
    mindCoupling: 'The Mind in the Coupling (۲۰۲۶، انگلیسی)',
    papersLabel: 'کانون فنی جاری:',
  },
};

export function ArchivedBookBanner({ lang, bookId, statusNote }: ArchivedBookBannerProps) {
  const t = BANNER_COPY[lang] || BANNER_COPY.en;

  return (
    <aside
      role="note"
      aria-label="Superseded 2025 book archive notice"
      data-archived-book-banner={bookId}
      className="mb-8 border border-frc-gold/60 bg-frc-void-light p-5 text-sm"
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-widest text-frc-gold mb-2">
        {t.eyebrow}
      </p>
      <p className="font-medium text-frc-text mb-2">{t.heading}</p>
      <p className="text-frc-text-dim leading-relaxed mb-3">
        {statusNote || t.body}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="text-frc-steel uppercase tracking-wider">{t.currentBooksLabel}</span>
        <Link href="/en/books/the-open-system" className="text-frc-gold hover:underline">
          {t.openSystem}
        </Link>
        <Link href="/en/books/the-mind-in-the-coupling" className="text-frc-gold hover:underline">
          {t.mindCoupling}
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mt-2">
        <span className="text-frc-steel uppercase tracking-wider">{t.papersLabel}</span>
        <Link href="/en/papers/FRC-100-000" className="text-frc-gold hover:underline font-mono">
          FRC 100.000
        </Link>
        <Link href="/en/papers/FRC-566-001" className="text-frc-gold hover:underline font-mono">
          FRC 566.001
        </Link>
      </div>
    </aside>
  );
}
