import Image from 'next/image';

const EPISODES = [
  {
    ep: 1,
    title: 'The Ghost in the Machine',
    url: 'https://youtu.be/PjWnk7RjItc',
    thumbnail: '/media/slides/cover-deterministic-framework.png',
  },
  {
    ep: 2,
    title: 'Order in the Chaos',
    url: 'https://youtu.be/I77qlVunpRs',
    thumbnail: '/media/slides/cover-chaos-has-structure.png',
  },
  {
    ep: 3,
    title: 'The Engine of Coherence',
    url: 'https://youtu.be/Cy_5ofEuHLA',
    thumbnail: '/media/slides/cover-190-signature.png',
  },
  {
    ep: 4,
    title: 'The Vortex of Reality',
    url: 'https://youtu.be/i-mDr5wz1hA',
    thumbnail: '/media/slides/cover-quantum-theory.png',
  },
  {
    ep: 5,
    title: 'The Illusion of Chance',
    url: 'https://youtu.be/Y2_85m-zVV0',
    thumbnail: '/media/slides/cover-illusion-of-chance.png',
  },
  {
    ep: 6,
    title: 'Hunting for the Glitch',
    url: 'https://youtu.be/fthtrwfoytg',
    thumbnail: '/media/slides/cover-hunting-the-glitch.png',
  },
  {
    ep: 7,
    title: 'The Resonant Mind',
    subtitle: 'Series Finale',
    url: 'https://youtu.be/UwE_SNAioTs',
    thumbnail: '/media/slides/cover-unmasking-randomness.png',
  },
];

const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLhRVhnQbVX2XOn3e-HjD1J0NcaEzMDQJY';

export function VideoSeries() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-marker mb-8" data-section="§05">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-light text-frc-text">Video Series</h2>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-frc-text-dim hover:text-frc-gold"
            >
              Full playlist &rarr;
            </a>
          </div>
          <p className="text-sm text-frc-text-dim mt-2">
            Fractal Resonance Cognition — a seven-part exploration of deterministic dynamics beneath apparent quantum randomness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EPISODES.map((ep) => (
            <a
              key={ep.ep}
              href={ep.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card p-0 overflow-hidden block"
            >
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
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-frc-text group-hover:text-frc-gold transition-colors">
                  {ep.title}
                </h3>
                {ep.subtitle && (
                  <span className="text-[0.625rem] font-mono text-frc-gold mt-1 block">{ep.subtitle}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
