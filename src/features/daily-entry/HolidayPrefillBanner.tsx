import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useCalendarOverrides } from '@/hooks/useCalendarOverrides';
import { useDaysInRange } from '@/hooks/useDay';
import { findHolidayRun, resolveDay } from '@/lib/calendar';
import { formatThaiDate } from '@/lib/date';
import { upsertDay } from '@/api/days';
import { friendlyDbError } from '@/lib/format';
import { useState } from 'react';

interface Props {
  dateISO: string;
  /** ถ้า day ปัจจุบันถูกบันทึกแล้ว → ไม่ต้องโชว์ banner */
  daySaved: boolean;
}

export function HolidayPrefillBanner({ dateISO, daySaved }: Props) {
  const { map: overrides } = useCalendarOverrides();
  const qc = useQueryClient();
  const [working, setWorking] = useState(false);

  const run = useMemo(() => findHolidayRun(dateISO, overrides), [dateISO, overrides]);
  const range = useDaysInRange(run?.from ?? dateISO, run?.to ?? dateISO);

  if (!run || run.dates.length < 2) return null;

  const savedDates = new Set(range.data?.map((d) => d.date) ?? []);
  const missingDates = run.dates.filter((d) => !savedDates.has(d));

  // ไม่โชว์ถ้า:
  // - daySaved แล้ว และ ไม่มี missing วันอื่น
  // - ไม่มี missing เลย
  const otherMissing = missingDates.filter((d) => d !== dateISO);
  if (otherMissing.length === 0 && (daySaved || missingDates.length === 0)) return null;
  if (missingDates.length === 0) return null;

  const handleBulkPrefill = async () => {
    setWorking(true);
    try {
      for (const d of missingDates) {
        const info = resolveDay(d, overrides);
        await upsertDay({
          date: d,
          location: 'holiday',
          is_holiday: info.type === 'holiday',
          note: info.label ?? null,
        });
      }
      qc.invalidateQueries({ queryKey: ['day'] });
      qc.invalidateQueries({ queryKey: ['days'] });
      notify.success(`pre-fill ${missingDates.length} วันแล้ว ✓`);
    } catch (err) {
      notify.error(friendlyDbError(err, 'pre-fill ไม่สำเร็จ'));
    } finally {
      setWorking(false);
    }
  };

  return (
    <Card className="p-4 bg-lemon-soft border-ink-900 flex items-start gap-3 flex-wrap">
      <Sparkles size={20} className="text-tangerine shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-h4 leading-tight">
          ช่วงวันหยุด {run.dates.length} วัน · {formatThaiDate(run.from, 'd MMM')} – {formatThaiDate(run.to, 'd MMM yy')}
        </div>
        <div className="font-mono text-xs text-ink-700 mt-1">
          ยังไม่ได้บันทึก {missingDates.length} วัน — pre-fill เป็น <b>holiday</b> ให้ครบเลย?
        </div>
      </div>
      <Button variant="lemon" size="sm" onClick={handleBulkPrefill} disabled={working}>
        {working ? 'กำลัง pre-fill...' : `Pre-fill ${missingDates.length} วัน`}
      </Button>
    </Card>
  );
}
