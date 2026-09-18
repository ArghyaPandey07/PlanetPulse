// PlanetPulse — Aggregation and filtering (pure functions)

import type { Activity, ActivityFilters, ActivityType } from '../types/index.js';
import { VALID_ACTIVITY_TYPES } from '../constants/index.js';

/**
 * Sum CO2 by category for a set of activities.
 * Returns an entry for every activity type (0 if none logged).
 */
export function aggregateByCategory(activities: Activity[]): Record<string, number> {
  const breakdown: Record<string, number> = {};

  // Initialize all categories to 0
  for (const type of VALID_ACTIVITY_TYPES) {
    breakdown[type] = 0;
  }

  for (const activity of activities) {
    breakdown[activity.type] = Math.round((breakdown[activity.type] + activity.co2Kg) * 100) / 100;
  }

  return breakdown;
}

/**
 * Calculate total CO2 for a set of activities.
 */
export function aggregateTotal(activities: Activity[]): number {
  const total = activities.reduce((sum, a) => sum + a.co2Kg, 0);
  return Math.round(total * 100) / 100;
}

/**
 * Filter activities by type and/or date range.
 * All filters are optional — omitted filters match everything.
 */
export function filterActivities(activities: Activity[], filters: ActivityFilters): Activity[] {
  return activities.filter((activity) => {
    if (filters.type && activity.type !== filters.type) {
      return false;
    }
    if (filters.startDate && activity.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && activity.date > filters.endDate) {
      return false;
    }
    return true;
  });
}
