import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { SchemaScript } from '@/components/SchemaScript';
import { EpistemicBadge, type EpistemicStatus } from '@/components/EpistemicBadge';
import { TaxonomyLink } from '@/components/TaxonomyLink';
import { schemaCollectionPage, type ListItemMeta } from '@/lib/schema';
import {
  getConcept,
  getContentsByTag,
  getLanguages,
  isRevisionPendingPaper,
  getTaxonomyRouteSlugs,
  type CorpusEpistemicStatus,
  type TaxonomyContentItem,
  type TaxonomyContentType,
} from '@/lib/content';
import {
  canonicalizeTaxon,
  getTaxonomyDescription,
  getTaxonomyEntry,
  getTaxonomyHref,
  getTaxonomyLabel,
} from '@/lib/taxonomy';

interface Props {
  params: Promise<{ lang: string; tag: string }>;
}

const STATUS_ORDER: CorpusEpistemicStatus[] = [
  'primary',
  'frontier',
  'commentary',
  'conceptual',
  'philosophical',
  'archive',
];

const DICT: Record<string, {
  tags: string;
  items: string;
  currentDefinition: string;
  readConcept: string;
  related: string;
  noDescription: string;
  primary: string;
  frontier: string;
  commentary: string;
  conceptual: string;
  philosophical: string;
  archive: string;
  paper: string;
  concept: string;
  topic: string;
  article: string;
  blog: string;
  book: string;
  kasra: string;
  river: string;
  both: string;
}> = {
  en: { tags: 'Tags', items: 'items', currentDefinition: 'Current reading', readConcept: 'Read the concept note', related: 'Related', noDescription: 'A cross-corpus navigation page. Check each item’s declared scope and evidence status.', primary: 'Primary research', frontier: 'Frontier research', commentary: 'Commentary', conceptual: 'Concepts and topics', philosophical: 'Philosophical work', archive: 'Archive / development history', paper: 'Paper', concept: 'Concept', topic: 'Topic', article: 'Article', blog: 'Blog', book: 'Book', kasra: 'Technical view', river: 'Narrative view', both: 'Both views' },
  es: { tags: 'Etiquetas', items: 'elementos', currentDefinition: 'Lectura actual', readConcept: 'Leer la nota conceptual', related: 'Relacionadas', noDescription: 'Una página de navegación entre el corpus. Revise el alcance y el estado de evidencia declarados de cada elemento.', primary: 'Investigación primaria', frontier: 'Investigación de frontera', commentary: 'Comentario', conceptual: 'Conceptos y temas', philosophical: 'Trabajo filosófico', archive: 'Archivo / historia de desarrollo', paper: 'Artículo', concept: 'Concepto', topic: 'Tema', article: 'Artículo de comentario', blog: 'Blog', book: 'Libro', kasra: 'Vista técnica', river: 'Vista narrativa', both: 'Ambas vistas' },
  fr: { tags: 'Étiquettes', items: 'éléments', currentDefinition: 'Lecture actuelle', readConcept: 'Lire la note conceptuelle', related: 'Associées', noDescription: 'Une page de navigation dans le corpus. Vérifiez le cadre et le niveau de preuve déclarés de chaque élément.', primary: 'Recherche primaire', frontier: 'Recherche de frontière', commentary: 'Commentaire', conceptual: 'Concepts et sujets', philosophical: 'Travail philosophique', archive: 'Archives / histoire du développement', paper: 'Article', concept: 'Concept', topic: 'Sujet', article: 'Article de commentaire', blog: 'Blog', book: 'Livre', kasra: 'Vue technique', river: 'Vue narrative', both: 'Les deux vues' },
  fa: { tags: 'برچسب‌ها', items: 'مورد', currentDefinition: 'خوانش کنونی', readConcept: 'یادداشت مفهومی را بخوانید', related: 'مرتبط', noDescription: 'یک صفحه ناوبری میان‌پیکره‌ای است. دامنه و وضعیت شواهد اعلام‌شده هر مورد را بررسی کنید.', primary: 'پژوهش اصلی', frontier: 'پژوهش مرزی', commentary: 'تفسیر', conceptual: 'مفاهیم و موضوعات', philosophical: 'کار فلسفی', archive: 'بایگانی / تاریخچه توسعه', paper: 'مقاله', concept: 'مفهوم', topic: 'موضوع', article: 'مقاله تفسیری', blog: 'وبلاگ', book: 'کتاب', kasra: 'نمای فنی', river: 'نمای روایی', both: 'هر دو نما' },
};

function contentHref(basePath: string, item: TaxonomyContentItem): string {
  const segment: Record<TaxonomyContentType, string> = {
    paper: 'papers',
    concept: 'concepts',
    topic: 'topics',
    article: 'articles',
    blog: 'blog',
    book: 'books',
  };
  return `${basePath}/${segment[item.type]}/${item.content.frontmatter.id}`;
}

function perspectiveLabel(perspective: string | undefined, t: typeof DICT.en): string | undefined {
  if (perspective === 'kasra') return t.kasra;
  if (perspective === 'river') return t.river;
  if (perspective === 'both') return t.both;
  return undefined;
}

export async function generateStaticParams() {
  return getLanguages().flatMap((lang) => getTaxonomyRouteSlugs(lang).map((tag) => ({ lang, tag })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params;
  const canonicalTag = canonicalizeTaxon(decodeURIComponent(tag));
  const title = getTaxonomyLabel(canonicalTag, lang);
  const description = getTaxonomyDescription(canonicalTag, lang)
    || `Cross-corpus navigation for ${title}. Check each item’s declared scope and evidence status.`;

  return {
    title: `${title} — FRC`,
    description,
    alternates: { canonical: `https://fractalresonance.com/${lang}/tags/${canonicalTag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const canonicalTag = canonicalizeTaxon(decodedTag);
  const basePath = `/${lang}`;

  if (decodedTag !== canonicalTag) {
    permanentRedirect(getTaxonomyHref(basePath, canonicalTag));
  }

  const t = DICT[lang] || DICT.en;
  const results = getContentsByTag(lang, canonicalTag);
  if (results.length === 0) notFound();

  const entry = getTaxonomyEntry(canonicalTag);
  const concept = entry?.conceptId ? getConcept(lang, entry.conceptId) : undefined;
  const counts = new Map<string, number>();
  results.forEach((item) => item.taxons.forEach((taxon) => {
    if (taxon !== canonicalTag) counts.set(taxon, (counts.get(taxon) || 0) + 1);
  }));
  const related = [...counts.entries()]
    .filter(([taxon]) => getContentsByTag(lang, taxon).length > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([taxon]) => taxon);

  const schemaItems: ListItemMeta[] = results.map((item) => ({
    name: item.content.frontmatter.title,
    url: `https://fractalresonance.com${contentHref(basePath, item)}`,
    description: item.content.frontmatter.abstract || '',
  }));
  const collectionSchema = schemaCollectionPage(
    `${getTaxonomyLabel(canonicalTag, lang)} — FRC`,
    getTaxonomyDescription(canonicalTag, lang) || t.noDescription,
    `https://fractalresonance.com${getTaxonomyHref(basePath, canonicalTag)}`,
    schemaItems,
    lang,
  );

  return (
    <>
      <SchemaScript data={collectionSchema} />
      <main className="max-w-5xl mx-auto px-6 py-14">
        <header className="mb-12 border-b border-frc-blue pb-8">
          <nav className="flex items-center gap-2 text-sm text-frc-text-dim mb-5" aria-label="Breadcrumb">
            <Link href={basePath} className="hover:text-frc-gold">FRC</Link>
            <span>/</span>
            <Link href={`${basePath}/tags`} className="hover:text-frc-gold">{t.tags}</Link>
            <span>/</span>
            <span className="text-frc-text">{getTaxonomyLabel(canonicalTag, lang)}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-widest text-frc-steel mb-2">{entry?.group || t.tags}</p>
              <h1 className="text-3xl font-light text-frc-gold">{getTaxonomyLabel(canonicalTag, lang)}</h1>
            </div>
            <span className="font-mono text-sm text-frc-steel">{results.length} {t.items}</span>
          </div>
          <div className="mt-5 max-w-3xl border-l-2 border-frc-gold pl-4 text-sm leading-relaxed text-frc-text-dim">
            <p>{getTaxonomyDescription(canonicalTag, lang) || t.noDescription}</p>
            {concept && (
              <Link href={`${basePath}/concepts/${concept.frontmatter.id}`} className="inline-block mt-3 text-frc-gold hover:underline">
                {t.readConcept} &rarr;
              </Link>
            )}
          </div>
          {related.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-[0.72rem] uppercase tracking-wider text-frc-steel">{t.related}</span>
              {related.map((taxon) => (
                <TaxonomyLink key={taxon} taxon={taxon} basePath={basePath} lang={lang} className="tag hover:text-frc-gold hover:border-frc-gold transition-colors" />
              ))}
            </div>
          )}
        </header>

        {STATUS_ORDER.map((status) => {
          const items = results.filter((item) => item.epistemicStatus === status);
          if (items.length === 0) return null;
          return (
            <section key={status} className="mb-11" aria-labelledby={`tag-${canonicalTag}-${status}`}>
              <h2 id={`tag-${canonicalTag}-${status}`} className="text-xs uppercase tracking-widest text-frc-steel border-b border-frc-blue pb-3 mb-4">
                {t[status]} <span className="text-frc-text-dim">({items.length})</span>
              </h2>
              <div className="grid gap-4">
                {items.map((item) => {
                  const fm = item.content.frontmatter;
                  const perspective = perspectiveLabel(fm.perspective, t);
                  return (
                    <article key={`${item.type}-${fm.id}`} className="border border-frc-blue bg-frc-void-light px-5 py-4 hover:border-frc-gold-light transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <EpistemicBadge status={item.epistemicStatus as EpistemicStatus} lang={lang} />
                        <span className="font-mono text-[0.7rem] uppercase text-frc-steel">{t[item.type]}</span>
                        {fm.version && <span className="font-mono text-[0.7rem] text-frc-gold">{fm.version}</span>}
                        {(isRevisionPendingPaper(fm.id) || fm.publicationState?.toLowerCase() === 'revision pending') && <span className="font-mono text-[0.7rem] uppercase text-frc-steel">revision pending</span>}
                        {perspective && <span className="text-[0.7rem] text-frc-steel">{perspective}</span>}
                        {fm.date && <span className="text-[0.7rem] text-frc-steel">{fm.date}</span>}
                      </div>
                      <Link href={contentHref(basePath, item)} className="group">
                        <h3 className="text-lg text-frc-text group-hover:text-frc-gold transition-colors font-medium">{fm.title}</h3>
                        {fm.abstract && <p className="text-sm text-frc-text-dim leading-relaxed mt-2 line-clamp-3">{fm.abstract}</p>}
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
