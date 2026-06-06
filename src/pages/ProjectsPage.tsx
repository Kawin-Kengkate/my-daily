import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Star4, Burst } from '@/components/Star4';
import { useProjects } from '@/hooks/useProjects';
import { GanttChart } from '@/features/projects/GanttChart';
import { TimelineCountdownCard } from '@/features/projects/TimelineCountdownCard';
import { NoTimelineBucket } from '@/features/projects/NoTimelineBucket';
import { todayISO } from '@/lib/date';
import { deriveProjectTimeline, type GanttScale } from '@/lib/timeline';

export function ProjectsPage() {
  const [scale, setScale] = useState<GanttScale>('quarter');
  const [showAll, setShowAll] = useState(false);
  const { data: projects = [] } = useProjects();
  const today = todayISO();

  const visible = showAll
    ? projects
    : projects.filter((p) => p.status === 'active');

  const withDates = visible.filter(
    (p) => p.kickoff_at || p.dev_at || p.uat_at || p.golive_at,
  );
  const withoutDates = visible.filter(
    (p) => !p.kickoff_at && !p.dev_at && !p.uat_at && !p.golive_at,
  );

  // sorted for mobile card list
  const mobileSorted = [...withDates]
    .map((p) => ({ project: p, data: deriveProjectTimeline(p, today) }))
    .sort((a, b) => {
      const da = a.data.nextMilestone?.daysLeft ?? Infinity;
      const db = b.data.nextMilestone?.daysLeft ?? Infinity;
      return da - db;
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Star4 size={22} />
          <h2 className="font-display font-extrabold text-display">Projects Timeline</h2>
          <Burst size={16} className="opacity-70" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className={cn(
              'px-3 py-1.5 rounded-button border-1.5 border-ink-900 font-display font-semibold text-xs transition-colors',
              showAll
                ? 'bg-ink-900 text-paper'
                : 'bg-paper text-ink-700 hover:bg-cream-100 shadow-stamp-sm active:translate-x-px active:translate-y-px active:shadow-none',
            )}
          >
            {showAll ? 'ทั้งหมด' : 'Active'}
          </button>
          <Link to="/projects/manage">
            <Button variant="paper" size="sm" className="gap-1.5">
              <Settings2 size={14} />
              จัดการโปรเจค
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop: Gantt chart */}
      <div className="hidden md:block">
        {withDates.length === 0 ? (
          <div className="border-1.5 border-ink-900 rounded-card shadow-stamp py-14 text-center">
            <p className="font-body text-sm text-ink-500 mb-3">ยังไม่มีโปรเจคที่ตั้ง timeline</p>
            <Link to="/projects/manage">
              <Button variant="primary" size="sm">+ ตั้ง timeline</Button>
            </Link>
          </div>
        ) : (
          <GanttChart projects={withDates} scale={scale} onScaleChange={setScale} />
        )}
      </div>

      {/* Mobile: countdown card list */}
      <div className="md:hidden space-y-3">
        {mobileSorted.length === 0 ? (
          <div className="border-1.5 border-ink-900 rounded-card py-10 text-center">
            <p className="font-body text-sm text-ink-500 mb-3">ยังไม่มีโปรเจคที่ตั้ง timeline</p>
            <Link to="/projects/manage">
              <Button variant="primary" size="sm">+ ตั้ง timeline</Button>
            </Link>
          </div>
        ) : (
          mobileSorted.map(({ project, data }) => (
            <TimelineCountdownCard key={project.id} project={project} data={data} today={today} />
          ))
        )}
      </div>

      {/* No-timeline bucket */}
      <NoTimelineBucket projects={withoutDates} />
    </div>
  );
}
