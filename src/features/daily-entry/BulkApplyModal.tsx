import { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LocationToggle } from './LocationToggle';
import { notify } from '@/lib/notify';
import { upsertDay } from '@/api/days';
import { useCalendarOverrides } from '@/hooks/useCalendarOverrides';
import { useDaysInRange } from '@/hooks/useDay';
import { resolveDay } from '@/lib/calendar';
import { formatThaiDate, getMonthGrid, isSameMonth, monthRange, toISO } from '@/lib/date';
import { friendlyDbError } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { LocationKind } from '@/types/db';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** เดือนเริ่มต้นที่จะแสดง (yyyy-MM) */
  defaultMonth: string;
}

const DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

export function BulkApplyModal({ open, onOpenChange, defaultMonth }: Props) {
  const [month, setMonth] = useState(defaultMonth);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState<LocationKind>('leave');
  const [note, setNote] = useState('');
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [skipExisting, setSkipExisting] = useState(true);
  const [running, setRunning] = useState(false);

  const { map: overrides } = useCalendarOverrides();
  const range = useMemo(() => monthRange(month), [month]);
  const existing = useDaysInRange(range.from, range.to);
  const existingDates = useMemo(
    () => new Set((existing.data ?? []).map((d) => d.date)),
    [existing.data],
  );

  const qc = useQueryClient();
  const grid = useMemo(() => getMonthGrid(month), [month]);
  const monthDate = new Date(`${month}-01T00:00:00`);

  const toggleDate = (iso: string) => {
    const next = new Set(selected);
    if (next.has(iso)) next.delete(iso);
    else next.add(iso);
    setSelected(next);
  };

  const selectAllInMonth = () => {
    const next = new Set(selected);
    for (const d of grid) {
      if (!isSameMonth(d, monthDate)) continue;
      next.add(toISO(d));
    }
    setSelected(next);
  };
  const clearAll = () => setSelected(new Set());

  // คำนวณวันที่จะถูก apply จริง (หลัง filter)
  const toApply = useMemo(() => {
    const out: string[] = [];
    for (const iso of selected) {
      if (skipExisting && existingDates.has(iso)) continue;
      if (skipHolidays && (location === 'wfh' || location === 'onsite')) {
        const info = resolveDay(iso, overrides);
        if (info.type === 'holiday') continue;
      }
      out.push(iso);
    }
    return out.sort();
  }, [selected, skipExisting, skipHolidays, location, overrides, existingDates]);

  const skipped = selected.size - toApply.length;

  const handleApply = async () => {
    if (toApply.length === 0) {
      notify.error('ไม่มีวันที่จะ apply');
      return;
    }
    setRunning(true);
    let ok = 0;
    const fails: string[] = [];
    for (const date of toApply) {
      try {
        const info = resolveDay(date, overrides);
        await upsertDay({
          date,
          location,
          is_holiday: info.type === 'holiday',
          note: note.trim() || null,
        });
        ok++;
      } catch (err) {
        fails.push(`${date} (${friendlyDbError(err, 'error')})`);
      }
    }
    setRunning(false);
    qc.invalidateQueries({ queryKey: ['day'] });
    qc.invalidateQueries({ queryKey: ['days'] });
    if (fails.length === 0) {
      notify.success(`Bulk apply สำเร็จ ${ok} วัน ✓`);
      onOpenChange(false);
      setSelected(new Set());
      setNote('');
    } else {
      notify.error(`สำเร็จ ${ok}, ผิดพลาด ${fails.length}: ${fails.slice(0, 2).join(', ')}`);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(640px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-auto bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp-lg p-5 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="font-display font-extrabold text-h3">
              Bulk apply
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center border-1.5 border-ink-900 rounded-field bg-cream-50 hover:bg-cream-200"
              >
                <X size={14} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="font-body text-sm text-ink-500 mb-4">
            เลือกหลายวันแล้ว apply location เดียว — ใช้ตอนลาพักร้อนหลายวัน หรือ WFH ทั้งสัปดาห์
          </Dialog.Description>

          {/* Month nav + select-all */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Button variant="paper" size="sm" onClick={() => setMonth(prevMonth(month))}>←</Button>
            <span className="font-display font-bold text-h4">{formatThaiDate(`${month}-01`, 'MMMM yyyy')}</span>
            <Button variant="paper" size="sm" onClick={() => setMonth(nextMonth(month))}>→</Button>
            <Button variant="paper" size="sm" onClick={selectAllInMonth} className="ml-auto">
              เลือกทั้งเดือน
            </Button>
            <Button variant="paper" size="sm" onClick={clearAll} disabled={selected.size === 0}>
              ล้าง ({selected.size})
            </Button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DOW.map((d) => (
              <div key={d} className="text-center font-mono text-[10px] text-ink-500 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-4">
            {grid.map((d) => {
              const iso = toISO(d);
              const inMonth = isSameMonth(d, monthDate);
              const isSel = selected.has(iso);
              const info = resolveDay(iso, overrides);
              const existsInDB = existingDates.has(iso);
              const holiday = info.type === 'holiday';

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={!inMonth}
                  onClick={() => toggleDate(iso)}
                  className={cn(
                    'relative aspect-square rounded-chip border-1.5 font-mono text-[11px] font-bold transition-all',
                    'hover:-translate-y-0.5 hover:shadow-stamp-sm',
                    isSel
                      ? 'bg-ink-900 border-ink-900 text-paper'
                      : holiday
                      ? 'bg-cream-200 border-ink-300'
                      : 'bg-paper border-ink-300',
                    !inMonth && 'opacity-0 pointer-events-none',
                  )}
                >
                  {d.getDate()}
                  {existsInDB && (
                    <span className="absolute -top-0.5 -right-0.5 text-[8px]" title="มี entry แล้ว">✏️</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Preset */}
          <div className="space-y-3">
            <div>
              <span className="font-display font-bold text-label text-ink-500 uppercase">Location</span>
              <LocationToggle className="mt-1.5" value={location} onChange={setLocation} />
            </div>
            <div>
              <label className="font-display font-bold text-label text-ink-500 uppercase">Note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ลาพักร้อน, WFH สัปดาห์นี้, ..."
                className="mt-1.5 w-full h-10 px-3 bg-paper border-1.5 border-ink-900 rounded-field font-body text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-body">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipExisting}
                  onChange={(e) => setSkipExisting(e.target.checked)}
                  className="h-4 w-4 border-1.5 border-ink-900 accent-tangerine"
                />
                Skip วันที่มี entry แล้ว
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipHolidays}
                  onChange={(e) => setSkipHolidays(e.target.checked)}
                  className="h-4 w-4 border-1.5 border-ink-900 accent-tangerine"
                />
                Skip วันหยุด (เฉพาะ WFH/Onsite)
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t-1.5 border-ink-900 flex items-center justify-between gap-3 flex-wrap">
            <div className="font-mono text-sm">
              <span className="text-ink-900 font-bold">{toApply.length}</span> วันจะถูก apply
              {skipped > 0 && (
                <span className="text-ink-500"> · skip {skipped}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog.Close asChild>
                <Button variant="paper" size="md">Cancel</Button>
              </Dialog.Close>
              <Button
                variant="primary"
                size="md"
                onClick={handleApply}
                disabled={running || toApply.length === 0}
              >
                {running ? 'กำลัง apply...' : `Apply ${toApply.length} วัน`}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function prevMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function nextMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
