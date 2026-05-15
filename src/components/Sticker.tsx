import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type StickerColor = 'lemon' | 'tangerine' | 'mint' | 'peri' | 'rose';

const colorMap: Record<StickerColor, string> = {
  lemon: 'bg-lemon text-ink-900',
  tangerine: 'bg-tangerine text-paper',
  mint: 'bg-mint text-paper',
  peri: 'bg-peri text-paper',
  rose: 'bg-rose text-ink-900',
};

export function Sticker({
  children,
  color = 'lemon',
  rotate = -3,
  className,
}: {
  children: ReactNode;
  color?: StickerColor;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'border-1.5 border-ink-900 shadow-stamp-sm',
        'font-display font-semibold text-[13px] tracking-tight whitespace-nowrap',
        colorMap[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
