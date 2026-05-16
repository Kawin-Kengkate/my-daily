import { describe, it, expect } from 'vitest';
import { calculateStreak } from './streak';
import type { OverrideMap } from './calendar';

const empty: OverrideMap = {};

describe('calculateStreak', () => {
  it('นับ workday ติดต่อกัน (Mon-Fri ทำงาน, today=Fri)', () => {
    // 2026-05-11 จ, 12 อ, 13 พ, 14 พฤ, 15 ศ
    const saved = new Set(['2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15']);
    const r = calculateStreak(saved, '2026-05-15', empty);
    expect(r.current).toBe(5);
    expect(r.longest).toBe(5);
  });

  it('ส-อา ตรงกลาง → ไม่ break', () => {
    // 2026-05-08 ศ, 11 จ (เสาร์-อาทิตย์ 9-10 skip)
    const saved = new Set(['2026-05-08', '2026-05-11']);
    const r = calculateStreak(saved, '2026-05-11', empty);
    expect(r.current).toBe(2);
  });

  it('วันธรรมดาขาด 1 วัน → break', () => {
    // 2026-05-12 อ ไม่ได้บันทึก
    const saved = new Set(['2026-05-11', '2026-05-13', '2026-05-14']);
    const r = calculateStreak(saved, '2026-05-14', empty);
    expect(r.current).toBe(2); // 13, 14
    expect(r.longest).toBe(2);
  });

  it('วันนี้ยังไม่บันทึก แต่เมื่อวานบันทึก → ไม่ break', () => {
    const saved = new Set(['2026-05-13', '2026-05-14']);
    const r = calculateStreak(saved, '2026-05-15', empty);
    expect(r.current).toBe(2);
  });

  it('วันหยุดราชการ → skip ไม่ break (สงกรานต์ 13-15)', () => {
    // 2026-04-13/14/15 สงกรานต์ (holiday)
    // 2026-04-10 ศ, 16 พฤ
    const saved = new Set(['2026-04-10', '2026-04-16']);
    const r = calculateStreak(saved, '2026-04-16', empty);
    expect(r.current).toBe(2);
  });

  it('ไม่มีอะไรเลย → 0', () => {
    const r = calculateStreak(new Set(), '2026-05-15', empty);
    expect(r.current).toBe(0);
    expect(r.longest).toBe(0);
  });

  it('override working — เสาร์ทำงาน บันทึก → นับ', () => {
    // 2026-05-09 เสาร์ (override working) บันทึก
    const overrides: OverrideMap = {
      '2026-05-09': {
        id: '1', user_id: 'u', date: '2026-05-09',
        kind: 'working', label: null, created_at: '',
      },
    };
    const saved = new Set(['2026-05-08', '2026-05-09', '2026-05-11']);
    const r = calculateStreak(saved, '2026-05-11', overrides);
    expect(r.current).toBe(3);
  });

  it('override working — เสาร์ทำงาน ไม่บันทึก → break', () => {
    const overrides: OverrideMap = {
      '2026-05-09': {
        id: '1', user_id: 'u', date: '2026-05-09',
        kind: 'working', label: null, created_at: '',
      },
    };
    const saved = new Set(['2026-05-08', '2026-05-11']);
    const r = calculateStreak(saved, '2026-05-11', overrides);
    expect(r.current).toBe(1); // เฉพาะ 11 — 9 break
  });

  it('longest > current', () => {
    // ช่วง 1: 2026-05-18 ถึง 22 = 5 workdays
    // gap: 25 ไม่บันทึก (ส-อา 23-24 skip)
    // ช่วง 2: 26, 27 = 2 days, today=27
    const saved = new Set([
      '2026-05-18', '2026-05-19', '2026-05-20', '2026-05-21', '2026-05-22',
      '2026-05-26', '2026-05-27',
    ]);
    const r = calculateStreak(saved, '2026-05-27', empty);
    expect(r.current).toBe(2);
    expect(r.longest).toBe(5);
  });
});
