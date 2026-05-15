import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Plus, Copy } from 'lucide-react';
import { DatePopover } from '@/components/DatePopover';
import { MobileDateStrip } from './MobileDateStrip';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sticker } from '@/components/Sticker';
import { RecentProjects } from './RecentProjects';
import { QuickPresets, type PresetBlock } from './QuickPresets';
import { useDay, useSaveDay } from '@/hooks/useDay';
import { useProjects } from '@/hooks/useProjects';
import { useSettings } from '@/hooks/useSettings';
import { isAutoHoliday, getHolidayName } from '@/lib/thai-holidays';
import { calculateOT } from '@/lib/ot';
import { formatMoney, formatHours, friendlyDbError } from '@/lib/format';
import { formatThaiDate, addDays, toISO, fromISO } from '@/lib/date';
import { entryErrors } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import type { LocationKind } from '@/types/db';

interface EntryDraft {
  project_id: string;
  start_time: string;
  end_time: string;
  progress: string;
  done_note: string;
  next_note: string;
}

const LOCATIONS: { value: LocationKind; label: string }[] = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'wfh', label: 'WFH' },
  { value: 'leave', label: 'ลา' },
  { value: 'training', label: 'Training' },
  { value: 'holiday', label: 'Holiday' },
];

const PROGRESS_PRESETS = ['0%', '10%', '30%', '50%', '70%', '90%', 'complete'];

function blankEntry(prevEnd?: string): EntryDraft {
  const start = prevEnd ?? '08:00';
  const end = prevEnd ? addOneHour(start) : '16:40';
  return { project_id: '', start_time: start, end_time: end, progress: '30%', done_note: '', next_note: '' };
}

function addOneHour(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const total = (h * 60 + (m || 0) + 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function DailyForm({ dateISO }: { dateISO: string }) {
  const { data: day, isLoading } = useDay(dateISO);
  const { data: projects = [] } = useProjects();
  const { data: settings } = useSettings();
  const saveDay = useSaveDay();

  const [location, setLocation] = useState<LocationKind>('onsite');
  const [isHoliday, setIsHoliday] = useState<boolean>(isAutoHoliday(dateISO));
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<EntryDraft[]>([blankEntry()]);
  const focusIdxRef = useRef<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (day) {
      setLocation(day.location);
      setIsHoliday(day.is_holiday);
      setNote(day.note ?? '');
      setEntries(
        (day.entries ?? []).map((e) => ({
          project_id: e.project_id,
          start_time: e.start_time.slice(0, 5),
          end_time: e.end_time.slice(0, 5),
          progress: e.progress,
          done_note: e.done_note ?? '',
          next_note: e.next_note ?? '',
        })),
      );
      if (!day.entries || day.entries.length === 0) setEntries([blankEntry()]);
    } else {
      setLocation('onsite');
      setIsHoliday(isAutoHoliday(dateISO));
      setNote('');
      setEntries([blankEntry()]);
    }
  }, [day, isLoading, dateISO]);

  const errors = useMemo(() => entryErrors(entries), [entries]);
  const hasErrors = errors.some((e) => Object.keys(e).length > 0);
  const skipEntries = location === 'leave' || location === 'holiday';

  const otPreview = useMemo(() => {
    if (!settings) return null;
    return calculateOT(
      { is_holiday: isHoliday, location },
      entries.filter((e) => e.start_time && e.end_time),
      settings,
    );
  }, [entries, isHoliday, location, settings]);

  const holidayName = getHolidayName(dateISO);

  const handleSave = async () => {
    if (skipEntries) {
      try {
        await saveDay.mutateAsync({
          date: dateISO,
          location,
          is_holiday: isHoliday,
          note: note || null,
          entries: [],
        });
        toast.success('บันทึกแล้ว ✓');
      } catch (err) {
        toast.error(friendlyDbError(err, 'บันทึกไม่สำเร็จ'));
      }
      return;
    }
    if (entries.length === 0) {
      toast.error('ใส่ entry อย่างน้อย 1 อันก่อนบันทึก');
      return;
    }
    if (hasErrors) {
      toast.error('แก้ error ในฟอร์มก่อน');
      return;
    }
    try {
      await saveDay.mutateAsync({
        date: dateISO,
        location,
        is_holiday: isHoliday,
        note: note || null,
        entries: entries.map((e) => ({
          project_id: e.project_id,
          start_time: e.start_time,
          end_time: e.end_time,
          progress: e.progress.trim(),
          done_note: e.done_note.trim() || null,
          next_note: e.next_note.trim() || null,
        })),
      });
      toast.success('บันทึกแล้ว ✓');
    } catch (err) {
      toast.error('save error: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const target = e.target as Node | null;
      if (!target || !formRef.current?.contains(target)) return;
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
        const idx = focusIdxRef.current;
        if (idx == null || idx < 0 || idx >= entries.length) return;
        e.preventDefault();
        const src = entries[idx];
        const copy: EntryDraft = { ...src };
        const next = [...entries.slice(0, idx + 1), copy, ...entries.slice(idx + 1)];
        setEntries(next);
        focusIdxRef.current = idx + 1;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, location, isHoliday, note]);

  const navDate = (delta: number) => {
    const d = addDays(fromISO(dateISO), delta);
    window.location.hash = `#/daily/${toISO(d)}`;
  };

  return (
    <div ref={formRef} className="space-y-4">
      <div className="hidden md:flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="paper" size="sm" onClick={() => navDate(-1)}>← Prev</Button>
          <DatePopover value={dateISO} onChange={(iso) => { window.location.hash = `#/daily/${iso}`; }} />
          <Button variant="paper" size="sm" onClick={() => navDate(1)}>Next →</Button>
          <span className="font-display font-bold text-h4 ml-2">{formatThaiDate(dateISO, 'EEEE d MMMM yyyy')}</span>
        </div>
        {holidayName && <Sticker color="lemon" rotate={-3}>🎉 {holidayName}</Sticker>}
        {!holidayName && isHoliday && <Sticker color="lemon" rotate={-3}>วันหยุด</Sticker>}
      </div>

      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-h4">{formatThaiDate(dateISO, 'EEE d MMM yy')}</span>
          <DatePopover value={dateISO} onChange={(iso) => { window.location.hash = `#/daily/${iso}`; }} />
        </div>
        <MobileDateStrip dateISO={dateISO} onPick={(iso) => { window.location.hash = `#/daily/${iso}`; }} />
        {(holidayName || isHoliday) && (
          <Sticker color="lemon" rotate={-3}>{holidayName ? `🎉 ${holidayName}` : 'วันหยุด'}</Sticker>
        )}
      </div>

      <Card>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="font-display font-bold text-label text-ink-500 uppercase">Location</span>
            <Select className="mt-1.5 w-full" value={location} onChange={(e) => setLocation(e.target.value as LocationKind)}>
              {LOCATIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
          </label>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={isHoliday}
              onChange={(e) => setIsHoliday(e.target.checked)}
              className="h-5 w-5 border-1.5 border-ink-900 accent-tangerine"
            />
            <span className="font-display font-semibold text-sm">is holiday (เปลี่ยน rate OT)</span>
          </label>
          <label className="block md:col-span-1">
            <span className="font-display font-bold text-label text-ink-500 uppercase">Note (ทั้งวัน)</span>
            <Input className="mt-1.5 w-full" value={note} onChange={(e) => setNote(e.target.value)} placeholder="ออกไป training, ฯลฯ" />
          </label>
        </div>

        <div className="border-t-1.5 border-ink-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-h4">Entries</h3>
            <div className="flex gap-2">
              <Button
                variant="paper"
                size="sm"
                onClick={() => {
                  const last = entries[entries.length - 1];
                  setEntries([...entries, blankEntry(last?.end_time)]);
                }}
              >
                <Plus size={14} /> Add entry
              </Button>
              <Button
                variant="lemon"
                size="sm"
                disabled={entries.length === 0}
                onClick={() => {
                  const last = entries[entries.length - 1];
                  if (!last) return;
                  setEntries([...entries, { ...blankEntry(), start_time: last.start_time, end_time: last.end_time }]);
                }}
              >
                <Copy size={14} /> Duplicate time
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <QuickPresets
              onPick={(p: PresetBlock) =>
                setEntries([...entries, { ...blankEntry(), start_time: p.start_time, end_time: p.end_time }])
              }
            />
            <RecentProjects
              onPick={(project_id) => {
                // ถ้ามี entry ว่างอยู่ก่อน → ใส่เข้า entry ล่าสุด ถ้าไม่ → สร้างใหม่
                const lastIdx = entries.findIndex((e) => !e.project_id);
                if (lastIdx >= 0) {
                  setEntries(entries.map((e, i) => (i === lastIdx ? { ...e, project_id } : e)));
                } else {
                  const last = entries[entries.length - 1];
                  setEntries([...entries, { ...blankEntry(last?.end_time), project_id }]);
                }
              }}
            />
          </div>

          {entries.length === 0 && (
            <p className="font-body text-ink-500 text-sm">ไม่มี entry — คลิก "Add entry"</p>
          )}

          {entries.map((e, idx) => {
            const err = errors[idx] ?? {};
            const errCls = (k: string) => err[k] ? 'border-rose ring-1 ring-rose' : '';
            return (
            <div
              key={idx}
              onFocusCapture={() => { focusIdxRef.current = idx; }}
              className="grid grid-cols-12 gap-2 items-start bg-cream-50 border-1.5 border-ink-900 rounded-card p-3 shadow-stamp-sm"
            >
              <div className="col-span-3 md:col-span-2 flex flex-col gap-0.5">
                <input
                  type="time"
                  value={e.start_time}
                  onChange={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, start_time: ev.target.value } : x))}
                  className={cn('h-9 w-full px-2 bg-paper border-1.5 border-ink-900 rounded-field font-mono text-sm font-bold', errCls('start_time'))}
                />
                {err.start_time && <span className="text-rose text-[10px] font-mono">{err.start_time}</span>}
              </div>
              <div className="col-span-3 md:col-span-2 flex flex-col gap-0.5">
                <input
                  type="time"
                  value={e.end_time}
                  onChange={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, end_time: ev.target.value } : x))}
                  className={cn('h-9 w-full px-2 bg-paper border-1.5 border-ink-900 rounded-field font-mono text-sm font-bold', errCls('end_time'))}
                />
                {err.end_time && <span className="text-rose text-[10px] font-mono">{err.end_time}</span>}
              </div>
              <div className="col-span-6 md:col-span-3 flex flex-col gap-0.5">
                <Select
                  className={cn('w-full h-9', errCls('project_id'))}
                  value={e.project_id}
                  onChange={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, project_id: ev.target.value } : x))}
                >
                  <option value="">-- เลือกโปรเจค --</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </Select>
                {err.project_id && <span className="text-rose text-[10px] font-mono">{err.project_id}</span>}
              </div>
              <div className="col-span-6 md:col-span-2 flex flex-col gap-0.5">
                <input
                  list={`progress-${idx}`}
                  value={e.progress}
                  onChange={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, progress: ev.target.value } : x))}
                  onBlur={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, progress: ev.target.value.trim() } : x))}
                  className={cn('h-9 w-full px-2 bg-paper border-1.5 border-ink-900 rounded-field font-mono text-sm font-bold', errCls('progress'))}
                  placeholder="30%"
                />
                <datalist id={`progress-${idx}`}>
                  {PROGRESS_PRESETS.map((p) => <option key={p} value={p} />)}
                </datalist>
                {err.progress && <span className="text-rose text-[10px] font-mono">{err.progress}</span>}
              </div>
              <div className="col-span-11 md:col-span-2">
                <input
                  value={e.done_note}
                  onChange={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, done_note: ev.target.value } : x))}
                  placeholder="ทำเสร็จ"
                  className="h-9 w-full px-2 bg-paper border-1.5 border-ink-900 rounded-field font-mono text-xs"
                />
                <input
                  value={e.next_note}
                  onChange={(ev) => setEntries(entries.map((x, i) => i === idx ? { ...x, next_note: ev.target.value } : x))}
                  placeholder="ทำต่อ"
                  className="mt-1.5 h-9 w-full px-2 bg-paper border-1.5 border-ink-900 rounded-field font-mono text-xs"
                />
              </div>
              <button
                onClick={() => setEntries(entries.filter((_, i) => i !== idx))}
                className="col-span-1 h-9 flex items-center justify-center text-ink-700 hover:text-rose"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            );
          })}
        </div>
      </Card>

      <div className="hidden md:flex items-center justify-between flex-wrap gap-3 pb-2">
        {otPreview ? (
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-ink-500">OT preview:</span>
            <span className="text-ink-900 font-bold">1.5x {formatHours(otPreview.hours15x)}</span>
            <span className="text-ink-900 font-bold">3x {formatHours(otPreview.hours3x)}</span>
            <span className="text-tangerine font-display font-bold text-h4">฿{formatMoney(otPreview.total)}</span>
          </div>
        ) : <span className="text-ink-500 font-mono text-sm">ตั้ง salary ที่ /settings เพื่อเห็น OT preview</span>}
        <div className="flex items-center gap-3">
          <span className="text-ink-300 font-mono text-xs hidden lg:inline">Ctrl+D คัดลอก row · Ctrl+Enter บันทึก</span>
          <Button
            variant={isHoliday ? 'tangerine' : 'primary'}
            size="lg"
            onClick={handleSave}
            disabled={saveDay.isPending || (!skipEntries && hasErrors)}
          >
            {saveDay.isPending ? 'กำลังบันทึก...' : 'Save day ✓ (Ctrl+Enter)'}
          </Button>
        </div>
      </div>

      <div className="md:hidden h-20" />
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper border-t-1.5 border-ink-900 p-3 flex items-center justify-between gap-2 shadow-[0_-3px_0_0_rgba(15,27,45,0.08)]">
        {otPreview ? (
          <div className="flex flex-col font-mono text-xs leading-tight">
            <span className="text-ink-500">OT preview</span>
            <span className="text-tangerine font-display font-bold text-h4">฿{formatMoney(otPreview.total)}</span>
          </div>
        ) : <span className="text-ink-500 font-mono text-xs">ตั้ง salary ก่อน</span>}
        <Button
          variant={isHoliday ? 'tangerine' : 'primary'}
          size="lg"
          onClick={handleSave}
          disabled={saveDay.isPending || (!skipEntries && hasErrors)}
        >
          {saveDay.isPending ? '...' : 'Save ✓'}
        </Button>
      </div>
    </div>
  );
}
