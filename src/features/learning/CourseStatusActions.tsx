import type { LearningCourse, CourseStatus } from '@/types/db';
import { useSetCourseStatus } from '@/hooks/useLearningCourses';
import { notify } from '@/lib/notify';
import { cn } from '@/lib/utils';

const actionBtn =
  'px-3 py-1 border-1.5 border-ink-900 rounded-field font-display font-bold text-xs shadow-stamp-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform disabled:opacity-50';

interface Props {
  course: LearningCourse;
}

export function CourseStatusActions({ course }: Props) {
  const setStatus = useSetCourseStatus();

  async function change(status: CourseStatus) {
    try {
      await setStatus.mutateAsync({ id: course.id, status });
    } catch {
      notify.error('อัปเดต status ไม่สำเร็จ');
    }
  }

  const isPending = setStatus.isPending;

  return (
    <div className="flex flex-wrap gap-1.5">
      {course.status === 'active' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => change('paused')}
          className={cn(actionBtn, 'bg-cream-100 hover:bg-cream-200')}
        >
          Pause
        </button>
      )}
      {course.status === 'paused' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => change('active')}
          className={cn(actionBtn, 'bg-mint/20 hover:bg-mint/40')}
        >
          Resume
        </button>
      )}
      {(course.status === 'active' || course.status === 'paused') && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => change('done')}
          className={cn(actionBtn, 'bg-peri/10 hover:bg-peri/20')}
        >
          Done ✓
        </button>
      )}
      {course.status === 'done' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => change('active')}
          className={cn(actionBtn, 'bg-cream-100 hover:bg-cream-200')}
        >
          Reopen
        </button>
      )}
      {course.status === 'dropped' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => change('paused')}
          className={cn(actionBtn, 'bg-cream-100 hover:bg-cream-200')}
        >
          Restore
        </button>
      )}
      {course.status !== 'dropped' && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => change('dropped')}
          className={cn(actionBtn, 'bg-rose/10 hover:bg-rose/20 text-rose')}
        >
          Drop
        </button>
      )}
    </div>
  );
}
