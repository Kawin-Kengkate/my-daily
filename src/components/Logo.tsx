import { cn } from '@/lib/utils';

/** Logo M — tilted -8° with chunky drop shadow for depth */
export function Logo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sz = {
    sm: { box: 'h-9 w-9 rounded-[10px]', text: 'text-lg', shadow: '3px 3px 0 0 var(--ink-900)' },
    md: { box: 'h-12 w-12 rounded-[14px]', text: 'text-2xl', shadow: '4px 4px 0 0 var(--ink-900)' },
    lg: { box: 'h-16 w-16 rounded-[18px]', text: 'text-4xl', shadow: '5px 5px 0 0 var(--ink-900)' },
  }[size];
  return (
    <div
      className={cn(
        sz.box,
        'bg-tangerine border-1.5 border-ink-900 flex items-center justify-center',
        'font-display font-extrabold text-paper select-none',
        sz.text,
        className,
      )}
      style={{
        transform: 'rotate(-8deg)',
        boxShadow: sz.shadow,
      }}
      aria-label="My Daily logo"
    >
      M
    </div>
  );
}
