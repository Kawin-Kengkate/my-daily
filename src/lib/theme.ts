// รายชื่อ theme — สีจริงอยู่ใน src/styles/globals.css ([data-theme='<id>'])
// เพิ่ม theme ใหม่ = เพิ่มที่นี่ + เพิ่ม block ใน globals.css (theme.test.ts จะเช็คว่าครบ + contrast ผ่าน)
export const THEMES = [
  { id: 'pop',       label: 'Pop Riot',      emoji: '🍭', blurb: 'ส้มแดงจัด × ม่วงไฟฟ้า สดทุกหน้า' },
  { id: 'neon',      label: 'Neon Night',    emoji: '🌃', blurb: 'โหมดมืด นีออนเรืองแสง เงาชมพู' },
  { id: 'bubblegum', label: 'Bubblegum',     emoji: '🫧', blurb: 'ชมพูลูกกวาด ม่วงองุ่น' },
  { id: 'matcha',    label: 'Matcha',        emoji: '🍵', blurb: 'เขียวชา ส้มอิฐ สบายตา' },
  { id: 'classic',   label: 'Classic Cream', emoji: '📜', blurb: 'ครีมต้นฉบับจาก design handoff' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const DEFAULT_THEME: ThemeId = 'pop';

// index.html อ่าน key นี้ก่อน paint — ถ้าเปลี่ยนต้องแก้ที่นั่นด้วย
export const THEME_STORAGE_KEY = 'my-daily-theme';

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}
