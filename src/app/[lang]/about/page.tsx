import type { Metadata } from 'next';
import { getLanguages, getContentStats } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Fractal Resonance Coherence — a living, status-labeled research program for entropy, coherence, and open systems.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'About FRC',
    intro: 'Fractal Resonance Coherence (FRC) is a living research program connecting entropy, coherence, open-system physics, chaos, measurement, and computation.',
    problemTitle: 'The Problem',
    problemDesc: 'Coherence is operationalized differently across fields, and broad foundational claims often blur mathematical identities, model-specific results, and physical conjectures. FRC makes those boundaries explicit and testable.',
    frameworkTitle: 'The Framework',
    frameworkDesc1: 'The canonical, scale-invariant relation is Entropy–Coherence Reciprocity:',
    frameworkDesc2: 'Operational realizations must declare scale, observables, units, and boundary. FRC uses the relation as bookkeeping and a control law; its universal physical extension remains conjectural.',
    predictionsTitle: 'Claim Status',
    pred1: 'Exact identities are established for declared mathematical families, including the von Mises/Kuramoto result in FRC 566.030',
    pred2: 'Chaos, localization, collapse, and transport results are model-specific or pilot-supported and retain explicit open gates',
    pred3: 'Lambda_obs, Lambda_eq, and optional Lambda_dyn are distinct operational or effective objects',
    pred4: 'A universal physical law, fundamental Lambda field, and Born mechanism remain conjectural',
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
    intro: 'همدوسی رزونانس فراکتال (FRC) یک برنامه پژوهشی زنده درباره آنتروپی، همدوسی، سامانه‌های باز، آشوب، اندازه‌گیری و محاسبه است.',
    problemTitle: 'مسئله',
    problemDesc: 'همدوسی در رشته‌های مختلف به شکل‌های متفاوت تعریف می‌شود و ادعاهای گسترده اغلب همانی ریاضی، نتیجه وابسته به مدل و فرضیه فیزیکی را درهم می‌آمیزند. FRC این مرزها را روشن می‌کند.',
    frameworkTitle: 'چارچوب',
    frameworkDesc1: 'رابطه بنیادی و ناوردای مقیاس تقابل آنتروپی-همدوسی است:',
    frameworkDesc2: 'صورت‌های عملیاتی باید مقیاس، مشاهده‌پذیرها، واحدها و مرز را اعلام کنند. جهان‌شمولی فیزیکی رابطه همچنان فرضیه است.',
    predictionsTitle: 'وضعیت ادعاها',
    pred1: 'همانی‌های دقیق برای خانواده‌های ریاضی اعلام‌شده برقرارند',
    pred2: 'نتایج آشوب، موضعی‌شدن، فروپاشی و انتقال وابسته به مدل یا مقدماتی‌اند',
    pred3: 'Lambda_obs، Lambda_eq و Lambda_dyn اشیای جداگانه عملیاتی یا مؤثرند',
    pred4: 'قانون فیزیکی جهان‌شمول، میدان بنیادی لاندا و سازوکار بورن فرضیه‌اند',
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
    intro: 'La Coherencia de Resonancia Fractal (FRC) es un programa de investigación vivo sobre entropía, coherencia, sistemas abiertos, caos, medición y computación.',
    problemTitle: 'El Problema',
    problemDesc: 'La coherencia se define de forma distinta entre campos y las afirmaciones amplias suelen mezclar identidades matemáticas, resultados de modelos y conjeturas físicas. FRC separa esos niveles.',
    frameworkTitle: 'El Marco',
    frameworkDesc1: 'La relación canónica e invariante de escala es la Reciprocidad Entropía–Coherencia:',
    frameworkDesc2: 'Las realizaciones operativas declaran escala, observables, unidades y frontera. Su extensión física universal sigue siendo conjetural.',
    predictionsTitle: 'Estado de las afirmaciones',
    pred1: 'Existen identidades exactas para familias matemáticas declaradas',
    pred2: 'Los resultados de caos, localización, colapso y transporte son específicos de modelos o pilotos',
    pred3: 'Lambda_obs, Lambda_eq y Lambda_dyn son objetos operativos o efectivos distintos',
    pred4: 'La ley física universal, el campo Lambda fundamental y el mecanismo de Born son conjeturas',
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
    intro: 'La Cohérence de Résonance Fractale (FRC) est un programme de recherche vivant sur l’entropie, la cohérence, les systèmes ouverts, le chaos, la mesure et le calcul.',
    problemTitle: 'Le Problème',
    problemDesc: 'La cohérence varie selon les disciplines et les affirmations larges confondent souvent identités mathématiques, résultats de modèles et conjectures physiques. FRC sépare ces niveaux.',
    frameworkTitle: 'Le Cadre',
    frameworkDesc1: 'La relation canonique et invariante d’échelle est la Réciprocité Entropie–Cohérence :',
    frameworkDesc2: 'Les réalisations opérationnelles déclarent échelle, observables, unités et frontière. L’extension physique universelle reste conjecturale.',
    predictionsTitle: 'Statut des affirmations',
    pred1: 'Des identités exactes sont établies pour des familles mathématiques déclarées',
    pred2: 'Les résultats sur le chaos, la localisation, l’effondrement et le transport sont propres aux modèles ou pilotes',
    pred3: 'Lambda_obs, Lambda_eq et Lambda_dyn sont des objets opérationnels ou effectifs distincts',
    pred4: 'La loi physique universelle, le champ Lambda fondamental et le mécanisme de Born restent conjecturaux',
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
