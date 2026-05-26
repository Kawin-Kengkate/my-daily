import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getISODay } from 'date-fns';
import { todayISO } from '@/lib/date';

// DOW labels ISO: 1=Mon … 7=Sun
const DOW_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

function getWeekDates(): string[] {
  const today = new Date();
  const dow = getISODay(today);
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

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function WeeklySummaryHero({ hoursLogged, weeklyTarget, activeDatesSet }: Props) {
  const navigate = useNavigate();
  const pct = weeklyTarget > 0 ? Math.min(1, hoursLogged / weeklyTarget) : 0;
  const animated = useCountUp(hoursLogged);
  const weekDates = getWeekDates();
  const todayDate = todayISO();

  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const isComplete = pct >= 1;

  return (
    <div className="relative p-5 md:p-6 bg-paper border-1.5 border-ink-900 rounded-card-lg shadow-stamp-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        {/* Progress ring */}
        <div className="relative shrink-0 self-center sm:self-start">
          <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
            {/* Track */}
            <circle cx="66" cy="66" r={r} fill="none" stroke="var(--cream-200, #F0E9D6)" strokeWidth="10" />
            {/* Progress arc */}
            <motion.circle
              cx="66"
              cy="66"
              r={r}
              fill="none"
              stroke={isComplete ? 'var(--mint, #4FB389)' : 'var(--peri, #6B7FE8)'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              transform="rotate(-90 66 66)"
            />
            {/* Inner accent ring (signature double-border feel) */}
            <circle cx="66" cy="66" r={r - 10} fill="none" stroke="var(--ink-900)" strokeWidth="1.5" strokeOpacity="0.08" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display font-extrabold text-h2 leading-none">
              {animated.toFixed(1)}
            </div>
            <div className="font-mono text-[10px] text-ink-500 mt-0.5 uppercase tracking-wider">
              / {weeklyTarget} ชม.
            </div>
          </div>
          {isComplete && (
            <span
              className="absolute -top-1 -right-1 px-2 py-0.5 bg-mint text-paper border-1.5 border-ink-900 rounded-full font-display font-bold text-[10px] shadow-stamp-sm"
              style={{ transform: 'rotate(8deg)' }}
            >
              ครบ ✓
            </span>
          )}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-display font-bold text-label text-ink-500 uppercase tracking-wide">
                สัปดาห์นี้
              </div>
              <div className="font-display font-extrabold text-h3 mt-0.5">
                {Math.round(pct * 100)}%{' '}
                <span className="font-bold text-ink-500 text-base">of weekly target</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/learning/new')}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2',
                'bg-lemon border-1.5 border-ink-900 rounded-button shadow-stamp font-display font-bold text-sm',
                'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform',
              )}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Log session</span>
              <span className="sm:hidden">Log</span>
            </button>
          </div>

          {/* Active days */}
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weekDates.map((date, i) => {
              const isActive = activeDatesSet.has(date);
              const isToday = date === todayDate;
              return (
                <div key={date} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'h-7 w-full rounded-md border-1.5 border-ink-900 flex items-center justify-center transition-colors',
                      isActive ? 'bg-peri text-paper' : 'bg-cream-100 text-ink-400',
                      isToday && !isActive && 'ring-2 ring-offset-1 ring-peri',
                      isToday && isActive && 'ring-2 ring-offset-1 ring-ink-900',
                    )}
                  >
                    {isActive && <span className="font-display font-bold text-xs">✓</span>}
                  </div>
                  <span
                    className={cn(
                      'font-mono text-[10px]',
                      isToday ? 'text-ink-900 font-bold' : 'text-ink-500',
                    )}
                  >
                    {DOW_LABELS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
