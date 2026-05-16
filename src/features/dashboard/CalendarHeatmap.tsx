import { useMemo } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { useNavigate } from 'react-router-dom';
import type { DayWithEntries, Project } from '@/types/db';
import { getMonthGrid, isSameMonth, toISO, formatThaiDate, diffHours } from '@/lib/date';
import { resolveDay } from '@/lib/calendar';
import { useCalendarOverrides } from '@/hooks/useCalendarOverrides';
import { parseHHMM } from '@/lib/ot';
import { Star4 } from '@/components/Star4';
import { Pill } from '@/components/Pill';
import { cn } from '@/lib/utils';

const DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const locationBg: Record<string, string> = {
  onsite: 'bg-mint-soft',
  wfh: 'bg-peri-soft',
  leave: 'bg-rose-soft',
  training: 'bg-lemon-soft',
  holiday: 'bg-cream-200',
};

const locationLabel: Record<string, string> = {
  onsite: 'Onsite',
  wfh: 'WFH',
  leave: 'ลา',
  training: 'Training',
  holiday: 'Holiday',
};

interface Props {
  yyyymm: string;
  days: DayWithEntries[];
  projects?: Project[];
}

export function CalendarHeatmap({ yyyymm, days, projects = [] }: Props) {
  const navigate = useNavigate();
  const { map: overrides } = useCalendarOverrides();
  const grid = useMemo(() => getMonthGrid(yyyymm), [yyyymm]);
  const monthDate = new Date(`${yyyymm}-01T00:00:00`);
  const byDate = useMemo(() => {
    const m = new Map<string, DayWithEntries>();
    for (const d of days) m.set(d.date, d);
    return m;
  }, [days]);
  const projectById = useMemo(() => {
    const m = new Map<string, Project>();
    for (const p of projects) m.set(p.id, p);
    return m;
  }, [projects]);

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
          const info = resolveDay(iso, overrides);
          const holiday = info.type === 'holiday';
          const isWorkingOverride = info.source === 'override_working';
          const hasOT = !!day?.entries?.some((e) => parseHHMM(e.end_time) > 17 * 60);

          const cellInner = (
            <>
              <span className="font-mono text-tiny font-bold">{d.getDate()}</span>
              {hasOT && <Star4 size={12} className="absolute bottom-1 right-1" />}
              {holiday && <span className="absolute bottom-0.5 right-0.5 text-[10px]">🎉</span>}
              {isWorkingOverride && <span className="absolute bottom-0.5 right-0.5 text-[10px]">📌</span>}
            </>
          );

          const cellClass = cn(
            'relative aspect-square border-1.5 border-ink-900 rounded-chip p-1.5 transition-all',
            'hover:-translate-y-0.5 hover:shadow-stamp-sm cursor-pointer',
            day ? locationBg[day.location] : 'bg-paper',
            !isCur && 'opacity-30',
            holiday && !day && 'bg-lemon-soft',
            isWorkingOverride && !day && 'bg-peri-soft',
          );

          return (
            <HoverCard.Root key={iso} openDelay={120} closeDelay={80}>
              <HoverCard.Trigger asChild>
                <button
                  type="button"
                  onClick={() => navigate(`/daily/${iso}`)}
                  className={cellClass}
                >
                  {cellInner}
                </button>
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content
                  side="top"
                  align="center"
                  sideOffset={6}
                  className="z-50 w-[240px] pointer-events-none bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-3 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                >
                  <DayPopup iso={iso} day={day} holidayLabel={info.label ?? null} holiday={holiday} projectById={projectById} />
                  <HoverCard.Arrow className="fill-ink-900" />
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
          );
        })}
      </div>
    </div>
  );
}

function DayPopup({
  iso,
  day,
  holiday,
  holidayLabel,
  projectById,
}: {
  iso: string;
  day?: DayWithEntries;
  holiday: boolean;
  holidayLabel: string | null;
  projectById: Map<string, Project>;
}) {
  const holidayName = holiday ? holidayLabel : null;
  const totalHours = day?.entries.reduce((s, e) => s + diffHours(e.start_time, e.end_time), 0) ?? 0;
  const latestEnd = day?.entries.reduce<string | null>(
    (acc, e) => (!acc || e.end_time > acc ? e.end_time : acc),
    null,
  );
  const uniqueProjects = Array.from(new Set(day?.entries.map((e) => e.project_id) ?? []));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-display font-bold text-sm">{formatThaiDate(iso, 'd MMM yy')}</div>
        {day && (
          <span className="font-mono text-[10px] text-ink-500 uppercase">
            {locationLabel[day.location]}
          </span>
        )}
      </div>

      {holidayName && (
        <div className="font-mono text-xs text-tangerine">🎉 {holidayName}</div>
      )}

      {!day && !holidayName && (
        <div className="font-mono text-xs text-ink-500">ยังไม่ได้บันทึก — คลิกเพื่อจด</div>
      )}

      {day && (
        <>
          <div className="flex gap-3 font-mono text-xs">
            <div>
              <span className="text-ink-500">ชั่วโมง</span>{' '}
              <span className="font-bold">{totalHours.toFixed(1)}h</span>
            </div>
            {latestEnd && (
              <div>
                <span className="text-ink-500">เลิกงาน</span>{' '}
                <span className="font-bold">{latestEnd.slice(0, 5)}</span>
              </div>
            )}
          </div>
          {uniqueProjects.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {uniqueProjects.slice(0, 5).map((pid) => {
                const p = projectById.get(pid);
                if (!p) return null;
                return (
                  <Pill key={pid} className="text-[10px]">
                    {p.code}
                  </Pill>
                );
              })}
              {uniqueProjects.length > 5 && (
                <span className="font-mono text-[10px] text-ink-500">
                  +{uniqueProjects.length - 5}
                </span>
              )}
            </div>
          )}
        </>
      )}

      <div className="pt-1 border-t border-cream-300 font-mono text-[10px] text-ink-500">
        คลิกเพื่อเปิดหน้า Daily →
      </div>
    </div>
  );
}
