// PlanetPulse — Activity service (application operations)

import { v4 as uuidv4 } from 'uuid';
import type {
  Activity,
  ActivityInput,
  ActivityType,
  ActivityFilters,
  DashboardData,
  WeeklyData,
  ValidationError,
} from '../types/index.js';
import { ACTIVITY_UNITS } from '../constants/index.js';
import { calculateCO2 } from '../domain/carbon.js';
import { validateActivity } from '../domain/validation.js';
import { getCurrentWeekRange, isDateInWeek } from '../domain/weekly.js';
import { aggregateByCategory, aggregateTotal } from '../domain/aggregation.js';
import { calculateTargetStatus } from '../domain/target.js';
import { activityStore, settingsStore } from '../data/store.js';

/**
 * Log a new activity: validate → calculate CO2 → persist.
 * Returns either the saved activity or validation errors.
 */
export function logActivity(input: ActivityInput): { activity?: Activity; errors?: ValidationError[] } {
  const errors = validateActivity(input);
  if (errors.length > 0) {
    return { errors };
  }

  const type = input.type as ActivityType;
  const quantity = Number(input.quantity);
  const co2Kg = calculateCO2(type, quantity);

  const activity: Activity = {
    id: uuidv4(),
    type,
    quantity,
    unit: ACTIVITY_UNITS[type],
    date: input.date,
    co2Kg,
  };

  activityStore.add(activity);
  return { activity };
}

/**
 * Get activities with optional filters.
 */
export function getActivities(filters: ActivityFilters = {}): Activity[] {
  return activityStore.getFiltered(filters);
}

/**
 * Get dashboard data: total CO2 and category breakdown for the current week.
 */
export function getDashboard(): DashboardData {
  const weekRange = getCurrentWeekRange();
  const allActivities = activityStore.getAll();

  // Filter to current week
  const weekActivities = allActivities.filter((a) => isDateInWeek(a.date, weekRange));

  return {
    totalCo2Kg: aggregateTotal(weekActivities),
    categoryBreakdown: aggregateByCategory(weekActivities),
    weekRange,
  };
}

/**
 * Get weekly summary: progress toward target + nudge state.
 */
export function getWeeklySummary(): WeeklyData {
  const weekRange = getCurrentWeekRange();
  const allActivities = activityStore.getAll();
  const weekActivities = allActivities.filter((a) => isDateInWeek(a.date, weekRange));

  const currentCo2Kg = aggregateTotal(weekActivities);
  const targetKg = settingsStore.getTarget();
  const status = calculateTargetStatus(currentCo2Kg, targetKg);

  return {
    targetKg,
    currentCo2Kg,
    progressPercent: status.progressPercent,
    exceeded: status.exceeded,
    nudgeMessage: status.nudgeMessage,
    weekRange,
  };
}
