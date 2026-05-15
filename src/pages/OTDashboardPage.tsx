import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { OTTable } from '@/features/ot-report/OTTable';
import { monthRange } from '@/lib/date';

export function OTDashboardPage() {
  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const range = useMemo(() => monthRange(month), [month]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-extrabold text-display">OT Report</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="h-10 px-3 bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm font-mono font-bold"
        />
      </div>
      <OTTable from={range.from} to={range.to} />
    </div>
  );
}
