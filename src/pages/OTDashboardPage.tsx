import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { OTTable } from '@/features/ot-report/OTTable';
import { monthRange } from '@/lib/date';
import { MonthPicker } from '@/components/MonthPicker';

export function OTDashboardPage() {
  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const range = useMemo(() => monthRange(month), [month]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-extrabold text-display">OT Report</h2>
        <MonthPicker value={month} onChange={setMonth} />
      </div>
      <OTTable from={range.from} to={range.to} />
    </div>
  );
}
