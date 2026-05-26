import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { LearningCourse, LearningSession } from '@/types/db';

const PALETTE = ['#6B7FE8', '#F7C548', '#4FB389', '#FF6B35', '#F291A6', '#DCCFB6', '#A78BFA'];

export function HoursPerCourseDonut({
  sessions,
  courses,
}: {
  sessions: LearningSession[];
  courses: LearningCourse[];
}) {
  const data = useMemo(() => {
    const hoursMap = new Map<string, number>();
    for (const s of sessions) {
      hoursMap.set(s.course_id, (hoursMap.get(s.course_id) ?? 0) + s.duration_min);
    }
    return Array.from(hoursMap.entries())
      .map(([id, min], i) => ({
        name: courses.find((c) => c.id === id)?.code ?? '?',
        fullName: courses.find((c) => c.id === id)?.name ?? id,
        value: Math.round((min / 60) * 10) / 10,
        fill: PALETTE[i % PALETTE.length],
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [sessions, courses]);

  const totalHours = data.reduce((s, d) => s + d.value, 0);
  if (totalHours === 0) return <p className="text-ink-500 font-body text-sm">ยังไม่มี session</p>;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[140px] h-[140px] shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={38}
              outerRadius={64}
              stroke="var(--ink-900)"
              strokeWidth={1.5}
            >
              {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-paper border-1.5 border-ink-900 rounded-card px-3 py-2 shadow-stamp-sm font-mono text-xs">
                    <div className="font-display font-bold mb-0.5">{d.fullName}</div>
                    <div>{d.value} ชม.</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-extrabold text-stat">{totalHours.toFixed(1)}</span>
          <span className="font-mono text-tiny text-ink-500 uppercase">hrs</span>
        </div>
      </div>
      <ul className="space-y-1 text-sm flex-1 min-w-0">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 font-mono">
            <span className="h-3 w-3 shrink-0 rounded border-1.5 border-ink-900" style={{ background: d.fill }} />
            <span className="font-bold truncate">{d.name}</span>
            <span className="text-ink-500 ml-auto shrink-0">{d.value}h</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
