-- add quick_presets column to user_settings
-- stores user-defined time presets as JSONB array of {label, start_time, end_time}
alter table user_settings
  add column if not exists quick_presets jsonb;
