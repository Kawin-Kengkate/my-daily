# CONTEXT — Domain Knowledge & Decisions

เอกสารนี้เก็บ domain knowledge + reasoning เบื้องหลังการตัดสินใจ
ถ้าจะแก้ logic ที่กระทบสิ่งเหล่านี้ — อ่านก่อนแก้

---

## ภาพรวมการใช้งาน

User คนเดียว (Kawin) ใช้ app นี้ทำ 2 เรื่องใน 2 module แยกกัน:

### Work module (mature)
บันทึก daily log ทุกวันทำงาน:
- เวลาเริ่ม-เลิกงาน
- WFH / Onsite / ลา / training
- โปรเจคที่ทำ + % progress + สิ่งที่ทำเสร็จ + สิ่งที่ทำต่อ
- OT (ถ้ามี) — คำนวณเงินได้

เป้าหมายข้อมูล:
1. กรอกเร็ว ใช้บนมือถือได้
2. Dashboard รายเดือน/ควอเตอร์ ดูภาพรวมงาน
3. ตาราง OT สรุปไว้เอาไปกรอกฟอร์มเบิก

### Learning module (planned)
Track session การเรียนของ user (จาก `learning-plan.md`):
- Log session ทุกครั้งที่นั่งเรียน (duration, course, note)
- Dashboard เห็น progress สัปดาห์/เดือน/quarter
- Nudge banner ใน-แอป เมื่อกลางสัปดาห์แล้วยังไม่ถึงเป้า

**Primary use case คือ Work** — user เข้ามากรอก daily เป็นหลัก, Learning module เป็น secondary section ที่อยู่ใน sidebar แยก

---

## OT Rules <a id="ot-rules"></a>

**เวลาทำงานปกติ:** 8.00 - 16.40 (พักกลางวัน 40 นาที รวมในนี้แล้ว)
**ฐานคำนวณ:** `baseHourly = salary / 30 / 8`

### วันธรรมดา (is_holiday = false)

| ช่วงเวลา | สถานะ |
|---|---|
| 8.00 - 16.40 | งานปกติ ไม่นับ OT |
| 16.40 - 17.00 | **พักกินข้าวเย็น ไม่ได้เงิน** (skip ตอน aggregate) |
| 17.00 เป็นต้นไป | OT × 1.5 |

### วันหยุด (is_holiday = true) — เสาร์/อาทิตย์/วันหยุดปฏิทิน

| ช่วงเวลา | สถานะ |
|---|---|
| 8.00 - 17.00 | OT × 1.5 |
| 17.00 เป็นต้นไป | OT × 3 |

### กฎพิเศษ: หักพักทุก 5 ชั่วโมง

ถ้าทำงานต่อเนื่อง > 5 ชม. → หักพัก 1 ชม. จากเวลา OT
- วันธรรมดาแทบไม่เจอ (ทำ OT 5 ชม.ติด = ดึกมาก) แต่ implement ไว้
- วันหยุดเจอบ่อย (มาทำเต็มวัน 8.00-17.00 = 9 ชม. → หัก 1 ชม. = นับ 8 ชม.)

### ตัวอย่างคำนวณ

**Case 1 — วันธรรมดา 8.00-20.30:**
- งานปกติ: 8.00-16.40 (ไม่นับ)
- พัก: 16.40-17.00 (skip)
- OT 1.5x: 17.00-20.30 = 3.5 ชม.
- เงิน = 3.5 × 1.5 × baseHourly

**Case 2 — วันเสาร์ 8.00-18.00:**
- ช่วง 1.5x: 8.00-17.00 = 9 ชม. → หักพัก 1 ชม. = **8 ชม.**
- ช่วง 3x: 17.00-18.00 = **1 ชม.**
- เงิน = (8 × 1.5 + 1 × 3) × baseHourly = 15 × baseHourly

**Case 3 — วันธรรมดา 8.00-23.00:**
- OT 1.5x: 17.00-23.00 = 6 ชม. → เกิน 5 ชม. หักพัก 1 ชม. = **5 ชม.**
- เงิน = 5 × 1.5 × baseHourly

> ทุก case ข้างบนต้องมี unit test ใน `src/lib/ot.test.ts`

---

## Schema Decisions

### 1) `entries` flat — ทำไมไม่ทำ time_blocks แยก?

โครงสร้างจริง: 1 day → หลาย time block → หลายโปรเจคใน block

ทางเลือกที่พิจารณา:
- **(A) 3 ระดับ:** `days → time_blocks → entries` — normalize สวย แต่ form กรอกซับซ้อน (nested) + query aggregate ต้อง join 3 ทาง
- **(B) Flat:** `days → entries(start, end, project)` — โปรเจคใน block เดียวกัน = หลาย rows ซ้ำ start/end ← **เลือกอันนี้**

**เหตุผล:**
- Dashboard query ง่ายกว่ามาก (group by project, sum hours, count entries)
- Form กรอก: ปุ่ม "Duplicate time" copy start/end ให้ใน 1 คลิก
- ความซ้ำซ้อน 2 ฟิลด์ × ไม่กี่ rows = ไม่ใช่ปัญหาจริง

### 2) `progress` เป็น text ไม่ใช่ number — ทำไม?

User กรอกค่าผสมกัน: `"30%"`, `"90%"`, `"complete"`, บางทีก็ `"0%"` หรือ `"-"`

ถ้าใช้ `numeric`:
- ต้องแยก field `is_complete` มาเก็บ "complete"
- หรือ map complete → 100% → เสีย semantic
- กลายเป็น 2 field ที่ต้อง sync

เก็บเป็น text + parse ตอน aggregate (regex `/(\d+)%?/` → number, "complete" = 100) — ง่ายและ flex

**Trade-off:** validation อ่อนกว่า → ใส่ Zod schema ใน form กรอง garbage ออก

### 3) `is_holiday` แยกจาก `location` — ทำไม?

- `is_holiday` = วันหยุดตามปฏิทิน (auto จาก ส-อา + ปฏิทินไทย, override ได้)
- `location` = สิ่งที่ user ทำวันนั้น (wfh / onsite / leave / training / holiday)

เพราะ "วันหยุดที่ทำงาน OT" = `is_holiday=true` + `location='wfh'` หรือ `'onsite'`
ต้องการทั้งคู่เพื่อ:
- คำนวณ OT rate (ใช้ `is_holiday`)
- Dashboard นับวัน WFH/onsite/ลา (ใช้ `location`)

### 4) ไม่มี `is_ot` ที่ระดับ entry — ทำไม?

OT คำนวณได้จาก `start_time/end_time` + `is_holiday` + work hours config — เก็บแยกเสี่ยง inconsistent
ถ้าวันไหนต้อง override (เช่น มาทำงานวันเสาร์แต่ไม่ได้ OT เพราะมาเก็บงาน) → ใช้ flag ที่ `days` level (เพิ่มทีหลังถ้าจำเป็น ตอนนี้ไม่มี)

---

## Public Holidays ไทย

เก็บใน `src/lib/thai-holidays.ts` เป็น static array:

```ts
export const THAI_HOLIDAYS: Record<string, string> = {
  '2026-01-01': 'วันขึ้นปีใหม่',
  '2026-02-10': 'วันมาฆบูชา',
  // ...
};
```

**Trade-off:** ต้องอัปเดตมือปีละครั้ง (ปฏิทินไทยมีหยุดชดเชยที่ประกาศใหม่)
**เหตุผลที่ไม่ใช้ API:** ไม่มี API ฟรี/เสถียร, 10-15 entries/ปี ไม่คุ้ม dependency

User override ได้ผ่าน `days.is_holiday` toggle ในหน้า daily entry — เผื่อบริษัทให้หยุดชดเชย หรือทำเสาร์ปกติ

---

## Time Zone

- DB: `time` columns = naive (ไม่มี TZ) — ใช้ตามนี้ เพราะ work hours ก็ใช้ local time อยู่แล้ว
- DB: `timestamptz` columns (`created_at`, `updated_at`) — เก็บ UTC ตามมาตรฐาน Postgres
- UI: render timestamps เป็น `Asia/Bangkok` เสมอ ใช้ `date-fns-tz` หรือ format ตรงๆ (เครื่อง user อยู่ไทย local time ตรงอยู่แล้ว)

---

## Auth Model

- Supabase Auth + Google OAuth provider
- **Whitelist email เดียว** = `kawinkengkate@gmail.com`
  - Implement: ใน `useAuth` hook → ถ้า login สำเร็จแต่ `user.email !== WHITELIST_EMAIL` → signOut + แสดง error
  - หรือใช้ Supabase RLS + trigger ใน `profiles` table ปฏิเสธ insert email อื่น
- RLS เปิดทุก table: `user_id = auth.uid()`
- ถึงจะใช้คนเดียว ก็เปิด RLS เพื่อกัน leak จาก client direct query

---

## เงินเดือน / ข้อมูล sensitive

- เก็บใน `user_settings.salary` (Postgres numeric)
- ไม่ encrypt ที่ DB layer (single-user, admin = ตัว user เอง → accepted)
- UI: ใส่ `<input type="password">` หรือ toggle เปิด/ปิด เห็นใน Settings page
- **ห้าม log salary หรือ OT amount** ทั้ง client + server
- Dashboard แสดงเงิน OT ได้ปกติ (เป็นเป้าหมายของ feature)

---

## สิ่งที่ตัดออกจาก scope (ตั้งใจ)

ของ **Work module:**
- ❌ Import Excel เก่า — เริ่มข้อมูลใหม่ตั้งแต่ deploy
- ❌ Export OT เป็น Excel — copy ตามองจาก table พอ
- ❌ Time tracking ละเอียดระดับนาทีต่อโปรเจค — แค่บอกได้ว่าเดือนนั้นแตะโปรเจคไหน
- ❌ Multi-user / sharing — ใช้คนเดียว
- ❌ Mobile app — responsive web พอ
- ❌ Reminder / notification ของ daily — ไม่ต้องเตือนวันเก่าที่ไม่ได้กรอก (ตั้งใจ user เอง)
- ❌ Auto-save draft — manual save ป้องกัน partial entry
- ❌ Pomodoro / timer / live tracking — กรอกย้อนหลังเอง

ของ **Learning module** (ดู §Learning Module ด้านล่าง):
- ❌ Notes editor / markdown / file attachment
- ❌ Per-course progress % (session-based ไม่มี denominator)
- ❌ Daily streak counter (punishing)
- ❌ Push notification / Email / LINE (in-app nudge เพียงพอ)
- ❌ Hard limit "2 active courses" (ขัด philosophy "guideline ไม่ใช่ contract")

ถ้าจะเพิ่ม feature เหล่านี้ — คุยกับ user ก่อน (อาจเปลี่ยนใจได้ แต่ default = ไม่ทำ)

---

## Learning Module (planned)

### ปัญหาที่แก้
แผนใน `learning-plan.md` ไม่ตอบ 2 สิ่ง:
1. **ไม่เห็นว่าคืบหน้าแค่ไหน** — เรียนเยอะแต่วัดไม่ได้
2. **ไม่ต่อเนื่อง** — ทิ้งเป็นสัปดาห์ๆ momentum หาย

**ไม่ใช่ปัญหา:** ไม่รู้จะเรียนอะไร, เรียนแล้วลืม → ดังนั้น scope ตัด planner builder + note editor ออก

### Schema decisions

**`learning_courses`** — entity ที่ user track (mirror `projects` pattern)
- `name`, `code` (2-4 chars เหมือน project code), `phase` (1-4)
- `status` enum: `active | paused | done | dropped`
- `target_hours_per_week` optional (สำหรับ tooltip ใน donut, ไม่ใช่ source of truth ของ weekly metric)

**`learning_sessions`** — atom ของระบบ (1 row = 1 ครั้งที่นั่งเรียน)
- `course_id`, `date`, `duration_min` (5..600), `note` (max 200)
- **ไม่มี `start_time` / `end_time`** — self-study ไม่มี timestamp จริง, duration พอ
- เก็บแบน 1 ระดับ ไม่มี nested topic

**`user_settings.learning_weekly_target_hours`** — global target (default 10 ตาม learning-plan.md)
- เป็น source of truth ของ weekly metric + nudge calculation
- course.target_hours_per_week ผลรวมไม่จำเป็นต้องเท่า global

### Metric design

**Weekly target + active days display** (ไม่ใช้ daily streak)

เหตุผล:
- Daily streak punishing — user ทำงาน 5 วัน + บางสัปดาห์ no energy → streak แตก → demotivate (ตรงข้ามกับเป้า)
- Weekly เพียวๆ ไม่ปกป้องจากการอัดวันเดียว → เลยแสดง active days dots เป็น display เฉยๆ (ไม่ใช่ pass/fail)

**Hero widget:**
```
6.5 / 10 hrs    ━━━━━━░░░░ 65%       ← primary metric
3 active days   ● ● ○ ● ○ ○ ○         ← display only
```

### Nudge logic (in-app banner)

ตรวจทุกครั้งที่ render `AppShell` — pure client-side, ไม่มี backend cron / push

**Decision tree (เรียงตามลำดับ — match แล้วหยุด):**

| เงื่อนไข | Action |
|---|---|
| ไม่มี course `status='active'` | ซ่อน |
| dismissed สัปดาห์นี้ (`localStorage[learning-nudge-{ISOweek}]`) | ซ่อน |
| user อยู่ที่ `/learning/new` | ซ่อน |
| `hoursLogged >= weeklyTarget` | celebrate (mint, 1 ครั้ง) |
| todayDow ≤ 2 (จ-อ) | ซ่อน |
| todayDow=3 (พ) และ hours=0 | Level 1 info (peri) |
| todayDow=4 (พฤ) และ hours < 30% | Level 1 |
| todayDow=5 (ศ) และ hours < 50% | Level 2 warning (lemon) |
| todayDow=6 (ส) และ hours < 70% | Level 2 |
| todayDow=7 (อา) และ hours < target | Level 3 urgent (tangerine) |
| otherwise | ซ่อน |

**Priority rule:** ถ้า `MissingDaysBanner` ของ Work แสดงอยู่ → learning nudge หลีกทาง (Work กระทบเงิน priority สูงกว่า)

**Tone rule:** neutral facts + suggest, ห้ามคำกดดัน เช่น "ขี้เกียจ", "ตามหลัง" — ใช้คำเชิงข้อมูล "เหลือ X วัน, ขาด Y ชม."

**Dismiss:** key เป็น ISO week → reset อัตโนมัติทุกจันทร์ใหม่

### Course management — soft display

กฎ "ไม่เกิน 2 คอร์สหลักพร้อมกัน" ใน learning-plan.md = อยู่ในเอกสาร ไม่ได้ enforce ในระบบ

**Display in `/learning/courses` header:**
```
Courses    Active: 3   Paused: 2   Done: 1
            ↑ Pill นับ ใช้สี ink-900 ปกติ ไม่ใช่ tangerine/lemon
```

- ไม่มี warning, ไม่บัง action
- Pause/Resume = 1 คลิก ไม่ confirm
- ไม่บังคับ pause ก่อนเพิ่ม active ใหม่
- Paused course ยัง list อยู่ (สีจาง), session history คงอยู่ใน dashboard ย้อนหลัง แต่ไม่นับใน weekly hero ปัจจุบัน
- เคารพ "guideline ไม่ใช่ contract" จาก learning-plan.md

### Module differentiation (Work vs Learning visual)

ดู `.claude/CLAUDE.md §Module Differentiation` — สรุป: ใช้ design language เดียวกัน 100% สำหรับ primitives (border-1.5, shadow-stamp, fonts, press) แต่ต่างที่:
- Page bg (cream vs peri/5)
- Hero decoration (Star4/Burst vs Squiggle/Arc)
- Card corner (— vs DotGrid)
- Primary action color (tangerine vs lemon)
- Sticker variant (default vs double-border learning)

---

## Project Codes ที่เคยใช้ (อ้างอิง)

จาก daily log เก่าใน Excel — สำหรับ seed projects ครั้งแรก:
- `TAI` — Tractor Asset Inventory (?)
- `MFG-API` — Manufacturing API
- `SKR` — Siam Kubota Raw materials (?)
- `CMMS` — Computerized Maintenance Management System
- `etc` — งานเบ็ดเตล็ด / งานเล็กๆ ที่ไม่อยู่ในโปรเจคหลัก

> User จะมาเติม name/description เองในหน้า `/projects` หลัง deploy
