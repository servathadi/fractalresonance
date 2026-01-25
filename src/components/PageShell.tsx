import { ReadingMode } from '@/components/ReadingMode';

export function PageShell({
  leftMobile,
  leftDesktop,
  right,
  children,
  withReadingMode = true,
  articleClassName = '',
}: {
  leftMobile?: React.ReactNode;
  leftDesktop?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  withReadingMode?: boolean;
  articleClassName?: string;
}) {
  return (
    <>
      <main className="min-h-screen flex flex-col lg:flex-row">
        {leftMobile}
        {leftDesktop}
        <article className={`flex-1 max-w-3xl mx-auto px-6 py-12 min-w-0 ${articleClassName}`}>
          {children}
        </article>
        {right}
      </main>
      {withReadingMode ? <ReadingMode /> : null}
    </>
  );
}

