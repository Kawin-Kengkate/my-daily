import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Arc } from '@/components/Arc';
import { DotGrid } from '@/components/DotGrid';
import { getISODay } from 'date-fns';
import { todayISO } from '@/lib/date';

// DOW labels ISO: 1=Mon … 7=Sun
const DOW_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

function getWeekDates(): string[] {
  const today = new Date();
  const dow = getISODay(today); // 1=Mon
  const dates: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (dow - i));
    dates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return dates;
}

interface Props {
  hoursLogged: number;
  weeklyTarget: number;
  activeDatesSet: Set<string>;
}

export function WeeklySummaryHero({ hoursLogged, weeklyTarget, activeDatesSet }: Props) {
  const navigate = useNavigate();
  const pct = weeklyTarget > 0 ? Math.min(1, hoursLogged / weeklyTarget) : 0;
  const weekDates = getWeekDates();
  const todayDate = todayISO();

  return (
    <div className="relative p-5 bg-paper border-1.5 border-ink-900 rounded-card-lg shadow-stamp-lg overflow-hidden">
      {/* DotGrid corner decoration */}
      <DotGrid className="absolute top-3 right-3" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="font-display font-bold text-label text-ink-500 uppercase tracking-wide">
            สัปดาห์นี้
          </div>
          <div className="relative inline-block">
            <div className="font-display font-extrabold text-stat">
              {hoursLogged.toFixed(1)}
              <span className="text-h3 font-bold text-ink-500"> / {weeklyTarget} ชม.</span>
            </div>
            <Arc width={60} className="absolute -bottom-3 left-0" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/learning/new')}
          className={cn(
            'shrink-0 flex items-center gap-1.5 px-4 py-2 mt-1',
            'bg-lemon border-1.5 border-ink-900 rounded-button shadow-stamp font-display font-bold text-sm',
            'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform',
          )}
        >
          <Plus size={15} />
          Log session
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-3 bg-cream-200 border-1.5 border-ink-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-lemon transition-all duration-500"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <div className="mt-1 font-mono text-hint text-ink-500 text-right">
        {Math.round(pct * 100)}%
      </div>

      {/* Active days dots */}
      <div className="mt-3 flex items-center gap-2">
        {weekDates.map((date, i) => {
          const isActive = activeDatesSet.has(date);
          const isToday = date === todayDate;
          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full border-1.5 border-ink-900',
                  isActive ? 'bg-peri' : 'bg-cream-200',
                  isToday && 'ring-1 ring-offset-1 ring-ink-900',
                )}
              />
              <span className="font-mono text-[10px] text-ink-500">{DOW_LABELS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
