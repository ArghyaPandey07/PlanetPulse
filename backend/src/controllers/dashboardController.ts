// PlanetPulse — Dashboard controller

import type { Request, Response } from 'express';
import { getDashboard, getWeeklySummary } from '../services/activityService.js';

/**
 * GET /api/dashboard — Total footprint + category breakdown for current week.
 */
export function dashboard(_req: Request, res: Response): void {
  const data = getDashboard();
  res.status(200).json({ success: true, data });
}

/**
 * GET /api/weekly — Weekly target progress + nudge state.
 */
export function weekly(_req: Request, res: Response): void {
  const data = getWeeklySummary();
  res.status(200).json({ success: true, data });
}
