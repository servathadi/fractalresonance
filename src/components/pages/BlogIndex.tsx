import Link from 'next/link';
import { estimateReadTime, getBlogPosts, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { VoiceTag } from '@/components/VoiceTag';

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
        <section className="grid sm:grid-cols-2 gap-5">
          {posts.map((post, idx) => {
            const fm = post.frontmatter;
            const readTime = fm.read_time || estimateReadTime(post.body);
            const voice = fm.voice || (fm.perspective === 'river' ? 'river' : fm.perspective === 'kasra' ? 'kasra' : undefined);
            return (
              <Link
                key={fm.id}
                href={`${basePath}/blog/${fm.id}`}
                className="card block p-6 group"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-frc-steel shrink-0 mt-1 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <VoiceTag voice={voice} />
                      <span className="text-[0.625rem] text-frc-steel">{readTime}</span>
                    </div>
                    <h3 className="text-sm text-frc-text group-hover:text-frc-gold transition-colors font-medium leading-snug mb-2">
                      {fm.title}
                    </h3>
                    {fm.abstract && (
                      <p className="text-xs text-frc-text-dim leading-relaxed line-clamp-2">
                        {fm.abstract}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-[0.625rem] text-frc-steel">
                      <span className="font-mono">{fm.id}</span>
                      {fm.date && <span>{fm.date}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}

