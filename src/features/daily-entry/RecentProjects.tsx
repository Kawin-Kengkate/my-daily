import { useMemo } from 'react';
import { useDaysInRange } from '@/hooks/useDay';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCode } from '@/components/ProjectCode';
import { todayISO, addDays, fromISO, toISO } from '@/lib/date';

/** chip โปรเจคที่ใช้ในช่วง 14 วันที่ผ่านมา — click → onPick(project_id) */
export function RecentProjects({ onPick }: { onPick: (project_id: string) => void }) {
  const today = todayISO();
  const from = toISO(addDays(fromISO(today), -14));
  const { data: days = [] } = useDaysInRange(from, today);
  const { data: projects = [] } = useProjects();

  const recent = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of days) for (const e of d.entries) counts.set(e.project_id, (counts.get(e.project_id) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([id, n]) => ({ project: projects.find((p) => p.id === id), n }))
      .filter((x) => x.project)
      .sort((a, b) => b.n - a.n)
      .slice(0, 6);
  }, [days, projects]);

  if (recent.length === 0) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-display font-bold text-label text-ink-500 uppercase">Recent:</span>
      {recent.map(({ project }) => (
        <button
          key={project!.id}
          onClick={() => onPick(project!.id)}
          className="btn-press"
          title={project!.name}
        >
          <ProjectCode code={project!.code} />
        </button>
      ))}
    </div>
  );
}
