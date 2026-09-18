// PlanetPulse — Aggregation and filtering tests

import { describe, it, expect } from 'vitest';
import { aggregateByCategory, aggregateTotal, filterActivities } from '../../src/domain/aggregation.js';
import type { Activity } from '../../src/types/index.js';

// ─── Test data ───

const testActivities: Activity[] = [
  { id: '1', type: 'car', quantity: 10, unit: 'km', date: '2026-09-15', co2Kg: 2.00 },
  { id: '2', type: 'car', quantity: 20, unit: 'km', date: '2026-09-16', co2Kg: 4.00 },
  { id: '3', type: 'bus', quantity: 10, unit: 'km', date: '2026-09-15', co2Kg: 0.80 },
  { id: '4', type: 'flight', quantity: 100, unit: 'km', date: '2026-09-17', co2Kg: 25.00 },
  { id: '5', type: 'veg_meal', quantity: 1, unit: 'meal', date: '2026-09-15', co2Kg: 0.50 },
  { id: '6', type: 'non_veg_meal', quantity: 1, unit: 'meal', date: '2026-09-18', co2Kg: 2.00 },
  { id: '7', type: 'electricity', quantity: 5, unit: 'kWh', date: '2026-09-16', co2Kg: 4.00 },
];

describe('aggregateByCategory', () => {
  it('sums CO2 by category', () => {
    const breakdown = aggregateByCategory(testActivities);
    expect(breakdown['car']).toBe(6.00);
    expect(breakdown['bus']).toBe(0.80);
    expect(breakdown['flight']).toBe(25.00);
    expect(breakdown['electricity']).toBe(4.00);
    expect(breakdown['veg_meal']).toBe(0.50);
    expect(breakdown['non_veg_meal']).toBe(2.00);
  });

  it('returns 0 for categories with no activities', () => {
    const breakdown = aggregateByCategory([testActivities[0]]); // only car
    expect(breakdown['bus']).toBe(0);
    expect(breakdown['flight']).toBe(0);
  });

  it('handles empty array', () => {
    const breakdown = aggregateByCategory([]);
    expect(breakdown['car']).toBe(0);
    expect(breakdown['bus']).toBe(0);
  });
});

describe('aggregateTotal', () => {
  it('sums all CO2', () => {
    const total = aggregateTotal(testActivities);
    expect(total).toBe(38.30);
  });

  it('returns 0 for empty array', () => {
    expect(aggregateTotal([])).toBe(0);
  });

  it('handles single activity', () => {
    expect(aggregateTotal([testActivities[0]])).toBe(2.00);
  });
});

describe('filterActivities', () => {
  // ─── Filter by type ───

  it('filters by activity type', () => {
    const result = filterActivities(testActivities, { type: 'car' });
    expect(result).toHaveLength(2);
    expect(result.every(a => a.type === 'car')).toBe(true);
  });

  it('returns empty array for type with no matches', () => {
    // All activities are in the set, but let's filter for a type that only has one
    const subset = [testActivities[0]]; // only car
    const result = filterActivities(subset, { type: 'bus' });
    expect(result).toHaveLength(0);
  });

  // ─── Filter by date ───

  it('filters by start date', () => {
    const result = filterActivities(testActivities, { startDate: '2026-09-17' });
    expect(result).toHaveLength(2); // flight (17th) + non_veg_meal (18th)
  });

  it('filters by end date', () => {
    const result = filterActivities(testActivities, { endDate: '2026-09-15' });
    expect(result).toHaveLength(3); // car, bus, veg_meal on 15th
  });

  it('filters by date range', () => {
    const result = filterActivities(testActivities, {
      startDate: '2026-09-16',
      endDate: '2026-09-17',
    });
    expect(result).toHaveLength(3); // car(16), electricity(16), flight(17)
  });

  // ─── Combined filters ───

  it('filters by type AND date range', () => {
    const result = filterActivities(testActivities, {
      type: 'car',
      startDate: '2026-09-16',
      endDate: '2026-09-17',
    });
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2026-09-16');
  });

  // ─── No filters ───

  it('returns all activities with no filters', () => {
    const result = filterActivities(testActivities, {});
    expect(result).toHaveLength(testActivities.length);
  });
});
