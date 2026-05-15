import { cn } from '@/lib/utils';

const bgMap = {
  peri: 'bg-peri-soft',
  lemon: 'bg-lemon-soft',
  mint: 'bg-mint-soft',
  rose: 'bg-rose-soft',
  cream: 'bg-cream-200',
  tangerine: 'bg-tangerine-soft',
} as const;

export type ProjectCodeColor = keyof typeof bgMap;

export function ProjectCode({
  code,
  color = 'peri',
  className,
}: {
  code: string;
  color?: ProjectCodeColor;
  className?: string;
}) {
  return (
    <code
      className={cn(
        'inline-block px-1.5 py-0.5 rounded-chip',
        'border border-ink-900',
        'font-mono font-bold text-xs text-ink-900',
        bgMap[color],
        className,
      )}
    >
      {code}
    </code>
  );
}
