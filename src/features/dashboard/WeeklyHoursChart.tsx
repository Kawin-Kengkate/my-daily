import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { TooltipProps } from 'recharts';
import type { DayWithEntries } from '@/types/db';
import { calculateOT, calcWorkHours } from '@/lib/ot';
import type { UserSettings } from '@/types/db';
import { getISOWeek } from 'date-fns';

function WeekTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-paper border-1.5 border-ink-900 rounded-card px-3 py-2 shadow-stamp-sm font-mono text-xs">
      <div className="font-display font-bold mb-1">{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 border-1.5 border-ink-900"
            style={{ background: p.color }}
          />
          <span className="text-ink-700">{p.dataKey === 'ot' ? 'OT' : 'Regular'}</span>
          <span className="font-bold">{(p.value ?? 0).toFixed(2)}h</span>
        </div>
      ))}
    </div>
  );
}

/** stacked bar: regular hours + OT hours per ISO week */
export function WeeklyHoursChart({
  days,
  settings,
}: {
  days: DayWithEntries[];
  settings: UserSettings | null | undefined;
}) {
  const data = useMemo(() => {
    const byWeek: Record<string, { week: string; regular: number; ot: number }> = {};
    for (const d of days) {
      const wk = `W${getISOWeek(new Date(d.date + 'T00:00:00'))}`;
      byWeek[wk] ??= { week: wk, regular: 0, ot: 0 };

      const breakMin = settings?.break_minutes ?? 40;
      const isHoliday = d.is_holiday || d.location === 'holiday';
      const effectiveHours = calcWorkHours(
        d.entries.map((e) => ({ start_time: e.start_time.slice(0, 5), end_time: e.end_time.slice(0, 5) })),
        breakMin,
        isHoliday,
        d.location,
      );
      let otHours = 0;
      if (settings) {
        const ot = calculateOT({ is_holiday: d.is_holiday, location: d.location }, d.entries, settings);
        otHours = ot.hours15x + ot.hours3x;
      }
      const regular = Math.max(0, effectiveHours - otHours);
      byWeek[wk].regular += regular;
      byWeek[wk].ot += otHours;
    }
    return Object.values(byWeek).sort((a, b) => a.week.localeCompare(b.week));
  }, [days, settings]);

  if (data.length === 0) return <p className="text-ink-500 font-body text-sm">ไม่มีข้อมูล</p>;

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-300)" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip content={<WeekTooltip />} cursor={{ fill: 'var(--cream-100)' }} />
          <Bar dataKey="regular" stackId="a" fill="var(--peri-soft)" stroke="var(--ink-900)" strokeWidth={1.5} />
          <Bar dataKey="ot" stackId="a" fill="var(--tangerine)" stroke="var(--ink-900)" strokeWidth={1.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
