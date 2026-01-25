import Link from 'next/link';
import type { Metadata } from 'next';
import { getBooks, getLanguages, type ParsedContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Books exploring the Fractal Resonance Cognition framework — from foundational theory to applications.',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BooksPage({ params }: Props) {
  const { lang } = await params;
  const books = getBooks(lang);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Books</h1>
        <p className="text-frc-text-dim">
          Long-form explorations of the Fractal Resonance Cognition framework.
        </p>
      </header>

      {books.length === 0 ? (
        <p className="text-frc-text-dim">No books available yet.</p>
      ) : (
        <div className="space-y-6">
          {books.map(book => (
            <BookCard key={book.frontmatter.id} book={book} lang={lang} />
          ))}
        </div>
      )}
    </main>
  );
}

function BookCard({ book, lang }: { book: ParsedContent; lang: string }) {
  const fm = book.frontmatter;

  return (
    <Link
      href={`/${lang}/books/${fm.id}`}
      className="block border border-frc-blue px-6 py-5 hover:border-frc-gold-light transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-light">
            {fm.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-frc-text-dim">
            <span>{fm.author || 'H. Servat'}</span>
            {fm.date && <span>{fm.date}</span>}
          </div>
          {fm.abstract && (
            <p className="text-sm text-frc-text-dim mt-3 line-clamp-3">
              {fm.abstract}
            </p>
          )}
          {fm.tags && fm.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {fm.tags.slice(0, 5).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0 text-xl">
          &rarr;
        </span>
      </div>
    </Link>
  );
}
