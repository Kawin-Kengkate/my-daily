# MANUAL_SETUP.md — สิ่งที่ Kawin ต้องทำเอง

ไฟล์นี้คือทุกอย่างที่ Claude **ทำให้ไม่ได้** (เพราะต้องเข้า browser, สร้างบัญชี, หรือ SentinelOne risk) — ทำตามลำดับ

---

## 1) ติดตั้ง dependencies

```powershell
cd D:\Kawin\Pratice\daily
npm install
```

ถ้า SentinelOne ขึ้นเตือน — allow แล้วลองใหม่ ปกติ `npm install` ไม่โดน

---

## 2) สร้าง Supabase project

1. ไป https://supabase.com → Sign in (ใช้ Google บัญชีส่วนตัว)
2. **New project** → ตั้งชื่อ `my-daily`, region `Southeast Asia (Singapore)`, สร้าง password
3. รอ ~2 นาที จน project boot

**เอา URL + anon key:**
- Project Settings → API
- Copy `URL` และ `anon public` key

**สร้าง `.env` local:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_WHITELIST_EMAIL=kawinkengkate@gmail.com
```

---

## 3) Run migrations

ใน Supabase Dashboard → **SQL Editor** → New query
- เปิดไฟล์ `supabase/migrations/0001_init.sql` → copy ทั้งหมด → paste → **Run**
- ควรเห็น "Success. No rows returned"

ตรวจ: Table Editor → ต้องเห็น `profiles`, `user_settings`, `projects`, `days`, `entries`

---

## 4) เปิด Google OAuth ใน Supabase

1. Authentication → Providers → **Google** → enable
2. ต้องใส่ Client ID + Secret จาก Google Cloud Console:
   - ไป https://console.cloud.google.com → New project (หรือใช้ของเดิม)
   - APIs & Services → OAuth consent screen → External → ใส่ email + ชื่อ app
   - Credentials → Create OAuth client ID → Web application
   - **Authorized redirect URI:** copy จาก Supabase Google provider page (จะเป็น `https://<project>.supabase.co/auth/v1/callback`)
   - Copy Client ID + Secret → ใส่ใน Supabase
3. Save

**Whitelist enforcement:** Client side ใช้ `VITE_WHITELIST_EMAIL` ใน `useAuth` → ถ้า email ไม่ตรง → signOut อัตโนมัติ (ดู [src/hooks/useAuth.ts](src/hooks/useAuth.ts))

---

## 5) Local dev test

```powershell
npm run dev
```

- เปิด http://localhost:5173
- Click "Sign in with Google" → login → ควรเข้าหน้า Daily form
- ไป `/settings` → ใส่ salary (เช่น 30000) → Save
- ไป `/projects` → เพิ่ม project แรก (`TAI`, `MFG-API`, etc.)
- กลับ Daily → กรอก entry → Save → reload เห็นข้อมูลครบ
- ไป `/dashboard/ot` → ดูตาราง

---

## 6) Test OT calculation

```powershell
npm test
```

ต้องผ่านทุก case ใน `src/lib/ot.test.ts` ก่อน deploy

---

## 7) Deploy บน Vercel

1. ไป GitHub → สร้าง repo ส่วนตัว `my-daily` → push code
   ```powershell
   git init
   git add -A
   git commit -m "feat: initial scaffold"
   git remote add origin git@github.com:<you>/my-daily.git
   git push -u origin main
   ```
2. ไป https://vercel.com → Import → เลือก repo
3. Framework preset: **Vite**
4. Environment Variables — ใส่ทั้ง 3 ตัวจาก `.env`
5. Deploy
6. หลัง deploy เสร็จ — copy production URL กลับไปใส่ใน Google Cloud Console → OAuth redirect (เพิ่ม `https://<project>.vercel.app` ใน Authorized origins ด้วย)

---

## 8) สิ่งที่ Mock / ยังไม่ครบ (อย่าลืมกลับมาทำ)

| สิ่งที่ขาด | ต้องทำตอนไหน | วิธี |
|---|---|---|
| Seed projects | หลัง login ครั้งแรก | ใช้ `/projects` page เพิ่มเอง (หรือแก้ `supabase/seed.sql` ใส่ user_id แล้ว run) |
| Public holidays 2027+ | ปลายปี 2026 | แก้ `src/lib/thai-holidays.ts` มือ |
| Calendar `<Calendar>` shadcn (date picker) | ถ้าอยากใช้ popover แทน `<input type="date">` | `npx shadcn@latest add calendar popover` แล้วเปลี่ยน [DailyForm.tsx:118](src/features/daily-entry/DailyForm.tsx) |
| Mobile-specific date strip | ถ้าอยาก match design SCREEN spec ของหน้า mobile entry | ตอนนี้ใช้ Prev/Next + date input — ดีพอใช้ |
| Recent projects quick-pick | optional polish | ใน DailyForm เพิ่ม row ของ chip projects ใช้ล่าสุด → click = ใส่ใน entry ใหม่ |
| Charts ใน Quarterly — pie/donut by project | ปัจจุบันใช้ stacked bar + list | เพิ่ม `<PieChart>` Recharts ก็ได้ |
| Export OT เป็น Excel/PDF | ตัดออกจาก scope ตาม CONTEXT.md | — |

---

## 9) เรื่อง security ที่ต้อง verify

- ลอง open Incognito → ยังไม่ได้ login → เปิด DevTools → Network tab → `supabase.from('days').select('*')` ผ่าน console — ควร return `[]` ไม่ใช่ error 401 (RLS เปิดให้แต่ filter ออก)
- ลอง login ด้วย Google **อีกบัญชีนึง** (ไม่ใช่ kawinkengkate@gmail.com) → ควรถูก signOut ทันที (whitelist enforcement)

---

## 10) ปัญหาที่อาจเจอ

**TypeScript errors ตอน build แรก:** `npm install` ครบหรือยัง — บางที type packages โหลดช้า

**Supabase migration error: `auth.users` table not found:** Supabase สร้าง schema `auth` อัตโนมัติ — ถ้า error ลอง run migration ใน SQL editor ของ Supabase (ไม่ใช่ local psql)

**Login redirect ไม่กลับมา / เด้งไป localhost หลัง deploy Vercel:**

อาการ: หลัง deploy ขึ้น Vercel แล้ว login Google → redirect ไป `http://localhost:3000/?error=invalid_request&error_code=bad_oauth_state&error_description=OAuth+state+not+found+or+expired`

สาเหตุ: Supabase fallback ไป **Site URL** เมื่อ redirect URL ที่ส่งมาไม่อยู่ใน allow-list — state ถูก save ใน localStorage ของ domain Vercel แต่ callback เด้งไป localhost → คนละ domain → อ่าน state ไม่เจอ

แก้ใน **Supabase Dashboard → Authentication → URL Configuration**:

1. **Site URL** → ตั้งเป็น production URL เช่น `https://your-app.vercel.app` (ไม่ใช่ `localhost`)
2. **Redirect URLs** (allow-list) → เพิ่มทั้งหมดที่ใช้:
   - `https://your-app.vercel.app/**` — production
   - `http://localhost:5173/**` — Vite dev (port default ของ Vite ไม่ใช่ 3000)
   - `https://*-<vercel-team>.vercel.app/**` — preview deployments ถ้าใช้
3. โค้ดส่ง `redirectTo: window.location.origin` อยู่แล้ว ([useAuth.ts:39](src/hooks/useAuth.ts:39)) — ไม่ต้องแก้

**OT คำนวณเพี้ยน:** ใช้ `npm test` ก่อน — case ใน `ot.test.ts` ครอบ scenarios จาก CONTEXT.md หมดแล้ว ถ้า logic ต้องปรับ — แก้ `src/lib/ot.ts` (pure function) แล้ว test ใหม่
