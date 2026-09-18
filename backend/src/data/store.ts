// PlanetPulse — In-memory data store
// Persistence interface keeps storage separate from business logic.
// Swap InMemoryActivityStore for a database-backed implementation later.

import type { Activity, ActivityFilters, TargetSettings } from '../types/index.js';
import { filterActivities } from '../domain/aggregation.js';
import { DEFAULT_WEEKLY_TARGET_KG } from '../constants/index.js';

// ──────────────────────────────────────────────
// Activity Store
// ──────────────────────────────────────────────

/** Persistence interface for activities */
export interface ActivityStore {
  add(activity: Activity): Activity;
  getAll(): Activity[];
  getFiltered(filters: ActivityFilters): Activity[];
  clear(): void;
}

/** Simple in-memory implementation — data resets on server restart */
export class InMemoryActivityStore implements ActivityStore {
  private activities: Activity[] = [];

  add(activity: Activity): Activity {
    this.activities.push(activity);
    return activity;
  }

  getAll(): Activity[] {
    return [...this.activities];
  }

  getFiltered(filters: ActivityFilters): Activity[] {
    return filterActivities(this.activities, filters);
  }

  clear(): void {
    this.activities = [];
  }
}

// ──────────────────────────────────────────────
// Settings Store
// ──────────────────────────────────────────────

/** Persistence interface for user settings */
export interface SettingsStore {
  getTarget(): number | null;
  setTarget(kg: number): void;
  clear(): void;
}

/** Simple in-memory implementation */
export class InMemorySettingsStore implements SettingsStore {
  private weeklyTargetKg: number | null = DEFAULT_WEEKLY_TARGET_KG;

  getTarget(): number | null {
    return this.weeklyTargetKg;
  }

  setTarget(kg: number): void {
    this.weeklyTargetKg = kg;
  }

  clear(): void {
    this.weeklyTargetKg = DEFAULT_WEEKLY_TARGET_KG;
  }
}

// ──────────────────────────────────────────────
// Singleton instances (for hackathon simplicity)
// ──────────────────────────────────────────────

export const activityStore = new InMemoryActivityStore();
export const settingsStore = new InMemorySettingsStore();
