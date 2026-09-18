// PlanetPulse — Weekly date utilities (pure functions)
// Week is defined as Monday (start) through Sunday (end).
// All operations use UTC to prevent timezone-related week boundary bugs.

import type { WeekRange } from '../types/index.js';

/**
 * Get the current week's Monday–Sunday range.
 * Uses UTC to ensure consistent behavior across timezones.
 */
export function getCurrentWeekRange(): WeekRange {
  const now = new Date();
  return getWeekRangeForDate(formatUTCDate(now));
}

/**
 * Get the Monday–Sunday week range that contains the given date.
 *
 * @param dateStr - ISO date string YYYY-MM-DD
 * @returns WeekRange with start (Monday) and end (Sunday) as YYYY-MM-DD
 */
export function getWeekRangeForDate(dateStr: string): WeekRange {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const date = new Date(Date.UTC(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10)
  ));

  // getUTCDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  // We want Monday=0, so shift: (day + 6) % 7
  const dayOfWeek = date.getUTCDay();
  const mondayOffset = (dayOfWeek + 6) % 7; // days since Monday

  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - mondayOffset);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return {
    start: formatUTCDate(monday),
    end: formatUTCDate(sunday),
  };
}

/**
 * Check if a date string falls within a given week range (inclusive).
 *
 * @param dateStr - ISO date string YYYY-MM-DD
 * @param weekRange - The week range to check against
 * @returns true if the date is within the week range
 */
export function isDateInWeek(dateStr: string, weekRange: WeekRange): boolean {
  // Simple string comparison works for YYYY-MM-DD format
  return dateStr >= weekRange.start && dateStr <= weekRange.end;
}

/**
 * Format a Date object to YYYY-MM-DD string using UTC components.
 */
export function formatUTCDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
