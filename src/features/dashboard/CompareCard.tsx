import type { ReactNode } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { delta } from '@/lib/aggregate';

interface Props {
  label: string;
  a: number;
  b: number;
  /** how to format the number for display */
  format?: (n: number) => string;
  /** สีตัวเลข — เช่น tangerine สำหรับเงิน */
  valueClass?: string;
  hint?: ReactNode;
}

export function CompareCard({ label, a, b, format = (n) => n.toFixed(0), valueClass, hint }: Props) {
  const d = delta(a, b);
  const dir = d.abs === 0 ? 'flat' : d.abs > 0 ? 'up' : 'down';
  const max = Math.max(a, b, 1);
  const aPct = (a / max) * 100;
  const bPct = (b / max) * 100;

  const DeltaIcon = dir === 'up' ? ArrowUp : dir === 'down' ? ArrowDown : Minus;

  return (
    <Card className="p-4">
      <div className="font-display font-bold text-label text-ink-500 uppercase">{label}</div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn('font-display font-extrabold text-h2 leading-none', valueClass)}>
          {format(a)}
        </span>
        <span className="font-mono text-xs text-ink-500">vs</span>
        <span className="font-display font-bold text-h4 text-ink-500 leading-none">
          {format(b)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 font-mono text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-chip border-1.5 border-ink-900',
            dir === 'up' && 'bg-mint-soft',
            dir === 'down' && 'bg-rose-soft',
            dir === 'flat' && 'bg-cream-100',
          )}
        >
          <DeltaIcon size={11} />
          {format(Math.abs(d.abs))}
          {d.pct != null && <span className="opacity-70">· {d.pct >= 0 ? '+' : ''}{d.pct.toFixed(0)}%</span>}
        </span>
        {hint}
      </div>

      <div className="mt-3 space-y-1">
        <BarLine pct={aPct} active />
        <BarLine pct={bPct} />
      </div>
    </Card>
  );
}

function BarLine({ pct, active }: { pct: number; active?: boolean }) {
  return (
    <div className="relative h-2 bg-cream-100 border-1.5 border-ink-900 rounded-chip overflow-hidden">
      <div
        className={cn('absolute inset-y-0 left-0', active ? 'bg-ink-900' : 'bg-ink-300')}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
