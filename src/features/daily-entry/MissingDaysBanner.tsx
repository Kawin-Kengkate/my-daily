import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
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
    <Card className="p-3 bg-cream-100 border-ink-900 flex items-start gap-2 flex-wrap">
      <AlertCircle size={18} className="text-tangerine shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm leading-tight">
          มี {missing.length} วันทำงานที่ยังไม่ได้บันทึก
        </div>
        <div className="font-mono text-xs text-ink-700 mt-1 flex flex-wrap gap-x-2 gap-y-1">
          {missing.map((iso) => (
            <a
              key={iso}
              href={`#/daily/${iso}`}
              className="underline decoration-dotted hover:text-ink-900"
            >
              {formatThaiDate(iso, 'EEE d MMM')}
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
