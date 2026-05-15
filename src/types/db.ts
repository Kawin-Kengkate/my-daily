export type LocationKind = 'wfh' | 'onsite' | 'leave' | 'training' | 'holiday';
export type ProjectStatus = 'active' | 'on_hold' | 'done' | 'archived';

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  salary: number;
  work_start: string;       // 'HH:MM' or 'HH:MM:SS'
  work_end: string;
  ot_rate_weekday: number;
  ot_rate_holiday_day: number;
  ot_rate_holiday_night: number;
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
  started_at: string | null;
  ended_at: string | null;
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
