// PlanetPulse — CO2 calculation tests

import { describe, it, expect } from 'vitest';
import { calculateCO2 } from '../../src/domain/carbon.js';

describe('calculateCO2', () => {
  // ─── Required expected calculations from spec ───

  it('Car, 10 km = 2.00 kg', () => {
    expect(calculateCO2('car', 10)).toBe(2.00);
  });

  it('Bus, 10 km = 0.80 kg', () => {
    expect(calculateCO2('bus', 10)).toBe(0.80);
  });

  it('Flight, 100 km = 25.00 kg', () => {
    expect(calculateCO2('flight', 100)).toBe(25.00);
  });

  it('Electricity, 5 kWh = 4.00 kg', () => {
    expect(calculateCO2('electricity', 5)).toBe(4.00);
  });

  it('Veg meal, 1 = 0.50 kg', () => {
    expect(calculateCO2('veg_meal', 1)).toBe(0.50);
  });

  it('Non-veg meal, 1 = 2.00 kg', () => {
    expect(calculateCO2('non_veg_meal', 1)).toBe(2.00);
  });

  // ─── Edge cases ───

  it('handles decimal quantities', () => {
    expect(calculateCO2('car', 2.5)).toBe(0.50);
  });

  it('handles large quantities', () => {
    expect(calculateCO2('flight', 10000)).toBe(2500.00);
  });

  it('handles quantity of 1', () => {
    expect(calculateCO2('car', 1)).toBe(0.20);
  });

  it('returns 0 for quantity 0', () => {
    expect(calculateCO2('car', 0)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    // 0.08 * 3 = 0.24000000000000002 in floating point
    expect(calculateCO2('bus', 3)).toBe(0.24);
  });
});
