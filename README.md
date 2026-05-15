# Daily Log & OT Dashboard

เว็บส่วนตัวสำหรับบันทึก daily log + ดู dashboard + คำนวณ OT
React + Vite + TypeScript + Supabase

**ขั้นตอน setup จริง (Supabase project, OAuth, deploy) → ดู [MANUAL_SETUP.md](MANUAL_SETUP.md)**

## Quick Start

```bash
npm install
cp .env.example .env
# แก้ .env ใส่ค่า Supabase
npm run dev
```

เปิด http://localhost:5173

## Environment Variables

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

หาได้จาก Supabase dashboard → Project Settings → API

## Supabase Setup (ครั้งแรก)

1. สร้าง project ที่ https://supabase.com
2. SQL Editor → รัน `supabase/migrations/0001_init.sql`
3. Authentication → Providers → เปิด **Google**, ใส่ OAuth client ID/secret จาก Google Cloud Console
4. Authentication → URL Configuration → ใส่ Site URL = production URL + localhost:5173
5. (Optional) รัน `supabase/seed.sql` เพื่อ seed projects เริ่มต้น

## Deploy

Push to `main` → Vercel auto-deploy

ตั้ง env vars ใน Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts

```
npm run dev        # local dev server
npm run build      # production build
npm run preview    # preview build local
npm run test       # vitest (ครอบ src/lib/ot.ts เป็นหลัก)
```

## Docs

- [.claude/CLAUDE.md](.claude/CLAUDE.md) — instructions สำหรับ AI / dev (folder convention, code style, design system summary)
- [CONTEXT.md](CONTEXT.md) — OT rules, schema rationale, domain knowledge
- [design_handoff/](design_handoff/) — design system (tokens, components, screen specs, shadcn override) ← source of truth สำหรับ UI

## Tech Stack

React 18 · Vite · TypeScript · Tailwind · shadcn/ui · React Router · React Hook Form · Zod · TanStack Query · date-fns · Recharts · Supabase
