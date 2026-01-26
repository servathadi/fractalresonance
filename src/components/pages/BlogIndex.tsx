import { estimateReadTime, getBlogPosts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { BlogGridClient, type BlogGridItem } from '@/components/pages/BlogGridClient';

const DICT: Record<string, { title: string; desc: string; noPosts: string }> = {
  en: { title: 'Blog', desc: 'Down-to-earth notes, experiments, and field reports.', noPosts: 'No blog posts yet.' },
  fa: { title: 'وبلاگ', desc: 'یادداشت‌ها، آزمایش‌ها و گزارش‌های میدانی عملی.', noPosts: 'هنوز پست وبلاگی وجود ندارد.' },
  es: { title: 'Blog', desc: 'Notas prácticas, experimentos e informes de campo.', noPosts: 'Aún no hay publicaciones de blog.' },
  fr: { title: 'Blog', desc: 'Notes pratiques, expériences et rapports de terrain.', noPosts: 'Pas encore d\'articles de blog.' },
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
    .filter((p) => matchesPerspectiveView(p.frontmatter.perspective, view))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const items: BlogGridItem[] = posts.map((post, idx) => {
    const fm = post.frontmatter;
    const readTime = fm.read_time || estimateReadTime(post.body);
    const voice = fm.voice || (fm.perspective === 'river' ? 'river' : fm.perspective === 'kasra' ? 'kasra' : undefined);
    return {
      id: fm.id,
      title: fm.title,
      abstract: fm.abstract,
      date: fm.date,
      href: `${basePath}/blog/${fm.id}`,
      tags: fm.tags || [],
      voice,
      readTime,
      ordinal: idx + 1,
    };
  });

  const t = DICT[lang] || DICT['en'];

  const content = (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-light text-frc-gold tracking-tight">{t.title}</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
        </div>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          {t.desc}
        </p>
      </header>

      {posts.length === 0 ? (
        <section className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          {t.noPosts}
        </section>
      ) : (
        <BlogGridClient items={items} lang={lang} />
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
