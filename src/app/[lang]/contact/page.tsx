import type { Metadata } from 'next';
import Script from 'next/script';
import { getLanguages, getSitePage, getGlossary } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownContent } from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const page = getSitePage(lang, 'contact');

  return {
    title: page?.frontmatter.title || 'Contact',
    description: page?.frontmatter.description || 'Connect with the FRC team.',
  };
}

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const page = getSitePage(lang, 'contact');
  if (!page) notFound();

  const fm = page.frontmatter as any;
  const glossary = getGlossary(lang);
  const bodyHtml = renderMarkdown(page.body, lang, glossary, `/${lang}`);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">{fm.title}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <section className="border border-frc-blue p-8 space-y-6">
        <p className="text-frc-text leading-relaxed">
          {fm.intro}
        </p>

        <div className="rounded-lg border border-frc-blue/60 overflow-hidden bg-frc-void/20">
          <div style={{ width: '100%', height: 675 }}>
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/vGpoXpEcyYPScch7TCoM"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: 3 }}
              id="inline-vGpoXpEcyYPScch7TCoM"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="FRC Contact"
              data-height="675"
              data-layout-iframe-id="inline-vGpoXpEcyYPScch7TCoM"
              data-form-id="vGpoXpEcyYPScch7TCoM"
              title="FRC Contact"
            />
          </div>
          <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
        </div>

        <div className="prose prose-invert max-w-none text-sm text-frc-text-dim">
           <MarkdownContent html={bodyHtml} glossary={glossary} />
        </div>

        <p className="text-xs text-frc-text-dim leading-relaxed">
          {fm.outro}
        </p>
      </section>
    </main>
  );
}
