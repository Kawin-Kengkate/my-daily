import { Trash2 } from 'lucide-react';
import type { LearningCourse, LearningSession } from '@/types/db';
import { useDeleteSession } from '@/hooks/useLearningSessions';
import { formatThaiDate } from '@/lib/date';
import { notify } from '@/lib/notify';

export function RecentSessionsTable({
  sessions,
  courses,
}: {
  sessions: LearningSession[];
  courses: LearningCourse[];
}) {
  const deleteSession = useDeleteSession();
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const recent = sessions.slice(0, 10);

  if (recent.length === 0) {
    return <p className="text-ink-500 font-body text-sm py-2">ยังไม่มี session</p>;
  }

  async function handleDelete(id: string) {
    try {
      await deleteSession.mutateAsync(id);
      notify.success('ลบ session แล้ว');
    } catch {
      notify.error('ลบไม่สำเร็จ');
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b-1.5 border-ink-900">
            <th className="py-2 pr-4 text-left font-display font-bold text-label text-ink-500 uppercase whitespace-nowrap">วันที่</th>
            <th className="py-2 pr-4 text-left font-display font-bold text-label text-ink-500 uppercase">คอร์ส</th>
            <th className="py-2 pr-4 text-right font-display font-bold text-label text-ink-500 uppercase whitespace-nowrap">เวลา</th>
            <th className="py-2 text-left font-display font-bold text-label text-ink-500 uppercase">Note</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {recent.map((s) => {
            const course = courseMap.get(s.course_id);
            return (
              <tr key={s.id} className="border-b border-cream-200 hover:bg-peri/5 transition-colors">
                <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap">
                  {formatThaiDate(s.date, 'EEE d MMM')}
                </td>
                <td className="py-2 pr-4">
                  {course ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs px-1.5 py-0.5 bg-peri/10 border-1.5 border-ink-900 rounded-chip">
                        {course.code}
                      </span>
                    </span>
                  ) : (
                    <span className="text-ink-400">?</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-right font-mono font-bold text-xs whitespace-nowrap">
                  {s.duration_min >= 60
                    ? `${Math.floor(s.duration_min / 60)}h${s.duration_min % 60 > 0 ? ` ${s.duration_min % 60}m` : ''}`
                    : `${s.duration_min}m`}
                </td>
                <td className="py-2 text-ink-600 text-xs truncate max-w-[200px]">
                  {s.note ?? '—'}
                </td>
                <td className="py-2 pl-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    disabled={deleteSession.isPending}
                    aria-label="ลบ session"
                    className="h-6 w-6 flex items-center justify-center text-ink-400 hover:text-rose transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
