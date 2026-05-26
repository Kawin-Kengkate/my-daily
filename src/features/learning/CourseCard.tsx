import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LearningCourse, LearningSession } from '@/types/db';
import { CourseStatusActions } from './CourseStatusActions';
import { Sticker } from '@/components/Sticker';
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
  const lastSession = courseSessions[0];

  const isInactive = course.status === 'paused' || course.status === 'dropped';
  const isActive = course.status === 'active';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className={cn(
        'relative pl-5 pr-4 pt-5 pb-4 bg-paper border-1.5 border-ink-900 rounded-card shadow-stamp transition-shadow hover:shadow-stamp-lg',
        isInactive && 'opacity-60',
        isActive && 'ring-1 ring-mint/40 ring-offset-2 ring-offset-peri/5',
      )}
    >
      {/* Tilted code sticker */}
      <div className="absolute -top-3 -left-2 pointer-events-none select-none">
        <Sticker color="peri" rotate={-6} variant="learning" className="font-mono text-xs">
          {course.code}
        </Sticker>
      </div>

      <div className="mt-1 pr-1">
        <div className="font-display font-bold text-base leading-snug line-clamp-2">{course.name}</div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {course.phase && (
            <span className="font-mono text-[10px] text-ink-500">{phaseLabel[course.phase]}</span>
          )}
          <span
            className={cn(
              'px-1.5 py-0.5 font-mono text-[10px] font-bold rounded-full uppercase tracking-wide',
              statusStyle[course.status],
            )}
          >
            {course.status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-3 font-mono text-xs text-ink-600">
        <div className="flex items-baseline gap-1">
          <span className="font-display font-extrabold text-h3 text-ink-900 leading-none">
            {totalHours.toFixed(1)}
          </span>
          <span className="text-[10px] text-ink-500 uppercase tracking-wide">ชม.</span>
        </div>
        {lastSession ? (
          <span className="text-ink-400 text-[11px] ml-auto">
            ล่าสุด {formatThaiDate(lastSession.date, 'd MMM yy')}
          </span>
        ) : (
          <span className="text-ink-300 text-[11px] ml-auto">ยังไม่ได้เรียน</span>
        )}
      </div>

      <div className="mt-3 border-t border-cream-200 pt-3">
        <CourseStatusActions course={course} />
      </div>
    </motion.div>
  );
}
