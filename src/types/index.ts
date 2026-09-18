export type ActivityType = 'car' | 'bus' | 'flight' | 'electricity' | 'veg_meal' | 'nonveg_meal';

export type ActivityCategory = 'transport' | 'energy' | 'food';

export interface Activity {
  id: string;
  type: ActivityType;
  quantity: number;
  unit: string;
  co2Kg: number;
  date: string; // ISO date string
  createdAt: string; // ISO datetime string
  note?: string;
}

export interface WeeklyTarget {
  targetKg: number;
  weekStart: string; // ISO date string (Monday)
  weekEnd: string;   // ISO date string (Sunday)
}

export interface CategoryBreakdown {
  type: ActivityType;
  label: string;
  totalKg: number;
  percentage: number;
  color: string;
}

export interface WeekRange {
  start: Date;
  end: Date;
  label: string;
}
