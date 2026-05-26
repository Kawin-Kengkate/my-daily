import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { LearningSession } from '@/types/db';
import { buildWeeklyTrend } from '@/lib/learning';

function TrendTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-paper border-1.5 border-ink-900 rounded-card px-3 py-2 shadow-stamp-sm font-mono text-xs">
      <div className="font-display font-bold mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 border-1.5 border-ink-900 bg-peri" />
        <span className="text-ink-700">เรียน</span>
        <span className="font-bold">{(payload[0].value ?? 0).toFixed(1)}h</span>
      </div>
    </div>
  );
}

export function WeeklyTrendChart({
  sessions,
  weeklyTarget,
}: {
  sessions: LearningSession[];
  weeklyTarget: number;
}) {
  const data = useMemo(() => buildWeeklyTrend(sessions, 8), [sessions]);

  if (data.every((d) => d.hours === 0)) {
    return <p className="text-ink-500 font-body text-sm">ยังไม่มีข้อมูล</p>;
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-300)" />
          <XAxis dataKey="week" tick={{ fontFamily: 'inherit', fontSize: 11 }} />
          <YAxis tick={{ fontFamily: 'inherit', fontSize: 11 }} unit="h" />
          <Tooltip content={<TrendTooltip />} cursor={{ fill: 'var(--cream-100)' }} />
          <ReferenceLine
            y={weeklyTarget}
            stroke="var(--lemon)"
            strokeWidth={2}
            strokeDasharray="5 3"
            label={{
              value: `เป้า ${weeklyTarget}h`,
              position: 'insideTopRight',
              fontSize: 10,
              fontFamily: 'inherit',
              fill: 'var(--ink-700)',
            }}
          />
          <Bar dataKey="hours" fill="var(--peri-soft)" stroke="var(--ink-900)" strokeWidth={1.5} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
