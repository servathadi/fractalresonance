import { getTopics, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { TopicsGridClient, type TopicsGridItem } from '@/components/pages/TopicsGridClient';

const DICT: Record<string, { title: string; desc: string; noTopics: string }> = {
  en: { title: 'Topics', desc: 'Questions, summaries, and spectrum views: authority citations, FRC answers, and multiple perspectives.', noTopics: 'No topics yet.' },
  fa: { title: 'موضوعات', desc: 'سوالات، خلاصه‌ها و نماهای طیفی: ارجاعات معتبر، پاسخ‌های FRC و دیدگاه‌های متعدد.', noTopics: 'هنوز موضوعی وجود ندارد.' },
  es: { title: 'Temas', desc: 'Preguntas, resúmenes y vistas espectrales: citas de autoridad, respuestas FRC y múltiples perspectivas.', noTopics: 'Aún no hay temas.' },
  fr: { title: 'Sujets', desc: 'Questions, résumés et vues spectrales : citations d\'autorité, réponses FRC et perspectives multiples.', noTopics: 'Pas encore de sujets.' },
};

export function TopicsIndex({
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
  const topics = getTopics(lang)
    .filter((t) => matchesPerspectiveView(t.frontmatter.perspective, view))
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  const items: TopicsGridItem[] = topics.map((t) => {
    const fm = t.frontmatter;
    const answersCount = Array.isArray(fm.answers) ? fm.answers.length : undefined;
    return {
      id: fm.id,
      title: fm.title,
      question: fm.question,
      shortAnswer: fm.short_answer,
      abstract: fm.abstract,
      date: fm.date,
      href: `${basePath}/topics/${fm.id}`,
      tags: fm.tags || [],
      answersCount,
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

      {topics.length === 0 ? (
        <section className="border border-frc-blue rounded-lg p-6 text-sm text-frc-text-dim">
          {t.noTopics}
        </section>
      ) : (
        <TopicsGridClient items={items} lang={lang} />
      )}
    </div>
  );

  if (embedded) return content;
  return <main>{content}</main>;
}

