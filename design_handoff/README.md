# Design Handoff — My Daily

> เอกสารชุดนี้สำหรับส่งต่อให้ Claude Code (หรือ dev คน) ไปทำต่อใน repo จริง
> Stack ปลายทาง: **React 18 + Vite + TypeScript + Tailwind + shadcn/ui** (ตาม `README.md` หลัก)

## เนื้อหาในโฟลเดอร์นี้

| File | หน้าที่ |
|---|---|
| `README.md` | ไฟล์นี้ — overview + วิธีใช้ |
| `DESIGN.md` | **Design system** — tokens (color/type/spacing/shadow), components, motion |
| `SCREENS.md` | **Screen specs** — 7 หน้า (Login, Daily entry × 2, Dashboard, OT Table, Projects, Settings) layout + component breakdown แบบละเอียด |
| `tailwind.tokens.ts` | drop-in config สำหรับ `tailwind.config.ts` — color/font/shadow/borderRadius |
| `globals.css` | CSS variables + Google Fonts import + base layer |
| `COMPONENT_MAP.md` | mapping จาก shadcn primitive → custom styling ที่ design ต้องการ |
| `mocks/` | HTML mocks ต้นฉบับ (เปิดในเบราว์เซอร์ดูได้) + source JSX |

## เกี่ยวกับไฟล์ดีไซน์

ไฟล์ใน `mocks/` คือ **design reference** ที่ทำเป็น HTML — ไม่ใช่ production code ที่ copy ตรงๆ ได้
- งานของ dev = **recreate ใน React + Tailwind + shadcn/ui** ตาม pattern ของ repo
- Token values, spacing, copy text เอามาใช้ตรงได้
- Component logic ให้ใช้ shadcn primitives + react-hook-form + zod ตาม README หลัก

## Fidelity

**Hi-fi** — pixel-perfect mockups
- สี typography spacing เป็น final values ทุกตัว
- คาดหวังให้ dev recreate UI ตาม mock ให้ใกล้เคียงที่สุด โดยใช้ component library ของ repo (shadcn)

## ขอบเขต

ครอบ scope ตาม `CONTEXT.md`:
- ✅ Login / Google OAuth (whitelist email)
- ✅ Daily entry — mobile-first, รองรับ weekday + holiday พร้อม OT breakdown
- ✅ Dashboard — รายเดือน (calendar heatmap, weekly hours, project donut, recent entries)
- ✅ OT Table — พร้อม copy ไปกรอกฟอร์มเบิก
- ✅ Projects — manage project codes
- ✅ Settings — salary, work hours, holidays, account

## ลำดับงานที่แนะนำ

1. ตั้ง design tokens — copy `tailwind.tokens.ts` + `globals.css` เข้า repo
2. สร้าง shared components — `Sticker`, `Card`, `Pill`, `Star4`, `Squiggle` (ดูใน `mocks/src/shared.jsx`)
3. Login page (เรียบ ลองให้ OAuth + whitelist ทำงาน end-to-end ก่อน)
4. Daily entry mobile (หน้าหลักที่ user ใช้ทุกวัน — กรอกเร็วต้องดีก่อน)
5. Dashboard + OT Table (อ่านอย่างเดียว — implement ตอนมีข้อมูลพอ)
6. Projects + Settings (config — implement หลัก feature ใช้ได้ครบ)

## ไฟล์อื่นๆ ที่ต้องอ่านคู่กัน

- `../CONTEXT.md` (root) — domain knowledge, OT rules, schema rationale ← **อ่านก่อนเขียน logic**
- `../README.md` (root) — tech stack + setup
