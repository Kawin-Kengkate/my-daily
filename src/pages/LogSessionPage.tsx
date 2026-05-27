import { LearningPageShell } from '@/features/learning/LearningPageShell';
import { LogSessionForm } from '@/features/learning/LogSessionForm';
import { Arc } from '@/components/Arc';
import { Squiggle } from '@/components/Squiggle';
import { Sticker } from '@/components/Sticker';
import { useDashboardSessions } from '@/hooks/useLearningSessions';
import { aggregateWeek, currentWeekKey } from '@/lib/learning';
import { useSettings } from '@/hooks/useSettings';

export function LogSessionPage() {
  const { data: sessions = [] } = useDashboardSessions();
  const { data: settings } = useSettings();
  const weeklyTarget = settings?.learning_weekly_target_hours ?? 10;
  const { hours } = aggregateWeek(sessions, currentWeekKey());
  const remaining = Math.max(0, weeklyTarget - hours);

  return (
    <LearningPageShell>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative inline-block">
              <h1 className="font-display font-extrabold text-h2">Log Session</h1>
              <Arc width={100} className="absolute -bottom-3 left-0" />
            </div>
            <Squiggle width={36} className="text-peri mt-2 hidden sm:block" />
          </div>
          <p className="font-body text-sm text-ink-500 mt-4">บันทึก session การเรียนครั้งนี้</p>
        </div>
        {remaining > 0 ? (
          <Sticker color="lemon" rotate={4} className="text-xs hidden sm:inline-flex">
            เหลือ {remaining.toFixed(1)} ชม.
          </Sticker>
        ) : (
          <Sticker color="mint" rotate={4} className="text-xs hidden sm:inline-flex">
            ครบเป้าแล้ว ✓
          </Sticker>
        )}
      </div>
      <LogSessionForm />
    </LearningPageShell>
  );
}
