import Link from 'next/link';
import { NotFoundRedirect } from '@/components/NotFoundRedirect';

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <NotFoundRedirect />

      <h1 className="text-3xl font-light text-frc-gold mb-4">Not Found</h1>
      <p className="text-frc-text-dim leading-relaxed mb-8">
        This page does not exist in the current build. If you came from an older link, the content may have moved.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link href="/en/papers" className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
          Go to Papers
        </Link>
        <Link href="/en/blog" className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
          Go to Blog
        </Link>
        <Link href="/en/topics" className="tag hover:text-frc-gold hover:border-frc-gold transition-colors">
          Go to Topics
        </Link>
      </div>
    </main>
  );
}

