import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/lib/notify';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sticker } from '@/components/Sticker';
import { Skeleton } from '@/components/Skeleton';
import {
  useCalendarOverrides,
  useSetCalendarOverride,
  useDeleteCalendarOverride,
} from '@/hooks/useCalendarOverrides';
import { resolveDay } from '@/lib/calendar';
import { getMonthGrid, isSameMonth, toISO, formatThaiDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { friendlyDbError } from '@/lib/format';

const DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const MONTHS_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export function CalendarMaintenancePage() {
  const navigate = useNavigate();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const { map: overrides, data: overrideList, isLoading } = useCalendarOverrides();
  const setOverride = useSetCalendarOverride();
  const delOverride = useDeleteCalendarOverride();

  const yearOverrides = useMemo(
    () => (overrideList ?? []).filter((o) => o.date.startsWith(`${year}`)),
    [overrideList, year],
  );

  const handleCellClick = async (iso: string) => {
    const info = resolveDay(iso, overrides);
    try {
      if (info.source === 'override_working' || info.source === 'override_holiday') {
        await delOverride.mutateAsync(iso);
        notify.success(`ลบ override ${formatThaiDate(iso, 'd MMM yy')}`);
        return;
      }
      // ไม่มี override → toggle ฝั่งตรงข้ามของ default
      if (info.type === 'workday') {
        await setOverride.mutateAsync({ date: iso, kind: 'holiday', label: null });
        notify.success(`เพิ่มวันหยุดพิเศษ ${formatThaiDate(iso, 'd MMM yy')}`);
      } else {
        await setOverride.mutateAsync({ date: iso, kind: 'working', label: null });
        notify.success(`เพิ่มวันทำงาน ${formatThaiDate(iso, 'd MMM yy')}`);
      }
    } catch (err) {
      notify.error(friendlyDbError(err, 'บันทึกไม่สำเร็จ'));
    }
  };

  const handleEditLabel = async (iso: string, currentLabel: string | null, kind: 'working' | 'holiday') => {
    const label = window.prompt(
      `ป้ายกำกับสำหรับ ${formatThaiDate(iso, 'd MMM yy')}`,
      currentLabel ?? '',
    );
    if (label === null) return;
    try {
      await setOverride.mutateAsync({ date: iso, kind, label: label.trim() || null });
      notify.success('บันทึก label แล้ว');
    } catch (err) {
      notify.error(friendlyDbError(err, 'บันทึกไม่สำเร็จ'));
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="paper" size="sm" onClick={() => navigate('/settings')}>
            <ArrowLeft size={14} /> Settings
          </Button>
          <h2 className="font-display font-extrabold text-display">ปฏิทินวันทำงาน</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="paper" size="sm" onClick={() => setYear(year - 1)}>
            <ChevronLeft size={14} />
          </Button>
          <span className="font-display font-bold text-h3 w-16 text-center">{year}</span>
          <Button variant="paper" size="sm" onClick={() => setYear(year + 1)}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <LegendDot className="bg-paper border-ink-900" label="วันทำงานปกติ" />
          <LegendDot className="bg-cream-200 border-ink-300" label="ส-อา" />
          <LegendDot className="bg-lemon-soft border-ink-900" label="วันหยุดราชการ" />
          <LegendDot className="bg-peri-soft border-ink-900" label="📌 override: ทำงาน" />
          <LegendDot className="bg-rose-soft border-ink-900" label="🎉 override: หยุด" />
          <span className="ml-auto font-mono text-xs text-ink-500">
            คลิกเซลล์เพื่อ toggle · double-click ใส่ label
          </span>
        </div>
      </Card>

      {isLoading ? (
        <Skeleton className="h-96" rounded="card" bordered />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <MonthGrid
              key={i}
              year={year}
              month={i + 1}
              overrides={overrides}
              onCellClick={handleCellClick}
              onCellDoubleClick={(iso) => {
                const info = resolveDay(iso, overrides);
                if (info.source === 'override_working') handleEditLabel(iso, info.label ?? null, 'working');
                else if (info.source === 'override_holiday') handleEditLabel(iso, info.label ?? null, 'holiday');
              }}
            />
          ))}
        </div>
      )}

      <Card className="p-4">
        <h3 className="font-display font-bold text-h4 mb-3">
          Overrides ปี {year}{' '}
          <span className="font-mono text-sm text-ink-500">({yearOverrides.length})</span>
        </h3>
        {yearOverrides.length === 0 ? (
          <p className="font-body text-ink-500 text-sm">ยังไม่มี override สำหรับปีนี้</p>
        ) : (
          <ul className="space-y-1.5">
            {yearOverrides.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-field hover:bg-cream-50"
              >
                <Sticker color={o.kind === 'working' ? 'peri' : 'lemon'} rotate={0}>
                  {o.kind === 'working' ? '📌 ทำงาน' : '🎉 หยุด'}
                </Sticker>
                <span className="font-mono text-sm">{formatThaiDate(o.date, 'EEE d MMM yy')}</span>
                {o.label && <span className="font-body text-sm text-ink-700">— {o.label}</span>}
                <button
                  type="button"
                  onClick={() => {
                    delOverride.mutate(o.date);
                  }}
                  className="ml-auto font-mono text-xs text-rose hover:underline"
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('inline-block h-4 w-4 rounded-chip border-1.5', className)} />
      <span className="font-mono text-xs">{label}</span>
    </span>
  );
}

function MonthGrid({
  year,
  month,
  overrides,
  onCellClick,
  onCellDoubleClick,
}: {
  year: number;
  month: number;
  overrides: ReturnType<typeof useCalendarOverrides>['map'];
  onCellClick: (iso: string) => void;
  onCellDoubleClick: (iso: string) => void;
}) {
  const yyyymm = `${year}-${String(month).padStart(2, '0')}`;
  const grid = useMemo(() => getMonthGrid(yyyymm), [yyyymm]);
  const monthDate = new Date(`${yyyymm}-01T00:00:00`);

  return (
    <Card className="p-3">
      <div className="font-display font-bold text-h4 mb-2 leading-none">
        {MONTHS_TH[month - 1]}
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DOW.map((d) => (
          <div key={d} className="text-center font-mono text-[10px] text-ink-500 uppercase">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((d) => {
          const iso = toISO(d);
          const inMonth = isSameMonth(d, monthDate);
          const info = resolveDay(iso, overrides);

          const bg =
            info.source === 'override_working'
              ? 'bg-peri-soft border-ink-900'
              : info.source === 'override_holiday'
              ? 'bg-rose-soft border-ink-900'
              : info.source === 'public_holiday'
              ? 'bg-lemon-soft border-ink-900'
              : info.source === 'weekend'
              ? 'bg-cream-200 border-ink-300'
              : 'bg-paper border-ink-300';

          return (
            <button
              key={iso}
              type="button"
              disabled={!inMonth}
              onClick={() => onCellClick(iso)}
              onDoubleClick={() => onCellDoubleClick(iso)}
              title={info.label ?? ''}
              className={cn(
                'relative aspect-square rounded-chip border-1.5 font-mono text-[11px] font-bold transition-all',
                'hover:-translate-y-0.5 hover:shadow-stamp-sm',
                bg,
                !inMonth && 'opacity-0 pointer-events-none',
              )}
            >
              {d.getDate()}
              {info.source === 'override_working' && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">📌</span>
              )}
              {info.source === 'override_holiday' && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">🎉</span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
