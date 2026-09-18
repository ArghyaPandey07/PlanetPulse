// PlanetPulse — Centralized emission factors and validation limits
// Single source of truth — do NOT duplicate these values elsewhere.

import type { ActivityType } from '../types/index.js';

/** CO2 emission factors in kg per unit */
export const EMISSION_FACTORS: Record<ActivityType, number> = {
  car: 0.20,
  bus: 0.08,
  flight: 0.25,
  electricity: 0.80,
  veg_meal: 0.5,
  non_veg_meal: 2.0,
} as const;

/** Human-readable unit labels per activity type */
export const ACTIVITY_UNITS: Record<ActivityType, string> = {
  car: 'km',
  bus: 'km',
  flight: 'km',
  electricity: 'kWh',
  veg_meal: 'meal',
  non_veg_meal: 'meal',
} as const;

/**
 * Maximum reasonable quantity per activity type.
 * Values above these are rejected as absurd — not silently clamped.
 * These are generous limits; a 500,000 km car trip is absurd,
 * but a 50,000 km cross-continent road trip is plausible.
 */
export const MAX_QUANTITIES: Record<ActivityType, number> = {
  car: 50_000,
  bus: 10_000,
  flight: 20_000,
  electricity: 100_000,
  veg_meal: 100,
  non_veg_meal: 100,
} as const;

/** Human-readable labels for activity types (for error messages) */
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  car: 'car trip',
  bus: 'bus trip',
  flight: 'flight',
  electricity: 'electricity usage',
  veg_meal: 'veg meal',
  non_veg_meal: 'non-veg meal',
} as const;

/** All valid activity type strings */
export const VALID_ACTIVITY_TYPES: readonly string[] = Object.keys(EMISSION_FACTORS);

/** Default weekly CO2 target in kg */
export const DEFAULT_WEEKLY_TARGET_KG = 50;
