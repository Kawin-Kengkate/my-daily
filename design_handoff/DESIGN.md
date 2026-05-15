# DESIGN.md — My Daily Design System

> Hi-fi design system สำหรับ My Daily (personal daily log + OT dashboard)
> Visual direction: **Playful — cream base, hard-shadow stamps, warm accents, big numeric tickers**

---

## 1. Voice & character

- **Personal** — เป็น app ของ user คนเดียว ใช้ภาษาผสม ไทย + English (technical terms อังกฤษ)
- **Confident / chunky** — sticker stamps, hard shadow offset, ตัวเลขใหญ่ๆ
- **ใช้สีมีความหมาย** — ทุก accent มีหน้าที่ (ดู §2)
- **ภาษา**: Display heading ไทยตัวใหญ่ + English technical terms (`OT`, `WFH`, `1.5x`) เป็น mono

---

## 2. Color system

Cream base + ink + **4 accent ที่มีบทบาทเจาะจง** + 1 soft (rose)

| Token | Hex | OKLCH | Role |
|---|---|---|---|
| `cream-50` | `#FBF6EC` | — | Lightest surface (cards inner / hovers) |
| `cream-100` | `#F5EFE4` | — | **Canvas / page bg** |
| `cream-200` | `#ECE3D2` | — | Inactive chips, dividers |
| `cream-300` | `#DCCFB6` | — | Strong border, "etc" project chip |
| `paper` | `#FFFCF5` | — | **Card surface** (most cards) |
| `ink-900` | `#0F1B2D` | — | **Primary text, all 1.5px borders** |
| `ink-700` | `#2A3A52` | — | Secondary text |
| `ink-500` | `#5C6A80` | — | Muted text, labels |
| `ink-300` | `#9AA6B8` | — | Disabled / placeholder |
| `ink-200` | `#C6CDDB` | — | Light divider |
| `tangerine` | `#FF6B35` | — | **OT / money / urgent** (3x rate, OT bars, salary CTAs) |
| `tangerine-soft` | `#FFD8C7` | — | OT background fill, 1.5x bar fill on holidays |
| `lemon` | `#F7C548` | — | **Holiday / highlight / "next"** |
| `lemon-soft` | `#FCEDBD` | — | Holiday bg, holiday-row stripe in OT table |
| `mint` | `#4FB389` | — | **Complete / positive / synced** |
| `mint-soft` | `#C8E8D7` | — | Onsite chip, complete bg |
| `peri` | `#6B7FE8` | — | **Projects / info / user avatar** |
| `peri-soft` | `#D7DCFA` | — | WFH chip, project primary bg |
| `rose` | `#F291A6` | — | **Leave / soft sensitive** (salary lock sticker) |
| `rose-soft` | `#FBD7DE` | — | Leave chip bg |

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
| Logo M | `tangerine` solid |

### Tailwind config

ดู `tailwind.tokens.ts` — copy `extend.colors` ลง `tailwind.config.ts`

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
--shadow-stamp:    4px 4px 0 0 var(--ink-900);   /* main cards, stat blocks */
--shadow-stamp-sm: 2px 2px 0 0 var(--ink-900);   /* small buttons, chips */
--shadow-stamp-3:  3px 3px 0 0 var(--ink-900);   /* medium cards */
--shadow-stamp-cta-lemon: 4px 4px 0 0 var(--lemon);  /* primary CTA "Save" */
--shadow-stamp-cta-orange: 3px 3px 0 0 var(--tangerine); /* save in dark mode */

/* fallback soft shadow — rarely used */
--shadow-soft: 0 8px 24px -8px rgba(15,27,45,0.18);
```

**Rule**: pressed/active states translate `-1px,-1px` to "absorb" the shadow.

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
| Primary | `ink-900` | `paper` | `ink-900` | `4px 4px 0 lemon` or `tangerine` | Save, sign in, "New project" |
| Tangerine CTA | `tangerine` | `paper` | `ink-900` | `3px 3px 0 ink-900` | "Save day ✓" on holiday |
| Lemon | `lemon` | `ink-900` | `ink-900` | `2px 2px 0 ink-900` | Active filter, "+ เพิ่ม" |
| Paper | `paper` | `ink-900` | `ink-900` | `2px 2px 0 ink-900` | Secondary, filters, prev/next |
| Ghost | transparent | `ink-700` | none | none | Tab nav (non-active) |
| Icon-only | `paper` | `ink-900` | `ink-900` | `2px 2px 0 ink-900` | Date prev/next on mobile |

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
| `mocks/styles/tokens.css` | CSS variables source of truth |
