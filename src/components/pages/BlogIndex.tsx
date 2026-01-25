import { estimateReadTime, getBlogPosts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { BlogGridClient, type BlogGridItem } from '@/components/pages/BlogGridClient';

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

  const content = (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-light text-frc-gold tracking-tight">Blog</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
        </div>
        <p className="text-frc-text-dim max-w-2xl leading-relaxed">
          Down-to-earth notes, experiments, and field reports.
        </p>
      </header>

      {posts.length === 0 ? (
        <section className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          No blog posts yet.
        </section>
      ) : (
        <BlogGridClient items={items} />
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}
