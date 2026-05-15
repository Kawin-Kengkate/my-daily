import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatBlock } from '@/features/dashboard/StatBlock';
import { useDaysInRange } from '@/hooks/useDay';
import { useSettings } from '@/hooks/useSettings';
import { useProjects } from '@/hooks/useProjects';
import { quarterRange } from '@/lib/date';
import { calculateOT } from '@/lib/ot';
import { formatMoney, formatHours } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Sticker } from '@/components/Sticker';
import { ProjectCode } from '@/components/ProjectCode';

export function QuarterlyDashboardPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [q, setQ] = useState<1 | 2 | 3 | 4>(((Math.floor(new Date().getMonth() / 3) + 1) as 1 | 2 | 3 | 4));
  const range = useMemo(() => quarterRange(year, q), [year, q]);
  const { data: days = [], isLoading } = useDaysInRange(range.from, range.to);
  const { data: settings } = useSettings();
  const { data: projects = [] } = useProjects();

  const byMonth = useMemo(() => {
    const m: Record<string, { month: string; h15: number; h3: number; amt: number }> = {};
    for (const d of days) {
      const mk = d.date.slice(0, 7);
      m[mk] ??= { month: mk, h15: 0, h3: 0, amt: 0 };
      if (settings) {
        const ot = calculateOT({ is_holiday: d.is_holiday, location: d.location }, d.entries, settings);
        m[mk].h15 += ot.hours15x;
        m[mk].h3 += ot.hours3x;
        m[mk].amt += ot.total;
      }
    }
    return Object.values(m).sort((a, b) => a.month.localeCompare(b.month));
  }, [days, settings]);

  const totals = byMonth.reduce((a, m) => ({ h15: a.h15 + m.h15, h3: a.h3 + m.h3, amt: a.amt + m.amt }), { h15: 0, h3: 0, amt: 0 });

  const achievements = useMemo(() => {
    const fromTs = `${range.from}T00:00:00`;
    const toTs = `${range.to}T23:59:59`;
    const done = projects.filter((p) => p.done_at && p.done_at >= fromTs && p.done_at <= toTs);
    const notesByProject = new Map<string, string[]>();
    for (const d of days) {
      for (const e of d.entries) {
        if (!e.done_note) continue;
        const arr = notesByProject.get(e.project_id) ?? [];
        arr.push(e.done_note);
        notesByProject.set(e.project_id, arr);
      }
    }
    return done.map((p) => ({
      project: p,
      notes: Array.from(new Set(notesByProject.get(p.id) ?? [])).slice(0, 6),
    }));
  }, [projects, days, range]);

  const projectCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of days) for (const e of d.entries) m.set(e.project_id, (m.get(e.project_id) ?? 0) + 1);
    return Array.from(m.entries()).map(([id, n]) => ({ code: projects.find((p) => p.id === id)?.code ?? '?', n })).sort((a, b) => b.n - a.n);
  }, [days, projects]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-extrabold text-display">Quarterly</h2>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))}
          className="h-10 w-24 px-3 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-mono font-bold" />
        <select value={q} onChange={(e) => setQ(Number(e.target.value) as 1 | 2 | 3 | 4)}
          className="h-10 px-3 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-mono font-bold">
          <option value={1}>Q1</option><option value={2}>Q2</option><option value={3}>Q3</option><option value={4}>Q4</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="วันที่กรอก" value={days.length} loading={isLoading} />
        <StatBlock label="OT 1.5x" value={formatHours(totals.h15)} loading={isLoading} />
        <StatBlock label="OT 3x" value={formatHours(totals.h3)} loading={isLoading} />
        <StatBlock label="รวมเงิน OT" value={<span className="text-tangerine">฿{formatMoney(totals.amt)}</span>} loading={isLoading} />
      </div>

      <Card className="p-5">
        <h3 className="font-display font-bold text-h4 mb-3">OT trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-300)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="h15" stackId="a" fill="var(--peri)" />
              <Bar dataKey="h3" stackId="a" fill="var(--tangerine)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-bold text-h4 mb-4">🏆 Done in Q{q}</h3>
        {achievements.length === 0 ? (
          <p className="text-ink-500 font-body text-sm">ยังไม่มีโปรเจค done ในควอเตอร์นี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(({ project, notes }, i) => (
              <div key={project.id} className="border-1.5 border-ink-900 rounded-card p-4 bg-cream-50 shadow-stamp">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full border-1.5 border-ink-900" style={{ background: project.color }} />
                    <ProjectCode code={project.code} />
                    <span className="font-display font-bold">{project.name}</span>
                  </div>
                  <Sticker color="mint" rotate={i % 2 === 0 ? -3 : 3}>
                    {project.done_at ? new Date(project.done_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) : 'done'}
                  </Sticker>
                </div>
                {notes.length > 0 && (
                  <ul className="font-mono text-xs text-ink-700 space-y-0.5 mt-2 list-disc pl-4">
                    {notes.map((n, idx) => <li key={idx}>{n}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-bold text-h4 mb-3">Projects (จำนวน entries)</h3>
        <ul className="space-y-1">
          {projectCounts.length === 0 && (
            <li className="text-ink-500 font-body text-sm py-4 text-center">ไม่มี entry ในควอเตอร์นี้</li>
          )}
          {projectCounts.map((p) => (
            <li key={p.code} className="flex justify-between font-mono">
              <span className="font-bold">{p.code}</span>
              <span className="text-ink-500">{p.n}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
