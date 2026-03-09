import type { TocItem } from '@/components/TableOfContents';

export function InlineToc({
  items,
  title = 'On this page',
  className = '',
  hideAt = 'lg',
}: {
  items: TocItem[];
  title?: string;
  className?: string;
  hideAt?: 'lg' | 'xl' | '2xl';
}) {
  if (!items || items.length === 0) return null;

  const hideClass = hideAt === 'lg' ? 'lg:hidden' : hideAt === 'xl' ? 'xl:hidden' : '2xl:hidden';

  return (
    <details className={`${hideClass} group mb-6 border border-frc-blue rounded-lg ${className}`}>
      <summary className="px-4 py-3 text-sm text-frc-text cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-frc-steel">{title}</span>
        <svg
          className="w-4 h-4 text-frc-steel transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <nav className="px-4 pb-4">
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${Math.max(0, item.level - 2) * 0.75}rem` }}>
              <a href={`#${item.id}`} className="block py-1 text-frc-text-dim hover:text-frc-gold transition-colors">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
