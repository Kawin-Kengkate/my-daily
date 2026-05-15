import { z } from 'zod';

const TIME = /^\d{2}:\d{2}$/;
// 0-100% only (กัน 999%) หรือคำว่า complete
const PROGRESS = /^(complete|(\d|[1-9]\d|100)%)$/i;

export const EntryDraftSchema = z
  .object({
    project_id: z.string().min(1, 'เลือกโปรเจค'),
    start_time: z.string().regex(TIME, 'รูปแบบ HH:MM'),
    end_time: z.string().regex(TIME, 'รูปแบบ HH:MM'),
    progress: z
      .string()
      .trim()
      .min(1, 'ใส่ progress')
      .max(40)
      .regex(PROGRESS, 'ใช้ 0-100% หรือ complete'),
    done_note: z.string().max(280).optional().default(''),
    next_note: z.string().max(280).optional().default(''),
  })
  .refine((e) => toMinutes(e.end_time) > toMinutes(e.start_time), {
    path: ['end_time'],
    message: 'end ต้องหลัง start',
  });

export type EntryDraftInput = z.input<typeof EntryDraftSchema>;

export const DayFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.enum(['wfh', 'onsite', 'leave', 'training', 'holiday']),
  is_holiday: z.boolean(),
  note: z.string().max(500).nullable().optional(),
  entries: z.array(EntryDraftSchema),
});

const HEX = /^#[0-9a-fA-F]{6}$/;
const CODE = /^[A-Z][A-Z0-9_-]{1,11}$/;

export const ProjectDraftSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(CODE, 'A-Z, 0-9, _ หรือ -, 2-12 ตัว ขึ้นต้นด้วยตัวอักษร'),
  name: z.string().trim().min(1, 'ใส่ชื่อ').max(80),
  description: z.string().max(280).optional().default(''),
  color: z.string().regex(HEX, 'รูปแบบสี #rrggbb').optional(),
  status: z.enum(['active', 'on_hold', 'done', 'archived']).optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(10).optional(),
  started_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  ended_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

export type ProjectDraftInput = z.input<typeof ProjectDraftSchema>;

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function entryErrors(entries: EntryDraftInput[]): Array<Record<string, string>> {
  return entries.map((e) => {
    const r = EntryDraftSchema.safeParse(e);
    if (r.success) return {};
    const errs: Record<string, string> = {};
    for (const i of r.error.issues) {
      const k = i.path[0] as string;
      if (!errs[k]) errs[k] = i.message;
    }
    return errs;
  });
}
