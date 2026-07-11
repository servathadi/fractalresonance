import type { PaperCanonStatus, RawFrontmatter } from '@/lib/content';
import { getMuLevel } from '@/lib/mu-levels';

const OPEN_WORK: Record<string, string> = {
  'FRC-100-000': 'Router only: evaluate the cited primary papers rather than treating this map as evidence.',
  'FRC-100-002': 'KAM correspondence, crossover tolerance, and out-of-sample mechanism collapse remain open.',
  'FRC-100-002-001': 'A dense resonance-window sweep is required to test whether the structure functional beats entropy-only ranking; quantum and cross-mechanism gates remain open.',
  'FRC-100-003': 'Operational equivalence, no-signaling, and environment accounting remain open.',
  'FRC-100-005': 'The negative result remains scoped to the tested closure and normalization.',
  'FRC-100-007': 'The audited implementations fail in scope; no replacement ontology is established.',
  'FRC-566-001': 'The universal physical extension remains conjectural beyond declared bookkeeping.',
  'FRC-566-030': 'The exact family contains no bath or independent entropy-production channel.',
  'FRC-787-787': 'Independent platform validation and wins over equal-feature baselines remain required.',
  'FRC-826-829': 'Definitions and propositions are retained separately from conjectures and open problems.',
  'FRC-700-777': 'The interface record needs real case studies; this note does not establish cross-register causation or physical reciprocity.',
};

const LABELS: Record<string, Record<string, string>> = {
  en: { title: 'Reading status', statement: 'Current statement', evidence: 'Evidence level', register: 'Declared μ register', open: 'Open boundary', lineage: 'Version lineage', core: 'Living core preprint', frontier: 'Frontier preprint', framework: 'Philosophical / formal framework note', archive: 'Historical record', exact: 'Exact in declared scope', model: 'Model-specific result', pilot: 'Pilot-supported program', map: 'Version router', supersedes: 'Supersedes', current: 'Current release' },
  es: { title: 'Estado de lectura', statement: 'Declaración actual', evidence: 'Nivel de evidencia', register: 'Registro μ declarado', open: 'Límite abierto', lineage: 'Linaje de versión', core: 'Preprint del núcleo vivo', frontier: 'Preprint de frontera', framework: 'Nota filosófica / formal del marco', archive: 'Registro histórico', exact: 'Exacto en el alcance declarado', model: 'Resultado específico del modelo', pilot: 'Programa con piloto', map: 'Mapa de versiones', supersedes: 'Sustituye a', current: 'Versión actual' },
  fr: { title: 'Statut de lecture', statement: 'Énoncé actuel', evidence: 'Niveau de preuve', register: 'Registre μ déclaré', open: 'Limite ouverte', lineage: 'Lignée de version', core: 'Prépublication du cœur vivant', frontier: 'Prépublication frontière', framework: 'Note philosophique / formelle du cadre', archive: 'Archive historique', exact: 'Exact dans le cadre déclaré', model: 'Résultat propre au modèle', pilot: 'Programme soutenu par pilote', map: 'Routeur de versions', supersedes: 'Remplace', current: 'Version actuelle' },
  fa: { title: 'وضعیت مطالعه', statement: 'بیان کنونی', evidence: 'سطح شواهد', register: 'ثبت μ اعلام‌شده', open: 'مرز باز', lineage: 'تبار نسخه', core: 'پیش‌چاپ هسته زنده', frontier: 'پیش‌چاپ مرزی', framework: 'یادداشت فلسفی / صوری چارچوب', archive: 'رکورد تاریخی', exact: 'دقیق در دامنه اعلام‌شده', model: 'نتیجه وابسته به مدل', pilot: 'برنامه دارای پایلوت', map: 'نقشه نسخه‌ها', supersedes: 'جایگزین', current: 'نسخه کنونی' },
};

function evidenceLabel(frontmatter: RawFrontmatter, canonStatus: PaperCanonStatus, t: Record<string, string>) {
  if (canonStatus === 'archive') return t.archive;
  if (frontmatter.id === 'FRC-100-000') return t.map;
  if (canonStatus === 'framework') return t.framework;
  if (frontmatter.id === 'FRC-566-030') return t.exact;
  if (['FRC-100-005', 'FRC-100-007'].includes(frontmatter.id)) return t.model;
  if (frontmatter.tldr?.toLowerCase().includes('pilot') || frontmatter.abstract?.toLowerCase().includes('pilot')) return t.pilot;
  return canonStatus === 'frontier' ? t.frontier : t.core;
}

export function PaperStatusPanel({
  frontmatter,
  canonStatus,
  lang,
}: {
  frontmatter: RawFrontmatter;
  canonStatus: PaperCanonStatus;
  lang: string;
}) {
  const t = LABELS[lang] || LABELS.en;
  const statement = frontmatter.tldr || frontmatter.abstract || frontmatter.statusNote || 'See the paper abstract and scope statement.';
  const openWork = OPEN_WORK[frontmatter.id] || 'Review the paper’s declared scope, controls, limitations, and kill conditions.';
  const lineage = frontmatter.supersedes
    ? `${t.supersedes}: ${frontmatter.supersedes}`
    : `${frontmatter.version || t.current} · ${t.current}`;
  const muLevel = getMuLevel(frontmatter.muLevel);

  return (
    <section className="mb-9 border-y border-frc-blue py-5" aria-labelledby="paper-reading-status">
      <h2 id="paper-reading-status" className="font-mono text-[0.72rem] text-frc-gold uppercase tracking-widest mb-4">
        {t.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <h3 className="text-[0.72rem] text-frc-steel uppercase tracking-wider mb-2">{t.statement}</h3>
          <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-4">{statement}</p>
        </div>
        <div>
          <h3 className="text-[0.72rem] text-frc-steel uppercase tracking-wider mb-2">{t.evidence}</h3>
          <p className="text-sm text-frc-text">{evidenceLabel(frontmatter, canonStatus, t)}</p>
          {frontmatter.publicationState && <p className="text-xs text-frc-text-dim mt-1">{frontmatter.publicationState}</p>}
        </div>
        {muLevel && (
          <div>
            <h3 className="text-[0.72rem] text-frc-steel uppercase tracking-wider mb-2">{t.register || 'Declared μ register'}</h3>
            <p className="text-sm text-frc-text">{muLevel.symbol} · {muLevel.title}</p>
            <p className="text-xs text-frc-text-dim mt-1">{muLevel.description}</p>
          </div>
        )}
        <div>
          <h3 className="text-[0.72rem] text-frc-steel uppercase tracking-wider mb-2">{t.open}</h3>
          <p className="text-sm text-frc-text-dim leading-relaxed">{openWork}</p>
        </div>
        <div>
          <h3 className="text-[0.72rem] text-frc-steel uppercase tracking-wider mb-2">{t.lineage}</h3>
          <p className="text-sm text-frc-text-dim leading-relaxed">{lineage}</p>
        </div>
      </div>
    </section>
  );
}
