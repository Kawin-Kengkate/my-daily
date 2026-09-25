# DESIGN.md — My Daily Design System

> Hi-fi design system สำหรับ My Daily (personal daily log + OT dashboard)
> Visual direction: **Playful — cream base, hard-shadow stamps, warm accents, big numeric tickers**
> + **5 color themes** (Pop Riot default, Neon Night dark, Bubblegum, Matcha, Classic Cream) — ดู §2

---

## 1. Voice & character

- **Personal** — เป็น app ของ user คนเดียว ใช้ภาษาผสม ไทย + English (technical terms อังกฤษ)
- **Confident / chunky** — sticker stamps, hard shadow offset, ตัวเลขใหญ่ๆ
- **ใช้สีมีความหมาย** — ทุก accent มีหน้าที่ (ดู §2)
- **ภาษา**: Display heading ไทยตัวใหญ่ + English technical terms (`OT`, `WFH`, `1.5x`) เป็น mono

---

## 2. Color system

**Themeable** — 5 theme, token ชุดเดียวกัน, สลับได้ที่ Settings → 🎨 Theme หรือปุ่ม palette บน header
(เก็บใน `localStorage['my-daily-theme']` ต่อเครื่อง)

| Theme id | ชื่อ | Vibe |
|---|---|---|
| `pop` (**default**) | 🍭 Pop Riot | ครีมสด + ส้มแดงจัด + ม่วงไฟฟ้า, ink ม่วงเข้ม |
| `neon` | 🌃 Neon Night | dark — พื้นคราม, เส้นขาวลาเวนเดอร์, accent นีออน, **เงา stamp ชมพูแมกเจนต้า** |
| `bubblegum` | 🫧 Bubblegum | ชมพูลูกกวาด + ม่วงองุ่น |
| `matcha` | 🍵 Matcha | เขียวชา + ส้มอิฐ สบายตา |
| `classic` | 📜 Classic Cream | palette ต้นฉบับของ handoff นี้ (ค่าเดิมทุกตัว) |

**Source of truth = `src/styles/globals.css`** (`[data-theme='<id>']` blocks) — hex ของแต่ละ theme อยู่ในคอมเมนต์ข้างค่า
- เก็บเป็น channel `R G B` (`--c-peri: 91 61 245`) → Tailwind ใช้ `rgb(var(--c-peri) / <alpha-value>)` ทำให้ `bg-peri/20` ใช้ได้
- inline style / SVG ใช้ตัวแปรสีเต็ม `var(--peri)`, `var(--ink-900)`, `var(--stamp)` — **ห้ามใส่ hex ใน component**
- `src/lib/theme.test.ts` เช็คทุก theme: token ครบ, contrast (ดูข้างล่าง), ΔE ของสีพื้น location ≥ 10

### Tokens (ทุก theme ต้องมีครบ)

| Token | Role |
|---|---|
| `cream-50` | Lightest surface (field bg / hovers) |
| `cream-100` | **Canvas / page bg** (+ dot-grid texture สี ink 7%) |
| `cream-200` | Inactive chips, dividers, holiday cell |
| `cream-300` | Strong divider, chart grid |
| `paper` | **Card surface** |
| `ink-900` | **Primary text, all 1.5px borders** |
| `ink-700` / `ink-600` | Secondary text |
| `ink-500` / `ink-400` | Muted text, labels |
| `ink-300` / `ink-200` | Disabled / placeholder / light divider |
| `tangerine` (+`-soft`) | **OT / money / urgent** |
| `lemon` (+`-soft`) | **Holiday / highlight / "next"** |
| `mint` (+`-soft`) | **Complete / positive / synced** |
| `peri` (+`-soft`) | **Projects / info / user avatar** |
| `rose` (+`-soft`) | **Leave / soft sensitive** |
| `on-tangerine` `on-lemon` `on-mint` `on-peri` `on-rose` | **ตัวหนังสือ/ไอคอนบนพื้น accent ทึบ** |
| `stamp` | สีเงา hard shadow (`shadow-stamp*`) — `neon` = ชมพู, theme อื่น = ink-900 |

### กฎ on-color (สำคัญ)

พื้น accent ทึบ (`bg-tangerine`, `bg-lemon`, `bg-mint`, `bg-peri`, `bg-rose`) **ต้องคู่กับ `text-on-{accent}` เสมอ**
— ห้ามใช้ `text-paper` / `text-ink-900` / ปล่อย inherit เพราะ dark theme กลับขาว-ดำ แต่ accent ยังสว่าง

```tsx
<span className="bg-lemon text-on-lemon">…</span>   // ✓
<span className="bg-lemon text-ink-900">…</span>    // ✗ ขาวบนเหลืองใน neon
```

- พื้น `-soft` และพื้น `/alpha` (`bg-mint/20`) ใช้ `text-ink-*` ได้ตามปกติ
- พื้นกลับสี `bg-ink-900` ใช้ `text-paper` (ทำงานถูกทั้ง light/dark)
- element ที่มีพื้น `bg-paper` ซ้อนอยู่ใน accent ทึบ ต้องใส่ `text-ink-900` เอง (ไม่งั้นได้ on-color ที่ inherit มา)

### Contrast ที่ test บังคับ

| คู่สี | ขั้นต่ำ |
|---|---|
| `ink-900` บน `paper` / `cream-50` / `cream-100` | 7 |
| `ink-700`, `ink-500` บน surface เดียวกัน | 4.5 |
| `on-{accent}` บน `{accent}` | 4.5 |
| `ink-900` บน `{accent}-soft` | 4.5 |
| `tangerine` / `mint` / `peri` / `rose` เป็นตัวหนังสือบน `paper` | 3 (ยกเว้น `classic` ที่คงค่าต้นฉบับ) |
| `stamp` บน `cream-100` | 3 |

### Semantic mapping

| Domain concept | Color |
|---|---|
| OT hours (any rate) | `tangerine` foreground / `tangerine-soft` bg |
| OT 1.5x bar fill on holiday | `lemon` |
| OT 3x bar fill | `tangerine` |
| Holiday day cell | `lemon-soft` bg |
| WFH | `peri-soft` chip |
| Onsite | `mint-soft` chip |
| ลา (leave) | `rose-soft` chip |
| Training | `lemon-soft` chip |
| Status: complete task | `mint` |
| Progress 1–99% | `ink-700` |
| Money values (positive) | `tangerine` heading |
| User avatar | `peri` solid |
| Logo M | `tangerine` solid + `on-tangerine` |

### Project colors

`projects.color` ใน DB ยังเก็บ hex ของ palette เดิม (`#6B7FE8` peri, `#4FB389` mint, `#FF6B35` tangerine,
`#F7C548` lemon, `#F291A6` rose, `#1E1E1E` ink) — render ผ่าน `projectColor(hex, alpha)` (`src/lib/projectColor.ts`)
ซึ่ง map กลับเป็น token → สีโปรเจคเปลี่ยนตาม theme โดยไม่ต้อง migrate

### Tailwind config

ดู `tailwind.tokens.ts` — ทุก color ชี้ไปที่ `var(--c-*)` ไม่มี hex

---

## 3. Typography

3 font families จาก Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@10..48,400..800&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
```

| Token | Family | When to use |
|---|---|---|
| `font-display` | `Bricolage Grotesque` | Headings, big numbers, buttons, sticker text, all `font-weight: 700-800` material |
| `font-body` | `IBM Plex Sans Thai` | Body copy, descriptions, table cells (text), navigation labels |
| `font-mono` | `JetBrains Mono` | Time codes (`17:00`), project codes (`MFG-API`), money values, status labels in uppercase, hint text |

### Type scale (with intent)

| Class | Size | Weight | Letter-spacing | Use |
|---|---|---|---|---|
| `text-hero` | 56px | 800 | -0.04em | Page H1 (dashboard "เดือนนี้เก็บงาน 164.5 ชั่วโมง") |
| `text-display` | 44px | 800 | -0.04em | Section page heads, big stat values |
| `text-stat-lg` | 36px | 800 | -0.04em | OT total figures |
| `text-stat` | 28px | 800 | -0.03em | Donut center, stat block values |
| `text-h2` | 28px | 800 | -0.03em | Learning page titles, big numbers in rings / steppers / compare cards |
| `text-h3` | 18px | 700 | -0.02em | Card titles |
| `text-h4` | 17px | 700 | -0.02em | Project name in cards |
| `text-h5` | 16px | 700 | -0.02em | Chart card titles |
| `text-body` | 13–14px | 400/500 | normal | Default body |
| `text-label` | 11–12px | 700 | 0.08–0.1em uppercase | Section labels (`mono` or `display`) |
| `text-hint` | 10–11px | 500/600 | normal | Mono hints, time markers |
| `text-tiny` | 9–10px | 600/700 | 0.08em uppercase | Smallest labels in chips, stat sub-labels |

### Letter-spacing pattern

- Display headings → tight (`-0.02em` to `-0.04em`) — chunky feel
- Mono labels uppercase → loose (`0.08em` to `0.1em`) — separates the all-caps
- Body → normal

### Line-height

- Hero/display → `0.9–1.0`
- Body → `1.4–1.5`
- Compact card text → `1.3`

---

## 4. Spacing

Tailwind defaults work as-is. Conventions used:

- Page margin: `32px` horizontal (`px-8`) on desktop, `20px` on mobile (`px-5`)
- Top nav: `20px` vertical (`py-5`)
- Card padding: `18–20px` (`p-[18px]` or `p-5`)
- Stat block: `18–20px` (`p-[18px]`)
- Card-to-card gap: `12–14px` (`gap-3` or `gap-[14px]`)
- Section gap (page vertical): `18–24px`

---

## 5. Borders & corners

**ทุก card/button มี `1.5px solid var(--ink-900)` border** — เป็น signature look

| Element | Border radius |
|---|---|
| Stat blocks, big cards | 16px |
| Standard cards | 14px |
| Buttons (rounded rect) | 10–12px |
| Sticker | 999px (pill) |
| Project code chip | 4–6px (small) |
| Time chip, status pill | 999px |
| Logo / avatar tile | 11–16px |
| Day cell in heatmap | 6px |
| Form field | 10px |

---

## 6. Shadows — chunky offset signature

```css
shadow-stamp-sm   2px 2px 0 0 rgb(var(--c-stamp))   /* small buttons, chips */
shadow-stamp      3px 3px 0 0 rgb(var(--c-stamp))   /* medium cards */
shadow-stamp-lg   4px 4px 0 0 rgb(var(--c-stamp))   /* main cards, stat blocks */
shadow-stamp-lemon      4px 4px 0 0 rgb(var(--c-lemon))      /* primary CTA "Save" */
shadow-stamp-tangerine  3px 3px 0 0 rgb(var(--c-tangerine))

/* fallback soft shadow — rarely used */
shadow-soft       0 8px 24px -8px rgb(var(--c-ink-900) / 0.18)
```

`stamp` = ink-900 ในทุก light theme, ชมพูนีออนใน `neon` — inline style ใช้ `var(--stamp)`

**Rule**: pressed/active states translate `1px,1px` to "absorb" the shadow.

---

## 7. Iconography

Custom SVG primitives (no icon library needed for decoratives):

| Component | Look | Use |
|---|---|---|
| `<Star4>` | 4-pointed sparkle | Highlight, decoration, "OT day" marker on calendar cells |
| `<Burst>` | 8-pointed burst with stroke | Celebration / spotlight |
| `<Squiggle>` | Wavy underline | Heading highlight stroke (under "ได้ OT") |
| `<Tape>` | Rectangular tape strip | Note attached feel |

For functional icons (nav, controls): use **Lucide React** (default with shadcn). Match `1.5px` stroke and rounded caps.

---

## 8. Stickers, pills, badges

### Sticker (rotated, hard-shadow, signature element)

```tsx
// Element with display font, 1.5px ink-900 border, 2px shadow, rotate -4° to 4°
<Sticker color="lemon" rotate={-4}>วันหยุดราชการ</Sticker>
```

Used for:
- Holiday banner ("🎉 วันหยุดราชการ")
- Section accents ("21/22 วันกรอกแล้ว")
- Status confirmation ("✓ 7 rows ready")
- Account flags ("whitelisted")

### Pill (no rotation, smaller)

```tsx
// Rounded full, body font 600, optional left dot
<Pill color="peri-soft" dot="peri">MFG-API</Pill>
```

### Project code chip

```tsx
// Mono font 700, 1px ink-900 border, color-coded bg per project
<code class="font-mono font-bold text-xs px-1.5 py-0.5 rounded border border-ink-900 bg-peri-soft">
  MFG-API
</code>
```

---

## 9. Buttons

| Variant | Bg | Text | Border | Shadow | Use |
|---|---|---|---|---|---|
| Primary | `ink-900` | `paper` | `ink-900` | `4px 4px 0 lemon` | Save, sign in, "New project" |
| Tangerine CTA | `tangerine` | `on-tangerine` | `ink-900` | `3px 3px 0 stamp` | "Save day ✓" on holiday |
| Lemon | `lemon` | `on-lemon` | `ink-900` | `2px 2px 0 stamp` | Active filter, "+ เพิ่ม", Learning primary |
| Danger | `rose` | `on-rose` | `ink-900` | `2px 2px 0 stamp` | Destructive |
| Paper | `paper` | `ink-900` | `ink-900` | `2px 2px 0 stamp` | Secondary, filters, prev/next |
| Ghost | transparent | `ink-700` | none | none | Tab nav (non-active) |
| Icon-only | `paper` | `ink-900` | `ink-900` | `2px 2px 0 stamp` | Date prev/next on mobile |

All buttons: `font-display`, `font-weight: 600–700`, padding scales with size.

---

## 10. Form fields

```
[Label · 11px display 700 uppercase ink-500]
[Field · cream-50 bg, ink-900 1.5px border, 10px radius, 2px stamp shadow,
        mono 14px 700 value, optional suffix on right]
[Hint · 10px mono ink-500]
```

Used in Settings — `Field` component is the pattern.

---

## 11. Motion (for shadcn/Tailwind impl)

Static design but plan these subtle motions when implementing:

| Element | Behavior |
|---|---|
| Buttons | `active:translate-x-[1px] active:translate-y-[1px] active:shadow-none` — "press into the page" |
| Cards on hover (if interactive) | `hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink-900)]` |
| Status pill toggle | 150ms ease bg + border |
| Sticker | static (rotation baked in) |
| Number tickers (dashboard stats) | optional count-up on mount, 600ms ease-out |
| Page transitions | none — instant route changes |
| Date strip | snap-scroll horizontally on mobile, day cell pulse on tap |

Motion language is **chunky + immediate** — short durations (120–180ms), translate/scale only, no fades.

---

## 12. Layout patterns

### Desktop nav (1280 wide)
```
[Logo M + "My Daily"]  [Dashboard | Daily | OT Table | Projects | Settings]  [sync indicator]  [avatar]
```
- height: 76px (with 20px padding)
- top: แถบ 4px 5 accent (tangerine → lemon → mint → peri → rose)
- border-bottom: `1.5px ink-900`
- bg: `paper`
- active tab: `bg-ink-900 text-paper rounded-[10px]`

### Mobile (390 wide)
- Status bar safe area: 44px
- Sticky bottom action bar with OT preview + Save (110px tall)
- Body padding: `16–20px`
- Date strip: 7 cells, current day filled tangerine

---

## 13. Special components by screen

### Calendar heatmap (Dashboard)
- 7 cols grid (`grid-cols-7 gap-1`)
- Day labels: `อา จ อ พ พฤ ศ ส` (Thai short)
- Each cell: `aspect-square`, color from semantic mapping, 1.2px border, 6px radius, day number top-left mono
- OT/special day: `Star4` icon bottom-right
- Holiday: 🎉 emoji bottom-right
- Cells with no entry: `paper` bg

### Weekly hours bar chart
- 5 weeks rolling (W18 → W22)
- Stacked: Regular (peri-soft) bottom + OT (tangerine) top
- Current week: bottom segment uses `lemon` instead of `peri-soft`
- Hours total label above each bar (mono 10px)

### Project donut
- 140px circle, 14px stroke segments
- Inner hole at r=35, filled paper
- Total hours + "5 projects" in center
- Legend right: code + bar + hours + complete count

### OT table
- Header: `bg-ink-900 text-paper`, display 12px 700 uppercase
- Holiday rows: `bg-lemon-soft`
- Money column: display 14px 800
- Total row: `border-top: 2px ink-900`, larger numbers
- Final summary: `text-tangerine` for total amount

---

## 14. Edge cases & states

| State | Handling |
|---|---|
| No entries for the day | Show empty mobile screen with quick presets prominently |
| Today is holiday | Show 🎉 banner sticker + lemon-soft header bg |
| Status not set | Dashed-border pill, ink-500 text |
| OT = 0 hours | Money cell shows `—` (ink-300) |
| Future days in calendar | Skip render or render with reduced opacity, no border |
| Salary hidden | `•••••••` instead of value, "กดดวงตาเปิด" hint |
| Sign-out / failed auth | Toast (use shadcn `Sonner`) — top-right |

---

## 15. Files reference

ดูใน `mocks/` — HTML mocks ที่ implement ระบบนี้ทั้งหมด

| File | Screen |
|---|---|
| `mocks/My Daily.html` | Entry point — load ทุกหน้าใน design canvas |
| `mocks/src/Login.jsx` | Login |
| `mocks/src/DailyEntry.jsx` | Mobile entry (weekday) |
| `mocks/src/DailyEntrySat.jsx` | Mobile entry (holiday) |
| `mocks/src/Dashboard.jsx` | Desktop dashboard |
| `mocks/src/OTTable.jsx` | OT table |
| `mocks/src/Projects.jsx` | Projects management |
| `mocks/src/Settings.jsx` | Settings |
| `mocks/src/BrandSystem.jsx` | Brand reference card |
| `mocks/src/shared.jsx` | Sticker, Pill, Card, Star4, Burst, Tape, Phone |
| `mocks/styles/tokens.css` | CSS variables ของ mock ต้นฉบับ (= theme `classic`) — runtime ใช้ `src/styles/globals.css` |
