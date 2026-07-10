import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'join');

  return {
    title: page?.frontmatter.title || 'Join',
    description: page?.frontmatter.description || 'Join FRC updates.',
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'join');
  if (!page) notFound();

  const basePath = `/${lang}`;
  const fm = page.frontmatter as any;
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, basePath);

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <nav className="text-sm text-frc-text-dim mb-8">
        <Link href={basePath} className="hover:text-frc-gold transition-colors">FRC</Link>
        <span className="mx-2">/</span>
        <span className="text-frc-text">{fm.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-light text-frc-gold mb-3">{fm.title}</h1>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">{fm.subtitle}</p>
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
          <div style={{ width: '100%', height: 715 }}>
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
              data-height="715"
              data-layout-iframe-id="inline-okS6Dgg5RmtkDr9Oddm1"
              data-form-id="okS6Dgg5RmtkDr9Oddm1"
              title="Form 0"
            />
          </div>

          <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
        </div>
      </section>

      <div className="prose prose-invert max-w-none mb-8 text-sm text-frc-text-dim">
        <MarkdownContent html={bodyHtml} glossary={glossary} />
      </div>

      <p className="text-xs text-frc-steel">
        <Link href={`${basePath}/start-here`} className="text-frc-gold hover:underline">
          Start here
        </Link>
        .
      </p>
    </main>
  );
}
