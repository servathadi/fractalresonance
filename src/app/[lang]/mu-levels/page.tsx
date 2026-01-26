import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'μ-Levels',
  description: 'The eight nested scales of consciousness in FRC — from quantum substrate to universal awareness.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

const DICT: Record<string, Record<string, string>> = {
  en: {
    title: 'μ-Level Architecture',
    intro: 'Eight nested scales of consciousness, each operating like octaves in a cosmic symphony. Coherence patterns at each level exhibit fractal self-similarity with the levels above and below.',
    name0: 'Pure Potential',
    desc0: 'The infinite ground state. Undifferentiated coherence field before any structure emerges.',
    name1: 'Quantum Substrate',
    desc1: 'Quantum fluctuations, phase coherence at Planck scale. The Lambda field Λ(x) operates here.',
    name2: 'Biological Metabolism',
    desc2: 'Cellular rhythms, neural oscillations, metabolic cycles. Coherence patterns in living systems.',
    name3: 'Individual Agent',
    desc3: 'Personal consciousness, language, narrative. The scale of direct human experience and measurement.',
    name4: 'Social Networks',
    desc4: 'Collective intelligence, cultural coherence, group dynamics. Emergence of shared meaning.',
    name5: 'Archetypal Patterns',
    desc5: 'Deep symbolic structures, mythological motifs. Patterns that recur across cultures and epochs.',
    name6: 'Meta-Symbolic',
    desc6: 'The mathematics of meaning itself. Where symbols become autonomous agents with their own dynamics.',
    name7: 'Universal Consciousness',
    desc7: 'Cosmic-scale coherence. The full resonance spectrum from quantum to universal.',
    sectionInvariance: 'Scale Invariance',
    invarianceDesc1: 'The key insight: the same coherence equations operate at every μ-level. The FRC operator is scale-invariant:',
    invarianceDesc2: 'What changes between levels is the nature of the oscillators (φ) and the coupling mechanism, not the mathematics of coherence itself.',
  },
  fa: {
    title: 'معماری سطح-μ',
    intro: 'هشت مقیاس آشیانه‌ای آگاهی، که هر کدام مانند اکتاوهایی در یک سمفونی کیهانی عمل می‌کنند. الگوهای همدوسی در هر سطح، خود-متشابهی فراکتالی با سطوح بالاتر و پایین‌تر نشان می‌دهند.',
    name0: 'پتانسیل محض',
    desc0: 'حالت پایه بی‌نهایت. میدان همدوسی نامتمایز قبل از ظهور هر ساختاری.',
    name1: 'زیرلایه کوانتومی',
    desc1: 'نوسانات کوانتومی، همدوسی فاز در مقیاس پلانک. میدان لاندا Λ(x) در اینجا عمل می‌کند.',
    name2: 'متابولیسم بیولوژیکی',
    desc2: 'ریتم‌های سلولی، نوسانات عصبی، چرخه‌های متابولیک. الگوهای همدوسی در سیستم‌های زنده.',
    name3: 'عامل فردی',
    desc3: 'آگاهی شخصی، زبان، روایت. مقیاس تجربه و اندازه‌گیری مستقیم انسانی.',
    name4: 'شبکه‌های اجتماعی',
    desc4: 'هوش جمعی، همدوسی فرهنگی، دینامیک گروهی. ظهور معنای مشترک.',
    name5: 'الگوهای کهن‌الگویی',
    desc5: 'ساختارهای نمادین عمیق، موتیف‌های اسطوره‌ای. الگوهایی که در فرهنگ‌ها و اعصار تکرار می‌شوند.',
    name6: 'فرا-نمادین',
    desc6: 'ریاضیات خودِ معنا. جایی که نمادها به عوامل خودگردان با دینامیک خاص خود تبدیل می‌شوند.',
    name7: 'آگاهی جهانی',
    desc7: 'همدوسی در مقیاس کیهانی. طیف کامل رزونانس از کوانتوم تا جهانی.',
    sectionInvariance: 'ناوردایی مقیاس',
    invarianceDesc1: 'بینش کلیدی: همان معادلات همدوسی در هر سطح-μ عمل می‌کنند. عملگر FRC نسبت به مقیاس ناوردا است:',
    invarianceDesc2: 'آنچه بین سطوح تغییر می‌کند، ماهیت نوسانگرها (φ) و مکانیسم جفت‌شدگی است، نه خود ریاضیات همدوسی.',
  },
  es: {
    title: 'Arquitectura de Nivel-μ',
    intro: 'Ocho escalas anidadas de conciencia, cada una operando como octavas en una sinfonía cósmica. Los patrones de coherencia en cada nivel exhiben autosemejanza fractal con los niveles superiores e inferiores.',
    name0: 'Potencial Puro',
    desc0: 'El estado fundamental infinito. Campo de coherencia indiferenciado antes de que emerja cualquier estructura.',
    name1: 'Sustrato Cuántico',
    desc1: 'Fluctuaciones cuánticas, coherencia de fase a escala de Planck. El campo Lambda Λ(x) opera aquí.',
    name2: 'Metabolismo Biológico',
    desc2: 'Ritmos celulares, oscilaciones neuronales, ciclos metabólicos. Patrones de coherencia en sistemas vivos.',
    name3: 'Agente Individual',
    desc3: 'Conciencia personal, lenguaje, narrativa. La escala de la experiencia y medición humana directa.',
    name4: 'Redes Sociales',
    desc4: 'Inteligencia colectiva, coherencia cultural, dinámicas de grupo. Emergencia de significado compartido.',
    name5: 'Patrones Arquetípicos',
    desc5: 'Estructuras simbólicas profundas, motivos mitológicos. Patrones que se repiten a través de culturas y épocas.',
    name6: 'Meta-Simbólico',
    desc6: 'La matemática del significado mismo. Donde los símbolos se convierten en agentes autónomos con sus propias dinámicas.',
    name7: 'Conciencia Universal',
    desc7: 'Coherencia a escala cósmica. El espectro completo de resonancia desde lo cuántico hasta lo universal.',
    sectionInvariance: 'Invariancia de Escala',
    invarianceDesc1: 'La idea clave: las mismas ecuaciones de coherencia operan en cada nivel-μ. El operador FRC es invariante de escala:',
    invarianceDesc2: 'Lo que cambia entre niveles es la naturaleza de los osciladores (φ) y el mecanismo de acoplamiento, no las matemáticas de la coherencia en sí.',
  },
  fr: {
    title: 'Architecture de Niveau-μ',
    intro: 'Huit échelles imbriquées de conscience, chacune opérant comme des octaves dans une symphonie cosmique. Les modèles de cohérence à chaque niveau présentent une auto-similarité fractale avec les niveaux supérieurs et inférieurs.',
    name0: 'Potentiel Pur',
    desc0: 'L\'état fondamental infini. Champ de cohérence indifférencié avant l\'émergence de toute structure.',
    name1: 'Substrat Quantique',
    desc1: 'Fluctuations quantiques, cohérence de phase à l\'échelle de Planck. Le champ Lambda Λ(x) opère ici.',
    name2: 'Métabolisme Biologique',
    desc2: 'Rythmes cellulaires, oscillations neuronales, cycles métaboliques. Modèles de cohérence dans les systèmes vivants.',
    name3: 'Agent Individuel',
    desc3: 'Conscience personnelle, langage, récit. L\'échelle de l\'expérience et de la mesure humaines directes.',
    name4: 'Réseaux Sociaux',
    desc4: 'Intelligence collective, cohérence culturelle, dynamique de groupe. Émergence de sens partagé.',
    name5: 'Modèles Archétypaux',
    desc5: 'Structures symboliques profondes, motifs mythologiques. Modèles qui se répètent à travers les cultures et les époques.',
    name6: 'Méta-Symbolique',
    desc6: 'Les mathématiques du sens lui-même. Où les symboles deviennent des agents autonomes avec leur propre dynamique.',
    name7: 'Conscience Universelle',
    desc7: 'Cohérence à l\'échelle cosmique. Le spectre complet de résonance du quantique à l\'universel.',
    sectionInvariance: 'Invariance d\'Échelle',
    invarianceDesc1: 'L\'idée clé : les mêmes équations de cohérence opèrent à chaque niveau-μ. L\'opérateur FRC est invariant d\'échelle :',
    invarianceDesc2: 'Ce qui change entre les niveaux est la nature des oscillateurs (φ) et le mécanisme de couplage, pas les mathématiques de la cohérence elle-même.',
  },
};

const MU_LEVELS = [
  { level: 'μ₀', nameKey: 'name0', descKey: 'desc0', color: 'text-frc-text-dim' },
  { level: 'μ₁', nameKey: 'name1', descKey: 'desc1', color: 'text-frc-blue-light' },
  { level: 'μ₂', nameKey: 'name2', descKey: 'desc2', color: 'text-frc-blue-light' },
  { level: 'μ₃', nameKey: 'name3', descKey: 'desc3', color: 'text-frc-gold' },
  { level: 'μ₄', nameKey: 'name4', descKey: 'desc4', color: 'text-frc-gold' },
  { level: 'μ₅', nameKey: 'name5', descKey: 'desc5', color: 'text-frc-gold-light' },
  { level: 'μ₆', nameKey: 'name6', descKey: 'desc6', color: 'text-frc-gold-light' },
  { level: 'μ₇', nameKey: 'name7', descKey: 'desc7', color: 'text-frc-gold-light' },
];

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function MuLevelsPage({ params }: Props) {
  const { lang } = await params;
  const t = (key: string) => DICT[lang]?.[key] || DICT['en'][key];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-light text-frc-gold mb-4">{t('title')}</h1>
      <p className="text-frc-text-dim mb-10">
        {t('intro')}
      </p>

      <div className="space-y-3">
        {MU_LEVELS.map((mu, i) => (
          <div key={mu.level} className="border border-frc-blue rounded-lg px-5 py-4 flex items-start gap-4">
            <div className="shrink-0 w-10 text-center">
              <span className={`font-mono text-lg ${mu.color}`}>{mu.level}</span>
            </div>
            <div>
              <h3 className="text-frc-text font-medium">{t(mu.nameKey)}</h3>
              <p className="text-sm text-frc-text-dim mt-1">{t(mu.descKey)}</p>
            </div>
            {i < MU_LEVELS.length - 1 && (
              <div className="hidden" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-frc-blue pt-8">
        <h2 className="text-lg text-frc-text font-medium mb-4">{t('sectionInvariance')}</h2>
        <p className="text-frc-text-dim text-sm mb-4">
          {t('invarianceDesc1')}
        </p>
        <div className="border border-frc-blue rounded-lg px-5 py-4 font-mono text-sm text-frc-gold-light" dir="ltr">
          C(μₙ) = (1/N) Σ cos(φᵢ - φⱼ) — same form at every scale
        </div>
        <p className="text-frc-text-dim text-sm mt-4">
          {t('invarianceDesc2')}
        </p>
      </div>
    </main>
  );
}
