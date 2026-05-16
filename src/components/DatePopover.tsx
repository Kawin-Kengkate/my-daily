import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { fromISO, toISO, addMonths, getMonthGrid, isSameMonth, isSameDay, formatThaiDate } from '@/lib/date';
import { resolveIsHoliday } from '@/lib/calendar';
import { useCalendarOverrides } from '@/hooks/useCalendarOverrides';

interface Props {
  value: string;
  onChange: (iso: string) => void;
  className?: string;
  buttonClassName?: string;
}

const DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

export function DatePopover({ value, onChange, className, buttonClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => format(fromISO(value), 'yyyy-MM'));
  const { map: overrides } = useCalendarOverrides();
  const grid = getMonthGrid(viewMonth);
  const monthDate = fromISO(`${viewMonth}-01`);
  const selected = fromISO(value);
  const today = new Date();

  return (
    <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) setViewMonth(format(selected, 'yyyy-MM')); }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'h-9 px-3 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-mono font-bold text-sm hover:bg-cream-100',
            buttonClassName,
          )}
        >
          {formatThaiDate(value, 'd MMM yy')}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className={cn(
            'z-50 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-3 w-[280px]',
            className,
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewMonth(format(addMonths(monthDate, -1), 'yyyy-MM'))}
              className="h-7 w-7 flex items-center justify-center border-1.5 border-ink-900 rounded-field bg-cream-50 hover:bg-cream-200"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="font-display font-bold text-sm">{formatThaiDate(`${viewMonth}-01`, 'MMMM yyyy')}</div>
            <button
              type="button"
              onClick={() => setViewMonth(format(addMonths(monthDate, 1), 'yyyy-MM'))}
              className="h-7 w-7 flex items-center justify-center border-1.5 border-ink-900 rounded-field bg-cream-50 hover:bg-cream-200"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DOW.map((d) => (
              <div key={d} className="text-center font-display font-bold text-label text-ink-500">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d) => {
              const inMonth = isSameMonth(d, monthDate);
              const isSel = isSameDay(d, selected);
              const isToday = isSameDay(d, today);
              const iso = toISO(d);
              const isHol = resolveIsHoliday(iso, overrides);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => { onChange(iso); setOpen(false); }}
                  className={cn(
                    'h-8 rounded-field font-mono text-sm transition-all',
                    'border-1.5',
                    isSel
                      ? 'bg-ink-900 text-paper border-ink-900 font-bold'
                      : isToday
                      ? 'bg-lemon-soft border-ink-900 font-bold'
                      : isHol
                      ? 'bg-rose-soft border-transparent hover:border-ink-900'
                      : 'border-transparent hover:border-ink-900 hover:bg-cream-100',
                    !inMonth && 'opacity-30',
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-cream-300 flex justify-between">
            <button
              type="button"
              onClick={() => { onChange(toISO(today)); setOpen(false); }}
              className="font-mono text-xs text-ink-700 hover:text-ink-900 underline"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-ink-500 hover:text-ink-900"
            >
              ปิด
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
