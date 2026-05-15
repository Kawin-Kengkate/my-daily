-- My Daily — initial schema
-- single-user app, but RLS enabled to be safe against client direct queries

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);

create table if not exists user_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  salary numeric not null default 0,
  work_start time not null default '08:00',
  work_end time not null default '16:40',
  ot_rate_weekday numeric not null default 1.5,
  ot_rate_holiday_day numeric not null default 1.5,
  ot_rate_holiday_night numeric not null default 3,
  updated_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  status text not null default 'active',
  color text not null default '#6B7FE8',
  tags text[] not null default '{}',
  started_at date,
  ended_at date,
  created_at timestamptz default now(),
  unique (user_id, code)
);

create table if not exists days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  location text not null default 'onsite',
  is_holiday boolean not null default false,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  day_id uuid not null references days(id) on delete cascade,
  project_id uuid not null references projects(id) on delete restrict,
  start_time time not null,
  end_time time not null,
  progress text not null,
  done_note text,
  next_note text,
  created_at timestamptz default now()
);

create index if not exists idx_days_user_date on days(user_id, date);
create index if not exists idx_entries_day on entries(user_id, day_id);
create index if not exists idx_projects_user_status on projects(user_id, status);

-- RLS
alter table profiles enable row level security;
alter table user_settings enable row level security;
alter table projects enable row level security;
alter table days enable row level security;
alter table entries enable row level security;

create policy "own profile" on profiles for all
  using (id = auth.uid()) with check (id = auth.uid());

create policy "own settings" on user_settings for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own projects" on projects for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own days" on days for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own entries" on entries for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Auto-create profile + default settings on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
