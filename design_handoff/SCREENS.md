# SCREENS.md — Detailed screen specifications

> One section per screen. Use together with `DESIGN.md` for tokens.

---

## Convention

- All dimensions are **CSS px** at base scale.
- "Border" defaults to `1.5px solid var(--ink-900)` unless noted.
- "Stamp shadow" defaults to `4px 4px 0 0 var(--ink-900)` unless noted.
- Tailwind class hints in `monospace` next to each block — adapt to your project's conventions.

---

## 1. Login (mobile)

**Frame**: 390 × 844 (iPhone 14 base)
**Purpose**: Single-button OAuth sign-in for the whitelisted user

### Layout
- Full-bleed `cream-100` bg
- 4 decorative absolute circles (top-right lemon-soft 220px, mid-left peri-soft 160px, bottom-right mint-soft 130px) + 3 floating sparkles (`Star4`)
- Content padding: `120px 32px 50px` (top space leaves status bar + breathing room)
- Flex column

### Components
1. **Logo lockup** (top)
   - Tile: `56×56`, `tangerine` bg, `1.5px ink-900` border, `2px 2px 0 0 ink-900` shadow, `rotate(-6deg)`, content: "M" (display 800 30px, color: paper, letter-spacing -0.04em)
   - Right side: small uppercase label "v.1.0 · personal" + brand name "My Daily" (display 700 22px, tight tracking)
2. **Hero headline** (52px display 800, line-height 0.95, color ink-900)
   ```
   บันทึก
   ทุกวัน
   ได้ OT  ← tangerine word with lemon squiggle underline
   ```
3. **Subhead** (body 16px, color ink-500, max-width 280): "กรอก daily log · ดู dashboard · คำนวณ OT ครบในที่เดียว — เฉพาะ kawinkengkate@gmail.com เท่านั้น"
4. **Google sign-in button** (`mt-8`):
   - Full-width, `padding: 18px 20px`, bg `ink-900`, color `paper`
   - Border 1.5px ink-900, radius 16, shadow `4px 4px 0 0 tangerine`
   - Content: Google G icon (multi-color SVG) + "Continue with Google" (display 600 17px)
5. **Helper row** (centered, mono 11px ink-500): "RLS enabled · whitelist only · built for 1"

### Behavior
- Click button → Supabase OAuth flow
- On callback, useAuth hook checks `user.email === WHITELIST_EMAIL`
- If not match → `supabase.auth.signOut()` + toast "อีเมลนี้ไม่ได้อยู่ใน whitelist"

---

## 2. Daily Entry — Weekday (mobile)

**Frame**: 390 × 844
**Purpose**: Quick daily log entry for a regular working day

### Layout (top → bottom)

```
┌──── Header (cream-100 bg, 1.5px ink-900 bottom border) ────┐
│ [← btn]   [วันพฤหัสบดี / 14 พ.ค. 2026]   [→ btn]            │
│                                                            │
│ [Date strip — 7 days, today=14 highlighted tangerine]      │
└────────────────────────────────────────────────────────────┘

┌──── Body (cream-100, padded 16/20) ────┐
│ Label: "วันนี้ทำงานยังไง"               │
│ [WFH] [Onsite] [ลา] [Training]  ← 4 status pills │
│                                         │
│ ┌── Quick presets card (lemon-soft, dashed border) ──┐ │
│ │ [งานปกติ 8:00-16:40] [OT จนทุ่ม] [เหมือนเมื่อวาน] │
│ └─────────────────────────────────────────────────────┘ │
│                                         │
│ Label: "Time blocks · 2 entries"  [+ Add btn dark]│
│ ┌── Time block 1 ────────────────┐    │
│ │ 08:00 ●━━━━━━━━━━━━━━━● 16:40 │    │
│ │ [MFG-API peri] แก้ bug auth flow + integration test   90% │
│ │ [CMMS mint]   รีวิว PR + standup                      complete │
│ └─────────────────────────────────┘    │
│ ┌── Time block 2 (OT 1.5x) ──────┐    │
│ │ 17:00 ●━━━━━● 20:30  [OT 1.5x] │    │
│ │ [TAI lemon] เริ่ม schema สำหรับ asset inventory v2  30% │
│ └─────────────────────────────────┘    │
│                                         │
│ Label: "Recent · tap เพื่อเพิ่ม"        │
│ [+ TAI] [+ MFG-API] [+ SKR] [+ CMMS] [+ etc] │
└─────────────────────────────────────────┘

┌──── Sticky bottom (paper, 1.5px ink-900 top border) ────┐
│ [OT วันนี้ pill — tangerine bg]    [Save btn ink-900]  │
│  3.5 ชม · 1.5x       ฿1,312                            │
└─────────────────────────────────────────────────────────┘
```

### Component specs

**Header date strip**
- 7 equal cells, gap 6
- Each cell: padding 6/0, radius 10
- Today: `bg-tangerine`, border 1.5px ink-900, text paper
- Weekend: text `ink-300`
- Below number: dots indicating entries (mint dot = regular, tangerine dot = OT)

**StatusPill**
- `flex-1`, padding 10/4, radius 12
- Active: solid color bg (semantic), 1.5px ink-900 border, 2px stamp shadow, translate(-1px,-1px)
- Inactive: dashed ink-300 border, ink-500 text
- Display 600 13px centered

**Quick presets card**
- bg `lemon-soft`, 1.5px **dashed** ink-900 border, radius 12, padding 10
- Sticker "⚡ Quick presets" overlapping top-left (rotate -4°, color lemon)
- 3 preset buttons inside: each `flex-1`, paper or color bg, 1.5px solid ink-900 border, 2px shadow
- Preset: title (display 700 13px) + sub (mono 10px ink-500)

**TimeBlock**
- bg paper, 1.5px ink-900 border, radius 14, `3px 3px 0 0 ink-900` shadow, padding 12
- Top: time start (mono 18px 700) + horizontal line with circle endpoints (color from segment kind) + time end + optional kind pill (display 11px 700 in matching color)
- Body: vertical stack of project rows
- Project row: padding 8/10, bg `cream-50`, 1px `cream-300` border, radius 10
  - Code chip (mono 700 12px, 4px radius, color bg)
  - Task description (body 13px)
  - Progress (mono 11px 700) — `mint` if "complete", else `ink-700`

**Recent chips**
- Pill chips, padding 5/10, radius 999, 1.5px ink-900 border
- Mono 700 12px, color bg per project
- Prefix "+ "

**Sticky bottom bar**
- OT preview (`flex-1`): bg `tangerine`, color paper, padding 8/12, radius 10
  - Label uppercase mono 10
  - Big number (display 800 22px) + "ชม · 1.5x" + total ฿ right-aligned
- Save button: padding 14/20, bg ink-900, color paper, radius 12, `3px 3px 0 0 lemon` shadow, display 700 15px

### Behavior
- Status pills: single-select within group, persisted to day.location
- Quick presets: clicking populates time block fields immediately
- "เหมือนเมื่อวาน" duplicates: copies previous day's time blocks + projects
- Recent project chip → adds new row to active time block (or last block)
- Save: POST/upsert day + entries, then toast + navigate to next unfilled day

---

## 3. Daily Entry — Saturday/Holiday (mobile)

**Frame**: 390 × 844
**Purpose**: Same as weekday but rates differ (1.5x → 3x after 17:00, includes auto-deduct break)

### What's different from weekday

1. **Header bg** = `lemon-soft` (visual distinction for holiday)
2. **Holiday sticker** absolute top-right: "🎉 วันหยุดราชการ" (lemon color, rotate -4°)
3. **AI suggestion card** below status (paper bg, mint shadow):
   - Mint square icon with 💡
   - Title: "วันหยุดแต่ทำงาน? คิด OT 1.5x ทั้งวัน"
   - Body: "เลือก WFH/Onsite แล้วบล็อกเวลาเริ่ม-เลิก ระบบหักพัก 1 ชม. ให้อัตโนมัติ"
4. **Single big time block** instead of 2 — covers whole day 08:00→18:00
5. **OT breakdown bar** inside the time block:
   - Horizontal stacked bar 28px tall, 1.5px border, radius 8
   - Segment 1 (flex 8): `lemon` bg, "1.5x · 8h" centered
   - Segment 2 (flex 1): `cream-200` bg, mono "พัก" small
   - Segment 3 (flex 1): `tangerine` bg, "3x · 1h" paper text
   - Below: mono time markers "8:00 / 17:00 / 18:00"
6. **Note section** with `Tape` decoration — bg `lemon-soft`, body text written like a handwritten note
7. **Bottom bar variant**:
   - Left: dark `ink-900` block showing OT รวม (9 ชม) + ฿5,625 in lemon mono below
   - Right: `flex-1` tangerine button "Save day ✓"

### OT calculation visualization

The breakdown bar is the key UX element. Generate segment widths from real data:
```
const total = endMinutes - startMinutes;  // 600 min for 8-18
const break1Min = total > 5*60 ? 60 : 0;  // 60 min break if >5h continuous
const segment1 = clamp(17:00 - start) - prorated break  // 1.5x portion
const segment3 = end - 17:00                            // 3x portion
```

---

## 4. Dashboard (desktop)

**Frame**: 1280 × 900
**Purpose**: Month overview — hours, OT money, projects, calendar

### Layout

```
┌──────── Top nav (paper, 76px tall) ────────┐
│ [M logo] My Daily   [tabs]   [sync] [avatar K] │
└────────────────────────────────────────────┘

┌──────── Hero header (32px padded) ────────┐
│ พฤษภาคม 2026 [sticker: 21/22 วันกรอกแล้ว]    │
│ เดือนนี้เก็บงาน 164.5 ชั่วโมง     [‹ Apr] [May 2026 lemon] [Jun ›] │
│                ↑ tangerine                                       │
└────────────────────────────────────────────┘

┌──── Stat row (4 columns, gap 14, slight rotations) ────┐
│ [OT ชั่วโมง 27.5 tangerine] [OT เงินได้ ฿11,680 paper] [WFH/Onsite 14/5 peri-soft] [โปรเจค 5 lemon-soft] │
└────────────────────────────────────────────────────────┘

┌──── 3-col grid (gridTemplateColumns: 1.1fr 1fr 1.2fr) ────┐
│ [Calendar heatmap] [Weekly hours bars] [Project donut + legend] │
└───────────────────────────────────────────────────────────┘

┌──── Recent entries strip (5 cards) ────┐
│ [14 พฤ] [13 พ] [12 อ] [11 จ] [9 ส]   │
└────────────────────────────────────────┘
```

### Top nav details

- height 76px (py-5)
- bg paper, border-bottom 1.5px ink-900
- Logo: same M tile as login but 38×38, smaller font
- Tab buttons: padding 8/14, radius 10
  - Active: `bg-ink-900 text-paper`
  - Inactive: transparent `text-ink-700`
  - Hover: bg `cream-100`
- Right: sync pill (cream-100 rounded-full, mint dot, mono 11 600 "synced 2m ago") + avatar K (36×36 round, peri bg, 1.5px ink-900 border)

### Hero

- Section label (display 13 700 ink-500 uppercase 0.1em)
- Sticker (mint, rotate -3°): "21 / 22 วันกรอกแล้ว"
- H1: `text-hero` (56/800/-0.04em/lh 1)
- Number 164.5 in `tangerine`
- "ชั่วโมง" in mono 22 600 ink-500
- `Star4 lemon 26` absolute top-right
- Month nav right-aligned: 3 buttons

### Stat row (4 blocks)

Each block:
- flex-1, padding 18/20, 1.5px ink-900 border, radius 16, `4px 4px 0 0 ink-900` shadow
- Optional slight rotation: -0.6° / 0 / 0.6° / 0 (alternating tilt)
- Optional decoration `Star4` or `Burst` absolute top-right
- Label (display 11 700 uppercase 0.1em ink-700)
- Value (display 44 800 -0.04em lh 0.9) + optional unit (mono 13 600 ink-500)
- Sub (body 12 ink-700)

Stat 1: **OT ชั่วโมง** — bg `tangerine`, value `27.5`, unit `ชม`, sub `เทียบ Apr: +5.5h ▲`, lemon star
Stat 2: **OT เงินได้** — bg paper, value `฿11,680`, sub `1.5x · 22h | 3x · 5.5h`, mint burst
Stat 3: **WFH / Onsite** — bg `peri-soft`, value `14/5`, unit `วัน`, sub `ลา 1 · หยุดทำงาน 1`
Stat 4: **โปรเจคที่แตะ** — bg `lemon-soft`, value `5`, sub `MFG-API นำ 38% · 27✓ tasks done`

### Calendar heatmap card

- Card: paper, 1.5px ink-900, radius 16, stamp shadow, padding 18
- Header row: title "May at a glance" (display 16 700 -0.02em) + hint right (mono 10 ink-500)
- Day labels (7-col grid): `อา จ อ พ พฤ ศ ส` (weekend ink-300, weekday ink-500), display 10 700 uppercase
- Day cells (7-col grid, gap 4):
  - `aspect-square`, 1.2px ink-900 border, radius 6, padding 4
  - Background semantic (see table below)
  - Day number top-left: mono 10 700
  - Optional decoration bottom-right
- Legend below (mono 10 ink-700, 5 entries flex-wrap)

Cell color mapping:
| Type | Bg | Decoration |
|---|---|---|
| WFH | `peri-soft` | — |
| WFH + OT | `tangerine` (paper text) | `Star4 lemon 8` bottom-right |
| Onsite | `mint-soft` | — |
| ลา | `rose-soft` | — |
| Holiday | `lemon-soft` | "🎉" bottom-right |
| Holiday worked | `tangerine-soft` | `Star4 tangerine 8` bottom-right |
| Weekend (no work) | `cream-100` | — |

### Weekly hours bar chart

- Card same paper styling
- Header: title + legend (Regular peri-soft / OT tangerine, mono 10)
- 5 bars (W18 → W22 ›), gap 14, height 180
- Each bar:
  - Hours total label above bar (mono 10 700 ink-700)
  - Stacked: OT on top (tangerine, top corners rounded), Regular below (peri-soft or lemon for current week)
  - Width: `100%` of bar slot
  - All segments 1.5px ink-900 border (no bottom on top segment, no top on bottom segment)
- Footer: avg vs current (mono 11, current week +3.5h OT in tangerine bold)

### Project donut card

- 140×140 SVG donut
- Outer ring at r=42, stroke 14px segments colored per project
- Inner circle r=35 with paper fill + ink-900 border (creates "hole")
- Center text: total hours (display 28 800) + "5 projects" (mono 10 ink-500)
- Right legend rows:
  - 10×10 color square
  - Code (mono 12 700, w-70px)
  - Progress bar (flex-1, height 6, cream-100 bg, ink-200 border, filled with color)
  - Hours right-aligned (mono 11 700)
  - Complete count (mono 10 mint, "✓")
- Header right pill: "5 active" (lemon-soft, mono 10)

### Recent entries strip

- Single card paper + stamp shadow
- 5 cards in grid (5 columns, gap 10)
- Each: padding 10, cream-50 bg, 1px cream-300 border, radius 10
- Row 1: day label (display 13 700) + status pill (display 10 700, semantic bg)
- Row 2: hours big (display 20 800)
- Row 3: project codes (mono 9 700, paper bg, ink-300 border, gap 3 wrap)
- Row 4: note (body 11 ink-700, lh 1.3, text-wrap pretty)

---

## 5. OT Table (desktop)

**Frame**: 1280 × 900
**Purpose**: Copy-friendly OT report for ฟอร์มเบิก

### Layout

```
[Top nav — OT Table active]

[Section label: OT report · May 2026]
[H1: พร้อม copy ไปกรอกฟอร์มเบิก]   [Filter ▾] [May 2026 ▾] [📋 Copy table (dark btn)]

[Summary band — 4 cards]
[OT รวม ฿12,374 tangerine] [1.5x · 26 ชม paper] [3x · 1 ชม paper] [วันที่มี OT 6/7 lemon-soft]

[Big table card]
```

### Header

Same nav. Heading 44px display 800 with "copy" word in `tangerine`.

### Summary band

4 cards, `flex` row, gap 12:
1. **Big tangerine card** (flex-1): tangerine bg, paper text, ฿amount big (display 36 800), `Star4 lemon 28` right
2. **1.5x card** (flex-1): paper bg, hours big + ฿ derived below in mono
3. **3x card** (flex-1): same as 1.5x
4. **Day count card** (flex-1): lemon-soft bg, "6 / 7 วัน", sub "2 วันหยุด · 4 วันธรรมดา"

All: padding 14/18, 1.5px ink-900 border, radius 14, stamp shadow.

### Table

- Wrapped in paper card with `overflow-hidden` so border-radius clips header
- Border: 1.5px ink-900 outer, radius 16, stamp shadow
- `<table class="w-full border-collapse font-mono">`

**Header row** (`<thead>`):
- bg `ink-900`, color paper
- Each th: padding 12/14, display 12 700, uppercase, 0.05em tracking
- Columns + align:
  | # | Header | Align |
  |---|---|---|
  | 1 | วันที่ | left |
  | 2 | วัน | left |
  | 3 | ประเภท | left |
  | 4 | เริ่ม | left |
  | 5 | เลิก | left |
  | 6 | 1.5x ชม | right |
  | 7 | 3x ชม | right |
  | 8 | รายละเอียด | left |
  | 9 | เงิน (บาท) | right |

**Body rows**:
- 1px cream-300 top border between rows
- Holiday rows: `bg-lemon-soft`
- Date cell (col 1): display 700 14px
- Day cell (col 2): 24×24 square with day letter inside (display 11 700), bg `lemon` if holiday else `peri-soft`, 1px ink-900 border, radius 6
- Type cell (col 3): pill (display 11 700 padding 3/8 rounded-full, 1px ink-900 border, color per type)
- Time cells (cols 4–5): body 13 600, ink-300 if dash
- Hour cells (cols 6–7): mono 13 700 right-aligned, ink-300 if 0, tangerine for 3x column
- Note cell (col 8): body 13 ink-700
- Money cell (col 9): display 14 800 right-aligned, ink-300 if 0

**Total row**:
- `border-top: 2px ink-900`, bg `cream-50`
- Colspan 1–5 with "รวม" right-aligned display 700 uppercase ink-700
- Hour totals: display 16 800
- Final amount: display 20 800 tangerine, right-aligned

### Footer hints

Below table, flex row mono 11 ink-500:
- Legend: "= วันหยุด" with lemon-soft swatch
- Rule reminder: "หักพัก 1 ชม. อัตโนมัติเมื่อทำเกิน 5 ชม.ติด"
- Right: green sticker "✓ 7 rows · ready to paste"

### Behavior

- "Copy table" button → puts TSV in clipboard (tab-separated for paste into Sheets / form table)
- Filter dropdown: by status (all / weekday / holiday), by project
- Month dropdown: navigate Jan–Dec

---

## 6. Projects (desktop)

**Frame**: 1280 × 900
**Purpose**: Manage project codes + see at-a-glance which is hot

### Layout

```
[Top nav — Projects active]

[Section label]
[H1: 5 โปรเจคที่ทำให้ [หมุน] ← lemon highlight box]
                                                [Active only ▾] [+ New project dark btn]

[3-column grid of cards (5 project cards + 1 add placeholder)]
```

### Project card

- 18 padding, paper bg, 1.5px ink-900 border, radius 16, stamp shadow, relative overflow-hidden
- **Corner accent**: absolute top-right 80×80 circle in project's `soft` color (positioned top:-30 right:-30 to peek)
- **Header row**:
  - Tile 56×56 in project color (rotated -4° to 4° per card), 1.5px ink-900 border, 2px shadow, radius 12
  - Inside: code in mono 800, paper color (or ink-900 if cream-300 bg)
  - Code font-size: 14 if ≤4 chars, 11 if longer
- **Name** (display 17 700 -0.02em, line-height 1.15)
- **Star row** (3 stars Star4 size 11, filled lemon if ≤ rating, else cream-300) + "last · 14 พ.ค." (mono 10 ink-500)
- **Kebab menu** (⋯) right
- **Description** (body 13 ink-700, lh 1.4, min-height 36 for alignment)
- **Stat row** (3 cols, top/bottom dashed ink-200 dividers, padding 10/0):
  - Hours / Days / Tasks ✓
  - Label (mono 9 ink-500 uppercase 0.08em)
  - Value (display 22 800 -0.03em, mint color for "Tasks ✓")
- **Sparkline** (22 bars, gap 2, height 32, project color with opacity gradient 0.4 → 1 based on value)
- Sparkline footer: "22 wk ago" / "now" (mono 9 ink-500)

### Add new card

- Same dimensions, transparent bg, **dashed** ink-300 border
- Centered content: dashed square tile (56×56) with "+" + "Add a new project" + hint

### Real project data

(from CONTEXT.md, with placeholder hours)

| Code | Name | Color | Soft |
|---|---|---|---|
| MFG-API | Manufacturing API | peri | peri-soft |
| TAI | Tractor Asset Inventory | lemon | lemon-soft |
| CMMS | Computerized Maintenance Mgmt System | mint | mint-soft |
| SKR | Siam Kubota Raw materials | rose | rose-soft |
| etc | งานเบ็ดเตล็ด | cream-300 | cream-200 |

---

## 7. Settings (desktop)

**Frame**: 1280 × 900
**Purpose**: Configure salary, work hours, holidays, account

### Layout

```
[Top nav — Settings active]

[Section label: Settings]
[H1: ตั้งค่าให้ [OT คำนวณถูก] ← tangerine squiggle underline]

[2-column grid 1.1fr 1fr]
  LEFT:
    [Salary card]
    [Work hours card]
  RIGHT:
    [Account card — dark]
    [Holidays card]
```

### Salary card (left)

- Paper card, padding 20, stamp shadow
- Top-right sticker "🔒 ความลับ" (rose, rotate -3°, absolute -10px from top)
- Title (display 18 700) + sub (body 12 ink-500 with code inline `user_settings.salary`)
- Form grid 2×2 (gap 12) of `Field` components:
  - "เงินเดือนรวม" / `•••••••` / suffix `THB / เดือน` / hint "กดดวงตาเพื่อเปิดดู"
  - "baseHourly (auto)" / `฿250.00` / `/ ชม` / hint "salary ÷ 30 ÷ 8"
  - "1.5x rate" / `฿375.00` / `/ ชม`
  - "3x rate" / `฿750.00` / `/ ชม`

### Work hours card (left)

- Same card style
- Title "เวลาทำงาน + กฎ OT" + sub "ใช้ตอน aggregate · เปลี่ยนถ้าบริษัทย้ายกะ"
- **Timeline graphic** (height 56):
  - Single bar 14px tall, cream-100 bg, 1.5px ink-900 border, radius 8, internal segments:
    - 47% width: peri-soft "งานปกติ" (mono 9 700)
    - 5% width: striped pattern (cream-200/cream-300 diagonal) = พัก
    - 48% width: tangerine "OT 1.5x" (mono 9 700 paper)
  - 4 tick marks below at 0% / 47% / 52% / 100% labelled `8:00 / 16:40 / 17:00 / 23:00` (mono 10 600 ink-500)
- Form grid 3×1 of `Field` components:
  - "เริ่มงาน" / `08:00`
  - "พักกินข้าวเที่ยง" / `40` / `นาที` / hint "รวมในเวลางาน"
  - "พักก่อน OT" / `16:40 → 17:00` (body font) / hint "ไม่นับเงิน"
- **Rule callout**: padding 12, lemon-soft bg, 1.5px **dashed** ink-900 border, radius 10
  - Lemon icon square 24×24 with "⚠"
  - Text "หักพัก 1 ชม. อัตโนมัติเมื่อทำงานต่อเนื่อง **เกิน 5 ชม.**"
  - Toggle (on=mint, off=cream-200, 44×26, 1.5px ink-900 border, knob 18×18 paper with 1.5px border)

### Account card (right)

- **Dark card** — bg `ink-900`, color `paper`, radius 16, `4px 4px 0 0 tangerine` shadow
- Top row:
  - Avatar K (56×56, peri bg, 1.5px paper border)
  - Name "Kawin Kengkate" (display 17 700)
  - Email (mono 11 paper at 70% opacity)
  - Pill "whitelisted" (mint bg, 1.5px paper border, ink-900 text)
- Divider (dashed paper 20%)
- 2 ghost buttons: "Export ข้อมูล" / "Sign out" (transparent bg, paper border at 30%, paper text)

### Holidays card (right)

- Paper card
- Title "วันหยุดราชการ 2026" + sub "static · อัพเดทมือปีละครั้ง"
- "+ เพิ่ม" lemon button right
- List rows (max 10 visible):
  - flex row, gap 12, padding 8/10, 1px cream-300 border, radius 8
  - Date (mono 12 700 w-80px) + name (body 13)
  - Past dates: opacity 0.45
  - **Next holiday** row: lemon-soft bg, 1.5px ink-900 border, "next ↗" pill (lemon)
- Real 2026 Thai holidays:
  | Date | Name |
  |---|---|
  | 1 ม.ค. | วันขึ้นปีใหม่ |
  | 10 ก.พ. | วันมาฆบูชา |
  | 6 เม.ย. | วันจักรี |
  | 13–15 เม.ย. | วันสงกรานต์ |
  | 1 พ.ค. | วันแรงงานแห่งชาติ |
  | 4 พ.ค. | วันฉัตรมงคล |
  | 1 มิ.ย. | วันวิสาขบูชา ← **next** as of 14 May 2026 |
  | 28 ก.ค. | วันเฉลิม ร.10 |
  | 12 ส.ค. | วันแม่แห่งชาติ |
  | 13 ต.ค. | วันคล้ายวันสวรรคต ร.9 |

---

## Cross-screen patterns

### Mobile-only

- Status bar safe-area inset (44px top) — use CSS env() in real impl
- Bottom action bar: sticky `position: sticky bottom: 0` with `border-top` divider
- Home indicator: visual only — drop in real app, system handles it

### Desktop-only

- Top nav: 76px, sticky top
- Page content padded `32px` horizontal
- Cards live on `cream-100` page bg

### Responsive note

CONTEXT says "Mobile app: ❌ — responsive web พอ". Use Tailwind breakpoints:
- `< md`: mobile entry layout
- `>= md`: desktop dashboard/table/projects/settings
- Daily entry should also work on desktop (centered, max-width 480) — but mobile is primary
