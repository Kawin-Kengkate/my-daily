import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MonthPicker } from '@/components/MonthPicker';
import { ProjectCode } from '@/components/ProjectCode';
import { CompareCard } from '@/features/dashboard/CompareCard';
import { useDaysInRange } from '@/hooks/useDay';
import { useSettings } from '@/hooks/useSettings';
import { useProjects } from '@/hooks/useProjects';
import { monthRange } from '@/lib/date';
import { summarizePeriod } from '@/lib/aggregate';
import { formatMoney, formatHours } from '@/lib/format';

function prevMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return format(d, 'yyyy-MM');
}

export function ComparePage() {
  const thisMonth = format(new Date(), 'yyyy-MM');
  const [monthA, setMonthA] = useState(thisMonth);
  const [monthB, setMonthB] = useState(() => prevMonth(thisMonth));

  const rangeA = useMemo(() => monthRange(monthA), [monthA]);
  const rangeB = useMemo(() => monthRange(monthB), [monthB]);
  const { data: daysA = [] } = useDaysInRange(rangeA.from, rangeA.to);
  const { data: daysB = [] } = useDaysInRange(rangeB.from, rangeB.to);
  const { data: settings } = useSettings();
  const { data: projects = [] } = useProjects();

  const sumA = useMemo(() => summarizePeriod(daysA, settings), [daysA, settings]);
  const sumB = useMemo(() => summarizePeriod(daysB, settings), [daysB, settings]);

  const projectById = useMemo(() => {
    const m = new Map<string, (typeof projects)[number]>();
    for (const p of projects) m.set(p.id, p);
    return m;
  }, [projects]);

  const topProjects = (
    s: ReturnType<typeof summarizePeriod>,
  ): Array<{ id: string; hours: number }> =>
    Object.entries(s.projectHours)
      .map(([id, hours]) => ({ id, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-extrabold text-display">Compare</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <MonthPicker value={monthA} onChange={setMonthA} />
          <span className="font-display font-bold text-ink-500">vs</span>
          <MonthPicker value={monthB} onChange={setMonthB} />
          <Button
            variant="paper"
            size="sm"
            onClick={() => {
              setMonthA(thisMonth);
              setMonthB(prevMonth(thisMonth));
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <CompareCard label="วันที่บันทึก" a={sumA.daysLogged} b={sumB.daysLogged} />
        <CompareCard label="ชั่วโมงรวม" a={sumA.workHours} b={sumB.workHours} format={formatHours} />
        <CompareCard
          label="OT 1.5x"
          a={sumA.otHours15}
          b={sumB.otHours15}
          format={formatHours}
          hint={
            <span className="text-ink-500">
              + 3x {formatHours(sumA.otHours3)} / {formatHours(sumB.otHours3)}
            </span>
          }
        />
        <CompareCard
          label="OT เงิน"
          a={sumA.otAmount}
          b={sumB.otAmount}
          format={(n) => `฿${formatMoney(n)}`}
          valueClass="text-tangerine"
        />
        <CompareCard label="WFH" a={sumA.wfh} b={sumB.wfh} />
        <CompareCard label="Onsite" a={sumA.onsite} b={sumB.onsite} />
        <CompareCard label="ลา" a={sumA.leave} b={sumB.leave} />
        <CompareCard label="Training" a={sumA.training} b={sumB.training} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="font-display font-bold text-h4 mb-1">{monthA} · Top projects</div>
          <div className="font-mono text-xs text-ink-500 mb-3">A</div>
          <ProjectList items={topProjects(sumA)} projectById={projectById} />
        </Card>
        <Card className="p-5">
          <div className="font-display font-bold text-h4 mb-1">{monthB} · Top projects</div>
          <div className="font-mono text-xs text-ink-500 mb-3">B</div>
          <ProjectList items={topProjects(sumB)} projectById={projectById} />
        </Card>
      </div>
    </div>
  );
}

function ProjectList({
  items,
  projectById,
}: {
  items: Array<{ id: string; hours: number }>;
  projectById: Map<string, { id: string; code: string; name: string; color: string }>;
}) {
  if (items.length === 0) {
    return <p className="font-body text-sm text-ink-500">ไม่มี entry ในเดือนนี้</p>;
  }
  const max = items[0]?.hours ?? 1;
  return (
    <ul className="space-y-2">
      {items.map((it) => {
        const p = projectById.get(it.id);
        const pct = (it.hours / max) * 100;
        return (
          <li key={it.id} className="flex items-center gap-2">
            <ProjectCode code={p?.code ?? '?'} hexColor={p?.color} />
            <div className="flex-1 relative h-3 bg-cream-100 border-1.5 border-ink-900 rounded-chip overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-peri"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-sm text-ink-700 w-14 text-right">
              {it.hours.toFixed(1)}h
            </span>
          </li>
        );
      })}
    </ul>
  );
}
