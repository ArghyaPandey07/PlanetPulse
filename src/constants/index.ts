import type { ActivityType } from '../types';

/**
 * CO₂ emission factors — provided by hackathon organizers.
 * DO NOT modify these values.
 */
export const CO2_FACTORS: Record<ActivityType, { factor: number; unit: string; label: string; category: string }> = {
  car:         { factor: 0.20, unit: 'km',  label: 'Car',          category: 'transport' },
  bus:         { factor: 0.08, unit: 'km',  label: 'Bus',          category: 'transport' },
  flight:      { factor: 0.25, unit: 'km',  label: 'Flight',       category: 'transport' },
  electricity: { factor: 0.80, unit: 'kWh', label: 'Electricity',  category: 'energy' },
  veg_meal:    { factor: 0.50, unit: 'meal', label: 'Veg Meal',    category: 'food' },
  nonveg_meal: { factor: 2.00, unit: 'meal', label: 'Non-Veg Meal', category: 'food' },
};

/** Category colors — mapped to CSS variables */
export const CATEGORY_COLORS: Record<ActivityType, string> = {
  car:         'var(--color-cat-car)',
  bus:         'var(--color-cat-bus)',
  flight:      'var(--color-cat-flight)',
  electricity: 'var(--color-cat-electricity)',
  veg_meal:    'var(--color-cat-veg)',
  nonveg_meal: 'var(--color-cat-nonveg)',
};

/**
 * Validation limits for quantity inputs.
 * Absurd values (DP2) should be rejected with explanation.
 */
export const QUANTITY_LIMITS: Record<ActivityType, { min: number; max: number; explanation: string }> = {
  car:         { min: 0.1, max: 2000,  explanation: 'A single car trip over 2,000 km is unusually long. Please verify.' },
  bus:         { min: 0.1, max: 1000,  explanation: 'A single bus trip over 1,000 km is unusually long. Please verify.' },
  flight:      { min: 10,  max: 20000, explanation: 'Flights over 20,000 km exceed the longest routes. Please verify.' },
  electricity: { min: 0.1, max: 500,   explanation: 'Daily usage over 500 kWh is extremely high. Please verify.' },
  veg_meal:    { min: 1,   max: 20,    explanation: 'More than 20 meals in one entry seems incorrect. Please verify.' },
  nonveg_meal: { min: 1,   max: 20,    explanation: 'More than 20 meals in one entry seems incorrect. Please verify.' },
};
