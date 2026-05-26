import { Card } from '@/components/ui/card';
import { LearningPageShell } from '@/features/learning/LearningPageShell';
import { LearningNudgeBanner } from '@/features/learning/LearningNudgeBanner';
import { WeeklySummaryHero } from '@/features/learning/WeeklySummaryHero';
import { HoursPerCourseDonut } from '@/features/learning/HoursPerCourseDonut';
import { LearningHeatmap } from '@/features/learning/LearningHeatmap';
import { WeeklyTrendChart } from '@/features/learning/WeeklyTrendChart';
import { RecentSessionsTable } from '@/features/learning/RecentSessionsTable';
import { useLearningCourses } from '@/hooks/useLearningCourses';
import { useDashboardSessions } from '@/hooks/useLearningSessions';
import { useSettings } from '@/hooks/useSettings';
import { aggregateWeek, currentWeekKey } from '@/lib/learning';
import { Squiggle } from '@/components/Squiggle';

export function LearningDashboardPage() {
  const { data: courses = [], isLoading: coursesLoading } = useLearningCourses();
  const { data: sessions = [], isLoading: sessionsLoading } = useDashboardSessions();
  const { data: settings } = useSettings();

  const weeklyTarget = settings?.learning_weekly_target_hours ?? 10;
  const weekKey = currentWeekKey();
  const { hours: hoursLogged, activeDatesSet } = aggregateWeek(sessions, weekKey);

  const isLoading = coursesLoading || sessionsLoading;

  return (
    <LearningPageShell>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-extrabold text-h2">Learning</h1>
          <Squiggle className="text-peri" />
        </div>
        <p className="font-body text-sm text-ink-500 mt-0.5">track progress · stay consistent</p>
      </div>

      {/* Nudge banner */}
      <LearningNudgeBanner />

      {/* Weekly hero */}
      <div className="mb-6">
        {isLoading ? (
          <div className="h-44 rounded-card-lg border-1.5 border-ink-900 bg-paper animate-pulse" />
        ) : (
          <WeeklySummaryHero
            hoursLogged={hoursLogged}
            weeklyTarget={weeklyTarget}
            activeDatesSet={activeDatesSet}
          />
        )}
      </div>

      {/* Donut + Heatmap */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4 border-1.5 border-ink-900 shadow-stamp">
          <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">ชั่วโมงต่อคอร์ส</div>
          {isLoading ? (
            <div className="h-36 animate-pulse bg-cream-200 rounded" />
          ) : (
            <HoursPerCourseDonut sessions={sessions} courses={courses} />
          )}
        </Card>

        <Card className="p-4 border-1.5 border-ink-900 shadow-stamp">
          <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Activity (13 สัปดาห์)</div>
          {isLoading ? (
            <div className="h-36 animate-pulse bg-cream-200 rounded" />
          ) : (
            <LearningHeatmap sessions={sessions} />
          )}
        </Card>
      </div>

      {/* Weekly trend */}
      <Card className="p-4 border-1.5 border-ink-900 shadow-stamp mb-4">
        <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Weekly trend (8 สัปดาห์)</div>
        {isLoading ? (
          <div className="h-48 animate-pulse bg-cream-200 rounded" />
        ) : (
          <WeeklyTrendChart sessions={sessions} weeklyTarget={weeklyTarget} />
        )}
      </Card>

      {/* Recent sessions */}
      <Card className="p-4 border-1.5 border-ink-900 shadow-stamp">
        <div className="font-display font-bold text-label text-ink-500 uppercase mb-3">Sessions ล่าสุด</div>
        {isLoading ? (
          <div className="h-32 animate-pulse bg-cream-200 rounded" />
        ) : (
          <RecentSessionsTable
            sessions={[...sessions].sort((a, b) => b.date.localeCompare(a.date))}
            courses={courses}
          />
        )}
      </Card>
    </LearningPageShell>
  );
}
