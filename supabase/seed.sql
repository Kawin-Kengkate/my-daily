-- Seed initial project codes — run after first signup, replace USER_ID with auth.uid()
-- ตัวอย่าง: supabase studio → SQL → แก้ <USER_ID> เป็น uuid ของคุณก่อน run

-- insert into projects (user_id, code, name, color) values
--   ('<USER_ID>', 'TAI',     'Tractor Asset Inventory', '#6B7FE8'),
--   ('<USER_ID>', 'MFG-API', 'Manufacturing API',       '#F7C548'),
--   ('<USER_ID>', 'SKR',     'SK Raw Materials',        '#4FB389'),
--   ('<USER_ID>', 'CMMS',    'CMMS',                    '#FF6B35'),
--   ('<USER_ID>', 'etc',     'งานเบ็ดเตล็ด',              '#DCCFB6');

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed learning courses จาก learning-plan.md
-- วิธีหา USER_ID: Supabase Dashboard → Authentication → Users → copy UUID
-- แก้ '<USER_ID>' ทุกตัวให้เป็น UUID ของคุณก่อน run
-- ─────────────────────────────────────────────────────────────────────────────
insert into learning_courses (user_id, code, name, phase, status) values
  -- Phase 1: Backend & Frontend Core
  ('<USER_ID>', 'FA',   'FastAPI Complete Course',            1, 'active'),
  ('<USER_ID>', 'RX',   'Advanced React',                     1, 'active'),
  ('<USER_ID>', 'GIT',  'Git Advanced',                       1, 'paused'),
  ('<USER_ID>', 'SQL',  'SQL Performance Tuning',             1, 'paused'),
  ('<USER_ID>', 'DOCK', 'Docker Basics',                      1, 'paused'),
  -- Phase 2: Testing & AI Workflow
  ('<USER_ID>', 'RTL',  'React Testing Library + Vitest',     2, 'paused'),
  ('<USER_ID>', 'AI',   'AI Agent & Modern Workflow',         2, 'paused'),
  -- Phase 3: System Design & Azure
  ('<USER_ID>', 'SD',   'Mastering System Design Interview',  3, 'paused'),
  ('<USER_ID>', 'AZ',   'AZ-204 Developer Associate',         3, 'paused');
