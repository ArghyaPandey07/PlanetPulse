// PlanetPulse — Settings service

import type { TargetSettings, ValidationError } from '../types/index.js';
import { validateTarget } from '../domain/validation.js';
import { settingsStore } from '../data/store.js';

/**
 * Get current target settings.
 */
export function getTarget(): TargetSettings {
  return {
    weeklyTargetKg: settingsStore.getTarget(),
  };
}

/**
 * Set the weekly CO2 target.
 * Returns errors if validation fails.
 */
export function setTarget(targetKg: unknown): { settings?: TargetSettings; errors?: ValidationError[] } {
  const errors = validateTarget(targetKg);
  if (errors.length > 0) {
    return { errors };
  }

  settingsStore.setTarget(Number(targetKg));
  return {
    settings: {
      weeklyTargetKg: settingsStore.getTarget(),
    },
  };
}
