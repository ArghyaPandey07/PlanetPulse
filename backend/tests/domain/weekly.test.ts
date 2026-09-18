// PlanetPulse — Weekly date utility tests

import { describe, it, expect } from 'vitest';
import { getCurrentWeekRange, getWeekRangeForDate, isDateInWeek, formatUTCDate } from '../../src/domain/weekly.js';

describe('getWeekRangeForDate', () => {
  it('returns Monday–Sunday for a Wednesday', () => {
    // 2026-09-16 is a Wednesday
    const range = getWeekRangeForDate('2026-09-16');
    expect(range.start).toBe('2026-09-14'); // Monday
    expect(range.end).toBe('2026-09-20');   // Sunday
  });

  it('returns correct range when given a Monday', () => {
    // 2026-09-14 is a Monday
    const range = getWeekRangeForDate('2026-09-14');
    expect(range.start).toBe('2026-09-14');
    expect(range.end).toBe('2026-09-20');
  });

  it('returns correct range when given a Sunday', () => {
    // 2026-09-20 is a Sunday
    const range = getWeekRangeForDate('2026-09-20');
    expect(range.start).toBe('2026-09-14');
    expect(range.end).toBe('2026-09-20');
  });

  // ─── Sunday-to-Monday week boundary ───

  it('handles Sunday-to-Monday boundary correctly', () => {
    // Sunday Sept 20 should be in week Mon Sept 14–Sun Sept 20
    const sundayRange = getWeekRangeForDate('2026-09-20');
    expect(sundayRange.start).toBe('2026-09-14');
    expect(sundayRange.end).toBe('2026-09-20');

    // Monday Sept 21 should be in the NEXT week
    const mondayRange = getWeekRangeForDate('2026-09-21');
    expect(mondayRange.start).toBe('2026-09-21');
    expect(mondayRange.end).toBe('2026-09-27');
  });

  it('handles month boundary (week spanning two months)', () => {
    // 2026-09-28 is a Monday, week spans into October
    const range = getWeekRangeForDate('2026-09-30');
    expect(range.start).toBe('2026-09-28');
    expect(range.end).toBe('2026-10-04');
  });

  it('handles year boundary', () => {
    // 2025-12-29 is a Monday
    const range = getWeekRangeForDate('2025-12-31');
    expect(range.start).toBe('2025-12-29');
    expect(range.end).toBe('2026-01-04');
  });
});

describe('getCurrentWeekRange', () => {
  it('returns a valid week range with start <= end', () => {
    const range = getCurrentWeekRange();
    expect(range.start).toBeDefined();
    expect(range.end).toBeDefined();
    expect(range.start <= range.end).toBe(true);
  });

  it('returns dates in YYYY-MM-DD format', () => {
    const range = getCurrentWeekRange();
    expect(range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('start is a Monday', () => {
    const range = getCurrentWeekRange();
    const [y, m, d] = range.start.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    expect(date.getUTCDay()).toBe(1); // Monday
  });

  it('end is a Sunday', () => {
    const range = getCurrentWeekRange();
    const [y, m, d] = range.end.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    expect(date.getUTCDay()).toBe(0); // Sunday
  });
});

describe('isDateInWeek', () => {
  const week = { start: '2026-09-14', end: '2026-09-20' };

  it('returns true for a date within the week', () => {
    expect(isDateInWeek('2026-09-16', week)).toBe(true);
  });

  it('returns true for the start date (Monday)', () => {
    expect(isDateInWeek('2026-09-14', week)).toBe(true);
  });

  it('returns true for the end date (Sunday)', () => {
    expect(isDateInWeek('2026-09-20', week)).toBe(true);
  });

  it('returns false for a date before the week', () => {
    expect(isDateInWeek('2026-09-13', week)).toBe(false);
  });

  it('returns false for a date after the week', () => {
    expect(isDateInWeek('2026-09-21', week)).toBe(false);
  });

  // ─── Activity outside the current week ───

  it('correctly identifies activity outside current week', () => {
    const currentWeek = getCurrentWeekRange();
    // Use a date definitely in the past
    expect(isDateInWeek('2020-01-01', currentWeek)).toBe(false);
  });
});

describe('formatUTCDate', () => {
  it('formats a Date to YYYY-MM-DD', () => {
    const date = new Date(Date.UTC(2026, 8, 19)); // Sept 19, 2026
    expect(formatUTCDate(date)).toBe('2026-09-19');
  });

  it('pads single-digit months and days', () => {
    const date = new Date(Date.UTC(2026, 0, 5)); // Jan 5, 2026
    expect(formatUTCDate(date)).toBe('2026-01-05');
  });
});
