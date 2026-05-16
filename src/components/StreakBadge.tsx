import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStreak } from '@/hooks/useStreak';

interface Props {
  size?: 'sm' | 'md';
  className?: string;
}

export function StreakBadge({ size = 'sm', className }: Props) {
  const { current, longest, isLoading } = useStreak();
  if (isLoading || current === 0) return null;

  const isBest = current === longest && current >= 3;

  return (
    <span
      title={`best record: ${longest} วัน`}
      className={cn(
        'inline-flex items-center gap-1 border-1.5 border-ink-900 rounded-full bg-tangerine text-paper shadow-stamp-sm font-display font-bold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[12px]' : 'px-2.5 py-1 text-sm',
        className,
      )}
    >
      <Flame size={size === 'sm' ? 12 : 14} className="shrink-0" />
      {current} วันติด
      {isBest && <span className="font-mono text-[10px] opacity-90">· best</span>}
    </span>
  );
}
