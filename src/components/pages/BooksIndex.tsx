import Link from 'next/link';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

export function BooksIndex({ lang, basePath, view }: { lang: string; basePath: string; view: PerspectiveView }) {
  const books = getBooks(lang).filter((b) => matchesPerspectiveView(b.frontmatter.perspective, view));

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-frc-gold mb-3">Books</h1>
        <p className="text-frc-text-dim">
          Longer-form writing (textbooks, primers, and narrative frames) for the FRC project.
        </p>
      </header>

      {books.length === 0 ? (
        <div className="text-frc-text-dim text-sm border border-frc-blue rounded-lg p-6">
          No books published yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map((b) => {
            const fm = b.frontmatter;
            return (
              <Link
                key={fm.id}
                href={`${basePath}/books/${fm.id}`}
                className="card block p-6 group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <h2 className="text-xl text-frc-text group-hover:text-frc-gold transition-colors font-medium">
                      {fm.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-xs text-frc-steel">
                      <span className="font-mono">{fm.id}</span>
                      {fm.date && <span>{fm.date}</span>}
                    </div>
                  </div>
                  <span className="text-frc-steel group-hover:text-frc-gold transition-colors shrink-0">&rarr;</span>
                </div>
                {fm.abstract && (
                  <p className="text-sm text-frc-text-dim leading-relaxed line-clamp-3">
                    {fm.abstract}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

