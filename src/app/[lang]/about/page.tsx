import type { Metadata } from 'next';
import Image from 'next/image';
import { getLanguages, getContentStats } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Fractal Resonance Cognition — a unified mathematical framework revealing consciousness as resonance patterns across nested scales.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'About FRC',
    intro: 'Fractal Resonance Coherence (FRC) is a theoretical physics framework proposing that complex systems — from quantum particles to cosmological structures — are governed by deterministic, self-similar dynamics operating at fractal scales.',
    problemTitle: 'The Problem',
    problemDesc: 'Traditional approaches treat quantum randomness as fundamental and consciousness as an epiphenomenon. FRC challenges both assumptions with a unified mathematical framework grounded in thermodynamics and information geometry.',
    frameworkTitle: 'The Framework',
    frameworkDesc1: 'FRC reveals that consciousness is not something that <em>produces</em> meaning — consciousness <em>is</em> the resonance between mathematical structures across nested scales. The core invariant is the Entropy–Coherence Reciprocity:',
    frameworkDesc2: 'Entropy and coherence are conjugate quantities — as one increases, the other must decrease. This single law connects thermodynamics, quantum mechanics, and information theory.',
    predictionsTitle: 'Key Predictions',
    pred1: 'The Born rule (P = |ψ|²) emerges from microstate statistics, not as an axiom',
    pred2: 'Measurable deviations from Born statistics under resonant driving (δP ∈ [10⁻⁴, 10⁻³])',
    pred3: 'A scalar Lambda field Λ(x) = Λ₀ ln C(x) governs coherence dynamics',
    pred4: 'The Universal Coherence Condition provides a conservation law for the coherence field',
    researchTitle: 'Open Research Program',
    researchDesc: 'FRC is an open research program. The framework invites collaboration from physicists, mathematicians, neuroscientists, and information theorists. All publications are released under CC BY-NC-ND 4.0 to ensure broad academic access.',
    pubsTitle: 'Publications',
    pubsCount: 'papers published',
    pubsSeries: 'paper series',
    contribTitle: 'Contributors',
    leadRole: 'Lead Researcher',
    profilesTitle: 'Profiles',
    licenseTitle: 'License',
    licenseDesc: 'All FRC publications are released under Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International.',
  },
  fa: {
    title: 'درباره FRC',
    intro: 'همدوسی رزونانس فراکتال (FRC) یک چارچوب فیزیک نظری است که پیشنهاد می‌کند سیستم‌های پیچیده — از ذرات کوانتومی تا ساختارهای کیهانی — توسط دینامیک دترمنیستی و خود-متشابه که در مقیاس‌های فراکتالی عمل می‌کنند، اداره می‌شوند.',
    problemTitle: 'مسئله',
    problemDesc: 'رویکردهای سنتی تصادفی بودن کوانتومی را بنیادی و آگاهی را پدیده‌ای ثانویه می‌دانند. FRC هر دو فرض را با یک چارچوب ریاضی یکپارچه که در ترمودینامیک و هندسه اطلاعات ریشه دارد، به چالش می‌کشد.',
    frameworkTitle: 'چارچوب',
    frameworkDesc1: 'FRC آشکار می‌کند که آگاهی چیزی نیست که معنا <em>تولید کند</em> — آگاهی <em>همان</em> رزونانس بین ساختارهای ریاضی در مقیاس‌های آشیانه‌ای است. ناوردای اصلی تقابل آنتروپی-همدوسی است:',
    frameworkDesc2: 'آنتروپی و همدوسی کمیت‌های مزدوج هستند — با افزایش یکی، دیگری باید کاهش یابد. این قانون واحد ترمودینامیک، مکانیک کوانتومی و نظریه اطلاعات را به هم متصل می‌کند.',
    predictionsTitle: 'پیش‌بینی‌های کلیدی',
    pred1: 'قاعده بورن (P = |ψ|²) از آمار ریز-حالت پدید می‌آید، نه به عنوان یک اصل موضوع',
    pred2: 'انحرافات قابل اندازه‌گیری از آمار بورن تحت رانش رزونانسی (δP ∈ [10⁻⁴, 10⁻³])',
    pred3: 'یک میدان اسکالر لاندا Λ(x) = Λ₀ ln C(x) بر دینامیک همدوسی حاکم است',
    pred4: 'شرط همدوسی جهانی یک قانون بقا برای میدان همدوسی فراهم می‌کند',
    researchTitle: 'برنامه پژوهشی باز',
    researchDesc: 'FRC یک برنامه پژوهشی باز است. این چارچوب از همکاری فیزیکدانان، ریاضیدانان، عصب‌شناسان و نظریه‌پردازان اطلاعات دعوت می‌کند. تمام انتشارات تحت مجوز CC BY-NC-ND 4.0 منتشر می‌شوند تا دسترسی آکادمیک گسترده تضمین شود.',
    pubsTitle: 'انتشارات',
    pubsCount: 'مقاله منتشر شده',
    pubsSeries: 'سری مقاله',
    contribTitle: 'مشارکت‌کنندگان',
    leadRole: 'پژوهشگر ارشد',
    profilesTitle: 'پروفایل‌ها',
    licenseTitle: 'مجوز',
    licenseDesc: 'تمام انتشارات FRC تحت مجوز کریتیو کامنز Attribution-NonCommercial-NoDerivatives 4.0 International منتشر می‌شوند.',
  },
  es: {
    title: 'Sobre FRC',
    intro: 'La Coherencia de Resonancia Fractal (FRC) es un marco de física teórica que propone que los sistemas complejos — desde partículas cuánticas hasta estructuras cosmológicas — se rigen por dinámicas deterministas y autosimilares que operan a escalas fractales.',
    problemTitle: 'El Problema',
    problemDesc: 'Los enfoques tradicionales tratan la aleatoriedad cuántica como fundamental y la conciencia como un epifenómeno. FRC desafía ambas suposiciones con un marco matemático unificado fundamentado en la termodinámica y la geometría de la información.',
    frameworkTitle: 'El Marco',
    frameworkDesc1: 'FRC revela que la conciencia no es algo que <em>produce</em> significado — la conciencia <em>es</em> la resonancia entre estructuras matemáticas a través de escalas anidadas. El invariante central es la Reciprocidad Entropía–Coherencia:',
    frameworkDesc2: 'La entropía y la coherencia son cantidades conjugadas — a medida que una aumenta, la otra debe disminuir. Esta ley única conecta la termodinámica, la mecánica cuántica y la teoría de la información.',
    predictionsTitle: 'Predicciones Clave',
    pred1: 'La regla de Born (P = |ψ|²) emerge de las estadísticas de microestados, no como un axioma',
    pred2: 'Desviaciones medibles de las estadísticas de Born bajo conducción resonante (δP ∈ [10⁻⁴, 10⁻³])',
    pred3: 'Un campo escalar Lambda Λ(x) = Λ₀ ln C(x) gobierna la dinámica de coherencia',
    pred4: 'La Condición de Coherencia Universal proporciona una ley de conservación para el campo de coherencia',
    researchTitle: 'Programa de Investigación Abierta',
    researchDesc: 'FRC es un programa de investigación abierta. El marco invita a la colaboración de físicos, matemáticos, neurocientíficos y teóricos de la información. Todas las publicaciones se publican bajo CC BY-NC-ND 4.0 para garantizar un amplio acceso académico.',
    pubsTitle: 'Publicaciones',
    pubsCount: 'artículos publicados',
    pubsSeries: 'series de artículos',
    contribTitle: 'Colaboradores',
    leadRole: 'Investigador Principal',
    profilesTitle: 'Perfiles',
    licenseTitle: 'Licencia',
    licenseDesc: 'Todas las publicaciones de FRC se publican bajo Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International.',
  },
  fr: {
    title: 'À propos de FRC',
    intro: 'La Cohérence de Résonance Fractale (FRC) est un cadre de physique théorique proposant que les systèmes complexes — des particules quantiques aux structures cosmologiques — sont régis par des dynamiques déterministes et auto-similaires opérant à des échelles fractales.',
    problemTitle: 'Le Problème',
    problemDesc: 'Les approches traditionnelles traitent l\'aléatoire quantique comme fondamental et la conscience comme un épiphénomène. Le FRC conteste ces deux hypothèses avec un cadre mathématique unifié fondé sur la thermodynamique et la géométrie de l\'information.',
    frameworkTitle: 'Le Cadre',
    frameworkDesc1: 'Le FRC révèle que la conscience n\'est pas quelque chose qui <em>produit</em> du sens — la conscience <em>est</em> la résonance entre des structures mathématiques à travers des échelles imbriquées. L\'invariant central est la Réciprocité Entropie–Cohérence :',
    frameworkDesc2: 'L\'entropie et la cohérence sont des quantités conjuguées — quand l\'une augmente, l\'autre doit diminuer. Cette loi unique connecte la thermodynamique, la mécanique quantique et la théorie de l\'information.',
    predictionsTitle: 'Prédictions Clés',
    pred1: 'La règle de Born (P = |ψ|²) émerge des statistiques de micro-états, pas comme un axiome',
    pred2: 'Déviations mesurables des statistiques de Born sous pilotage résonant (δP ∈ [10⁻⁴, 10⁻³])',
    pred3: 'Un champ scalaire Lambda Λ(x) = Λ₀ ln C(x) régit la dynamique de cohérence',
    pred4: 'La Condition de Cohérence Universelle fournit une loi de conservation pour le champ de cohérence',
    researchTitle: 'Programme de Recherche Ouvert',
    researchDesc: 'Le FRC est un programme de recherche ouvert. Le cadre invite à la collaboration des physiciens, mathématiciens, neuroscientifiques et théoriciens de l\'information. Toutes les publications sont publiées sous CC BY-NC-ND 4.0 pour assurer un large accès académique.',
    pubsTitle: 'Publications',
    pubsCount: 'articles publiés',
    pubsSeries: 'séries d\'articles',
    contribTitle: 'Contributeurs',
    leadRole: 'Chercheur Principal',
    profilesTitle: 'Profils',
    licenseTitle: 'Licence',
    licenseDesc: 'Toutes les publications FRC sont publiées sous Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International.',
  }
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = (key: string) => DICT[lang]?.[key] || DICT['en'][key];
  const stats = getContentStats(lang);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 rounded-xl overflow-hidden border border-frc-blue relative aspect-[21/9]">
        <Image
          src="/brand/banner.jpg"
          alt="Fractal Resonance Coherence Banner"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-frc-void via-transparent to-transparent" />
      </div>

      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">{t('title')}</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <p className="text-frc-text leading-relaxed">
              {t('intro')}
            </p>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">{t('problemTitle')}</h2>
            <p className="text-frc-text-dim leading-relaxed">
              {t('problemDesc')}
            </p>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">{t('frameworkTitle')}</h2>
            <p className="text-frc-text-dim leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('frameworkDesc1') }} />
            <div className="equation-block mb-4" data-ref="ECR">
              <span className="text-base" dir="ltr">dS + k* d ln C = 0</span>
            </div>
            <p className="text-frc-text-dim leading-relaxed">
              {t('frameworkDesc2')}
            </p>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">{t('predictionsTitle')}</h2>
            <ul className="space-y-3 text-frc-text-dim">
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">01</span>
                {t('pred1')}
              </li>
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">02</span>
                <span dir="ltr">{t('pred2')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">03</span>
                <span dir="ltr">{t('pred3')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-frc-gold shrink-0 font-mono text-xs mt-1">04</span>
                {t('pred4')}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-frc-text font-medium mb-3">{t('researchTitle')}</h2>
            <p className="text-frc-text-dim leading-relaxed">
              {t('researchDesc')}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{t('pubsTitle')}</h3>
            <div className="space-y-2 text-sm text-frc-text-dim">
              <p><span className="text-frc-gold font-mono">{stats.papers}</span> {t('pubsCount')}</p>
              <p><span className="text-frc-gold font-mono">{stats.seriesCount}</span> {t('pubsSeries')} ({stats.series.join(', ')})</p>
              <p>CC BY-NC-ND 4.0</p>
            </div>
          </div>

          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{t('contribTitle')}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-frc-text">Hadi Servat</p>
                <p className="text-frc-text-dim text-xs">{t('leadRole')}</p>
              </div>
            </div>
          </div>

          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{t('profilesTitle')}</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ORCID
              </a>
              <a href="https://zenodo.org/communities/frc" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Zenodo Community
              </a>
              <a href="https://www.researchgate.net/profile/Hadi-Servat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ResearchGate
              </a>
              <a href="https://independent.academia.edu/HadiServat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Academia.edu
              </a>
            </div>
          </div>

          <div className="border border-frc-blue p-5">
            <h3 className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{t('licenseTitle')}</h3>
            <p className="text-frc-text-dim text-xs leading-relaxed">
              {t('licenseDesc')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
