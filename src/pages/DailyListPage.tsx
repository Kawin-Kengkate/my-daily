import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Pill } from '@/components/Pill';
import { useDaysInRange } from '@/hooks/useDay';
import { monthRange, formatThaiDate, todayISO } from '@/lib/date';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MonthPicker } from '@/components/MonthPicker';

export function DailyListPage() {
  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const range = useMemo(() => monthRange(month), [month]);
  const { data: days = [], isLoading } = useDaysInRange(range.from, range.to);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display font-extrabold text-display">Daily log</h2>
        <MonthPicker value={month} onChange={setMonth} />
      </div>
      <Card>
        <div className="p-2">
          {isLoading && (
            <ul className="p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="h-10 rounded-field bg-cream-200 animate-pulse" />
              ))}
            </ul>
          )}
          {!isLoading && days.length === 0 && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <p className="text-ink-500 font-body">ยังไม่มี entry เดือนนี้</p>
              <Link to={`/daily/${todayISO()}`}>
                <Button variant="primary" size="sm">+ กรอกของวันนี้</Button>
              </Link>
            </div>
          )}
          <ul>
            {days.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/daily/${d.date}`}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-cream-200 hover:bg-cream-50"
                >
                  <span className="font-mono font-bold text-sm w-32">{formatThaiDate(d.date, 'EEE d MMM')}</span>
                  <Pill className="bg-cream-200">{d.location}</Pill>
                  {d.is_holiday && <Pill className="bg-lemon-soft">holiday</Pill>}
                  <span className="font-mono text-xs text-ink-500 ml-auto">{d.entries.length} entries</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
