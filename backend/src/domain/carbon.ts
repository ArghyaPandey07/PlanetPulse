// PlanetPulse — CO2 calculation (pure function)

import type { ActivityType } from '../types/index.js';
import { EMISSION_FACTORS } from '../constants/index.js';

/**
 * Calculate CO2 emissions for a given activity type and quantity.
 * Pure function — no side effects.
 *
 * @param type - The activity type
 * @param quantity - The quantity in the type's unit (km, kWh, meals)
 * @returns CO2 in kg, rounded to 2 decimal places
 */
export function calculateCO2(type: ActivityType, quantity: number): number {
  const factor = EMISSION_FACTORS[type];
  // Round to 2 decimal places to avoid floating-point artifacts
  return Math.round(quantity * factor * 100) / 100;
}
