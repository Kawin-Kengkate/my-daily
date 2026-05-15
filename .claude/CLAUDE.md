# Daily Log & OT Dashboard — Project Instructions

โปรเจคส่วนตัวของ Kawin: บันทึก daily + dashboard + คำนวณ OT
**vibe code 100%** — เน้นง่าย เร็ว ใช้คนเดียว ห้าม over-engineer

## เอกสารต้องอ่าน (ลำดับสำคัญ)

1. **[../CONTEXT.md](../CONTEXT.md)** — domain knowledge, OT rules, schema decisions ← อ่านก่อนแก้ business logic
2. **[../design_handoff/DESIGN.md](../design_handoff/DESIGN.md)** — design system, tokens, components ← source of truth สำหรับ UI
3. **[../design_handoff/SCREENS.md](../design_handoff/SCREENS.md)** — spec ทุกหน้า (Login, Daily × 2, Dashboard, OT, Projects, Settings)
4. **[../design_handoff/COMPONENT_MAP.md](../design_handoff/COMPONENT_MAP.md)** — shadcn override + custom primitives + Zod schemas

**กฎทอง:** UI ยึด `design_handoff/` เป็นหลัก / Feature & business logic ยึด `CONTEXT.md` ก่อนทำ feature ใหม่ → อ่านสองไฟล์นี้ก่อน

---

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind + shadcn/ui (override ตาม COMPONENT_MAP) + Google Fonts (Bricolage Grotesque + IBM Plex Sans Thai + JetBrains Mono)
- **Routing:** React Router v6
- **Form:** React Hook Form + Zod
- **Server state:** TanStack Query
- **Date:** date-fns
- **Chart:** Recharts (สี/border ปรับให้เข้ากับ design)
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Auth:** Google OAuth (whitelist `kawinkengkate@gmail.com`)
- **Hosting:** Vercel (auto-deploy จาก GitHub)

## Design System — สรุปสั้น

ดู `design_handoff/DESIGN.md` สำหรับ full spec — สรุปเฉพาะกฎที่ violate บ่อย:

- **ทุก card/button/field มี `border-1.5 border-ink-900`** = signature look ห้ามลืม
- **Shadow signature:** `shadow-stamp-sm` (2px), `shadow-stamp` (3px), `shadow-stamp-lg` (4px) — solid offset ไม่ใช่ blur
- **Press state:** `active:translate-x-[1px] active:translate-y-[1px] active:shadow-none` (กดแล้วยุบ)
- **Fonts:**
  - `font-display` (Bricolage Grotesque) → headings, ตัวเลขใหญ่, ปุ่ม, sticker
  - `font-body` (IBM Plex Sans Thai) → body, table cells
  - `font-mono` (JetBrains Mono) → time codes, project codes, money values, uppercase labels
- **Color roles** (อย่า random):
  - `tangerine` = OT/เงิน/3x rate
  - `lemon` = holiday/highlight/1.5x rate on holiday
  - `mint` = complete/positive
  - `peri` = projects/info/avatar
  - `rose` = leave/sensitive
- **Custom primitives** (port จาก `mocks/src/shared.jsx`): `<Sticker>`, `<Pill>`, `<ProjectCode>`, `<Star4>`, `<Burst>`, `<Squiggle>`, `<Field>` — ใช้สิ่งเหล่านี้แทนการ inline class
- **อย่าใช้ shadcn `<Calendar>` สำหรับ heatmap** — สร้าง custom grid `grid-cols-7 gap-1` แทน (Calendar shadcn ใช้แค่ date picker ปกติ)

## Folder Structure

ตาม `design_handoff/COMPONENT_MAP.md` — ใช้ feature-folder pattern:

```
src/
  api/                     — Supabase client + queries (1 file/resource)
    supabase.ts
    days.ts, entries.ts, projects.ts, settings.ts
  components/
    ui/                    — shadcn primitives (override แล้ว)
    Sticker.tsx, Pill.tsx, ProjectCode.tsx
    Star4.tsx, Burst.tsx, Squiggle.tsx
    Field.tsx              — label + input + hint pattern
  features/
    daily-entry/           — DailyForm, TimeBlock, QuickPresets, RecentProjects, StatusPicker, DateStrip
    dashboard/             — StatBlock, CalendarHeatmap, WeeklyHoursChart, ProjectDonut, RecentEntries
    ot-report/             — OTTable, OTSummaryBand, useCopyTable
    projects/              — ProjectCard, ProjectSparkline
    settings/              — SalarySection, WorkHoursSection, HolidaysSection, AccountSection
  pages/                   — 1 file/route (thin — compose features)
  hooks/                   — useAuth, useToday, useDay, useEntries, useProjects, useSettings
  lib/                     — pure utils
    ot.ts, ot.test.ts
    thai-holidays.ts
    date.ts, format.ts
  types/                   — db.ts (map กับ Supabase schema)
  styles/                  — globals.css (copy จาก design_handoff + shadcn base)
```

**กฎ:**
- `lib/` = pure function ไม่มี side effect / DOM / Supabase call → test ได้
- `api/` = wrap Supabase query ไม่ใส่ business logic
- Business logic อยู่ใน `hooks/` หรือ `lib/`
- Component layer ลำดับ: shadcn primitive (override) → custom primitive (`Sticker`, `Pill`) → feature component → page
- Page บาง — compose features ไม่ใส่ logic

## Code Style

- **TypeScript strict** — เขียน type/interface ทุกที่ ห้าม `any` ยกเว้น `// reason:` กำกับ
- **Component:** function component + named export
- **className:** ใช้ `cn()` helper (จาก shadcn) ทุก conditional class
- **Comment:** เฉพาะ WHY ที่ไม่ชัดจาก code
- **ห้าม:**
  - Redux / Zustand / MobX → ใช้ useState + Context พอ
  - CSS-in-JS อื่นนอก Tailwind
  - Lib ใหม่ที่ไม่ list ข้างบน → ถาม user ก่อน
  - Mock/fallback ที่ไม่จำเป็น
  - Abstraction ล่วงหน้าเผื่ออนาคต
  - `border` (1px default) ที่ควรเป็น `border-1.5` ตาม design

## OT Calculation (จุดเดียวที่ต้องมี test)

`src/lib/ot.ts` = pure function → **เขียน unit test (Vitest) ให้ครอบทุก case ใน CONTEXT.md §OT Rules** เพราะคำนวณเงิน ผิดไม่ได้

## Form (Daily Entry)

ใช้ Zod schema จาก `design_handoff/COMPONENT_MAP.md` §Form schemas (มี `TimeBlockSchema` + `DayFormSchema` พร้อมใช้)

โครงสร้าง DB เป็น `entries` flat (ดู CONTEXT.md) — form กรอกเป็น time_blocks → ตอน save แตกเป็น entry rows ตาม project ใน block

## Workflow

- Branch: เริ่มแค่ `main` (ถ้าทีมโตค่อยทำ dev/staging)
- Commit: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)
- Push main → Vercel auto-deploy
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (set ทั้ง local `.env` + Vercel dashboard)

## Security

- เงินเดือนเก็บใน `user_settings` (Supabase + RLS) ไม่ใช่ env var
- RLS policy: `auth.uid() = user_id` ทุก table
- ห้าม commit `.env` / ห้าม log salary / ห้าม log OT amount
- Settings page: salary input มี toggle เปิด/ปิด (default ปิด — `•••••••`)

## SentinelOne (work laptop)

ระวังคำสั่งที่อาจโดน flag:
- ห้ามรัน `curl | sh`, `iex`, installer `.exe` ผ่าน Claude
- `npm install` ปกติได้
- ถ้าไม่แน่ใจ → ให้ user รันเองแล้วส่ง output กลับ

## ภาษา

ตอบ user ภาษาไทย ทับศัพท์ EN ได้ตามปกติ
