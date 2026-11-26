import Link from 'next/link';
import {
  estimateReadTime,
  getBlogPosts,
  isCurrentReadingContent,
  matchesPerspectiveView,
  normalizeEdgeScopeTag,
  normalizePrimarySources,
  type PerspectiveView,
} from '@/lib/content';
import { Suspense } from 'react';
import { BlogGridClient, type BlogGridItem } from '@/components/pages/BlogGridClient';

const DICT: Record<string, { title: string; desc: string; boundary: string; papersLink: string; ledgerLink: string; noPosts: string }> = {
  en: {
    title: 'Field Notes & Edge Dispatches',
    desc: 'Working research notes, experimental logs, and weekly FRC Edge Dispatches. Strictly distinct from the canonical papers and versioned proofs.',
    boundary: 'Commentary & field notes only. Primary scientific claims live in the numbered papers and the public Falsification Ledger.',
    papersLink: 'Browse canonical papers',
    ledgerLink: 'Falsification ledger',
    noPosts: 'No field notes published yet.',
  },
  fa: {
    title: 'یادداشت‌های میدانی و گزارش‌های مرزی',
    desc: 'یادداشت‌های پژوهشی، گزارش‌های آزمایشی و مرور هفتگی ادبیات روز در نسبت با FRC؛ کاملاً متمایز از مقالات کانونیک.',
    boundary: 'صرفاً یادداشت و تفسیر پژوهشی. ادعاهای علمی اصلی در مقالات شماره‌گذاری‌شده و دفتر ابطال‌ها ثبت می‌شوند.',
    papersLink: 'مرور مقالات کانونیک',
    ledgerLink: 'دفتر ابطال‌ها',
    noPosts: 'هنوز یادداشتی منتشر نشده است.',
  },
  es: {
    title: 'Notas de campo y Edge Dispatches',
    desc: 'Notas prácticas, registros experimentales y despachos semanales sobre literatura externa. Estrictamente distintos de los artículos canónicos.',
    boundary: 'Solo comentarios y notas de campo. Las afirmaciones científicas primarias viven en los artículos numerados y el Registro de Falsaciones.',
    papersLink: 'Explorar artículos canónicos',
    ledgerLink: 'Registro de falsaciones',
    noPosts: 'Aún no hay publicaciones.',
  },
  fr: {
    title: 'Notes de terrain et Edge Dispatches',
    desc: 'Notes de travail, journaux d’expériences et dépêches hebdomadaires. Strictement distincts des articles canoniques.',
    boundary: 'Commentaires et notes de terrain uniquement. Les énoncés scientifiques primaires figurent dans les articles numérotés et le Registre des Réfutations.',
    papersLink: 'Parcourir les articles canoniques',
    ledgerLink: 'Registre des réfutations',
    noPosts: 'Aucune publication pour le moment.',
  },
};

export function BlogIndex({
  lang,
  basePath,
  view,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  embedded?: boolean;
}) {
  const posts = getBlogPosts(lang)
    .filter((p) => isCurrentReadingContent('blog', p.frontmatter) && matchesPerspectiveView(p.frontmatter.perspective, view))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const items: BlogGridItem[] = posts.map((post, idx) => {
    const fm = post.frontmatter;
    const readTime = fm.read_time || estimateReadTime(post.body);
    return {
      id: fm.id,
      title: fm.title,
      abstract: fm.abstract,
      date: fm.date,
      href: `${basePath}/blog/${fm.id}`,
      tags: Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === 'string') : [],
      scopeTag: normalizeEdgeScopeTag(fm.scopeTag),
      primarySourcesCount: normalizePrimarySources(fm.primarySources).length,
      readTime,
      ordinal: idx + 1,
    };
  });

  const t = DICT[lang] || DICT.en;

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
      <header className="mb-10 border-b border-frc-blue pb-8">
        <h1 className="text-3xl sm:text-4xl font-light text-frc-gold tracking-[-0.025em] leading-[1.12] mb-4">
          {t.title}
        </h1>
        <p className="text-base text-frc-text-dim max-w-[65ch] leading-relaxed mb-5">
          {t.desc}
        </p>
        <div className="border-s-2 border-frc-blue-light ps-4 text-sm text-frc-steel">
          <p className="mb-2">{t.boundary}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href={`${basePath}/papers`} className="text-frc-gold hover:underline">
              {t.papersLink} →
            </Link>
            <Link href={`${basePath}/falsifications`} className="text-frc-text-dim hover:text-frc-gold transition-colors">
              {t.ledgerLink} →
            </Link>
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <section className="border-t border-frc-blue pt-6 text-sm text-frc-text-dim">
          {t.noPosts}
        </section>
      ) : (
        <Suspense fallback={<div className="min-h-48" aria-busy="true" />}>
          <BlogGridClient items={items} lang={lang} />
        </Suspense>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
