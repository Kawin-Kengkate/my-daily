import { differenceInCalendarDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ProjectCode } from '@/components/ProjectCode';
import { Pill } from '@/components/Pill';
import type { Project } from '@/types/db';
import type { ProjectTimelineData } from '@/lib/timeline';
import { clampPct } from '@/lib/timeline';

interface Props {
  project: Project;
  data: ProjectTimelineData;
  today: string;
}

export function TimelineCountdownCard({ project: p, data, today }: Props) {
  // Mini progress bar: % through overall span (first bar start → last bar end)
  const spanStart = data.bars[0]?.start;
  const spanEnd   = data.bars[data.bars.length - 1]?.end;
  let progressPct: number | null = null;
  if (spanStart && spanEnd) {
    const totalSpan = differenceInCalendarDays(parseISO(spanEnd), parseISO(spanStart));
    if (totalSpan > 0) {
      const elapsed = differenceInCalendarDays(parseISO(today), parseISO(spanStart));
      progressPct = clampPct((elapsed / totalSpan) * 100);
    }
  }

  return (
    <div className="border-1.5 border-ink-900 rounded-card shadow-stamp p-4 bg-paper">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5 min-w-0">
        <span
          className="h-2.5 w-2.5 rounded-full border-1.5 border-ink-900 shrink-0"
          style={{ background: p.color }}
        />
        <ProjectCode code={p.code} />
        <span className="font-body text-sm text-ink-900 truncate">{p.name}</span>
      </div>

      {/* Mini progress bar */}
      {progressPct !== null && (
        <div className="h-2 bg-cream-200 rounded-full mb-2.5 border-1.5 border-ink-900 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: p.color }}
          />
        </div>
      )}

      {/* Countdown pills */}
      {data.upcomingCountdowns.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {data.upcomingCountdowns.map((c) => (
            <Pill
              key={c.label}
              className={cn(
                'border-1.5 border-ink-900 text-xs',
                c.label === 'Go-live'
                  ? 'bg-tangerine/20 text-ink-900 font-bold'
                  : 'bg-cream-100 text-ink-700',
              )}
            >
              <span>{c.label}</span>
              <span className="font-mono font-bold ml-1">{c.daysLeft}d</span>
            </Pill>
          ))}
        </div>
      ) : (
        <span className="text-xs font-mono text-ink-400">ผ่านหมุดทั้งหมดแล้ว</span>
      )}
    </div>
  );
}
