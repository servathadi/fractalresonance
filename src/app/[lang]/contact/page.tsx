import type { Metadata } from 'next';
import Script from 'next/script';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Connect with the Fractal Resonance Cognition team for collaborations and inquiries.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

const DICT: Record<string, { title: string; intro: string; emailLabel: string; websiteLabel: string; authorLabel: string; outro: string }> = {
  en: { title: 'Contact', intro: 'We welcome inquiries, collaborations, and discussions related to Fractal Resonance Cognition (FRC). If you have questions about the framework, want to explore research partnerships, or wish to share your insights, feel free to reach out.', emailLabel: 'Email:', websiteLabel: 'Website:', authorLabel: 'Author:', outro: 'We strive to respond promptly. Thank you for your interest in FRC.' },
  fa: { title: 'تماس', intro: 'ما از پرسش‌ها، همکاری‌ها و بحث‌های مرتبط با همدوسی رزونانس فراکتال (FRC) استقبال می‌کنیم. اگر سوالاتی در مورد چارچوب دارید، می‌خواهید مشارکت‌های پژوهشی را بررسی کنید یا مایلید بینش‌های خود را به اشتراک بگذارید، با ما تماس بگیرید.', emailLabel: 'ایمیل:', websiteLabel: 'وب‌سایت:', authorLabel: 'نویسنده:', outro: 'ما تلاش می‌کنیم به سرعت پاسخ دهیم. از علاقه شما به FRC سپاسگزاریم.' },
  es: { title: 'Contacto', intro: 'Damos la bienvenida a consultas, colaboraciones y discusiones relacionadas con la Coherencia de Resonancia Fractal (FRC). Si tiene preguntas sobre el marco, desea explorar asociaciones de investigación o desea compartir sus ideas, no dude en comunicarse.', emailLabel: 'Correo:', websiteLabel: 'Sitio web:', authorLabel: 'Autor:', outro: 'Nos esforzamos por responder con prontitud. Gracias por su interés en FRC.' },
  fr: { title: 'Contact', intro: 'Nous accueillons les demandes, collaborations et discussions liées à la Cohérence de Résonance Fractale (FRC). Si vous avez des questions sur le cadre, souhaitez explorer des partenariats de recherche ou souhaitez partager vos idées, n\'hésitez pas à nous contacter.', emailLabel: 'Email :', websiteLabel: 'Site web :', authorLabel: 'Auteur :', outro: 'Nous nous efforçons de répondre rapidement. Merci de votre intérêt pour le FRC.' },
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const t = DICT[lang] || DICT['en'];

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">{t.title}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <section className="border border-frc-blue p-8 space-y-6">
        <p className="text-frc-text leading-relaxed">
          {t.intro}
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

        <p className="text-xs text-frc-text-dim leading-relaxed">
          {t.outro}
        </p>
      </section>
    </main>
  );
}
