// PlanetPulse — Core TypeScript types

/** All supported activity types */
export type ActivityType = 'car' | 'bus' | 'flight' | 'electricity' | 'veg_meal' | 'non_veg_meal';

/** A logged activity with calculated CO2 */
export interface Activity {
  id: string;
  type: ActivityType;
  quantity: number;
  unit: string;
  date: string;       // ISO date string YYYY-MM-DD
  co2Kg: number;      // Calculated by the backend, never trusted from client
}

/** Client-provided input — no id, no co2Kg */
export interface ActivityInput {
  type: string;
  quantity: unknown;   // unknown because we validate before using
  date: string;
}

/** A field-level validation error */
export interface ValidationError {
  field: string;
  message: string;
}

/** Monday–Sunday week range as ISO date strings */
export interface WeekRange {
  start: string;  // Monday YYYY-MM-DD
  end: string;    // Sunday YYYY-MM-DD
}

/** Dashboard response data */
export interface DashboardData {
  totalCo2Kg: number;
  categoryBreakdown: Record<string, number>;
  weekRange: WeekRange;
}

/** Weekly progress response data */
export interface WeeklyData {
  targetKg: number | null;
  currentCo2Kg: number;
  progressPercent: number | null;
  exceeded: boolean;
  nudgeMessage: string | null;
  weekRange: WeekRange;
}

/** User settings for weekly target */
export interface TargetSettings {
  weeklyTargetKg: number | null;
}

/** Target status calculation result */
export interface TargetStatus {
  progressPercent: number | null;
  exceeded: boolean;
  nudgeMessage: string | null;
}

/** Activity filter parameters */
export interface ActivityFilters {
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
}

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}
