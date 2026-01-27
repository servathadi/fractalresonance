import Image from 'next/image';
import Link from 'next/link';

interface Episode {
  ep: number;
  title: string;
  articleId?: string; // Internal article link
  youtubeUrl: string; // YouTube fallback
  thumbnail: string;
  subtitle?: string;
}

const EPISODES: Episode[] = [
  {
    ep: 1,
    title: 'The Ghost in the Machine',
    articleId: 'FRC-EP-001',
    youtubeUrl: 'https://youtu.be/PjWnk7RjItc',
    thumbnail: '/media/slides/cover-deterministic-framework.png',
  },
  {
    ep: 2,
    title: 'Order in the Chaos',
    articleId: 'FRC-EP-002',
    youtubeUrl: 'https://youtu.be/I77qlVunpRs',
    thumbnail: '/media/slides/cover-chaos-has-structure.png',
  },
  {
    ep: 3,
    title: 'The Engine of Coherence',
    articleId: 'FRC-EP-003',
    youtubeUrl: 'https://youtu.be/Cy_5ofEuHLA',
    thumbnail: '/media/slides/cover-190-signature.png',
  },
  {
    ep: 4,
    title: 'The Vortex of Reality',
    // No article yet - uses YouTube fallback
    youtubeUrl: 'https://youtu.be/i-mDr5wz1hA',
    thumbnail: '/media/slides/cover-quantum-theory.png',
  },
  {
    ep: 5,
    title: 'The Illusion of Chance',
    articleId: 'FRC-EP-005',
    youtubeUrl: 'https://youtu.be/Y2_85m-zVV0',
    thumbnail: '/media/slides/cover-illusion-of-chance.png',
  },
  {
    ep: 6,
    title: 'Hunting for the Glitch',
    articleId: 'FRC-EP-006',
    youtubeUrl: 'https://youtu.be/fthtrwfoytg',
    thumbnail: '/media/slides/cover-hunting-the-glitch.png',
  },
  {
    ep: 7,
    title: 'The Resonant Mind',
    subtitle: 'Series Finale',
    articleId: 'FRC-EP-EXTRA-2',
    youtubeUrl: 'https://youtu.be/UwE_SNAioTs',
    thumbnail: '/media/slides/cover-unmasking-randomness.png',
  },
];

const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLhRVhnQbVX2XOn3e-HjD1J0NcaEzMDQJY';

interface VideoSeriesProps {
  lang?: string;
}

export function VideoSeries({ lang = 'en' }: VideoSeriesProps) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-marker mb-8" data-section="§05">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-light text-frc-text">Video Series</h2>
            <Link
              href={`/${lang}/articles`}
              className="text-xs uppercase tracking-wider text-frc-text-dim hover:text-frc-gold"
            >
              All articles &rarr;
            </Link>
          </div>
          <p className="text-sm text-frc-text-dim mt-2">
            Fractal Resonance Coherence — a seven-part exploration of deterministic dynamics beneath apparent quantum randomness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EPISODES.map((ep) => {
            const hasArticle = !!ep.articleId;
            const href = hasArticle ? `/${lang}/articles/${ep.articleId}` : ep.youtubeUrl;

            // Use Link for internal articles, <a> for external YouTube
            if (hasArticle) {
              return (
                <Link
                  key={ep.ep}
                  href={href}
                  className="group card p-0 overflow-hidden block"
                >
                  <EpisodeCard ep={ep} />
                </Link>
              );
            }

            return (
              <a
                key={ep.ep}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group card p-0 overflow-hidden block"
              >
                <EpisodeCard ep={ep} isExternal />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EpisodeCard({ ep, isExternal }: { ep: Episode; isExternal?: boolean }) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={ep.thumbnail}
          alt={`Episode ${ep.ep}: ${ep.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-frc-void/30 group-hover:bg-frc-void/10 transition-colors" />
        <div className="absolute top-2 left-2 font-mono text-[0.625rem] text-frc-steel bg-frc-void/80 px-1.5 py-0.5">
          EP.{String(ep.ep).padStart(2, '0')}
        </div>
        {isExternal && (
          <div className="absolute top-2 right-2 font-mono text-[0.625rem] text-frc-gold bg-frc-void/80 px-1.5 py-0.5">
            YouTube
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-frc-text group-hover:text-frc-gold transition-colors">
          {ep.title}
        </h3>
        {ep.subtitle && (
          <span className="text-[0.625rem] font-mono text-frc-gold mt-1 block">{ep.subtitle}</span>
        )}
      </div>
    </>
  );
}
