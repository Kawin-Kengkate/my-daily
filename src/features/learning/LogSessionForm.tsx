import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DatePopover } from '@/components/DatePopover';
import { Field } from '@/components/Field';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { todayISO } from '@/lib/date';
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

export function LogSessionForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState(todayISO);
  const { data: activeCourses = [], isLoading: coursesLoading } = useActiveCourses();
  const createSession = useCreateSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { duration_min: 60 },
  });

  const currentDuration = watch('duration_min');

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md pb-20 md:pb-0">
      {/* Date */}
      <div>
        <label className="font-display font-bold text-label text-ink-500 uppercase">วันที่</label>
        <div className="mt-1.5">
          <DatePopover value={date} onChange={setDate} />
        </div>
      </div>

      {/* Course */}
      <div>
        <label className="font-display font-bold text-label text-ink-500 uppercase">คอร์ส</label>
        {coursesLoading ? (
          <div className="mt-1.5 h-10 rounded-field border-1.5 border-ink-900 bg-cream-100 animate-pulse" />
        ) : activeCourses.length === 0 ? (
          <p className="mt-2 text-sm font-body text-ink-500">
            ไม่มี active course —{' '}
            <a href="#/learning/courses" className="underline text-peri">เพิ่มคอร์สก่อน</a>
          </p>
        ) : (
          <select
            {...register('course_id')}
            className={cn(
              'mt-1.5 w-full h-10 px-3.5 bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm',
              'font-body text-sm font-semibold outline-none cursor-pointer',
              errors.course_id && 'border-rose',
            )}
          >
            <option value="">— เลือกคอร์ส —</option>
            {activeCourses.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.code}] {c.name}
              </option>
            ))}
          </select>
        )}
        {errors.course_id && <p className="mt-1 text-xs font-body text-rose">{errors.course_id.message}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className="font-display font-bold text-label text-ink-500 uppercase">เวลาที่เรียน</label>
        <div className="mt-1.5 flex items-center gap-2">
          <Field
            type="number"
            min={5}
            max={600}
            suffix="นาที"
            className="w-36"
            {...register('duration_min', { valueAsNumber: true })}
          />
        </div>
        {/* Quick chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DURATION_CHIPS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setValue('duration_min', min)}
              className={cn(
                'px-3 py-1 rounded-full border-1.5 border-ink-900 font-mono text-xs font-bold transition-all',
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
        {errors.duration_min && (
          <p className="mt-1 text-xs font-body text-rose">{errors.duration_min.message}</p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="font-display font-bold text-label text-ink-500 uppercase">สิ่งที่ทำ (optional)</label>
        <textarea
          {...register('note')}
          rows={2}
          placeholder="เช่น Section 8: Dependency Injection, ทำ exercise X เสร็จ"
          className={cn(
            'mt-1.5 w-full px-3.5 py-2.5 resize-none',
            'bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm',
            'font-body text-sm font-semibold outline-none placeholder:text-ink-300',
          )}
        />
        {errors.note && <p className="mt-1 text-xs font-body text-rose">{errors.note.message}</p>}
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex gap-3 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting || activeCourses.length === 0}
          className="bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          {isSubmitting ? 'กำลังบันทึก…' : 'บันทึก Session'}
        </Button>
        <Button
          type="button"
          variant="paper"
          onClick={() => navigate(-1)}
        >
          ยกเลิก
        </Button>
      </div>

      {/* Mobile sticky action bar */}
      <div
        className="md:hidden fixed left-0 right-0 z-20 bg-paper/95 backdrop-blur border-t-1.5 border-ink-900 px-5 py-3 flex gap-2"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 56px)' }}
      >
        <Button
          type="button"
          variant="paper"
          onClick={() => navigate(-1)}
          className="flex-1"
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || activeCourses.length === 0}
          className="flex-[2] bg-lemon border-1.5 border-ink-900 font-display font-bold shadow-stamp active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          {isSubmitting ? 'กำลังบันทึก…' : 'บันทึก Session'}
        </Button>
      </div>
    </form>
  );
}
