import { useMemo } from 'react';
import type { DayWithEntries } from '@/types/db';
import { getMonthGrid, isSameMonth, toISO } from '@/lib/date';
import { isAutoHoliday } from '@/lib/thai-holidays';
import { parseHHMM } from '@/lib/ot';
import { Star4 } from '@/components/Star4';
import { cn } from '@/lib/utils';

const DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const locationBg: Record<string, string> = {
  onsite: 'bg-mint-soft',
  wfh: 'bg-peri-soft',
  leave: 'bg-rose-soft',
  training: 'bg-lemon-soft',
  holiday: 'bg-cream-200',
};

export function CalendarHeatmap({ yyyymm, days }: { yyyymm: string; days: DayWithEntries[] }) {
  const grid = useMemo(() => getMonthGrid(yyyymm), [yyyymm]);
  const monthDate = new Date(`${yyyymm}-01T00:00:00`);
  const byDate = useMemo(() => {
    const m = new Map<string, DayWithEntries>();
    for (const d of days) m.set(d.date, d);
    return m;
  }, [days]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DOW.map((d) => (
          <div key={d} className="text-center font-mono text-tiny text-ink-500 uppercase">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((d) => {
          const iso = toISO(d);
          const isCur = isSameMonth(d, monthDate);
          const day = byDate.get(iso);
          const holiday = isAutoHoliday(iso);
          const hasOT = !!day?.entries?.some((e) => parseHHMM(e.end_time) > 17 * 60);
          return (
            <div
              key={iso}
              className={cn(
                'relative aspect-square border-1.5 border-ink-900 rounded-chip p-1.5',
                day ? locationBg[day.location] : 'bg-paper',
                !isCur && 'opacity-30',
                holiday && !day && 'bg-lemon-soft',
              )}
            >
              <span className="font-mono text-tiny font-bold">{d.getDate()}</span>
              {hasOT && <Star4 size={12} className="absolute bottom-1 right-1" />}
              {holiday && <span className="absolute bottom-0.5 right-0.5 text-[10px]">🎉</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
