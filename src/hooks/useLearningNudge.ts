import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLearningCourses } from './useLearningCourses';
import { useDashboardSessions } from './useLearningSessions';
import { useSettings } from './useSettings';
import {
  aggregateWeek,
  computeNudge,
  currentWeekKey,
  todayISODow,
  type NudgeLevel,
} from '@/lib/learning';

const DISMISS_PREFIX = 'learning-nudge-dismissed-';

export function getLearningNudgeDismissKey(): string {
  return `${DISMISS_PREFIX}${currentWeekKey()}`;
}

export function dismissLearningNudge(): void {
  localStorage.setItem(getLearningNudgeDismissKey(), '1');
}

export function isLearningNudgeDismissed(): boolean {
  return !!localStorage.getItem(getLearningNudgeDismissKey());
}

export function useLearningNudge(): {
  level: NudgeLevel;
  hoursLogged: number;
  weeklyTarget: number;
  hoursRemaining: number;
} {
  const { data: courses } = useLearningCourses();
  const { data: sessions } = useDashboardSessions();
  const { data: settings } = useSettings();
  const location = useLocation();

  return useMemo(() => {
    const weeklyTarget = settings?.learning_weekly_target_hours ?? 10;
    const weekKey = currentWeekKey();
    const { hours: hoursLogged } = aggregateWeek(sessions ?? [], weekKey);
    const hasActiveCourse = (courses ?? []).some((c) => c.status === 'active');
    const dismissed = isLearningNudgeDismissed();
    const onLogPage = location.pathname === '/learning/new';
    const todayDow = todayISODow();

    const level = computeNudge({
      hasActiveCourse,
      dismissed,
      onLogPage,
      hoursLogged,
      weeklyTarget,
      todayDow,
    });

    return {
      level,
      hoursLogged,
      weeklyTarget,
      hoursRemaining: Math.max(0, weeklyTarget - hoursLogged),
    };
  }, [courses, sessions, settings, location.pathname]);
}
