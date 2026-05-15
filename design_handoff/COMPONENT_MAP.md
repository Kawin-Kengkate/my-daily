# COMPONENT_MAP.md — shadcn ↔ My Daily styling

> สำหรับ dev ที่ใช้ shadcn/ui ตาม `README.md` หลัก: mapping จาก shadcn primitive → ใช้แต่ง override ให้ได้ look ของ design

## Setup steps

1. `npx shadcn@latest add button card input dialog dropdown-menu sheet table tabs toast toggle calendar`
2. Append CSS variables จาก `globals.css` ไปต่อท้าย `src/globals.css` ของ shadcn
3. Merge `tailwind.tokens.ts` เข้า `tailwind.config.ts`
4. ปรับ default border ทุก primitive — ใน design system นี้ **ทุก** card/button/field มี `1.5px solid var(--ink-900)` border

---

## Primitive overrides

### `<Button>` — สำคัญที่สุด

Default shadcn variants → custom variants:

```tsx
// components/ui/button.tsx — extend buttonVariants
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-bold transition-all btn-press disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary — dark with lemon shadow (Save, Sign in, New project)
        primary: 'bg-ink-900 text-paper border-1.5 border-ink-900 shadow-stamp-lemon',
        // Tangerine CTA (holiday Save)
        tangerine: 'bg-tangerine text-paper border-1.5 border-ink-900 shadow-stamp',
        // Lemon (filter, "+ เพิ่ม")
        lemon: 'bg-lemon text-ink-900 border-1.5 border-ink-900 shadow-stamp-sm',
        // Paper (secondary, prev/next)
        paper: 'bg-paper text-ink-900 border-1.5 border-ink-900 shadow-stamp-sm',
        // Ghost (nav tabs, non-active)
        ghost: 'text-ink-700 hover:bg-cream-100',
        // Icon-only mobile
        icon: 'bg-paper border-1.5 border-ink-900 shadow-stamp-sm',
      },
      size: {
        sm: 'h-8 px-3 text-[13px] rounded-button',
        md: 'h-10 px-4 text-sm rounded-button',
        lg: 'px-5 py-3.5 text-[15px] rounded-button',
        icon: 'h-9 w-9 rounded-field',
      },
    },
  },
);
```

### `<Card>`

Default shadcn `Card` is too plain. Replace base styling:

```tsx
// components/ui/card.tsx
className = cn(
  'bg-paper text-ink-900 rounded-card-lg border-1.5 border-ink-900 shadow-stamp-lg',
  className,
);
```

Variants:
- **Default** card → paper bg + stamp-lg
- **Stat card** with accent bg → pass `bg-tangerine`, `bg-lemon-soft`, etc as className
- **Account card** (dark) → `bg-ink-900 text-paper shadow-stamp-tangerine`

### `<Input>` / form Field

Don't use raw shadcn Input alone — wrap in the Field pattern (label + input + hint):

```tsx
// components/Field.tsx
export function Field({ label, hint, suffix, ...props }: FieldProps) {
  return (
    <div>
      <label className="font-display font-bold text-label text-ink-500 uppercase">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2 px-3.5 py-2.5 bg-cream-50 border-1.5 border-ink-900 rounded-field shadow-stamp-sm">
        <input
          {...props}
          className="flex-1 bg-transparent font-mono text-sm font-bold outline-none"
        />
        {suffix && <span className="font-mono text-hint text-ink-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 font-mono text-[10px] text-ink-500">{hint}</p>}
    </div>
  );
}
```

### `<Table>` (OT Table)

Style the shadcn Table primitive:

```tsx
// Wrap in Card with overflow-hidden so the header inherits the radius
<Card className="overflow-hidden p-0">
  <Table>
    <TableHeader className="bg-ink-900 [&_th]:text-paper [&_th]:font-display [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-label">
      ...
    </TableHeader>
    <TableBody className="font-mono [&_tr]:border-t [&_tr]:border-cream-300 [&_tr[data-holiday=true]]:bg-lemon-soft">
      ...
    </TableBody>
  </Table>
</Card>
```

### `<Toggle>` / `<Switch>`

The Settings page uses a custom switch with explicit border. Override shadcn switch:

```tsx
// switch.tsx — replace styling
'h-[26px] w-[44px] border-1.5 border-ink-900 rounded-full'
// thumb:
'h-[18px] w-[18px] bg-paper border-1.5 border-ink-900'
// checked state:
'data-[state=checked]:bg-mint'
// unchecked:
'data-[state=unchecked]:bg-cream-200'
```

### `<Tabs>` (top nav)

Use a custom div-based nav instead of shadcn Tabs — the spacing/styling diverges enough that shadcn Tabs adds friction. See `mocks/src/Dashboard.jsx` nav row.

### `<Calendar>` (heatmap)

shadcn Calendar is built on react-day-picker. For the heatmap on dashboard:
- Use a **custom grid** (`grid-cols-7 gap-1`), not the Calendar component
- shadcn Calendar is fine for the **date picker** in Daily entry header (the chevron + date)

### `<Toast>` / `<Sonner>`

Use `sonner` (shadcn default) with custom styling:

```tsx
<Toaster
  toastOptions={{
    className: 'bg-paper border-1.5 border-ink-900 shadow-stamp font-body',
  }}
/>
```

---

## Custom primitive components ที่ต้องสร้างเอง

These aren't shadcn — port from `mocks/src/shared.jsx`:

### `<Sticker>`

```tsx
type StickerColor = 'lemon' | 'tangerine' | 'mint' | 'peri' | 'rose';

export function Sticker({
  children,
  color = 'lemon',
  rotate = -3,
  className,
}: {
  children: React.ReactNode;
  color?: StickerColor;
  rotate?: number;
  className?: string;
}) {
  const colorMap: Record<StickerColor, string> = {
    lemon: 'bg-lemon text-ink-900',
    tangerine: 'bg-tangerine text-paper',
    mint: 'bg-mint text-paper',
    peri: 'bg-peri text-paper',
    rose: 'bg-rose text-ink-900',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'border-1.5 border-ink-900 shadow-stamp-sm',
        'font-display font-semibold text-[13px] tracking-tight whitespace-nowrap',
        colorMap[color],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
```

### `<Pill>`

```tsx
export function Pill({ children, color, dot }: PillProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
      'font-body font-semibold text-xs',
      color,
    )}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />}
      {children}
    </span>
  );
}
```

### Project code chip

```tsx
export function ProjectCode({ code, color }: { code: string; color: 'peri-soft' | 'lemon-soft' | 'mint-soft' | 'rose-soft' | 'cream-200' }) {
  return (
    <code className={cn(
      'inline-block px-1.5 py-0.5 rounded-[4px]',
      'border border-ink-900 bg-' + color,
      'font-mono font-bold text-xs text-ink-900',
    )}>
      {code}
    </code>
  );
}
```

### SVG primitives — `<Star4>`, `<Burst>`, `<Squiggle>`

Copy verbatim from `mocks/src/shared.jsx` — they're small inline SVGs.

---

## State management (TanStack Query patterns)

The mocks are static. Real impl needs queries — suggested keys:

```ts
// queries/days.ts
useQuery({ queryKey: ['day', dateISO], queryFn: () => supabase.from('days').select('*, entries(*)').eq('date', dateISO).single() })

useQuery({ queryKey: ['month', yyyymm], queryFn: () => fetchMonth(yyyymm) })

useQuery({ queryKey: ['ot-report', yyyymm], queryFn: () => fetchOTReport(yyyymm) })

useQuery({ queryKey: ['projects'], queryFn: () => supabase.from('projects').select('*').order('last_used_at', { ascending: false }) })

useQuery({ queryKey: ['user-settings'], queryFn: () => supabase.from('user_settings').select('*').single() })

// mutations
useMutation({ mutationFn: upsertDay, onSuccess: () => qc.invalidateQueries({ queryKey: ['day'] }) })
```

OT calculations: pure functions in `src/lib/ot.ts` — see CONTEXT.md §OT Rules for unit-test cases.

---

## Form schemas (Zod)

For daily entry — single day form:

```ts
const TimeBlockSchema = z.object({
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time:   z.string().regex(/^\d{2}:\d{2}$/),
  entries: z.array(z.object({
    project_id: z.string().uuid(),
    progress:   z.string().min(1).max(40),
    description: z.string().max(280),
  })).min(1),
});

const DayFormSchema = z.object({
  date:        z.string(),               // ISO date
  location:    z.enum(['wfh','onsite','leave','training','holiday']),
  is_holiday:  z.boolean(),
  time_blocks: z.array(TimeBlockSchema), // empty if leave/holiday
  note:        z.string().max(500).optional(),
});
```

---

## File suggestions for the React app

```
src/
  components/
    ui/             # shadcn primitives (customized)
    Sticker.tsx
    Pill.tsx
    ProjectCode.tsx
    Star4.tsx
    Burst.tsx
    Field.tsx
    Phone.tsx       # for any embedded mockups; not used in real app
  pages/ (or routes/)
    LoginPage.tsx
    DailyPage.tsx
    DashboardPage.tsx
    OTTablePage.tsx
    ProjectsPage.tsx
    SettingsPage.tsx
  features/
    daily-entry/
      DailyForm.tsx
      TimeBlock.tsx
      QuickPresets.tsx
      RecentProjects.tsx
      StatusPicker.tsx
      DateStrip.tsx
    dashboard/
      StatBlock.tsx
      CalendarHeatmap.tsx
      WeeklyHoursChart.tsx
      ProjectDonut.tsx
      RecentEntries.tsx
    ot-report/
      OTTable.tsx
      OTSummaryBand.tsx
      useCopyTable.ts
    projects/
      ProjectCard.tsx
      ProjectSparkline.tsx
    settings/
      SalarySection.tsx
      WorkHoursSection.tsx
      HolidaysSection.tsx
      AccountSection.tsx
  lib/
    ot.ts           # OT calc (see CONTEXT.md)
    ot.test.ts
    thai-holidays.ts
    format.ts       # money, hours formatting
  hooks/
    useAuth.ts
    useToday.ts
```
