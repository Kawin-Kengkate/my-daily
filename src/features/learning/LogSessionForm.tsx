import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { th } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Sticker } from '@/components/Sticker';
import { cn } from '@/lib/utils';
import { todayISO, toISO, fromISO } from '@/lib/date';
import { useCreateSession } from '@/hooks/useLearningSessions';
import { useActiveCourses } from '@/hooks/useLearningCourses';
import { notify } from '@/lib/notify';

const Schema = z.object({
  course_id: z.string().uuid('กรุณาเลือกคอร์ส'),
  duration_min: z.number().int().min(5, 'ขั้นต่ำ 5 นาที').max(600, 'สูงสุด 600 นาที'),
  note: z.string().max(200, 'ไม่เกิน 200 ตัวอักษร').optional(),
});

type FormValues = z.infer<typeof Schema>;

const DURATION_CHIPS = [30, 45, 60, 90, 120];

function formatDuration(min: number): string {
  if (min < 60) return `${min} นาที`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} ชม.` : `${h} ชม. ${m} นาที`;
}

// 7 วันย้อนหลังจนถึงวันนี้ (เพื่อ log ย้อนหลังได้)
function getRecentDays(): { iso: string; label: string; dow: string; isToday: boolean }[] {
  const today = new Date();
  const days: { iso: string; label: string; dow: string; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    days.push({
      iso: toISO(d),
      label: format(d, 'd'),
      dow: format(d, 'EEEEE', { locale: th }),
      isToday: i === 0,
    });
  }
  return days;
}

export function LogSessionForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState(todayISO);
  const { data: activeCourses = [], isLoading: coursesLoading } = useActiveCourses();
  const createSession = useCreateSession();
  const recentDays = getRecentDays();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { duration_min: 60, course_id: '', note: '' },
  });

  const currentDuration = watch('duration_min');
  const currentCourseId = watch('course_id');
  const currentNote = watch('note') ?? '';

  function setCourse(id: string) {
    setValue('course_id', id, { shouldValidate: true });
  }

  function adjustDuration(delta: number) {
    const next = Math.max(5, Math.min(600, (currentDuration || 0) + delta));
    setValue('duration_min', next, { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    try {
      await createSession.mutateAsync({ ...values, date, note: values.note || undefined });
      notify.success('บันทึก session แล้ว');
      navigate('/learning');
    } catch {
      notify.error('บันทึกไม่สำเร็จ กรุณาลองใหม่');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6 pb-24 md:pb-0">
      {/* === Date strip === */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="font-display font-bold text-label text-ink-500 uppercase tracking-wide">
            วันที่
          </label>
          <span className="font-mono text-[11px] text-ink-500">
            {format(fromISO(date), 'EEEE d MMM yyyy', { locale: th })}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {recentDays.map((d) => {
            const active = d.iso === date;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDate(d.iso)}
                className={cn(
                  'relative flex flex-col items-center py-2 px-1 rounded-card border-1.5 transition-all',
                  'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
                  active
                    ? 'bg-lemon border-ink-900 shadow-stamp'
                    : 'bg-paper border-ink-900/40 shadow-stamp-sm hover:border-ink-900',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[10px] uppercase',
                    active ? 'text-ink-900 font-bold' : 'text-ink-500',
                  )}
                >
                  {d.dow}
                </span>
                <span
                  className={cn(
                    'font-display font-extrabold text-base leading-none mt-0.5',
                    active ? 'text-ink-900' : 'text-ink-700',
                  )}
                >
                  {d.label}
                </span>
                {d.isToday && (
                  <span
                    className={cn(
                      'absolute -top-1.5 -right-1.5 px-1 py-0 font-mono text-[8px] font-bold rounded-full border-1.5 border-ink-900',
                      active ? 'bg-paper text-ink-900' : 'bg-peri text-paper',
                    )}
                  >
                    วันนี้
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* === Course picker === */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="font-display font-bold text-label text-ink-500 uppercase tracking-wide">
            คอร์ส
          </label>
          {errors.course_id && (
            <span className="font-body text-xs text-rose">{errors.course_id.message}</span>
          )}
        </div>
        {coursesLoading ? (
          <div className="h-20 rounded-card border-1.5 border-ink-900 bg-cream-100 animate-pulse" />
        ) : activeCourses.length === 0 ? (
          <div className="p-4 bg-paper border-1.5 border-ink-900 rounded-card text-sm">
            <p className="font-body text-ink-500">
              ไม่มี active course —{' '}
              <a href="#/learning/courses" className="underline text-peri font-bold">เพิ่มคอร์สก่อน</a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeCourses.map((c) => {
              const selected = currentCourseId === c.id;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCourse(c.id)}
                  className={cn(
                    'relative flex items-center gap-3 pl-3 pr-3 py-3 rounded-card border-1.5 border-ink-900 text-left transition-all',
                    'active:translate-x-[1px] active:translate-y-[1px]',
                    selected
                      ? 'bg-lemon shadow-stamp ring-2 ring-offset-2 ring-ink-900'
                      : 'bg-paper shadow-stamp-sm hover:shadow-stamp',
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0 px-2 py-1 font-mono font-bold text-xs border-1.5 border-ink-900 rounded-chip',
                      selected ? 'bg-paper' : 'bg-peri/15',
                    )}
                  >
                    {c.code}
                  </span>
                  <span className="font-display font-bold text-sm leading-tight line-clamp-2 flex-1">
                    {c.name}
                  </span>
                  {selected && (
                    <span className="shrink-0 h-5 w-5 rounded-full bg-ink-900 text-paper flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </section>

      {/* === Duration === */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="font-display font-bold text-label text-ink-500 uppercase tracking-wide">
            เวลาที่เรียน
          </label>
          {errors.duration_min && (
            <span className="font-body text-xs text-rose">{errors.duration_min.message}</span>
          )}
        </div>

        {/* Big display + stepper */}
        <div className="flex items-center justify-between gap-3 p-4 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp">
          <button
            type="button"
            aria-label="ลด 15 นาที"
            onClick={() => adjustDuration(-15)}
            className="h-10 w-10 flex items-center justify-center rounded-full border-1.5 border-ink-900 bg-cream-100 shadow-stamp-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Minus size={16} />
          </button>
          <motion.div
            key={currentDuration}
            initial={{ scale: 0.92, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-center"
          >
            <div className="font-display font-extrabold text-h2 leading-none">
              {currentDuration}
            </div>
            <div className="font-mono text-[10px] text-ink-500 uppercase mt-1">
              {formatDuration(currentDuration)}
            </div>
          </motion.div>
          <button
            type="button"
            aria-label="เพิ่ม 15 นาที"
            onClick={() => adjustDuration(15)}
            className="h-10 w-10 flex items-center justify-center rounded-full border-1.5 border-ink-900 bg-cream-100 shadow-stamp-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Quick chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DURATION_CHIPS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setValue('duration_min', min, { shouldValidate: true })}
              className={cn(
                'px-3 py-1.5 rounded-full border-1.5 border-ink-900 font-mono text-xs font-bold transition-all',
                'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
                currentDuration === min
                  ? 'bg-ink-900 text-paper shadow-none'
                  : 'bg-paper shadow-stamp-sm hover:bg-cream-100',
              )}
            >
              {min >= 60 ? `${min / 60}h` : `${min}m`}
            </button>
          ))}
        </div>
        {/* Hidden input ให้ react-hook-form อ่านค่า */}
        <input
          type="hidden"
          {...register('duration_min', { valueAsNumber: true })}
        />
      </section>

      {/* === Note === */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="font-display font-bold text-label text-ink-500 uppercase tracking-wide">
            สิ่งที่ทำ <span className="font-body text-ink-400 normal-case font-normal">(optional)</span>
          </label>
          <span
            className={cn(
              'font-mono text-[11px]',
              currentNote.length > 180 ? 'text-tangerine font-bold' : 'text-ink-400',
            )}
          >
            {currentNote.length}/200
          </span>
        </div>
        <textarea
          {...register('note')}
          rows={3}
          placeholder="เช่น Section 8: Dependency Injection, ทำ exercise X เสร็จ"
          className={cn(
            'w-full px-3.5 py-2.5 resize-none',
            'bg-paper border-1.5 border-ink-900 rounded-field shadow-stamp-sm',
            'font-body text-sm font-medium outline-none placeholder:text-ink-300',
            'focus:shadow-stamp transition-shadow',
          )}
        />
        {errors.note && <p className="mt-1 text-xs font-body text-rose">{errors.note.message}</p>}
      </section>

      {/* Preview sticker — show what's about to be saved */}
      {currentCourseId && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-mint/15 border-1.5 border-ink-900 rounded-card shadow-stamp-sm">
          <Sticker color="mint" rotate={-4} className="text-xs">
            พร้อมบันทึก
          </Sticker>
          <span className="font-body text-sm text-ink-700">
            {formatDuration(currentDuration)} ·{' '}
            <span className="font-mono font-bold">
              {activeCourses.find((c) => c.id === currentCourseId)?.code}
            </span>
          </span>
        </div>
      )}

      {/* Desktop actions */}
      <div className="hidden md:flex gap-3 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting || activeCourses.length === 0}
          className="bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp active:translate-x-[1px] active:translate-y-[1px] active:shadow-none gap-1.5"
        >
          <Check size={14} strokeWidth={3} />
          {isSubmitting ? 'กำลังบันทึก…' : 'บันทึก Session'}
        </Button>
        <Button type="button" variant="paper" onClick={() => navigate(-1)}>
          ยกเลิก
        </Button>
      </div>

      {/* Mobile sticky action bar */}
      <div
        className="md:hidden fixed left-0 right-0 z-20 bg-paper/95 backdrop-blur border-t-1.5 border-ink-900 px-5 py-3 flex gap-2"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 56px)' }}
      >
        <Button type="button" variant="paper" onClick={() => navigate(-1)} className="flex-1">
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || activeCourses.length === 0}
          className="flex-[2] bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp active:translate-x-[1px] active:translate-y-[1px] active:shadow-none gap-1.5"
        >
          <Check size={14} strokeWidth={3} />
          {isSubmitting ? 'กำลังบันทึก…' : 'บันทึก'}
        </Button>
      </div>
    </form>
  );
}
