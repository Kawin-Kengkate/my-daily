-- calendar_overrides: user-defined exceptions to default calendar
-- - kind='working' : วันที่ปกติเป็นวันหยุด แต่บริษัทให้ทำงาน (เช่นเสาร์ทำงาน) → is_holiday = false
-- - kind='holiday' : วันที่ปกติเป็นวันทำงาน แต่บริษัทให้หยุด (เช่น สงกรานต์ยาว) → is_holiday = true
-- override จะ trump ทั้ง weekend default และ THAI_HOLIDAYS

create table if not exists calendar_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  kind text not null check (kind in ('working', 'holiday')),
  label text,
  created_at timestamptz default now(),
  unique (user_id, date)
);

create index if not exists idx_calendar_overrides_user_date
  on calendar_overrides(user_id, date);

alter table calendar_overrides enable row level security;

create policy "own calendar_overrides" on calendar_overrides for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
