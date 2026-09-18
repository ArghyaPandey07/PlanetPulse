// PlanetPulse — Validation tests

import { describe, it, expect } from 'vitest';
import { validateActivity, isValidDateString, validateTarget } from '../../src/domain/validation.js';

describe('validateActivity', () => {
  // Helper: valid input baseline
  const valid = { type: 'car', quantity: 10, date: '2026-09-19' };

  // ─── Missing / empty fields ───

  it('rejects missing type', () => {
    const errors = validateActivity({ ...valid, type: '' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'type' }));
  });

  it('rejects missing quantity', () => {
    const errors = validateActivity({ ...valid, quantity: undefined });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'quantity', message: 'Quantity is required.' }));
  });

  it('rejects empty string quantity', () => {
    const errors = validateActivity({ ...valid, quantity: '' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'quantity', message: 'Quantity is required.' }));
  });

  it('rejects null quantity', () => {
    const errors = validateActivity({ ...valid, quantity: null });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'quantity', message: 'Quantity is required.' }));
  });

  it('rejects missing date', () => {
    const errors = validateActivity({ ...valid, date: '' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'date' }));
  });

  it('rejects missing all required fields', () => {
    const errors = validateActivity({ type: '', quantity: undefined, date: '' });
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });

  // ─── Zero and negative ───

  it('rejects zero quantity', () => {
    const errors = validateActivity({ ...valid, quantity: 0 });
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'quantity', message: 'Quantity must be greater than zero.' }),
    );
  });

  it('rejects negative quantity', () => {
    const errors = validateActivity({ ...valid, quantity: -5 });
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'quantity', message: 'Quantity must be greater than zero.' }),
    );
  });

  // ─── Valid decimals ───

  it('accepts valid decimal quantity', () => {
    const errors = validateActivity({ ...valid, quantity: 2.5 });
    expect(errors).toHaveLength(0);
  });

  it('accepts quantity as string number', () => {
    const errors = validateActivity({ ...valid, quantity: '10' });
    expect(errors).toHaveLength(0);
  });

  // ─── Extremely large and absurd values ───

  it('rejects absurd 500,000 km car trip', () => {
    const errors = validateActivity({ ...valid, type: 'car', quantity: 500_000 });
    expect(errors).toContainEqual(
      expect.objectContaining({
        field: 'quantity',
        message: expect.stringContaining('exceeds the maximum of 50,000'),
      }),
    );
  });

  it('accepts large-but-plausible car trip (45,000 km)', () => {
    const errors = validateActivity({ ...valid, type: 'car', quantity: 45_000 });
    expect(errors).toHaveLength(0);
  });

  it('rejects absurd flight (30,000 km)', () => {
    const errors = validateActivity({ ...valid, type: 'flight', quantity: 30_000 });
    expect(errors).toContainEqual(
      expect.objectContaining({
        field: 'quantity',
        message: expect.stringContaining('exceeds the maximum'),
      }),
    );
  });

  it('rejects Infinity quantity', () => {
    const errors = validateActivity({ ...valid, quantity: Infinity });
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'quantity', message: 'Quantity must be a finite number.' }),
    );
  });

  it('rejects NaN quantity', () => {
    const errors = validateActivity({ ...valid, quantity: 'not-a-number' });
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'quantity', message: 'Quantity must be a valid number.' }),
    );
  });

  // ─── Unknown activity type ───

  it('rejects unknown activity type', () => {
    const errors = validateActivity({ ...valid, type: 'bicycle' });
    expect(errors).toContainEqual(
      expect.objectContaining({
        field: 'type',
        message: expect.stringContaining('Unknown activity type'),
      }),
    );
  });

  // ─── Invalid dates ───

  it('rejects malformed date string', () => {
    const errors = validateActivity({ ...valid, date: 'not-a-date' });
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'date', message: expect.stringContaining('YYYY-MM-DD') }),
    );
  });

  it('rejects date with invalid month', () => {
    const errors = validateActivity({ ...valid, date: '2026-13-01' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'date' }));
  });

  it('rejects Feb 30', () => {
    const errors = validateActivity({ ...valid, date: '2026-02-30' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'date' }));
  });

  it('rejects date without leading zeros (2026-9-1)', () => {
    const errors = validateActivity({ ...valid, date: '2026-9-1' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'date' }));
  });

  // ─── Valid inputs ───

  it('accepts a fully valid activity', () => {
    const errors = validateActivity(valid);
    expect(errors).toHaveLength(0);
  });

  it('accepts all valid activity types', () => {
    const types = ['car', 'bus', 'flight', 'electricity', 'veg_meal', 'non_veg_meal'];
    for (const type of types) {
      const errors = validateActivity({ ...valid, type });
      expect(errors).toHaveLength(0);
    }
  });
});

describe('isValidDateString', () => {
  it('accepts valid date', () => {
    expect(isValidDateString('2026-09-19')).toBe(true);
  });

  it('rejects invalid format', () => {
    expect(isValidDateString('09-19-2026')).toBe(false);
  });

  it('rejects Feb 29 on non-leap year', () => {
    expect(isValidDateString('2025-02-29')).toBe(false);
  });

  it('accepts Feb 29 on leap year', () => {
    expect(isValidDateString('2024-02-29')).toBe(true);
  });
});

describe('validateTarget', () => {
  it('rejects null target', () => {
    const errors = validateTarget(null);
    expect(errors).toHaveLength(1);
  });

  it('rejects zero target', () => {
    const errors = validateTarget(0);
    expect(errors).toContainEqual(
      expect.objectContaining({ message: 'Weekly target must be greater than zero.' }),
    );
  });

  it('rejects negative target', () => {
    const errors = validateTarget(-10);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts valid target', () => {
    const errors = validateTarget(50);
    expect(errors).toHaveLength(0);
  });
});
