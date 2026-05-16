import { useMemo } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCalendarOverrides } from '@/hooks/useCalendarOverrides';
import { useDaysInRange } from '@/hooks/useDay';
import { resolveDay } from '@/lib/calendar';
import { addDays, fromISO, toISO, formatThaiDate, todayISO } from '@/lib/date';

const LOOKBACK_DAYS = 7;
const MIN_MISSING_TO_SHOW = 2;

interface Props {
  dateISO: string;
}

export function MissingDaysBanner({ dateISO }: Props) {
  const today = todayISO();
  const { map: overrides } = useCalendarOverrides();

  const from = useMemo(() => toISO(addDays(fromISO(today), -LOOKBACK_DAYS)), [today]);
  const to = useMemo(() => toISO(addDays(fromISO(today), -1)), [today]);
  const range = useDaysInRange(from, to);

  // โชว์เฉพาะตอนเปิดวันนี้
  if (dateISO !== today) return null;

  const savedDates = new Set(range.data?.map((d) => d.date) ?? []);
  const missing: string[] = [];
  for (let i = 1; i <= LOOKBACK_DAYS; i++) {
    const iso = toISO(addDays(fromISO(today), -i));
    const info = resolveDay(iso, overrides);
    if (info.type === 'workday' && !savedDates.has(iso)) {
      missing.push(iso);
    }
  }
  missing.sort();

  if (missing.length < MIN_MISSING_TO_SHOW) return null;

  return (
    <Card className="p-3 bg-cream-100 border-ink-900 space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle size={18} className="text-tangerine shrink-0" />
        <span className="font-display font-bold text-sm">
          มี {missing.length} วันทำงานที่ยังไม่ได้บันทึก
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {missing.map((iso) => (
          <a
            key={iso}
            href={`#/daily/${iso}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border-1.5 border-ink-900 bg-paper shadow-stamp-sm font-mono text-[11px] font-bold text-ink-900 hover:bg-lemon-soft transition-colors active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {formatThaiDate(iso, 'EEE d MMM')}
            <ChevronRight size={11} className="opacity-60" />
          </a>
        ))}
      </div>
    </Card>
  );
}
