import { describe, it, expect } from 'vitest';
import { calculateOT, type OTSettings } from './ot';

const settings: OTSettings = {
  salary: 30000, // baseHourly = 30000/30/8 = 125
  ot_rate_weekday: 1.5,
  ot_rate_holiday_day: 1.5,
  ot_rate_holiday_night: 3,
};

describe('calculateOT', () => {
  it('Case 1: weekday 08:00-20:30 → 3.5h × 1.5x', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'onsite' },
      [{ start_time: '08:00', end_time: '20:30' }],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(3.5, 5);
    expect(r.hours3x).toBe(0);
    expect(r.total).toBeCloseTo(3.5 * 1.5 * 125, 5);
  });

  it('Case 2: Saturday 08:00-18:00 → 8h 1.5x (-1h break) + 1h 3x', () => {
    const r = calculateOT(
      { is_holiday: true, location: 'onsite' },
      [{ start_time: '08:00', end_time: '18:00' }],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(8, 5);
    expect(r.hours3x).toBeCloseTo(1, 5);
    expect(r.total).toBeCloseTo((8 * 1.5 + 1 * 3) * 125, 5);
  });

  it('Case 3: weekday 08:00-23:00 → OT 17-23 = 6h, deduct 1h → 5h × 1.5x', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'onsite' },
      [{ start_time: '08:00', end_time: '23:00' }],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(5, 5);
    expect(r.hours3x).toBe(0);
  });

  it('weekday no OT: 08:00-16:40 = 0 OT', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'onsite' },
      [{ start_time: '08:00', end_time: '16:40' }],
      settings,
    );
    expect(r.hours15x).toBe(0);
    expect(r.hours3x).toBe(0);
    expect(r.total).toBe(0);
  });

  it('weekday OT < 5h: 17:00-20:00 → 3h, no deduction', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'onsite' },
      [{ start_time: '17:00', end_time: '20:00' }],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(3, 5);
  });

  it('weekday 16:40-17:00 skipped: 16:00-17:30 → only 17:00-17:30 = 0.5h OT', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'onsite' },
      [{ start_time: '16:00', end_time: '17:30' }],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(0.5, 5);
  });

  it('overlapping entries (same time, different project) → counted once', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'onsite' },
      [
        { start_time: '17:00', end_time: '19:00' },
        { start_time: '17:00', end_time: '19:00' },
      ],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(2, 5);
  });

  it('leave day: zero OT regardless of entries', () => {
    const r = calculateOT(
      { is_holiday: false, location: 'leave' },
      [{ start_time: '08:00', end_time: '20:00' }],
      settings,
    );
    expect(r.total).toBe(0);
  });

  it('holiday short shift 09:00-13:00 (4h) → no break deduction', () => {
    const r = calculateOT(
      { is_holiday: true, location: 'onsite' },
      [{ start_time: '09:00', end_time: '13:00' }],
      settings,
    );
    expect(r.hours15x).toBeCloseTo(4, 5);
    expect(r.hours3x).toBe(0);
  });

  it('holiday 08:00-22:00 (14h) → 8h 1.5x + 5h 3x after 1h break', () => {
    const r = calculateOT(
      { is_holiday: true, location: 'onsite' },
      [{ start_time: '08:00', end_time: '22:00' }],
      settings,
    );
    // 8-17 = 9h @1.5x, 17-22 = 5h @3x, total 14h > 5 → deduct 1h from 1.5x → 8h + 5h
    expect(r.hours15x).toBeCloseTo(8, 5);
    expect(r.hours3x).toBeCloseTo(5, 5);
  });
});
