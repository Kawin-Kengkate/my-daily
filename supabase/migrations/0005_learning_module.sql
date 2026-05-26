-- Migration: Learning Module
-- เพิ่ม learning_courses, learning_sessions tables + learning_weekly_target_hours ใน user_settings

-- 1. learning_courses — คอร์สที่ user track
create table learning_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  code text not null check (char_length(code) between 1 and 8),
  phase smallint,
  status text not null default 'active'
    check (status in ('active', 'paused', 'done', 'dropped')),
  target_hours_per_week numeric,
  started_at date,
  finished_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. learning_sessions — atom: 1 row = 1 ครั้งที่นั่งเรียน
create table learning_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  course_id uuid not null references learning_courses(id) on delete cascade,
  date date not null,
  duration_min smallint not null check (duration_min between 5 and 600),
  note text check (char_length(note) <= 200),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on learning_sessions (user_id, date desc);
create index on learning_sessions (course_id, date desc);

-- 3. RLS
alter table learning_courses enable row level security;
alter table learning_sessions enable row level security;

create policy "learning_courses: user owns"
  on learning_courses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "learning_sessions: user owns"
  on learning_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. เพิ่ม learning target ใน user_settings
alter table user_settings
  add column if not exists learning_weekly_target_hours numeric not null default 10;
