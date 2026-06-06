-- 0006_project_timeline.sql
-- Replace started_at/ended_at with 4 explicit timeline phase milestones
-- Migrate: started_at → kickoff_at, ended_at → golive_at

alter table projects
  add column if not exists kickoff_at date,
  add column if not exists dev_at     date,
  add column if not exists uat_at     date,
  add column if not exists golive_at  date;

-- Migrate existing data before dropping old columns
update projects set kickoff_at = started_at where started_at is not null;
update projects set golive_at  = ended_at   where ended_at   is not null;

alter table projects
  drop column if exists started_at,
  drop column if exists ended_at;
