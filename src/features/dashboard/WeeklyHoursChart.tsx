import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { DayWithEntries } from '@/types/db';
import type { OTSettings } from '@/lib/ot';
import { calculateOT, parseHHMM } from '@/lib/ot';
import { getISOWeek } from 'date-fns';

/** stacked bar: regular hours + OT hours per ISO week */
export function WeeklyHoursChart({
  days,
  settings,
}: {
  days: DayWithEntries[];
  settings: OTSettings | null | undefined;
}) {
  const data = useMemo(() => {
    const byWeek: Record<string, { week: string; regular: number; ot: number }> = {};
    for (const d of days) {
      const wk = `W${getISOWeek(new Date(d.date + 'T00:00:00'))}`;
      byWeek[wk] ??= { week: wk, regular: 0, ot: 0 };

      // regular = total paid before 17:00 on weekday, before 8:00 isn't counted but OK
      const totalMin = d.entries.reduce((s, e) => s + Math.max(0, parseHHMM(e.end_time) - parseHHMM(e.start_time)), 0);
      let otHours = 0;
      if (settings) {
        const ot = calculateOT({ is_holiday: d.is_holiday, location: d.location }, d.entries, settings);
        otHours = ot.hours15x + ot.hours3x;
      }
      const regular = Math.max(0, totalMin / 60 - otHours);
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
          <Tooltip />
          <Bar dataKey="regular" stackId="a" fill="var(--peri-soft)" stroke="var(--ink-900)" strokeWidth={1.5} />
          <Bar dataKey="ot" stackId="a" fill="var(--tangerine)" stroke="var(--ink-900)" strokeWidth={1.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
