import type { Metadata } from 'next';
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

        <div className="space-y-3 text-frc-text-dim">
          <p>
            <span className="text-frc-text">{t.emailLabel}</span>{' '}
            <a className="hover:text-frc-gold" href="mailto:publish@fractalresonance.com">
              publish@fractalresonance.com
            </a>
          </p>
          <p>
            <span className="text-frc-text">{t.websiteLabel}</span>{' '}
            <a className="hover:text-frc-gold" href="https://fractalresonance.com" target="_blank" rel="noopener noreferrer">
              fractalresonance.com
            </a>
          </p>
          <p>
            <span className="text-frc-text">{t.authorLabel}</span> Hadi Servat
          </p>
        </div>

        <p className="text-xs text-frc-text-dim leading-relaxed">
          {t.outro}
        </p>
      </section>
    </main>
  );
}

