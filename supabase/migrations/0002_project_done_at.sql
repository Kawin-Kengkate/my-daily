-- Track when a project transitioned to "done" so we can list achievements per quarter.
-- Backfill: use ended_at for already-done projects, fall back to created_at.

alter table projects add column if not exists done_at timestamptz;

-- Use Bangkok local-noon so a date like '2026-03-31' lands inside Q1 in UTC+7,
-- not midnight UTC which slips into Q2.
update projects
   set done_at = coalesce(
         (ended_at::text || ' 12:00:00')::timestamp at time zone 'Asia/Bangkok',
         created_at
       )
 where status = 'done' and done_at is null;

create or replace function set_project_done_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'done' and (old.status is distinct from 'done') then
    new.done_at := coalesce(new.done_at, now());
  elsif new.status <> 'done' and old.status = 'done' then
    new.done_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_project_done_at on projects;
create trigger trg_project_done_at
  before update of status on projects
  for each row execute function set_project_done_at();

create index if not exists idx_projects_done_at on projects (user_id, done_at);
