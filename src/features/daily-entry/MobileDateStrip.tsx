import { useMemo } from 'react';
import { addDays, fromISO, toISO, formatThaiDate } from '@/lib/date';
import { isAutoHoliday } from '@/lib/thai-holidays';
import { cn } from '@/lib/utils';

export function MobileDateStrip({ dateISO, onPick }: { dateISO: string; onPick: (iso: string) => void }) {
  const days = useMemo(() => {
    const center = fromISO(dateISO);
    return Array.from({ length: 7 }, (_, i) => addDays(center, i - 3));
  }, [dateISO]);
  const todayISO = toISO(new Date());

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d) => {
        const iso = toISO(d);
        const isSel = iso === dateISO;
        const isToday = iso === todayISO;
        const isHol = isAutoHoliday(iso);
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onPick(iso)}
            className={cn(
              'flex flex-col items-center py-1.5 rounded-field border-1.5 transition-all',
              isSel
                ? 'bg-ink-900 text-paper border-ink-900 shadow-stamp-sm'
                : isToday
                ? 'bg-lemon-soft border-ink-900'
                : isHol
                ? 'bg-rose-soft border-transparent'
                : 'bg-paper border-ink-900 shadow-stamp-sm',
            )}
          >
            <span className="font-display font-bold text-[10px] uppercase opacity-70">
              {formatThaiDate(iso, 'EEE')}
            </span>
            <span className="font-mono font-bold text-sm">{d.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
