import { Link } from 'react-router-dom';
import { ProjectCode } from '@/components/ProjectCode';
import type { Project } from '@/types/db';

interface Props {
  projects: Project[];
}

export function NoTimelineBucket({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <div className="border-1.5 border-dashed border-ink-400 rounded-card p-4 bg-cream-50">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-ink-500">
          ยังไม่ตั้ง Timeline
        </span>
        <Link
          to="/projects/manage"
          className="font-display font-semibold text-xs text-peri hover:underline"
        >
          ไปตั้งค่า →
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {projects.map((p) => (
          <Link
            key={p.id}
            to="/projects/manage"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-paper border-1.5 border-ink-900 rounded-full shadow-stamp-sm font-body text-xs hover:bg-cream-100 active:translate-x-px active:translate-y-px active:shadow-none transition-colors"
          >
            <span
              className="h-2 w-2 rounded-full border border-ink-900 shrink-0"
              style={{ background: p.color }}
            />
            <ProjectCode code={p.code} />
            <span className="text-ink-700">{p.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
