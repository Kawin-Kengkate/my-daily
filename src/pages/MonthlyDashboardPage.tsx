import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { CalendarHeatmap } from '@/features/dashboard/CalendarHeatmap';
import { StatBlock } from '@/features/dashboard/StatBlock';
import { ProjectDonut } from '@/features/dashboard/ProjectDonut';
import { WeeklyHoursChart } from '@/features/dashboard/WeeklyHoursChart';
import { useDaysInRange } from '@/hooks/useDay';
import { useSettings } from '@/hooks/useSettings';
import { useProjects } from '@/hooks/useProjects';
import { monthRange } from '@/lib/date';
import { calculateOT } from '@/lib/ot';
import { formatMoney, formatHours } from '@/lib/format';

export function MonthlyDashboardPage() {
  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const range = useMemo(() => monthRange(month), [month]);
  const { data: days = [], isLoading } = useDaysInRange(range.from, range.to);
  const { data: settings } = useSettings();
  const { data: projects = [] } = useProjects();

  const stats = useMemo(() => {
    const counts = { wfh: 0, onsite: 0, leave: 0, training: 0, holiday: 0 };
    let h15 = 0, h3 = 0, amt = 0;
    for (const d of days) {
      counts[d.location as keyof typeof counts] = (counts[d.location as keyof typeof counts] ?? 0) + 1;
      if (settings) {
        const ot = calculateOT({ is_holiday: d.is_holiday, location: d.location }, d.entries, settings);
        h15 += ot.hours15x;
        h3 += ot.hours3x;
        amt += ot.total;
      }
    }
    return { ...counts, h15, h3, amt };
  }, [days, settings]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="font-display font-extrabold text-display">Monthly</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="h-10 px-3 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-mono font-bold"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBlock label="WFH" value={stats.wfh} loading={isLoading} />
        <StatBlock label="Onsite" value={stats.onsite} loading={isLoading} />
        <StatBlock label="ลา" value={stats.leave} loading={isLoading} />
        <StatBlock label="OT 1.5x" value={formatHours(stats.h15)} hint={`+ 3x ${formatHours(stats.h3)}`} loading={isLoading} />
        <StatBlock label="OT เงิน" value={<span className="text-tangerine">฿{formatMoney(stats.amt)}</span>} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display font-bold text-h4 mb-3">Calendar</h3>
          <CalendarHeatmap yyyymm={month} days={days} />
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-bold text-h4 mb-3">Projects touched</h3>
          <ProjectDonut days={days} projects={projects} />
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-display font-bold text-h4 mb-3">Weekly hours</h3>
        <WeeklyHoursChart days={days} settings={settings} />
      </Card>
    </div>
  );
}
