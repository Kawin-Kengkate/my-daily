// projects.color เก็บเป็น hex จาก palette เดิม (ดู PROJECT_PALETTE) — map กลับเป็น theme token
// เพื่อให้สีโปรเจคเปลี่ยนตาม theme โดยไม่ต้อง migrate ข้อมูลใน DB
export const PROJECT_PALETTE = [
  { name: 'peri',      hex: '#6B7FE8', token: 'peri' },
  { name: 'mint',      hex: '#4FB389', token: 'mint' },
  { name: 'tangerine', hex: '#FF6B35', token: 'tangerine' },
  { name: 'lemon',     hex: '#F7C548', token: 'lemon' },
  { name: 'rose',      hex: '#F291A6', token: 'rose' },
  { name: 'ink',       hex: '#1E1E1E', token: 'ink-900' },
] as const;

export const DEFAULT_PROJECT_HEX = PROJECT_PALETTE[0].hex;

const TOKEN_BY_HEX = new Map<string, string>(PROJECT_PALETTE.map((c) => [c.hex.toLowerCase(), c.token]));

/** CSS color ของโปรเจค (ใช้ใน style) — alpha 0..1 */
export function projectColor(hex: string | null | undefined, alpha = 1): string {
  const token = TOKEN_BY_HEX.get((hex || DEFAULT_PROJECT_HEX).toLowerCase());
  if (token) return alpha === 1 ? `rgb(var(--c-${token}))` : `rgb(var(--c-${token}) / ${alpha})`;
  // hex นอก palette (เผื่อแก้ใน DB ตรงๆ) — ใช้ค่าเดิม
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return `rgb(var(--c-peri) / ${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${alpha})`;
}
