import { useMemo } from 'react';
import type { LearningCourse, LearningSession } from '@/types/db';
import { CourseStatusActions } from './CourseStatusActions';
import { DotGrid } from '@/components/DotGrid';
import { cn } from '@/lib/utils';
import { formatThaiDate } from '@/lib/date';

const phaseLabel: Record<number, string> = { 1: 'Phase 1', 2: 'Phase 2', 3: 'Phase 3', 4: 'Phase 4' };
const statusStyle: Record<string, string> = {
  active: 'bg-mint/20 text-ink-900',
  paused: 'bg-cream-200 text-ink-500',
  done: 'bg-peri/20 text-ink-900',
  dropped: 'bg-rose/20 text-ink-500',
};

interface Props {
  course: LearningCourse;
  allSessions: LearningSession[];
}

export function CourseCard({ course, allSessions }: Props) {
  const courseSessions = useMemo(
    () => allSessions.filter((s) => s.course_id === course.id),
    [allSessions, course.id],
  );
  const totalHours = courseSessions.reduce((sum, s) => sum + s.duration_min, 0) / 60;
  const lastSession = courseSessions[0]; // sessions sorted desc by date

  const isInactive = course.status === 'paused' || course.status === 'dropped';

  return (
    <div
      className={cn(
        'relative p-4 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp transition-opacity',
        isInactive && 'opacity-60',
      )}
    >
      {/* DotGrid decoration */}
      <DotGrid className="absolute top-3 right-3" />

      <div className="flex items-start gap-3 pr-8">
        {/* Course code */}
        <span className="shrink-0 px-2 py-1 font-mono font-bold text-xs border-1.5 border-ink-900 rounded-chip bg-peri/10">
          {course.code}
        </span>
        <div className="min-w-0">
          <div className="font-display font-bold text-sm leading-tight">{course.name}</div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {course.phase && (
              <span className="font-mono text-[10px] text-ink-500">{phaseLabel[course.phase]}</span>
            )}
            <span
              className={cn(
                'px-1.5 py-0.5 font-mono text-[10px] font-bold rounded-full',
                statusStyle[course.status],
              )}
            >
              {course.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 font-mono text-xs text-ink-600">
        <span>
          <span className="font-bold text-ink-900">{totalHours.toFixed(1)}</span> ชม. รวม
        </span>
        {lastSession ? (
          <span className="text-ink-400">
            ล่าสุด {formatThaiDate(lastSession.date, 'd MMM yy')}
          </span>
        ) : (
          <span className="text-ink-300">ยังไม่ได้เรียน</span>
        )}
      </div>

      <div className="mt-3 border-t border-cream-200 pt-3">
        <CourseStatusActions course={course} />
      </div>
    </div>
  );
}
