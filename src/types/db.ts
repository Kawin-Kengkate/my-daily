export type LocationKind = 'wfh' | 'onsite' | 'leave' | 'training' | 'holiday';
export type ProjectStatus = 'active' | 'on_hold' | 'done' | 'archived';
export type CalendarOverrideKind = 'working' | 'holiday';
export type CourseStatus = 'active' | 'paused' | 'done' | 'dropped';

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface QuickPreset {
  label: string;
  start_time: string;
  end_time: string;
}

export interface UserSettings {
  user_id: string;
  salary: number;
  work_start: string;       // 'HH:MM' or 'HH:MM:SS'
  work_end: string;
  ot_rate_weekday: number;
  ot_rate_holiday_day: number;
  ot_rate_holiday_night: number;
  quick_presets: QuickPreset[] | null;
  break_minutes: number | null;  // พักกลางวัน (min) — default 40, null = ใช้ default
  learning_weekly_target_hours: number | null; // default 10
  updated_at: string;
}

export interface LearningCourse {
  id: string;
  user_id: string;
  name: string;
  code: string;
  phase: number | null;
  status: CourseStatus;
  target_hours_per_week: number | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  course_id: string;
  date: string;        // 'YYYY-MM-DD'
  duration_min: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  code: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  color: string;
  tags: string[];
  kickoff_at: string | null;
  dev_at: string | null;
  uat_at: string | null;
  golive_at: string | null;
  done_at: string | null;
  created_at: string;
}

export interface Day {
  id: string;
  user_id: string;
  date: string;            // 'YYYY-MM-DD'
  location: LocationKind;
  is_holiday: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  day_id: string;
  project_id: string;
  start_time: string;       // 'HH:MM' or 'HH:MM:SS'
  end_time: string;
  progress: string;
  done_note: string | null;
  next_note: string | null;
  created_at: string;
}

export interface DayWithEntries extends Day {
  entries: Entry[];
}

export interface CalendarOverride {
  id: string;
  user_id: string;
  date: string;            // 'YYYY-MM-DD'
  kind: CalendarOverrideKind;
  label: string | null;
  created_at: string;
}
