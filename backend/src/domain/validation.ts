// PlanetPulse — Input validation (pure function)

import type { ActivityInput, ActivityType, ValidationError } from '../types/index.js';
import { VALID_ACTIVITY_TYPES, MAX_QUANTITIES, ACTIVITY_LABELS, ACTIVITY_UNITS } from '../constants/index.js';

/**
 * Validate an activity input from the client.
 * Returns an empty array if valid, otherwise returns all validation errors.
 * Pure function — no side effects.
 */
export function validateActivity(input: ActivityInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // --- Validate type ---
  if (!input.type || typeof input.type !== 'string') {
    errors.push({ field: 'type', message: 'Activity type is required.' });
  } else if (!VALID_ACTIVITY_TYPES.includes(input.type)) {
    errors.push({
      field: 'type',
      message: `Unknown activity type "${input.type}". Valid types: ${VALID_ACTIVITY_TYPES.join(', ')}.`,
    });
  }

  // --- Validate quantity ---
  if (input.quantity === undefined || input.quantity === null || input.quantity === '') {
    errors.push({ field: 'quantity', message: 'Quantity is required.' });
  } else {
    const qty = Number(input.quantity);
    if (isNaN(qty)) {
      errors.push({ field: 'quantity', message: 'Quantity must be a valid number.' });
    } else if (qty <= 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be greater than zero.' });
    } else if (!isFinite(qty)) {
      errors.push({ field: 'quantity', message: 'Quantity must be a finite number.' });
    } else if (VALID_ACTIVITY_TYPES.includes(input.type)) {
      // Only check absurd values if the type is valid
      const activityType = input.type as ActivityType;
      const maxQty = MAX_QUANTITIES[activityType];
      if (qty > maxQty) {
        const label = ACTIVITY_LABELS[activityType];
        const unit = ACTIVITY_UNITS[activityType];
        errors.push({
          field: 'quantity',
          message: `A ${label} of ${qty.toLocaleString()} ${unit} exceeds the maximum of ${maxQty.toLocaleString()} ${unit}. Please log as multiple trips if this is real.`,
        });
      }
    }
  }

  // --- Validate date ---
  if (!input.date || typeof input.date !== 'string') {
    errors.push({ field: 'date', message: 'Date is required.' });
  } else if (!isValidDateString(input.date)) {
    errors.push({
      field: 'date',
      message: 'Date must be a valid date in YYYY-MM-DD format.',
    });
  }

  return errors;
}

/**
 * Check if a string is a valid YYYY-MM-DD date.
 * Validates format AND that the date actually exists (no Feb 30, etc.).
 */
export function isValidDateString(dateStr: string): boolean {
  // Must match YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // Parse and verify the date is real
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Basic range checks
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Use UTC to avoid timezone issues
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Validate a weekly target value.
 */
export function validateTarget(targetKg: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (targetKg === undefined || targetKg === null) {
    errors.push({ field: 'weeklyTargetKg', message: 'Weekly target is required.' });
    return errors;
  }

  const value = Number(targetKg);
  if (isNaN(value)) {
    errors.push({ field: 'weeklyTargetKg', message: 'Weekly target must be a valid number.' });
  } else if (value <= 0) {
    errors.push({ field: 'weeklyTargetKg', message: 'Weekly target must be greater than zero.' });
  } else if (value > 100_000) {
    errors.push({ field: 'weeklyTargetKg', message: 'Weekly target seems unreasonably high.' });
  }

  return errors;
}
