import { cn } from '@/lib/utils';
import type { ThemeId } from '@/lib/theme';

const ACCENTS = ['bg-tangerine', 'bg-lemon', 'bg-mint', 'bg-peri', 'bg-rose'] as const;

/** mini preview 5 accent ของ theme — ใช้ data-theme ซ้อน ให้ CSS เป็น source of truth ของสี */
export function ThemeDots({ theme, className }: { theme: ThemeId; className?: string }) {
  return (
    <span
      data-theme={theme}
      className={cn(
        'inline-flex items-center -space-x-1 px-1.5 py-1 rounded-full bg-cream-100 border-1.5 border-ink-900',
        className,
      )}
    >
      {ACCENTS.map((bg) => (
        <span key={bg} className={cn('h-3 w-3 rounded-full border-1.5 border-ink-900', bg)} />
      ))}
    </span>
  );
}
