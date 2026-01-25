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
    <details className={`${hideClass} mb-6 border border-frc-blue rounded-lg ${className}`}>
      <summary className="px-4 py-3 text-sm text-frc-text cursor-pointer select-none">
        <span className="text-xs uppercase tracking-wider text-frc-steel">{title}</span>
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
