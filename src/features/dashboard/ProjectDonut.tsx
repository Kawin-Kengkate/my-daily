import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { DayWithEntries, Project } from '@/types/db';

const PALETTE = ['#6B7FE8', '#F7C548', '#4FB389', '#FF6B35', '#F291A6', '#DCCFB6'];

export function ProjectDonut({ days, projects }: { days: DayWithEntries[]; projects: Project[] }) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of days) for (const e of d.entries) counts.set(e.project_id, (counts.get(e.project_id) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([id, n], i) => ({
        name: projects.find((p) => p.id === id)?.code ?? '?',
        value: n,
        fill: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [days, projects]);

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-ink-500 font-body text-sm">ไม่มีข้อมูล</p>;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[140px] h-[140px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={38} outerRadius={64} stroke="var(--ink-900)" strokeWidth={1.5}>
              {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-extrabold text-stat">{total}</span>
          <span className="font-mono text-tiny text-ink-500 uppercase">entries</span>
        </div>
      </div>
      <ul className="space-y-1 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 font-mono">
            <span className="h-3 w-3 rounded border-1.5 border-ink-900" style={{ background: d.fill }} />
            <span className="font-bold">{d.name}</span>
            <span className="text-ink-500">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
